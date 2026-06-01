import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import {
  CardHeader,
  Box,
  SelectChangeEvent,
  MenuItem,
  Select,
  TablePagination,
  Checkbox,
  Button,
} from "@mui/material";
import {
  down_arrow_icon,
  check_rounded,
  ic_checked,
  ios_arrow_backward,
  cancelIcon,
} from "../../assets/images";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import { CustomeComparator, getValues } from "../../utils/commonfunction";
import { APiService } from "../../services/services/api-service";
import { APIListModel, ApiModel } from "../../models/configuration/ScopeModel";
import {
  ConfigurationActivities,
  ModuleDescription,
  StatusCode,
  rowsPerPageOptions,
} from "../../utils/constant";
import { FormattedMessage, useIntl } from "react-intl";

const ArrowDown = () => (
  <img src={down_arrow_icon} alt="arrow" className="select-icon" />
);

const ArrowDropDown = () => (
  <img src={ios_arrow_backward} alt="arrow" className="select-icon" />
);

function DesignerMakerCheckerConfiguration() {
  const intl = useIntl();
  const gridRef = useRef<AgGridReact>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalNumRecords, setTotalNumRecords] = useState(0);
  const [rowData, setRowData] = useState<APIListModel[]>([]);
  const [objectNameList, setObjectNameList] = useState<ApiModel[]>([]);
  const [selectedObject, setSelectedObject] = useState("");

  const position = useSelector((state: RootState) => state.selectedCard.position);
  const { left, top } = position;

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    },
    []
  );

  const showApiErrors = useCallback(
    (error: any, fallbackMessage: string) => {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((message: string) => toast.error(message));
      } else {
        toast.error(fallbackMessage);
      }
    },
    []
  );

  const fetchApiList = useCallback(
    async (objectName = "", resetPage = false) => {
      const payload = {
        asc: objectName ? "true" : true,
        offset: resetPage ? 0 : page,
        pageSize: rowsPerPage,
        sortBy: "apiDesc",
      };

      try {
        console.log("Fetching API list with payload:", payload, "and objectName:", objectName);
        const response = objectName
          ? await APiService.getApiList(payload, objectName)
          : await APiService.getAllApiList(payload);

        const apiResponse = response.data?.apiResponseDto ?? [];
        const filteredResponse = apiResponse;

        setRowData(filteredResponse);
        setTotalNumRecords(
          response.data?.paginationResponseDto?.totalNumberOfRecords ?? 0
        );
      } catch (error) {
        showApiErrors(
          error,
          intl.formatMessage({
            id: "MakerChecker_7.fetcherror",
            defaultMessage: "Error while fetching Maker-Checker data",
          })
        );
        setRowData([]);
        setTotalNumRecords(0);
      }
    },
    [page, rowsPerPage, intl, showApiErrors]
  );

  const loadObjectNames = useCallback(async () => {
    try {
      const response = await APiService.getApiObjects();
      setObjectNameList(response.data ?? []);
    } catch {
      toast.error(
        intl.formatMessage({
          id: "MakerChecker_7.objectnameerror",
          defaultMessage: "Error while fetching object names",
        })
      );
    }
  }, [intl]);

  const updateStpFlag = useCallback(
    async (data: APIListModel) => {
      const payload = [
        {
          apiId: data.apiId as number,
          stp: data.stp === "1" ? "0" : "1",
        },
      ];

      try {
        const response = await APiService.updateStpFlag(payload);
        if (response.status === StatusCode.Success) {
          toast.success(
            intl.formatMessage({
              id: "MakerChecker_7.stpupdatesuccess",
              defaultMessage: "STP flag updated successfully",
            })
          );
          fetchApiList(selectedObject);
        }
      } catch (error) {
        showApiErrors(error, "Failed to update STP flag");
      }
    },
    [fetchApiList, intl, selectedObject, showApiErrors]
  );

  useEffect(() => {
    loadObjectNames();
    console.log("Selected Object on load:", selectedObject);
    fetchApiList(selectedObject, true);
  }, [fetchApiList, loadObjectNames]);

  useEffect(() => {
    if (page > 0 || rowsPerPage !== 25) {
      console.log("Selected Object on load1:", selectedObject);
      fetchApiList(selectedObject);
    }
  }, [page, rowsPerPage, selectedObject, fetchApiList]);

  useEffect(() => {
    if (rowData.length === 0) {
      gridRef.current?.api?.showNoRowsOverlay();
    }
  }, [rowData]);

  const handleObject = useCallback(
    (event: SelectChangeEvent<string>) => {
      const objectName = event.target.value;
      setPage(0);
      setSelectedObject(objectName);
      console.log("Selected Object on load2:", objectName);
      fetchApiList(objectName, true);
    },
    [fetchApiList]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedObject("");
    setPage(0);
    console.log("Selected Object on load3:", selectedObject);
    fetchApiList("", true);
  }, [fetchApiList]);

  const sortedObjectNames = useMemo(
    () => [...objectNameList].sort((a, b) =>
      CustomeComparator(a.objectName, b.objectName)
    ),
    [objectNameList]
  );

  const columnDefs = useMemo(
    () => [
      {
        field: "apiDesc",
        headerName: intl.formatMessage({
          id: "MakerChecker_7.actiondescription",
          defaultMessage: "Action Description",
        }),
        sortable: true,
        filterable: false,
        hideable: false,
        hideSortIcons: true,
        headerClass: "status-col",
        flex: 1,
        comparator: CustomeComparator,
        cellRenderer: (params: any) => (
          <p>
            {params.data?.apiDesc === "Change Branch"
              ? "Transfer Stock"
              : params.data?.apiDesc}
          </p>
        ),
      },
      {
        field: "apiObject",
        headerName: intl.formatMessage({
          id: "MakerChecker_7.object",
          defaultMessage: "Object",
        }),
        sortable: true,
        filterable: false,
        hideable: false,
        hideSortIcons: true,
        headerClass: "status-col",
        flex: 1,
        comparator: CustomeComparator,
      },
      {
        field: "stp",
        headerName: intl.formatMessage({
          id: "MakerChecker_7.stp",
          defaultMessage: "STP",
        }),
        minWidth: 95,
        maxWidth: 115,
        sortable: false,
        filterable: false,
        hideable: false,
        hideSortIcons: true,
        flex: 1,
        headerAlign: "center",
        align: "center",
        headerClass: "action-header",
        cellRenderer: (params: any) => (
          <ul className="action-btn-listing">
            <li>
              <Checkbox
                checked={params.data?.stp === "1"}
                onChange={() => updateStpFlag(params.data)}
                icon={<img src={check_rounded} alt="" />}
                checkedIcon={<img src={ic_checked} alt="" />}
              />
            </li>
          </ul>
        ),
      },
    ],
    [intl, updateStpFlag]
  );

  const defaultColDef = useMemo(
    () => ({ resizable: true }),
    []
  );

  const suppressRowHoverHighlight = false;

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <CardHeader
              className="card-title"
              title={intl.formatMessage({
                id: "MakerChecker_7.maker-checkerconfiguration",
                defaultMessage: "Maker-Checker configuration",
              })}
              subheader={intl.formatMessage({
                id: "MakerChecker_7.managemaker-checkerconfiguration",
                defaultMessage: "Manage Maker-checker configuration",
              })}
              titleTypographyProps={{ variant: "h2", component: "h2" }}
            // subheaderTypographyProps={{ variant: "h4", component: "h4" }}
            />
            <div className="title-block">
              <Select
                id="select-api"
                fullWidth
                value={selectedObject}
                onChange={handleObject}
                onFocus={getValues}
                displayEmpty
                renderValue={(selected) =>
                  selected ? (
                    selected as string
                  ) : (
                    <em>
                      {intl.formatMessage({
                        id: "MakerChecker_7.selectobject",
                        defaultMessage: "Select Object",
                      })}
                    </em>
                  )
                }
                style={{ width: "30%" }}
                IconComponent={ArrowDown}
                MenuProps={{
                  className: "select-item",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                  PaperProps: {
                    sx: {
                      "@media (-webkit-device-pixel-ratio: 1.25)": {
                        left: `${left}px !important`,
                        top: `${top + 30}px !important`,
                      },
                    },
                  },
                }}
              >
                <MenuItem disabled value="">
                  <em>
                    {intl.formatMessage({
                      id: "MakerChecker_7.selectobject",
                      defaultMessage: "Select Object",
                    })}
                  </em>
                </MenuItem>
                {sortedObjectNames.map((data) => (
                  <MenuItem value={data.objectName} key={data.objectName}>
                    {data.objectName}
                  </MenuItem>
                ))}
              </Select>
              <Button
                sx={{ mt: 0 }}
                style={{ marginLeft: "50%" }}
                variant="contained"
                className="btn-light"
                onClick={handleClearSelection}
                disabled={!selectedObject}
              >
                <FormattedMessage id="Dashboard_2.clear" defaultMessage="Clear" />
                <img src={cancelIcon} alt="clear" />
              </Button>
            </div>
            <Box sx={{ width: "100%", minHeight: 520 }}>
              <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  suppressRowHoverHighlight={suppressRowHoverHighlight}
                  headerHeight={51}
                  rowHeight={52}
                  suppressDragLeaveHidesColumns={true}
                  overlayNoRowsTemplate={intl.formatMessage({
                    id: "NewCardIssueance_1.norowstoshow",
                    defaultMessage: "No Rows To Show",
                  })}
                  enableRtl={intl.locale === "ar" ? true : false}
                // className="table-component notification-configuration"
                ></AgGridReact>
              </div>
            </Box>
            <TablePagination
              className="pagination"
              rowsPerPageOptions={rowsPerPageOptions}
              labelRowsPerPage={intl.formatMessage({
                id: "Pagination.rowsperpage",
                defaultMessage: "Rows per page",
              })}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} 
                        ${intl.formatMessage({
                id: "Pagination.of",
                defaultMessage: "Of",
              })} ${count}`}
              component="div"
              count={totalNumRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                onFocus: getValues,
                IconComponent: ArrowDropDown,
                MenuProps: {
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                  PaperProps: {
                    sx: {
                      "@media (-webkit-device-pixel-ratio: 1.25)": {
                        left: `${left}px !important`,
                        top: `${top - 60}px !important`,
                      },
                    },
                  },
                },
              }}
              backIconButtonProps={{
                classes: {
                  root: "prev-arrow",
                },
              }}
              nextIconButtonProps={{
                classes: {
                  root: "next-arrow",
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </main >
      </div >
    </>
  );
}

export default DesignerMakerCheckerConfiguration;
