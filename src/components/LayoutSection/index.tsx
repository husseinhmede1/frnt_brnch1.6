import { add_rounded, down_arrow_icon, cancelIcon } from "../../assets/images";
import {
  FileElementResponseModel,
  layoutDetailsResponseModel,
} from "../../models/configuration/fileLayoutModel";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import {
  allowOnlyNumbers,
  getValues as getValuee,
} from "../../utils/commonfunction";
import { RowDragEndEvent } from "ag-grid-community";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import { CardActivities, LayoutDateElements, fileLayoutSectionType } from "../../utils/constant";

function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

type LayoutSectionProps = {
  layoutEleListRef: React.MutableRefObject<layoutDetailsResponseModel[]>;
  handlePadding: (event: any, params: any) => void;
  formsubmit: boolean;
  handlePaddingValue: (event: any, params: any) => void;
  handleElementLength: (event: any, params: any) => void;
  onDeleteEle: (element: layoutDetailsResponseModel, index: any) => void;
  setLayoutEleList1: React.Dispatch<
    React.SetStateAction<layoutDetailsResponseModel[]>
  >;
  handleAddElement: (element: FileElementResponseModel) => void;
  gridRef: React.RefObject<AgGridReact>;
  layoutEleList1: layoutDetailsResponseModel[];
  elementList: FileElementResponseModel[];
  sectionType: string;
  fileName?: string;
  isPending?: boolean;
  pendingActId?: number;
  isUpdated?: boolean;
  layoutUpdatedData: layoutDetailsResponseModel[];
  fileTypeStatus?: string | "";
};

