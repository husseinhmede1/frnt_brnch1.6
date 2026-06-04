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
import { ConfigurationActivities, StatusCode, rowsPerPageOptions } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
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

  // Permissions from modules localStorage (same pattern as XCS)
  const perms = useMemo(
    () => getActivityPermissions(ConfigurationActivities.MAKER_CHECKER),
    []
  );
  const canUpdate        = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.MAKER_CHECKER, 'MKCUPD');
  const canLoadObjects   = hasApiAccess(ConfigurationActivities.MAKER_CHECKER, 'MKCOBJ');
  const canLoadList      = hasApiAccess(ConfigurationActivities.MAKER_CHECKER, 'MKCLIST');
  const canLoadListByObj = hasApiAccess(ConfigurationActivities.MAKER_CHECKER, 'MKCOBJL');

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

  const showApiErrors = useCallback((error: any, fallbackMessage: string) => {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((message: string) => toast.error(message));
    } else {
      toast.error(fallbackMessage);
    }
  }, []);

  // Stable fetch — page/rowsPerPage passed as params, not captured via closure
  const fetchApiList = useCallback(
    async (objectName: string, currentPage: number, currentRowsPerPage: number) => {
      const payload = {
        asc: objectName ? "true" : true,
        offset: currentPage,
        pageSize: currentRowsPerPage,
        sortBy: "apiDesc",
      };

      try {
        if (objectName && !canLoadListByObj) return;
        if (!objectName && !canLoadList) return;

        const response = objectName
          ? await APiService.getApiList(payload, objectName)
          : await APiService.getAllApiList(payload);

        setRowData(response.data?.apiResponseDto ?? []);
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
    [intl, showApiErrors]
  );

  const loadObjectNames = useCallback(async () => {
    if (!canLoadObjects) return;
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

  // Single data-loading effect — fires on mount and whenever page/rows/object change
  useEffect(() => {
    fetchApiList(selectedObject, page, rowsPerPage);
  }, [page, rowsPerPage, selectedObject, fetchApiList]);

  // Load object names once on mount
  useEffect(() => {
    loadObjectNames();
  }, [loadObjectNames]);

  useEffect(() => {
    if (rowData.length === 0) {
      gridRef.current?.api?.showNoRowsOverlay();
    }
  }, [rowData]);

  const updateStpFlag = useCallback(
    async (data: APIListModel) => {
      const payload = [
        {
          apiId: data.apiId,
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
          fetchApiList(selectedObject, page, rowsPerPage);
        }
      } catch (error) {
        showApiErrors(error, "Failed to update STP flag");
      }
    },
    [fetchApiList, intl, selectedObject, page, rowsPerPage, showApiErrors]
  );

  // Just update state — the data-loading effect re-runs automatically
  const handleObject = useCallback((event: SelectChangeEvent<string>) => {
    setPage(0);
    setSelectedObject(event.target.value);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedObject("");
    setPage(0);
  }, []);

  const sortedObjectNames = useMemo(
    () =>
      [...objectNameList].sort((a, b) =>
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
                disabled={!canUpdate}
                icon={<img src={check_rounded} alt="" />}
                checkedIcon={<img src={ic_checked} alt="" />}
              />
            </li>
          </ul>
        ),
      },
    ],
    [intl, updateStpFlag, canUpdate]
  );

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

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
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  transformOrigin: { vertical: "top", horizontal: "right" },
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
                  suppressRowHoverHighlight={false}
                  headerHeight={51}
                  rowHeight={52}
                  suppressDragLeaveHidesColumns={true}
                  overlayNoRowsTemplate={intl.formatMessage({
                    id: "NewCardIssueance_1.norowstoshow",
                    defaultMessage: "No Rows To Show",
                  })}
                  enableRtl={intl.locale === "ar"}
                />
              </div>
            </Box>
            <TablePagination
              className="pagination"
              rowsPerPageOptions={rowsPerPageOptions}
              labelRowsPerPage={intl.formatMessage({
                id: "Pagination.rowsperpage",
                defaultMessage: "Rows per page",
              })}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${intl.formatMessage({
                  id: "Pagination.of",
                  defaultMessage: "Of",
                })} ${count}`
              }
              component="div"
              count={totalNumRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                onFocus: getValues,
                IconComponent: ArrowDropDown,
                MenuProps: {
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  transformOrigin: { vertical: "top", horizontal: "right" },
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
              backIconButtonProps={{ classes: { root: "prev-arrow" } }}
              nextIconButtonProps={{ classes: { root: "next-arrow" } }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </main>
      </div>
    </>
  );
}

export default DesignerMakerCheckerConfiguration;