const LayoutSection: React.FC<LayoutSectionProps> = ({
  layoutEleListRef,
  handlePadding,
  formsubmit,
  handlePaddingValue,
  handleElementLength,
  onDeleteEle,
  setLayoutEleList1,
  handleAddElement,
  gridRef,
  layoutEleList1,
  elementList,
  sectionType,
  fileName,
  isPending,
  pendingActId,
  isUpdated,
  layoutUpdatedData,
  fileTypeStatus,
}) => {
  const intl = useIntl();
  const [error, setError] = useState<string[]>([]);
  const [errorPaddingType, setErrorPaddingType] = useState<string[]>([]);

  // ── FIX: keep a local copy of rowData so AgGrid re-renders on every add/delete ──
  const [rowData, setRowData] = useState<layoutDetailsResponseModel[]>(layoutEleList1);

  useEffect(() => {
    console.log("layoutEleList1", layoutEleList1);
    
    setRowData([...layoutEleList1]);
  }, [layoutEleList1]);
  // ────────────────────────────────────────────────────────────────────────────────

  const getKycGroupKey = (elementName?: string) => {
    if (!elementName) return undefined;
    if (elementName.startsWith("CUST_CH_")) {
      return { prefix: "CUST_CH_", suffix: elementName.slice("CUST_CH_".length) };
    }
    if (elementName.startsWith("CUSTOMER_")) {
      return { prefix: "CUSTOMER_", suffix: elementName.slice("CUSTOMER_".length) };
    }
    if (elementName.startsWith("CARD_")) {
      return { prefix: "CARD_", suffix: elementName.slice("CARD_".length) };
    }
    if (elementName === "GENDER") {
      return { prefix: "CUSTOMER_", suffix: "GENDER" };
    }
    return undefined;
  };

  const isApplyKycBody = useMemo(
    () => fileName === CardActivities.ApplyKYC && sectionType === fileLayoutSectionType.Body,
    [fileName, sectionType]
  );

  const kycSelectedPrefixes = useMemo(() => {
    const prefixes: Record<string, Set<string>> = {};
    if (!isApplyKycBody) return prefixes;
    layoutEleList1.forEach((item) => {
      const key = getKycGroupKey(item.elementName);
      if (!key) return;
      prefixes[key.suffix] = prefixes[key.suffix] || new Set<string>();
      prefixes[key.suffix].add(key.prefix);
    });
    return prefixes;
  }, [isApplyKycBody, layoutEleList1]);

  const isKycAddDisabled = (element: FileElementResponseModel) => {
    if (!isApplyKycBody) return false;
    const key = getKycGroupKey(element.elementName);
    if (!key) return false;
    const selected = kycSelectedPrefixes[key.suffix];
    if (!selected || selected.size === 0) return false;
    const hasCustCh = selected.has("CUST_CH_");
    const hasCardOrCustomer = selected.has("CARD_") || selected.has("CUSTOMER_");
    if (key.prefix === "CUST_CH_") return hasCardOrCustomer || selected.has("CUST_CH_");
    if (key.prefix === "CARD_" || key.prefix === "CUSTOMER_") return hasCustCh;
    return false;
  };

  const handleError = (paddingIndex: any) => {
    if (
      (!layoutEleListRef?.current[paddingIndex]?.elementPaddingValue ||
        layoutEleListRef?.current[paddingIndex]?.elementPaddingValue === "") &&
      layoutEleListRef?.current[paddingIndex]?.elementPaddingType != undefined &&
      layoutEleListRef?.current[paddingIndex]?.elementPaddingType?.trim() !== ""
    ) {
      setError((prev) => [...prev, paddingIndex]);
    } else {
      setError((prev) => prev.filter((e) => e !== paddingIndex));
    }
  };

  const handleErrorPaddingType = (paddingIndex: any) => {
    if (
      (!layoutEleListRef?.current[paddingIndex]?.elementPaddingType ||
        layoutEleListRef?.current[paddingIndex]?.elementPaddingType?.trim() === "") &&
      (layoutEleListRef?.current[paddingIndex]?.elementPaddingValue ||
        layoutEleListRef?.current[paddingIndex]?.elementPaddingValue !== "")
    ) {
      setErrorPaddingType((prev) => [...prev, paddingIndex]);
    } else {
      setErrorPaddingType((prev) => prev.filter((e) => e !== paddingIndex));
    }
  };

  const columnDefs = [
    {
      field: "elementName",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.element", defaultMessage: "Element" }),
      maxWidth: 310, minWidth: 310,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true,
      rowDrag: true, flex: 1,
    },
    {
      field: "elementLength",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.elementLength", defaultMessage: "Element Length" }),
      maxWidth: 285, minWidth: 280,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => (
        <>
          {fileTypeStatus !== "Input" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
              <InputBase
                defaultValue={
                  isPending && pendingActId !== 0
                    ? layoutUpdatedData[params.node.rowIndex]?.elementLength
                    : ["CIRCUMFLEX","COMMA","DASH","PERCENTAGE","QUESTION","SEMI_COLON","SPACE","ASTERISK"].includes(layoutEleListRef?.current[params.node.rowIndex]?.elementName)
                    ? "1"
                    : layoutEleListRef?.current[params.node.rowIndex]?.elementLength
                }
                id={`params-elelength-${params?.node.rowIndex}-${sectionType}`}
                autoFocus={document?.activeElement?.id === `params-elelength-${params?.node.rowIndex}-${sectionType}`}
                inputProps={{ maxLength: 3 }}
                onChange={(e) => handleElementLength(e, params)}
                onKeyPress={allowOnlyNumbers}
                onPaste={allowOnlyNumbers}
                placeholder={intl.formatMessage({ id: "EditEmbossLayout_5.elementLength", defaultMessage: "Element Length" })}
                autoComplete="off"
              />
              {params.data?.elementLength === "" && formsubmit ? (
                <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element Length is required</FormHelperText>
              ) : params.data?.elementLength?.length > 3 ? (
                <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element length should not exceed 3 character</FormHelperText>
              ) : null}
            </div>
          )}
        </>
      ),
    },
    {
      field: "elementPaddingType",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.selectpadding", defaultMessage: "Select Padding" }),
      maxWidth: 258, minWidth: 240,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => (
        <>
          {fileTypeStatus !== "Input" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "10px", width: "100%" }}>
              <Select
                fullWidth
                defaultValue={
                  isPending && pendingActId !== 0
                    ? layoutUpdatedData[params.node.rowIndex]?.elementPaddingType
                    : layoutEleListRef?.current[params.node.rowIndex]?.elementPaddingType ?? " "
                }
                id={`params-paddingType-${params?.node.rowIndex}-${sectionType}`}
                autoFocus={document?.activeElement?.id === `params-paddingType-${params?.node.rowIndex}-${sectionType}`}
                onChange={(e) => { handlePadding(e, params); handleError(params?.node.rowIndex); handleErrorPaddingType(params?.node.rowIndex); }}
                onFocus={getValuee}
                IconComponent={ArrowDown}
                MenuProps={{
                  className: "select-item",
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  transformOrigin: { vertical: "top", horizontal: "right" },
                  PaperProps: { sx: { "@media (-webkit-device-pixel-ratio: 1.25)": { left: `${left}px !important` } } },
                }}
              >
                <MenuItem value=" ">Select Padding</MenuItem>
                {params.data?.elementName?.endsWith("DATE") && <MenuItem value="3">Date Format</MenuItem>}
                <MenuItem value="2">Left Padding</MenuItem>
                <MenuItem value="1">Right Padding</MenuItem>
              </Select>
              {!(isPending && pendingActId !== 0) &&
                errorPaddingType?.find((e) => e?.toString() === params?.node?.rowIndex?.toString()) !== undefined && (
                  <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element Padding Type is required</FormHelperText>
                )}
            </div>
          )}
        </>
      ),
    },
    {
      field: "elementPaddingValue",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.paddingcharacter", defaultMessage: "Characters" }),
      maxWidth: 400, minWidth: 350,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => {
        const element = layoutEleListRef?.current[params.node.rowIndex];
        return (
          <>
            {fileTypeStatus !== "Input" && (
              <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
                <InputBase
                  defaultValue={isPending && pendingActId !== 0 ? layoutUpdatedData[params.node.rowIndex]?.elementPaddingValue : element?.elementPaddingValue}
                  id={`params-paddingValue-${params?.node.rowIndex}-${sectionType}`}
                  autoFocus={document?.activeElement?.id === `params-paddingValue-${params?.node.rowIndex}-${sectionType}`}
                  inputProps={
                    params.data?.elementName?.endsWith("DATE") ? { maxLength: 10 }
                    : params.data?.elementName === LayoutDateElements?.FILLER ? { maxLength: 100 }
                    : { maxLength: 1 }
                  }
                  onChange={(e) => { handlePaddingValue(e, params); handleError(params?.node.rowIndex); handleErrorPaddingType(params?.node.rowIndex); }}
                  placeholder={intl.formatMessage({ id: "EditEmbossLayout_5.paddingcharacter", defaultMessage: "Characters" })}
                  autoComplete="off"
                />
                {!(isPending && pendingActId !== 0) && (
                  error.find((e) => e?.toString() === params?.node?.rowIndex?.toString()) !== undefined ? (
                    <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element padding value is required</FormHelperText>
                  ) : params.data?.elementPaddingValue?.length > 1 && params.data?.elementPaddingValue !== "" && !params.data?.elementName?.endsWith("DATE") && params.data?.elementName !== LayoutDateElements?.FILLER ? (
                    <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element padding value should not exceed 1 character</FormHelperText>
                  ) : params.data?.elementPaddingValue?.match(params.data?.validationRequired === "1" ? params.data.validationFormat : /^[a-zA-Z\s0-9_-]+$/) === null && params.data?.elementPaddingValue !== "" && !params.data?.elementName?.endsWith("DATE") ? (
                    <FormHelperText sx={{ whiteSpace: "break-spaces" }} id="error-helper-text" error>
                      {params.data?.validationRequired === "1" ? `Element padding value should match the pattern: ${params.data.validationFormat}` : `Element padding value is an alphanumeric string, the allowed special characters are "-" and "_"`}
                    </FormHelperText>
                  ) : params.data?.elementPaddingValue?.match(params.data?.validationRequired === "1" ? params.data.validationFormat : /^[A-Za-z0-9\s\-/]+$/) === null && params.data?.elementPaddingValue !== "" && params.data?.elementName?.endsWith("DATE") ? (
                    <FormHelperText sx={{ whiteSpace: "break-spaces" }} id="error-helper-text" error>
                      {params.data?.validationRequired === "1" ? `Element padding value should match the pattern: ${params.data.validationFormat}` : `Element padding value is an alphanumeric string, the allowed special characters are "-" and "/"`}
                    </FormHelperText>
                  ) : null
                )}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "roleaction",
      headerName: intl.formatMessage({ id: "SettingsUsers_4.actions", defaultMessage: "Actions" }),
      align: "right", headerAlign: "center",
      sortable: false, hideSortIcons: true, filterable: false, hideable: false,
      minWidth: 150, flex: 1, headerClass: "action-header",
      cellRenderer: (params: any) => (
        <ul className="action-btn-listing">
          <li>
            <Button
              className="action-btns"
              title={intl.formatMessage({ id: "Title.delete", defaultMessage: "Delete" })}
              onClick={() => {
                onDeleteEle(params.data, params.node.rowIndex);
                setError((prev) => prev.filter((e) => e !== params.node.rowIndex));
                setErrorPaddingType((prev) => prev.filter((e) => e !== params.node.rowIndex));
              }}
            >
              <img src={cancelIcon} alt="delete" />
            </Button>
          </li>
        </ul>
      ),
    },
  ];

  const columnDefsPrevious = [
    {
      field: "elementName",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.element", defaultMessage: "Element" }),
      maxWidth: 285, minWidth: 280,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true,
      rowDrag: true, flex: 1,
    },
    {
      field: "elementLength",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.elementLength", defaultMessage: "Element Length" }),
      maxWidth: 285, minWidth: 280,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => (
        <>
          {fileTypeStatus !== "Input" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
              <InputBase
                defaultValue={layoutEleList1[params.node.rowIndex]?.elementLength}
                id={`params-elelength-${params?.node.rowIndex}-${sectionType}`}
                autoFocus={document?.activeElement?.id === `params-elelength-${params?.node.rowIndex}-${sectionType}`}
                inputProps={{ maxLength: 3 }}
                onChange={(e) => handleElementLength(e, params)}
                onKeyPress={allowOnlyNumbers}
                onPaste={allowOnlyNumbers}
                placeholder={intl.formatMessage({ id: "EditEmbossLayout_5.elementLength", defaultMessage: "Element Length" })}
                autoComplete="off"
              />
              {params.data?.elementLength === "" && formsubmit ? (
                <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element Length is required</FormHelperText>
              ) : params.data?.elementLength?.length > 3 ? (
                <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element length should not exceed 3 character</FormHelperText>
              ) : null}
            </div>
          )}
        </>
      ),
    },
    {
      field: "elementPaddingType",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.selectpadding", defaultMessage: "Select Padding" }),
      maxWidth: 258, minWidth: 240,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => (
        <>
          {fileTypeStatus !== "Input" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "10px", width: "100%" }}>
              <Select
                fullWidth
                defaultValue={layoutEleList1[params.node.rowIndex]?.elementPaddingType}
                id={`params-paddingType-${params?.node.rowIndex}-${sectionType}`}
                autoFocus={document?.activeElement?.id === `params-paddingType-${params?.node.rowIndex}-${sectionType}`}
                onChange={(e) => handlePadding(e, params)}
                onFocus={getValuee}
                IconComponent={ArrowDown}
                MenuProps={{
                  className: "select-item",
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  transformOrigin: { vertical: "top", horizontal: "right" },
                  PaperProps: { sx: { "@media (-webkit-device-pixel-ratio: 1.25)": { left: `${left}px !important` } } },
                }}
              >
                <MenuItem value=" ">Select Padding</MenuItem>
                {params.data?.elementName?.endsWith("DATE") && <MenuItem value="3">Date Format</MenuItem>}
                <MenuItem value="2">Left Padding</MenuItem>
                <MenuItem value="1">Right Padding</MenuItem>
              </Select>
            </div>
          )}
        </>
      ),
    },
    {
      field: "elementPaddingValue",
      headerName: intl.formatMessage({ id: "EditEmbossLayout_5.paddingcharacter", defaultMessage: "Characters" }),
      maxWidth: 400, minWidth: 350,
      sortable: false, filterable: false, hideable: false, hideSortIcons: true, flex: 1,
      cellRenderer: (params: any) => (
        <>
          {fileTypeStatus !== "Input" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
              <InputBase
                defaultValue={layoutEleList1[params.node.rowIndex]?.elementPaddingValue}
                id={`params-paddingValue-${params?.node.rowIndex}-${sectionType}`}
                autoFocus={document?.activeElement?.id === `params-paddingValue-${params?.node.rowIndex}-${sectionType}`}
                inputProps={
                  params.data?.elementName?.endsWith("DATE") ? { maxLength: 10 }
                  : params.data?.elementName === LayoutDateElements?.FILLER ? { maxLength: 100 }
                  : { maxLength: 1 }
                }
                onChange={(e) => handlePaddingValue(e, params)}
                placeholder={intl.formatMessage({ id: "EditEmbossLayout_5.paddingcharacter", defaultMessage: "Characters" })}
                autoComplete="off"
              />
              {layoutEleListRef?.current[params.node.rowIndex]?.elementPaddingType?.trim() !== "" &&
                layoutEleListRef?.current[params.node.rowIndex]?.elementPaddingValue?.trim() === "" && (
                  <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element padding value is required</FormHelperText>
                )}
              {params.data?.elementPaddingValue?.length > 1 && params.data?.elementPaddingValue !== "" && !params.data?.elementName?.endsWith("DATE") && params.data?.elementName !== LayoutDateElements?.FILLER ? (
                <FormHelperText id="error-helper-text" error sx={{ whiteSpace: "break-spaces" }}>Element padding value should not exceed 1 character</FormHelperText>
              ) : params.data?.elementPaddingValue?.match(params.data?.validationRequired === "1" ? params.data.validationFormat : /^[a-zA-Z\s0-9_-]+$/) === null && params.data?.elementPaddingValue !== "" && !params.data?.elementName?.endsWith("DATE") ? (
                <FormHelperText sx={{ whiteSpace: "break-spaces" }} id="error-helper-text" error>
                  {params.data?.validationRequired === "1" ? `Element padding value should match the pattern: ${params.data.validationFormat}` : `Element padding value is an alphanumeric string, the allowed special characters are "-" and "_"`}
                </FormHelperText>
              ) : params.data?.elementPaddingValue?.match(params.data?.validationRequired === "1" ? params.data.validationFormat : /^[A-Za-z0-9\s\-/]+$/) === null && params.data?.elementPaddingValue !== "" && params.data?.elementName?.endsWith("DATE") ? (
                <FormHelperText sx={{ whiteSpace: "break-spaces" }} id="error-helper-text" error>
                  {params.data?.validationRequired === "1" ? `Element padding value should match the pattern: ${params.data.validationFormat}` : `Element padding value is an alphanumeric string, the allowed special characters are "-" and "/"`}
                </FormHelperText>
              ) : null}
            </div>
          )}
        </>
      ),
    },
    {
      field: "roleaction",
      headerName: intl.formatMessage({ id: "SettingsUsers_4.actions", defaultMessage: "Actions" }),
      align: "right", headerAlign: "center",
      sortable: false, hideSortIcons: true, filterable: false, hideable: false,
      minWidth: 150, flex: 1, headerClass: "action-header",
      cellRenderer: (params: any) => (
        <ul className="action-btn-listing">
          <li>
            <Button
              className="action-btns"
              title={intl.formatMessage({ id: "Title.delete", defaultMessage: "Delete" })}
              onClick={() => {
                onDeleteEle(params.data, params.node.rowIndex);
                setError((prev) => prev.filter((e) => e !== params.node.rowIndex));
                setErrorPaddingType((prev) => prev.filter((e) => e !== params.node.rowIndex));
              }}
            >
              <img src={cancelIcon} alt="delete" />
            </Button>
          </li>
        </ul>
      ),
    },
  ];

  const defaultColDef = useMemo(() => ({ resizable: true }), []);
  const suppressRowHoverHighlight = false;

  const onRowDragEnd = useCallback((e: RowDragEndEvent) => {
    let data: any = [];
    e.api.forEachNodeAfterFilterAndSort((rowNode: any) => { data.push(rowNode.data); });
    setLayoutEleList1([...data]);
    layoutEleListRef!.current = [...data];
  }, []);

  const Left = useSelector((state: RootState) => state.selectedCard.position.left);
  const Top = useSelector((state: RootState) => state.selectedCard.position.top);
  const [rowDragManagedState] = useState<boolean>(true);
  const [top, setTop] = React.useState(Top);
  const [left, setLeft] = React.useState(Left);
  useEffect(() => { setLeft(Left); setTop(Top); }, [Left, Top]);

  return (
    <Grid container spacing={3} className="embossing-element">
      {isUpdated && isPending && pendingActId !== 0 ? (
        <Grid item xs={12}>
          <Typography variant="h3">
            {intl.formatMessage({ id: "EditEmbossLayout_5.previouslayout", defaultMessage: "Previous Layout" })}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <AgGridReact
              ref={gridRef}
              rowData={layoutEleList1}
              columnDefs={isPending && pendingActId !== 0 ? columnDefsPrevious.slice(0, -1) : columnDefsPrevious}
              defaultColDef={defaultColDef}
              suppressRowHoverHighlight={suppressRowHoverHighlight}
              rowHeight={115}
              suppressDragLeaveHidesColumns={true}
              overlayNoRowsTemplate={intl.formatMessage({ id: "NewCardIssueance_1.norowstoshow", defaultMessage: "No Rows To Show" })}
              enableRtl={intl.locale === "ar"}
              animateRows={true}
              className="table-component draggable-table"
            />
          </Box>
        </Grid>
      ) : (
        <Grid
          item xs={12} md={4}
          className="data-grid-select"
          sx={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", zIndex: 20, backgroundColor: "#fff" }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {intl.formatMessage({ id: "EditEmbossLayout_5.selectelementtoadd", defaultMessage: "Select element to add" })}
          </Typography>
          <List
            component="nav"
            sx={{
              maxHeight: 520, overflowY: "auto", width: "100%",
              position: "relative", zIndex: 20, pointerEvents: "auto",
              "& .MuiListItemButton-root": { pointerEvents: "auto", cursor: "pointer" },
            }}
          >
            {elementList?.length > 0 && elementList.map((ele: FileElementResponseModel) => (
              <ListItemButton
                key={ele.elementId}
                onClick={() => handleAddElement(ele)}
                sx={{
                  width: "100%", textAlign: "left", mb: 1,
                  cursor: (isPending && pendingActId !== 0) || isKycAddDisabled(ele) ? "not-allowed" : "pointer",
                  alignItems: "center", position: "relative", zIndex: 20,
                  minHeight: 48, pointerEvents: "auto",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                disableRipple
              >
                <img src={add_rounded} alt="add" style={{ height: "15px", padding: "0px 10px", pointerEvents: "none" }} />
                {ele?.isMandatory === "1" && <span className="required">*</span>}
                <ListItemText primary={ele.elementName} style={{ paddingLeft: "3%" }} />
              </ListItemButton>
            ))}
          </List>
        </Grid>
      )}

      {/* ── Edit Layout grid ── */}
      <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {intl.formatMessage({ id: "EditEmbossLayout_5.editlayout", defaultMessage: "Edit Layout" })}
        </Typography>
        <Box sx={{ width: "100%", minHeight: 520 }}>
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            {/* ── FIX: key forces AgGrid to remount when row count changes ── */}
            <AgGridReact
              key={`${sectionType}-${rowData.length}`}
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              suppressRowHoverHighlight={suppressRowHoverHighlight}
              rowHeight={115}
              suppressDragLeaveHidesColumns={true}
              overlayNoRowsTemplate={intl.formatMessage({ id: "NewCardIssueance_1.norowstoshow", defaultMessage: "No Rows To Show" })}
              enableRtl={intl.locale === "ar"}
              rowDragManaged={rowDragManagedState}
              onRowDragEnd={onRowDragEnd}
              animateRows={true}
              className="table-component draggable-table"
            />
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LayoutSection;