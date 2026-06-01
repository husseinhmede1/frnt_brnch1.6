import {
  down_arrow_icon,
  check_rounded,
  ic_checked,
  cancelIcon,
  confetti,
  crossIcon,
  expandIcon,
  search_ic,
  tickIcon,
  clear,
} from "../../assets/images";
import { PendingActivitiesModel } from "../../models/Dashboard/Dashboard";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as XLSX from 'xlsx';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  Paper,
  Popper,
  PopperProps,
  Select,
  SelectChangeEvent,
  Switch,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
  SvgIcon,
} from "@mui/material";
import { PendingActivityService } from "../../services/dashboard/dashboard-service";
import { StatusCode, rowsPerPageOptions } from "../../utils/constant";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CustomeComparator,
  approvependingAct,
  cancelpendingAct,
  compareDate,
  getValues,
} from "../../utils/commonfunction";
import ScopeModel from "../../models/configuration/ScopeModel";
import { useDispatch, useSelector } from "react-redux";
import { ScopeAbbrev } from "../../utils/constant";
import { RootState } from "../../feature/store";
import { ScopeService } from "../../services/scope-service";
import {
  CellClickedEvent,
  ColumnApi,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import React from "react";
import throttle from "lodash/throttle";
import { PropagateLoader } from "react-spinners";

function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}
function ArrowDropDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

interface PendingActivitiesProps {
  expandPending?: boolean;
}

const PendingActivities = ({ expandPending = false }: PendingActivitiesProps) => {
  const intl = useIntl();
  const gridRef = React.useRef<AgGridReact>(null);
  const loginUserStorage = JSON.parse(localStorage.getItem("user") as string);
  const moduleStorage = JSON.parse(localStorage.getItem("modules") as string);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pendingActData, setPendingActData] =
    React.useState<PendingActivitiesModel>();
  const [hasExportEXCELAccess, setHasExportEXCELAccess] =
    useState<boolean>(false);
  const [note, setNote] = React.useState<string>("");
  const [reEmbossing, setReEmbossing] = React.useState(false);
  const [filterpendingActivities, setFilterPendingActivities] = React.useState<
    PendingActivitiesModel[]
  >([]);
  const financialList = [
    {
      key: "1",
      value: "Financial",
    },
    {
      key: "0",
      value: "Non Financial",
    },
  ];
  const [functionsList, setFunctionsList] = React.useState<String[]>([]);
  const filterActivityRef = React.useRef([...filterpendingActivities]);
  const { pathname } = useLocation();
  const [objectNameList, setObjectNameList] = React.useState<ScopeModel[]>([]);
  const [object, setObject] = React.useState(" ");
  const [searchFlag, setSearchFlag] = React.useState(false);
  const [canSearch, setCanSearch] = React.useState(false);
  const [functionValue, setFunctionValue] = React.useState(" ");
  const [financialValue, setFinancialValue] = React.useState(" ");
  const [balanceTypeCode, setBalanceTypeCode] = React.useState<number>(0);
  const [balanceTypeDesc, setBalanceTypeDesc] = React.useState<string>("");
  const [balanceTypeSeq, setBalanceTypeSeq] = React.useState<number>(0);
  const [balanceTypeStatus, setBalanceTypeStatus] = React.useState<string>('0');
  const [oldBalanceTypeCode, setOldBalanceTypeCode] = React.useState<number>(0);
  const [oldBalanceTypeDesc, setOldBalanceTypeDesc] = React.useState<string>("");
  const [oldBalanceTypeSeq, setOldBalanceTypeSeq] = React.useState<number>(0);
  const [oldBalanceTypeStatus, setOldBalanceTypeStatus] = React.useState<string>('0');
  const [fromDatePicker, setFromDatePicker] = useState<null | Date>(null);
  const [toDatePicker, setToDatePicker] = useState<null | Date>(null);
  const [authorityId, setAuthorityId] = React.useState<number | null>(null);
  const [thereBranchList, setThereBranchList] = React.useState<boolean>(false);
  const gridApiRef = useRef<GridApi | null>(null);
  const gridColumnApiRef = useRef<ColumnApi | null>(null);
  const [isGridLoading, setIsGridLoading] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    gridColumnApiRef.current = params.columnApi;

    // optional: show overlay immediately if API is loading
    if (isGridLoading) {
      gridApiRef.current.showLoadingOverlay();
    }
  };


  const CustomPaper = (props: any) => {
    return <Paper {...props} sx={{ mt: "2px !important" }} />;
  };

  const ThickBlueCalendarWithSixSquaresIcon = () => (
    <SvgIcon style={{ color: '#5798FB', width: "95%" }} viewBox="0 0 70 70">
      <rect x="6" y="10" width="52" height="46" rx="5" ry="5" fill="#5798FB" />
      <rect x="16" y="4" width="8" height="14" rx="1" fill="#5798FB" />
      <rect x="40" y="4" width="8" height="14" rx="1" fill="#5798FB" />
      <rect x="10" y="20" width="44" height="32" rx="2" fill="white" />
      <rect x="20" y="28" width="6" height="6" rx="1" fill="#5798FB" />
      <rect x="29" y="28" width="6" height="6" rx="1" fill="#5798FB" />
      <rect x="38" y="28" width="6" height="6" rx="1" fill="#5798FB" />
      <rect x="20" y="38" width="6" height="6" rx="1" fill="#5798FB" />
      <rect x="29" y="38" width="6" height="6" rx="1" fill="#5798FB" />
      <rect x="38" y="38" width="6" height="6" rx="1" fill="#5798FB" />
    </SvgIcon>
  );


  const handleObject = (event: SelectChangeEvent) => {
    setObject(event.target.value);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [totalNumRecords, setTotalNumRecords] = React.useState(0);
  const [branch, setBranch] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [blockCard, setBlockCard] = React.useState(false);
  const [blockNote, setBlockNote] = React.useState("");

  const [card, setCard] = React.useState("");
  const [cardMaskedNumber, setCardMaskedNumber] = React.useState("");
  const [isReplenish, setIsReplenish] = React.useState<boolean>(true);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApprove, setSelectedApprove] = React.useState<string[]>([]);
  const [selectedReject, setSelectedReject] = React.useState<string[]>([]);

  /********-----CARD OPERATIONS AND CUSTOMER INFO FROM PENDING ACT (START)----------**************************/
  const [openreplenish, setOpenReplenish] = React.useState(false);
  const [openBalanceType, setOpenBalanceType] = React.useState(false);
  const handleOpenReplenish = () => {
    setOpenReplenish(true);
    setIsReplenish(true);
  };

  const [opendeplete, setOpenDeplete] = React.useState(false);
  const handleOpenDeplete = () => {
    setOpenDeplete(true);
    setIsReplenish(false);
  };

  const [openReplacementCardFromStock, setOpenReplacementCardFromStock] = React.useState(false);
  const handleOpenReplacementCardFromStock = () => {
    setOpenReplacementCardFromStock(true);
  };

  const [openCardReplace, setOpenCardReplace] = React.useState(false);
  const handleOpenCardReplace = () => {
    setOpenCardReplace(true);
    setThereBranchList(true);
  };
  const onCancelBalanceType = () => {
    setOpenBalanceType(false);
  }
  const [openCustomerInfo, setOpenCustomerInfo] = React.useState(false);
  const handleOpenCustomerInfo = () => {
    setOpenCustomerInfo(true);
  };
  const [openAccountInfo, setOpenAccountInfo] = React.useState(false);
  const handleOpenAccountInfo = () => {
    setOpenAccountInfo(true);
  };

  const [openContactInfo, setOpenContactInfo] = useState(false);
  const handleOpenContactInfo = () => {
    setOpenContactInfo(true);
  };
  const handleCloseContactInfo = () => {
    setOpenContactInfo(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetch = React.useMemo(
    () =>
      throttle((request: { input: string; type: string }) => {
        if (request.input.trim().length === 0) return;
      }, 200),
    []
  );

  useEffect(() => {
    if (pathname === "/pending-activities")
      fetch({ input: inputValue, type: "authority" });
  }, [inputValue]);

  useEffect(() => {
    if (pathname.includes("/pending-activities")) {
      getObjectName();
    }
  }, []);

  // useEffect(() => {
  //   if(branchList.length === 0){
  //     // seven api 
  //   try {
  //     const res = await BranchesService.getBranchById();

  //     if (res.data?.length > 0) {

  //     } else {
  //     }

  //   } catch (err: any) {
  //     err?.response?.data?.errors?.map((e: string) => toast.error(e));
  //   }


  //     BranchesService.getActiveBranches().then((res) => {
  //       if (res.status === StatusCode.Success) {
  //         setBranchList(res.data);
  //         setThereBranchList(false);
  //       }
  //     });
  //   }
  // },[loginUser])

  const [updateCard, setUpdateCard] = React.useState<boolean>(false);
  const [embossingName, setEmbossingName] = React.useState<string>("");
  const [embossingNameNew, setEmbossingNameNew] = React.useState<string>("");
  const [embossingNameAr, setEmbossingNameAr] = React.useState<string>("");
  const [embossingNameArNew, setEmbossingNameArNew] = React.useState<string>("");
  const [sector, setSector] = React.useState<string>(" ");
  const [sectorNew, setSectorNew] = React.useState<string>(" ");
  const [cardTypeInfo, setCardTypeInfo] = React.useState<string>(" ");
  const [cardTypeInfoCode, setCardTypeInfoCode] = React.useState<string>(" ");
  const [cardTypeInfoDesc, setCardTypeInfoDesc] = React.useState<string>(" ");

  const [cardTypeInfoNew, setCardTypeInfoNew] = React.useState<string>(" ");
  const [cardTypeInfoNewId, setCardTypeInfoNewId] = React.useState<string>(" ");
  const [deliveryBranchCode, setDeliveryBranchCode] = React.useState<string>(" ");
  const [deliveryBranchName, setDeliveryBranchName] = React.useState<string>(" ");
  const [deliveryBranchNew, setDeliveryBranchNew] = React.useState<string>("");

  const [forceRerender, setForceRerender] = useState<number>(0);
  const [updateCardServiceSet, setUpdateCardServiceSet] = React.useState<boolean>(false);
  const [serviceSetNew, setServiceSetNew] = React.useState<string>("");
  const [serviceSetEcomNew, setServiceSetEcomNew] = React.useState<string>("");
  const [hasPending, setHasPending] = React.useState<boolean>(false);
  const [cardInformation, setCardInformation] = React.useState<any>();


  const gridRefServiceSet = useRef<AgGridReact>(null);
  const suppressRowHoverHighlight = false;


  const defaultColDef7 = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  const columnDefsServiceset = [
    {
      field: "serviceDescription",
      headerName: intl.formatMessage({
        id: "NewCardIssueance_2.servicename",
        defaultMessage: "Service Name",
      }),
      minWidth: 280,
      sortable: false,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      flex: 1,
      type: "string",
      valueGetter: (params: any) => {
        return params.data.serviceDescription;
      }
    },
    {
      field: "select",
      headerName: "old value",
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      hideable: false,
      minWidth: 122,
      flex: 1,
      headerClass: "action-header",
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
      cellRenderer: (params: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Switch
              defaultChecked={params.data.selectedServiceSetValue == "0" ? false : true}
              disabled={true}
            />
            {(params.data?.selectedServiceSetValue === "1") && params?.data?.serviceCode === "ECOM" && hasPending && (
              <FormHelperText error>
                Ecom has pending enrollment
              </FormHelperText>
            )}
          </div>
        );
      },
    },
    {
      field: "select",
      headerName: "New value",
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      hideable: false,
      minWidth: 122,
      flex: 1,
      headerClass: "action-header",
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
      cellRenderer: (params: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Switch
              defaultChecked={
                (params.data.serviceDescription === "ECOM" && hasPending)
                  ? true
                  : params.data.newSelectedServiceSetValue?.toString() !== "0"
              }
              disabled={true}
            />
            {(params.data?.selectedServiceSetValue === "1") && params?.data?.serviceCode === "ECOM" && hasPending && (
              <FormHelperText error>
                Ecom has pending enrollment
              </FormHelperText>
            )}
          </div>
        );
      },
    },
  ];

  const getObjectName = (): void => {
    ScopeService.getActiveScopes()
      .then((response) => {
        setObjectNameList([...response.data]);
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  const handleFunction = (event: SelectChangeEvent) => {
    setFunctionValue(event.target.value);
  };
  const handleFinancial = (event: SelectChangeEvent) => {
    setFinancialValue(event.target.value);
  };

  const [refreshPending, setRefreshPending] = React.useState(false);

  useEffect(() => {
    if (canSearch && !pathname.includes("dashboard")) {
      if (!fromDatePicker && !toDatePicker) {
        toast.error("Please enter from date and to date")
        return;
      }
      if (
        !object.trim() &&
        !functionValue.trim() &&
        !authorityId &&
        !financialValue.trim() &&
        !fromDatePicker &&
        !toDatePicker
      ) {
        getPendingActivities();
      } else {
        getPendingActListbyObject(object);
      }
    }
  }, [rowsPerPage, page, searchFlag, pathname]);

  useEffect(() => {
    if (filterpendingActivities.length === 0) {
      gridRef?.current?.api?.showNoRowsOverlay();
    }
  }, [intl.locale]);

  const getPendingActivities = async () => {
    setIsGridLoading(true);
    gridApiRef.current?.showLoadingOverlay();

    try {
      const model = {
        asc: "false",
        offset: page,
        pageSize: rowsPerPage,
        sortBy: "created_date",
      };

      const res = await PendingActivityService.getPendingActivitiesDashboard(model);
      const newArray =
        res?.status === StatusCode.Success
          ? (res.data?.pendingActivitiesDashboardResponseDto ?? []).map((el: any) => ({
            ...el,
            cancelStatus: false,
            approveStatus: false,
            returnStatus: false,
          }))
          : [];


      setFilterPendingActivities(newArray);
      filterActivityRef.current = newArray;
      setTotalNumRecords(res.data?.paginationResponseDto?.totalNumberOfRecords || 0);
    } catch (err: any) {
      err?.response?.data?.errors?.forEach((e: string) => toast.error(e));
      setFilterPendingActivities([]);
      filterActivityRef.current = [];
      setTotalNumRecords(0);
    } finally {
      setIsGridLoading(false);

      // Decide overlay AFTER data is set
      if (filterActivityRef.current.length === 0) {
        gridApiRef.current?.showNoRowsOverlay();
      } else {
        gridApiRef.current?.hideOverlay();
      }

      setRefreshPending(false);
    }
  };

  // const getPendingActivities = async () => {
  //   gridApiRef.current?.showLoadingOverlay();

  //   try {
  //     const model = {
  //       asc: "false",
  //       offset: page,
  //       pageSize: rowsPerPage,
  //       sortBy: "created_date",
  //     };

  //     const res = await PendingActivityService.getPendingActivitiesDashboard(model);

  //     if (
  //       res?.status === StatusCode.Success &&
  //       res?.data?.pendingActivitiesDashboardResponseDto?.length > 0
  //     ) {
  //       const newArray = res.data.pendingActivitiesDashboardResponseDto.map(
  //         (el: PendingActivitiesModel) => ({
  //           ...el,
  //           cancelStatus: false,
  //           approveStatus: false,
  //           returnStatus: false,
  //         })
  //       );

  //       setFilterPendingActivities(newArray);
  //       filterActivityRef.current = newArray;
  //       setTotalNumRecords(res.data.paginationResponseDto?.totalNumberOfRecords);
  //     } else {
  //       setFilterPendingActivities([]);
  //       filterActivityRef.current = [];
  //       setTotalNumRecords(0);
  //     }
  //   } catch (err: any) {
  //     err?.response?.data?.errors?.forEach((e: string) => toast.error(e));
  //     setFilterPendingActivities([]);
  //     filterActivityRef.current = [];
  //     setTotalNumRecords(0);
  //   } finally {
  //     gridApiRef.current?.hideOverlay();
  //     setRefreshPending(false);
  //   }
  // };

  const getPendingActListbyObject = (scopeId: string) => {
    setIsGridLoading(true);
    gridApiRef.current?.showLoadingOverlay();

    let model = {
      paginationRequestDto: {
        asc: "false",
        offset: page,
        pageSize: rowsPerPage,
        sortBy: "CREATED_DATE",
      },
      scopeId: scopeId === null ? 0 : Number(scopeId),
      function: functionValue === " " ? "" : functionValue,
      user: authorityId ?? 0,
      fromDate:
        fromDatePicker === null ? "" : moment(fromDatePicker).format("YYYY-MM-DD"),
      toDate:
        toDatePicker === null ? "" : moment(toDatePicker).format("YYYY-MM-DD"),
      financial: financialValue === " " ? "" : financialValue,
    };
    PendingActivityService.getPendingActivitiesByScope(model)
      .then((res) => {
        if (
          res?.data?.pendingActivitiesDashboardResponseDto.length > 0 &&
          res?.status === StatusCode.Success
        ) {
          let newArray: any = [
            ...res?.data?.pendingActivitiesDashboardResponseDto,
          ];
          newArray.forEach((element: PendingActivitiesModel) => {
            element.cancelStatus = false;
            element.approveStatus = false;
            element.returnStatus = false;
          });
          setFilterPendingActivities([...newArray]);
          filterActivityRef.current = [...newArray];
          setTotalNumRecords(
            res.data?.paginationResponseDto?.totalNumberOfRecords
          );
        } else {
          setFilterPendingActivities([]);
          filterActivityRef.current = [];
          setTotalNumRecords(0);
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
        setFilterPendingActivities([]);
        filterActivityRef.current = [];
        setTotalNumRecords(0);
      })
      .finally(() => {
        setIsGridLoading(false);
        gridApiRef.current?.hideOverlay();
      });
  };

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = (): void => {
    filterActivityRef.current = [...filterpendingActivities];
  };

  function checkOperationsStatus(inputString: string) {
    const regex = /(\d+)\s*failed\s*operations.*(\d+)\s*successful\s*operations/;
    const match = inputString.match(regex);
    if (match) {
      const number1 = parseInt(match[1], 10);
      const number2 = parseInt(match[2], 10);
      const flag = number1 > 0 && number2 === 0 ? 0 : number1 === 0 && number2 > 0 ? 1 : number1 > 0 && number2 > 0 ? 2 : null;
      return flag;
    }
    return null;
  }

  const getRowId = useCallback((params: GetRowIdParams) => {
    return params.data.uuid;
  }, []);

  const handleChangeApprove = (
    index: number,
    actData: PendingActivitiesModel,
    event: any
  ) => {
    let data = [...filterActivityRef.current];
    let approveList = [...selectedApprove];
    let rejectList = [...selectedReject];

    data[index] = { ...data[index], approveStatus: event.target.checked };
    if (event.target.checked && data[index].cancelStatus) {
      data[index].cancelStatus = false;
      if (rejectList.includes(actData.uuid.toString())) {
        rejectList.splice(
          rejectList.findIndex((u) => u === actData.uuid.toString()),
          1
        );
        setSelectedReject(rejectList);
      }
    }
    if (event.target.checked && actData.uuid) {
      approveList.push(actData.uuid.toString());
      setSelectedApprove(approveList);
    } else {
      approveList.splice(
        approveList.findIndex((u) => u === actData.uuid.toString()),
        1
      );
      setSelectedApprove(approveList);
    }
    filterActivityRef.current = [...data];
    setFilterPendingActivities([...data]);
  };

  const handleChangeCancel = (
    index: number,
    actData: PendingActivitiesModel,
    event: any
  ) => {
    let data = [...filterActivityRef.current];
    let approveList = [...selectedApprove];
    let rejectList = [...selectedReject];

    data[index] = { ...data[index], cancelStatus: event.target.checked };
    if (event.target.checked && data[index].approveStatus) {
      data[index].approveStatus = false;
      if (approveList.includes(actData.uuid.toString())) {
        approveList.splice(
          approveList.findIndex((u) => u === actData.uuid.toString()),
          1
        );
        setSelectedApprove(approveList);
      }
    }
    if (event.target.checked && actData.uuid) {
      rejectList.push(actData.uuid.toString());
      setSelectedReject(rejectList);
    } else {
      rejectList.splice(
        rejectList.findIndex((u) => u === actData.uuid.toString()),
        1
      );
      setSelectedReject(rejectList);
    }
    filterActivityRef.current = [...data];
    setFilterPendingActivities([...data]);
  };

  const selectAllCancel = (event: any) => {
    let data = [...filterActivityRef.current];
    let cancelList: string[] = [];
    if (pathname.includes("dashboard") && data.length > 10) {
      data = data.slice(0, 10);
    }
    data.map((item) => {
      item.cancelStatus = event.target.checked;
      item.approveStatus = false;
      if (event.target.checked && item.uuid) {
        cancelList.push(item.uuid.toString());
        setSelectedReject(cancelList);
      } else {
        setSelectedReject(cancelList);
      }
    });
    filterActivityRef.current = [...data];
    setFilterPendingActivities([...data]);
  };

  const selectAllApprove = (event: any) => {
    let data = [...filterActivityRef.current];
    let approveList: string[] = [];
    if (pathname.includes("dashboard") && data.length > 10) {
      data = data.slice(0, 10);
    }
    data.map((item) => {
      item.approveStatus = event.target.checked;
      item.cancelStatus = false;
      if (event.target.checked && item.uuid) {
        approveList.push(item.uuid.toString());
        setSelectedApprove(approveList);
      } else {
        setSelectedApprove(approveList);
      }
    });
    filterActivityRef.current = [...data];
    setFilterPendingActivities([...data]);
  };

  const columnDefs = [
    {
      field: "apiObject",
      colId: "1",
      headerName: intl.formatMessage({ id: "Dashboard_1_2.object" }),
      minWidth: 165,
      sortable: true,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      flex: 1,
      headerClass: "date-col",
      comparator: CustomeComparator,
    },
    {
      field: "apiDescription",
      colId: "2",
      headerName: intl.formatMessage({ id: "Dashboard_1_2.description" }),
      sortable: false,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      minWidth: 220,
      flex: 1,
      comparator: CustomeComparator,
      cellRenderer: (params: any) => {
        return params.data?.apiDescription;
      },
    },
    {
      field: "details",
      colId: "3",
      headerName: intl.formatMessage({
        id: "Dashboard_1_2.Details",
        defaultMessage: "Details",
      }),
      minWidth: 600,
      sortable: true,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      flex: 1,
      headerClass: "date-col",
      cellRenderer: (params: any) => {
        const details = params.value;
        return (
          <Tooltip title={details} placement='right-start'>
            {details}
          </Tooltip>
        );
      },
      valueGetter: (params: any) => {
        return params.data;
      }
    },
    {
      field: "createdByUser",
      colId: "4",
      headerName: intl.formatMessage({
        id: "Dashboard_1_2.createdbyuser",
        defaultMessage: "Created by user",
      }),
      sortable: true,
      filterable: false,
      hideable: false,
      hideSortIcons: true,
      minWidth: 240,
      flex: 1,
      headerClass: "date-col",
      comparator: CustomeComparator,
    },
    {
      field: "createdDate",
      colId: "5",
      headerName: intl.formatMessage({ id: "Dashboard_1_2.datecreated" }),
      type: "date",
      minWidth: 185,
      filterable: false,
      sortable: true,
      hideable: false,
      hideSortIcons: true,
      headerClass: "date-col",
      flex: 1,
      comparator: compareDate,
      cellRenderer: (params: any) => {
        if (params?.data?.createdDate) {
          return moment(params?.data?.createdDate).format("YYYY-MM-DD HH:mm");
        }
      },
    },
    {
      align: "center",
      headerAlign: "center",
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      hideable: false,
      minWidth: 220,
      maxWidth: 320,
      flex: 1,

      headerComponentFramework: () => {
        return (
          <ul className="action-btn-listing">
            <li>
              <Checkbox
                defaultChecked={
                  filterActivityRef.current.find(
                    (item: any) => item.cancelStatus === false
                  )
                    ? false
                    : filterActivityRef.current.length === 0
                      ? false
                      : true
                }
                onChange={selectAllCancel}
                icon={<img src={check_rounded} alt="" />}
                checkedIcon={<img src={ic_checked} alt="" />}
              />
              <Button
                className="action-btns"
                title={intl.formatMessage({
                  id: "Dashboard_3.cancelall",
                  defaultMessage: "Discard/Reject All",
                })}
              // onClick={handleCancel}
              >
                <img src={crossIcon} alt="cross" />
              </Button>
            </li>
            <li>
              <Checkbox
                defaultChecked={
                  filterActivityRef.current.find(
                    (item: any) => item.approveStatus === false
                  )
                    ? false
                    : filterActivityRef.current.length === 0
                      ? false
                      : true
                }
                onChange={selectAllApprove}
                icon={<img src={check_rounded} alt="" />}
                checkedIcon={<img src={ic_checked} alt="" />}
              />
              <Button
                className="action-btns"
                title={intl.formatMessage({
                  id: "Dashboard_3.approveall",
                  defaultMessage: "Approve All",
                })}
              // onClick={handleApprove}
              >
                <img src={tickIcon} alt="tick" />
              </Button>
            </li>
          </ul>
        );
      },
      cellRenderer: (params: any) => {
        return (
          <ul className="action-btn-listing">
            <li>
              <Checkbox
                sx={{ border: "none !important" }}
                defaultChecked={
                  filterpendingActivities[params.node.rowIndex].cancelStatus
                }
                onChange={(event) =>
                  handleChangeCancel(params.node.rowIndex, params.data, event)
                }
                icon={<img src={check_rounded} alt="" />}
                checkedIcon={<img src={ic_checked} alt="" />}
              />
            </li>
            <li>
              <Checkbox
                sx={{ border: "none !important" }}
                defaultChecked={
                  filterpendingActivities[params.node.rowIndex].approveStatus
                }
                onChange={(event) =>
                  handleChangeApprove(params.node.rowIndex, params.data, event)
                }
                icon={
                  <img src={check_rounded} alt="" />
                }
                checkedIcon={
                  <img src={ic_checked} alt="" />
                }
              />
            </li>
          </ul>
        );
      },
    },
  ];

  useEffect(() => {
    filterApiDescription();
  }, [object, financialValue]);

  const filterApiDescription = () => {
    // if (pathname.includes("/pending-activities")) {
    //   PendingActivityService.getFunctionsByScope(
    //     object === " " ? "all" : object,
    //     (searchPendingActivity.financialValue?.trim() != "")? (searchPendingActivity.financialValue === " " ? "all" : searchPendingActivity.financialValue): (financialValue === " " ? "all" : financialValue)
    //   )
    //     .then((res) => {
    //       setFunctionsList(res.data);
    //     })
    //     .catch(() => { });
    // }
  };

  const defaultColDef = React.useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  function extractCardType(input: any) {
    if (typeof input !== "string") return null;

    const match = input.match(/Cardtype\s+Type\s*:\s*\[([^\]]+)\]/i);
    return match ? match[1] : null;
  }



  // const CustomPopper = (props: PopperProps) => {
  //   return (
  //     <Popper
  //       {...props}
  //       sx={{
  //         "@media (-webkit-device-pixel-ratio: 1.25)": {
  //           transform: `translate3d(${left - 10}px, ${top + 30}px, 0px) !important`
  //         }
  //       }}
  //       placement="bottom-start"
  //     >
  //     </Popper>
  //   )
  // }

  const Left = useSelector(
    (state: RootState) => state.selectedCard.position.left
  );
  const Top = useSelector(
    (state: RootState) => state.selectedCard.position.top
  );
  const [top, setTop] = React.useState(Top);
  const [left, setLeft] = React.useState(Left);
  const [embossValueLength, setEmbossValueLength] = useState<string>("20");
  const hasFetchedEmbossValueLength = useRef(false);

  useEffect(() => {
    setLeft(Left);
    setTop(Top);
  }, [Left, Top]);

  const onCancel = () => {
    setReEmbossing(false);
    setBlockCard(false);
    setUpdateCard(false);
    setUpdateCardServiceSet(false);
    setRefreshPending(true);
  };

  const clearDates = () => {
    // dispatch(resetSearchPendingActivity());
    setFromDatePicker(null);
    setToDatePicker(null);
    setObject(" ");
    setFinancialValue(" ");
    setFunctionValue(" ");
    // setValue1(null);
    setAuthorityId(null);
    setSearchFlag(!searchFlag);
    setCanSearch(false);
    setFilterPendingActivities([]);
    filterActivityRef.current = [];
    setTotalNumRecords(0);

    getPendingActivities();
  };

  // const exportToExcel = () => {
  //   const allRows = gridRef.current!.api.getDataAsCsv({});
  //   const rowsArray = allRows?.split('\n');
  //   if (!rowsArray) return;

  //   const sheet2Header = [
  //     "Object",
  //     "Description",
  //     "Mask Card Number",
  //     "Account Number",
  //     "Amount",
  //     "Set Code",
  //     "Created By",
  //     "Date Created"
  //   ];

  //   // Parse CSV into 2D array
  //   const parsedData = rowsArray.map(row =>
  //     row.split(',').map(cell => cell.replace(/"/g, '').trim())
  //   );

  //   // Filter Replenish/Deplete rows
  //   let replenishDepleteData = parsedData.filter(
  //     row => row[1] === "Replenish Card" || row[1] === "Deplete Card"
  //   );

  //   // Reorder & clean data according to the desired indexes
  //   let filteredReplenishDepleteData = replenishDepleteData.map(r => [
  //     r[0],
  //     r[1],
  //     r[2]?.replace("Replenish Card [Mask Card Number: ", "").replace("Deplete Card [Mask Card Number: ", ""), // Mask Card Number
  //     r[5]?.replace("RAN: ", ""),
  //     r[6]?.replace("Amount: ", ""),
  //     r[7]?.replace("Set Code: ", "").replace("]", ""),
  //     r[8],
  //     r[9],
  //   ]);

  //   // Add header at the top
  //   filteredReplenishDepleteData.unshift(sheet2Header);

  //   // Other data (non-Replenish/Deplete)
  //   const otherData = parsedData.filter(
  //     row => row[1] !== "Replenish Card" && row[1] !== "Deplete Card"
  //   );

  //   // Create workbook
  //   const wb = XLSX.utils.book_new();

  //   if (otherData.length > 1) {
  //     const ws1 = XLSX.utils.aoa_to_sheet(otherData);
  //     XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');

  //     if (filteredReplenishDepleteData.length > 1) {
  //       const ws2 = XLSX.utils.aoa_to_sheet(filteredReplenishDepleteData);
  //       XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
  //     }
  //   } else {
  //     // Only Replenish/Deplete data exists
  //     const ws = XLSX.utils.aoa_to_sheet(filteredReplenishDepleteData);
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
  //   }

  //   // Save file
  //   XLSX.writeFile(wb, 'PendingActivities.xlsx');
  // };
  const exportToExcel = () => {
    const allRows = gridRef.current!.api.getDataAsCsv({});
    if (!allRows) return;

    const sheet2Header = [
      "Object",
      "Description",
      "Mask Card Number",
      "Account Number",
      "Amount",
      "Set Code",
      "Created By",
      "Date Created"
    ];

    const parseCSV = (csvText: string): string[][] => {
      const rows: string[][] = [];
      let currentRow: string[] = [];
      let currentCell = '';
      let inQuotes = false;

      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            currentCell += '"';
            i++;
          } else {
            // Toggle quote mode
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of cell
          currentRow.push(currentCell.trim());
          currentCell = '';
        } else if (char === '\n' && !inQuotes) {
          // End of row
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell !== '')) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentCell = '';
        } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
          // Handle Windows line endings (\r\n)
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell !== '')) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentCell = '';
          i++; // Skip the \n
        } else {
          currentCell += char;
        }
      }


      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
      }

      return rows;
    };

    const parsedData = parseCSV(allRows);

    const replenishDepleteData = parsedData.filter(
      row => row[1] === "Replenish Card" || row[1] === "Deplete Card"
    );

    const filteredReplenishDepleteData = replenishDepleteData.map(r => [
      r[0] || '',
      r[1] || '',
      (r[2] || '')
        .replace("Replenish Card [Mask Card Number: ", "")
        .replace("Deplete Card [Mask Card Number: ", ""),
      (r[5] || '').replace("RAN: ", ""),
      (r[6] || '').replace("Amount: ", ""),
      (r[7] || '').replace("Set Code: ", "").replace("]", ""),
      r[8] || '',
      r[9] || '',
    ]);

    filteredReplenishDepleteData.unshift(sheet2Header);

    const otherData = parsedData.filter(
      row => row[1] !== "Replenish Card" && row[1] !== "Deplete Card"
    );

    const autoWidth = (data: any[][]) =>
      data[0].map((_, colIndex) => ({
        wch: Math.max(
          ...data.map(row => row[colIndex]?.toString().length || 10),
          12
        )
      }));

    const wb = XLSX.utils.book_new();

    if (otherData.length > 1) {
      const ws1 = XLSX.utils.aoa_to_sheet(otherData);
      ws1['!cols'] = autoWidth(otherData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');

      if (filteredReplenishDepleteData.length > 1) {
        const ws2 = XLSX.utils.aoa_to_sheet(filteredReplenishDepleteData);
        ws2['!cols'] = autoWidth(filteredReplenishDepleteData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
      }
    } else {
      const ws = XLSX.utils.aoa_to_sheet(filteredReplenishDepleteData);
      ws['!cols'] = autoWidth(filteredReplenishDepleteData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
    }

    XLSX.writeFile(wb, 'PendingActivities.xlsx');
  };
  return (
    <Card
      className={
        pathname.includes("dashboard") ? `table-card` : `user-card table-card`
      }
    >
      <CardContent style={{ padding: '-5px' }}>

        <CardHeader
          className="card-title"
          title={!pathname.includes("/dashboard") ? intl.formatMessage({
            id: "Dashboard_1_2.pendingactivities",
            defaultMessage: "Pending Activities",
          }) : ''}
          subheader={!pathname.includes("/dashboard") ? intl.formatMessage({
            id: "NotificationList.manageyourpendingactivities",
            defaultMessage: "Manage your Pending Activities",
          }) : ''}
          titleTypographyProps={{ variant: "h2", component: "h2" }}
          subheaderTypographyProps={{ variant: "h4", component: "h4" }}
          action={
            !filterpendingActivities.length &&
              pathname.includes("/dashboard") ? (
              <></>
            ) : pathname.includes("/dashboard") ? (
              <>
                <Button
                  className="expand-btns"
                  title={intl.formatMessage({
                    id: "Dashboard_3.viewall",
                    defaultMessage: "View All",
                  })}
                  onClick={() => navigate("/pending-activities")}
                >
                  <img
                    src={expandIcon}
                    alt="expand"
                    style={{ width: 30, height: 30 }}
                  />
                </Button>
              </>
            ) : (
              <></>
            )
          }
        />

        {pathname.includes("/dashboard") && (
          <div className="form-content">
            <Grid container spacing={3} alignItems="center">
              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <span className="label">
                    {intl.formatMessage({
                      id: "MakerChecker_7.object",
                      defaultMessage: "Object",
                    })}{" "}
                  </span>
                </Grid>
                <Grid item lg={7} xs={8} style={{ height: "40px" }}>
                  <Select
                    id="select-api"
                    fullWidth
                    value={object}
                    onChange={handleObject}
                    onFocus={getValues}
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
                            left: `${left}px !important`, top: `${top + 30}px !important`
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value=" ">
                      <em>
                        {intl.formatMessage({
                          id: "MakerChecker_7.all",
                          defaultMessage: "All",
                        })}
                      </em>
                    </MenuItem>
                    {objectNameList?.length > 0 &&
                      objectNameList
                        ?.sort((a, b) =>
                          CustomeComparator(a.scopeDesc, b.scopeDesc)
                        )
                        ?.map((data) => (
                          <MenuItem
                            value={data.scopeId?.toString()}
                            key={data.scopeAbbrev}
                          >
                            {data.scopeDesc}
                          </MenuItem>
                        ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <span className="label">
                    {intl.formatMessage({
                      id: "MakerChecker_7.Financial",
                      defaultMessage: "Financial",
                    })}{" "}
                  </span>
                </Grid>
                <Grid item lg={7} xs={8} style={{ height: "40px" }}>
                  <Select
                    id="select-api"
                    fullWidth
                    value={financialValue}
                    onChange={handleFinancial}
                    onFocus={getValues}
                    IconComponent={ArrowDown}
                    disabled={
                      objectNameList.find(
                        (o) => o.scopeId.toString() === object
                      )?.scopeDesc !== "CARD"
                    }
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
                            left: `${left}px !important`, top: `${top + 30}px !important`
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value=" ">
                      <em>
                        {intl.formatMessage({
                          id: "MakerChecker_7.all",
                          defaultMessage: "All",
                        })}
                      </em>
                    </MenuItem>
                    {financialList?.length > 0 &&
                      financialList
                        ?.sort((a, b) => CustomeComparator(a.value, b.value))
                        ?.map((data) => (
                          <MenuItem value={data?.key} key={data?.key}>
                            {data?.value}
                          </MenuItem>
                        ))}
                  </Select>
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <span className="label">
                    {intl.formatMessage({
                      id: "MakerChecker_7.function",
                      defaultMessage: "Function",
                    })}{" "}
                  </span>
                </Grid>
                <Grid item lg={7} xs={8} style={{ height: "40px" }}>
                  <Select
                    id="select-api"
                    fullWidth
                    value={functionValue}
                    onChange={handleFunction}
                    onFocus={getValues}
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
                            left: `${left}px !important`, top: `${top + 30}px !important`
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value=" ">
                      <em>
                        {intl.formatMessage({
                          id: "MakerChecker_7.all",
                          defaultMessage: "All",
                        })}
                      </em>
                    </MenuItem>
                    {functionsList?.length > 0 &&
                      functionsList?.map((data) => (
                        <MenuItem
                          value={data?.toString()}
                          key={data?.toString()}
                        >
                          {data}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <span className="label">
                    {intl.formatMessage({
                      id: "PendingActivity.user",
                      defaultMessage: "User",
                    })}
                  </span>
                </Grid>
                <Grid item lg={7} xs={8} style={{ height: "40px" }}>
                  <Autocomplete
                    className="delegation-autocomplete"
                    getOptionLabel={(option) => (option)}
                    loading={loading}
                    filterOptions={(x) => x}
                    // options={usersList}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    // value={value}
                    // onChange={(event: any, newValue: UserListModel | null) => {
                    //   setUsersList(newValue ? [newValue, ...usersList] : usersList);
                    //   setValue1(newValue);
                    //   setAuthorityId(newValue?.userId as number);
                    //   dispatch(resetSearchPendingActivity());
                    // }}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    PaperComponent={CustomPaper}
                    // PopperComponent={CustomPopper}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={intl.formatMessage({
                          id: "PopupAddNewDelegation_4_1.enterauthorityholder",
                          defaultMessage: "Enter Authority Holder",
                        })}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }} />
                    )} options={[]} />
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <label>
                    {intl.formatMessage({
                      id: "StockReport.fromdate",
                      defaultMessage: "From Date",
                    })}
                  </label>
                </Grid>
                <Grid item lg={7} xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      inputFormat="dd/MM/yyyy"
                      value={fromDatePicker}
                      onChange={(value) => {
                        setFromDatePicker(value || new Date());
                      }}
                      maxDate={toDatePicker ? toDatePicker : new Date()}
                      components={{
                        OpenPickerIcon: ThickBlueCalendarWithSixSquaresIcon,
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="datepicker filter-date"
                          fullWidth
                          inputProps={{
                            ...params.inputProps,
                            id: "stock-from-issue",
                            readOnly: true,
                            placeholder: intl.formatMessage({
                              id: "PopUpOneTime_2_1.selectdate",
                              defaultMessage: "Select Date",
                            }),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {toDatePicker != null && fromDatePicker === null && (
                    <FormHelperText id="error-helper-text" error>
                      To Date is Required
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item lg={4} xs={4} alignItems="center">
                  <label>
                    {intl.formatMessage({
                      id: "StockReport.todate",
                      defaultMessage: "To Date",
                    })}
                  </label>
                </Grid>
                <Grid item lg={7} xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      inputFormat="dd/MM/yyyy"
                      value={toDatePicker}
                      minDate={fromDatePicker ? fromDatePicker : undefined}
                      maxDate={new Date()}
                      onChange={(value) => {
                        setToDatePicker(value || new Date());
                      }}
                      components={{
                        OpenPickerIcon: ThickBlueCalendarWithSixSquaresIcon,
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="datepicker filter-date"
                          fullWidth
                          inputProps={{
                            ...params.inputProps,
                            id: "stock-to-issue",
                            readOnly: true,
                            placeholder: intl.formatMessage({
                              id: "PopUpOneTime_2_1.selectdate",
                              defaultMessage: "Select Date",
                            }),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {toDatePicker === null && fromDatePicker !== null && (
                    <FormHelperText id="error-helper-text" error>
                      To Date is Required
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                alignItems="flex-end"
                justifyContent="flex-end"
              >
                <div className="search-btn-grp" style={{ marginTop: "5%" }}>
                  <div className="btn-outlined">
                    <Button
                      className="search-btn"
                      variant="outlined"
                      style={{
                        textTransform: "none",
                        opacity:
                          (toDatePicker === null && fromDatePicker !== null) ||
                            (toDatePicker !== null && fromDatePicker === null)
                            ? "0.5"
                            : "1",
                      }}
                      disabled={
                        (toDatePicker === null && fromDatePicker !== null) ||
                        (toDatePicker !== null && fromDatePicker === null)
                      }
                      onClick={() => {
                        setSearchFlag(!searchFlag);
                        setCanSearch(true);
                      }
                      }
                    >
                      <FormattedMessage
                        id="Dashboard_2.search"
                        defaultMessage="Search"
                      />
                      <img src={search_ic} alt="search" />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        clearDates();
                      }}
                      style={{ margin: "0 20px" }}
                      size="small"
                      className="btn-clear"
                    >
                      <FormattedMessage
                        id="Dashboard_2.clear"
                        defaultMessage="Clear"
                      />{" "}
                    </Button>
                  </div>
                  {hasExportEXCELAccess ? (
                    <Grid item md={6} xs={12} lg={4} style={{ margin: "2%" }}>
                      <div className="btn-outlined">
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            totalNumRecords
                              ? exportToExcel()
                              : toast.warn("No data available");
                          }}
                        >
                          {intl.formatMessage({
                            id: "ReleaseHoldTransaction_5.exporttoexcel",
                            defaultMessage: "Export to EXCEL",
                          })}
                        </Link>
                      </div>
                    </Grid>
                  ) : null}
                </div>
              </Grid>
            </Grid>
          </div>
        )}

        {!filterpendingActivities.length && pathname.includes("/dashboard") ? (
          isGridLoading ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}><PropagateLoader color='#1F26A6' loading={true} /></div> : <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <img src={confetti} alt="confetti" />
            <div>
              <Typography variant="h2" className="card-title">
                <FormattedMessage
                  id="Dashboard_1_2.goodjob"
                  defaultMessage="Good job!"
                />
              </Typography>
              <Typography variant="body1">
                <FormattedMessage
                  id="Dashboard_1_2.nopendingactions"
                  defaultMessage="You have no pending actions"
                />
              </Typography>
            </div>
          </div>
        ) : (
          <>
            <Box className="listing-table" style={{ marginTop: "1%" }}>
              <AgGridReact
                ref={gridRef}
                onGridReady={onGridReady}
                rowData={
                  pathname.includes("/dashboard")
                    ? filterpendingActivities.slice(0, 10)
                    : filterpendingActivities
                }
                loadingOverlayComponentParams={{
                  loadingMessage: "Loading pending activities...",
                }}
                overlayLoadingTemplate={
                  '<span class="ag-overlay-loading-center">Loading...</span>'
                }
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                suppressRowHoverHighlight={suppressRowHoverHighlight}
                headerHeight={51}
                rowHeight={52}
                rowSelection="multiple"
                suppressRowClickSelection
                suppressRowDeselection
                overlayNoRowsTemplate={intl.formatMessage({
                  id: "NewCardIssueance_1.dynamicnorowstoshow",
                  defaultMessage:
                    !canSearch && !pathname.includes("/dashboard")
                      ? `Search To Load Data`
                      : `No Rows To Show`,
                })}
                enableRtl={intl.locale === "ar"}
                className={
                  pathname.includes("/dashboard")
                    ? `table-component notification-list pending-activities`
                    : `table-component notification-list`
                }
                getRowId={getRowId}
              />
            </Box>
            {pathname.includes("/pending-activities") && (
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
            )}
          </>
        )}
        <Modal open={reEmbossing} aria-labelledby="modal-modal-title">
          <div className="user-card-modal" style={{ width: "60%" }}>
            <IconButton className="btn-close" size="small" onClick={onCancel}>
              <img src={cancelIcon} alt="close" />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h6">
              {pendingActData?.apiDescription}
            </Typography>
            <Divider></Divider>
            <Grid container columnSpacing={4} sx={{ p: "20px" }}>
              <Grid item xs={4} className="info-card-grid">
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={5}>
                    <label className="data-label">
                      {intl.formatMessage({
                        id: "Dashboard_2.customername",
                        defaultMessage: "Customer Name",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1" className="data">
                      : {cardInformation?.cards[0]?.customerName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {
                cardInformation?.passportNumber &&
                <Grid item xs={4} className="info-card-grid">
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={5.5}>
                      <label className="data-label">
                        {intl.formatMessage({
                          id: "Dashboard_2.passportnumber",
                          defaultMessage: "Passport Number",
                        })}
                      </label>
                    </Grid>
                    <Grid item xs={6.5}>
                      <Typography variant="body1" className="data">
                        : {cardInformation?.passportNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              }
              {
                cardInformation?.nationalId &&
                <Grid item xs={4} className="info-card-grid">
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <label className="data-label">
                        {intl.formatMessage({
                          id: "NewCardIssueance_1.nationalid",
                          defaultMessage: "National ID",
                        })}
                      </label>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1" className="data">
                        : {cardInformation?.nationalId}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              }
            </Grid>
            <Divider></Divider>
            <Grid container spacing={3}>
              <Grid item xs={6} container>
                <Grid item xs={4} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.branch",
                      defaultMessage: "Branch",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={8}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.branch",
                      defaultMessage: "Enter Branch",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={branch}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.card",
                      defaultMessage: "Card",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={8}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.card",
                      defaultMessage: "Enter Card",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={cardMaskedNumber}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={4} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.details",
                      defaultMessage: "Details",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={8}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.enterdetails",
                      defaultMessage: "Enter Details",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={details}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              {blockCard ? (
                <Grid item xs={6} container>
                  <Grid item xs={4} className="align-label">
                    <label>
                      {intl.formatMessage({
                        id: "pendingact.reason",
                        defaultMessage: "Reason",
                      })}{" "}
                      <span className="required">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    {" "}
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "pendingact.enterreason",
                        defaultMessage: "Enter Reason",
                      })}
                      id="type"
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                      value={blockNote}
                      disabled
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Grid>

            <Grid
              container
              alignItems="flex-end"
              className="bottom-container"
              sx={{
                borderTop: "1px dotted #bfbbbb",
                paddingTop: "20px",
                mt: "20px",
              }}
            >
              <Grid item xs={8}>
                <Grid container alignItems="center">
                  <Grid item xs={1}>
                    <label>
                      {intl.formatMessage({
                        id: "Dashboard_3.note",
                        defaultMessage: "Note",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={11}>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Dashboard_3.enternote",
                        defaultMessage: "Enter Note",
                      })}
                      value={note}
                      onChange={(event: any) => setNote(event.target.value)}
                      id="pending-note"
                      rows={2}
                      multiline
                      fullWidth
                      className="textarea"
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div className="save-btn-grp">
              <Button
                variant="text"
                type="reset"
                className="cancel-maker-checker-btn"
                title="Cancel"
                disableElevation
                onClick={onCancel}
              >
                <FormattedMessage
                  id="Dashboard_1_2.cancel"
                  defaultMessage="Cancel"
                />
              </Button>

              <Grid item xs={12} md={6} lg={8}>
                <div className="specify-btn-grp">
                  <Link
                    to=""
                    type="button"
                    className="reject-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      cancelpendingAct(
                        pendingActData?.createdById as number,
                        pendingActData?.uuid as string,
                        note as string,
                        onCancel
                      )
                    }
                    }
                  >
                    {/* {pendingActData?.createdById ===
                      (loginUser ? loginUser.userId : loginUserStorage?.userId) ? (
                      <FormattedMessage
                        id="Dashboard_3.discard"
                        defaultMessage="Discard"
                      />
                    ) : (
                      <FormattedMessage
                        id="Dashboard_3.reject"
                        defaultMessage="Reject"
                      />
                    )} */}
                  </Link>
                  {/* {pendingActData?.createdById !==
                    (loginUser ? loginUser.userId : loginUserStorage?.userId) && (
                      <Link
                        to=""
                        type="button"
                        className="approve-btn"
                        onClick={(e) => {
                            e.preventDefault();
                          approvependingAct(
                            pendingActData?.uuid as string,
                            note as string,
                            onCancel
                          )}
                        }
                      >
                        <FormattedMessage
                          id="Dashboard_3.approve"
                          defaultMessage="Approve"
                        />
                      </Link>
                    )} */}
                </div>
              </Grid>
            </div>
          </div>
        </Modal>


        {openBalanceType && (
          <Modal open={openBalanceType} aria-labelledby="modal-modal-title">
            <form>
              <div className="user-card-modal" style={{ width: "70%" }}>
                <IconButton
                  className="btn-close"
                  size="small"
                  onClick={onCancelBalanceType}
                >
                  <img src={cancelIcon} alt="close" />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h6">
                  {balanceTypeCode != 0
                    ? intl.formatMessage({
                      id: "BalanceType.updatebalancetype",
                      defaultMessage: "Update Balance Type",
                    })
                    : intl.formatMessage({
                      id: "BalanceType.newbalancetype",
                      defaultMessage: "New Balance Type",
                    })}
                </Typography>
                <Divider></Divider>
                <Grid container spacing={4}>
                  <Grid item xl={6} xs={12} container>
                    <Grid item xs={5} className="align-label">
                      <label>
                        {intl.formatMessage({
                          id: "BalanceType.balancetypecode",
                          defaultMessage: "Balance Type Code",
                        })}{" "}
                        <span className="required">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={7}>
                      {" "}
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "BalanceType.enterbalancetypecode",
                          defaultMessage: "Enter Balance Type Code",
                        })}
                        id="code"
                        value={balanceTypeCode}
                        fullWidth
                        autoComplete="off"
                        disabled={true}
                      />
                      {oldBalanceTypeCode != 0 && oldBalanceTypeCode != balanceTypeCode &&
                        <FormHelperText error>
                          Previous value: {oldBalanceTypeCode}
                        </FormHelperText>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xl={6} xs={12} container>
                    <Grid item xs={5} className="align-label">
                      <label>
                        {intl.formatMessage({
                          id: "BalanceType.balancetypedescription",
                          defaultMessage: "Balance Type Description",
                        })}{" "}
                        <span className="required">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={7}>
                      {" "}
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "BalanceType.enterbalancetypedescription",
                          defaultMessage: "Enter Balance Type Description",
                        })}
                        id="description"
                        value={balanceTypeDesc}
                        disabled={true}
                        fullWidth
                        autoComplete="off"
                      />
                      {oldBalanceTypeDesc != "" && oldBalanceTypeDesc != balanceTypeDesc &&
                        <FormHelperText error>
                          Previous value: {oldBalanceTypeDesc}
                        </FormHelperText>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xl={6} xs={12} container>
                    <Grid item xs={5} className="align-label">
                      <label>
                        <FormattedMessage
                          id="BalanceType.balancetypesequence"
                          defaultMessage="Balance Type Sequence"
                        />
                        <span className="required">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={7}>
                      {" "}
                      <InputBase
                        placeholder={intl.formatMessage({
                          id: "BalanceType.enterbalancetypesequence",
                          defaultMessage: "Enter Balance Type Sequence",
                        })}
                        id="sequence"
                        value={balanceTypeSeq}
                        disabled={true}
                        fullWidth
                        autoComplete="off"
                      />
                      {oldBalanceTypeSeq != 0 && oldBalanceTypeSeq != balanceTypeSeq &&
                        <FormHelperText error>
                          Previous value: {oldBalanceTypeSeq}
                        </FormHelperText>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xl={6} xs={12} container alignItems="center">
                    <Grid item xs={5}>
                      <label>
                        <FormattedMessage
                          id="BalanceType.status"
                          defaultMessage="Status"
                        />
                      </label>
                    </Grid>
                    <Grid item xs={7}>
                      <div className="switch">
                        <Typography className="text-light">
                          <FormattedMessage
                            id="JobDefinition_2.no"
                            defaultMessage="No"
                          />
                        </Typography>
                        <Switch
                          checked={balanceTypeStatus === "0" ? false : true}
                        />
                        <Typography>
                          <FormattedMessage
                            id="JobDefinition_2.yes"
                            defaultMessage="Yes"
                          />
                        </Typography>
                      </div>
                      {oldBalanceTypeStatus != '0' && oldBalanceTypeStatus != balanceTypeStatus &&
                        <FormHelperText error>
                          Previous value: {oldBalanceTypeStatus === '1' ? "enabled" : "disabled"}
                        </FormHelperText>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="flex-end"
                  className="bottom-container"
                  sx={{
                    borderTop: "1px dotted #bfbbbb",
                    paddingTop: "20px",
                    mt: "20px",
                  }}
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <Grid container alignItems="center">
                      <Grid item xs={1}>
                        <label>
                          {intl.formatMessage({
                            id: "Dashboard_3.note",
                            defaultMessage: "Note",
                          })}
                        </label>
                      </Grid>
                      <Grid item xs={11}>
                        <InputBase
                          placeholder={intl.formatMessage({
                            id: "Dashboard_3.enternote",
                            defaultMessage: "Enter Note",
                          })}
                          value={note}
                          onChange={(event: any) =>
                            setNote(event.target.value)
                          }
                          id="pending-note"
                          rows={2}
                          // disabled={
                          //   pendingActData?.createdById ===
                          //   (loginUser ? loginUser.userId : loginUserStorage?.userId)
                          // }
                          multiline
                          fullWidth
                          className="textarea"
                          autoComplete="off"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <div className="save-btn-grp">
                  <Button
                    variant="text"
                    type="reset"
                    className="cancel-btn"
                    title="Cancel"
                    disableElevation
                    onClick={onCancelBalanceType}
                  >
                    <FormattedMessage
                      id="Dashboard_1_2.cancel"
                      defaultMessage="Cancel"
                    />
                  </Button>
                  <Grid item xs={12} md={6} lg={8}>
                    <div className="specify-btn-grp">
                      <Link
                        to=""
                        type="button"
                        className="reject-btn"
                        onClick={() =>
                          cancelpendingAct(
                            pendingActData?.createdById as number,
                            pendingActData?.uuid as string,
                            note as string,
                            onCancelBalanceType
                          )
                        }
                      >
                        {/* {pendingActData?.createdById ===
                          (loginUser ? loginUser.userId : loginUserStorage?.userId) ? (
                          <FormattedMessage
                            id="Dashboard_3.discard"
                            defaultMessage="Discard"
                          />
                        ) : (
                          <FormattedMessage
                            id="Dashboard_3.reject"
                            defaultMessage="Reject"
                          />
                        )} */}
                      </Link>
                      {/* {pendingActData?.createdById !==
                        (loginUser ? loginUser.userId : loginUserStorage?.userId) && (
                          <Link
                            to=""
                            type="button"
                            className="approve-btn"
                            onClick={(e) => {
                            e.preventDefault();
                              approvependingAct(
                                pendingActData?.uuid as string,
                                note as string,
                                onCancelBalanceType
                              )}
                            }
                          >
                            <FormattedMessage
                              id="Dashboard_3.approve"
                              defaultMessage="Approve"
                            />
                          </Link>
                        )} */}
                    </div>
                  </Grid>
                </div>
              </div>
            </form>
          </Modal>
        )}

        <Modal open={updateCard} aria-labelledby="modal-modal-title">
          <div className="user-card-modal">
            <IconButton className="btn-close" size="small" onClick={onCancel}>
              <img src={cancelIcon} alt="close" />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h6">
              {pendingActData?.apiDescription}
            </Typography>
            <Divider></Divider>
            <Grid container spacing={3}>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.branch",
                      defaultMessage: "Branch",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.branch",
                      defaultMessage: "Enter Branch",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={branch}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.card",
                      defaultMessage: "Card",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.card",
                      defaultMessage: "Enter Card",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={cardMaskedNumber}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.details",
                      defaultMessage: "Details",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.enterdetails",
                      defaultMessage: "Enter Details",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={details}
                    disabled
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.embossingname",
                      defaultMessage: "Embossing Name",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.enterembossingname",
                      defaultMessage: "Enter Embossing Name",
                    })}
                    id="type"
                    fullWidth
                    value={embossingNameNew !== "" ? embossingNameNew : (details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != null && details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != undefined && details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != "") ? details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() || "" : embossingName}
                    disabled
                    autoComplete="off"
                  />
                  {embossingName && ((embossingName !== embossingNameNew && embossingNameNew.trim() != "") || (details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != null && embossingName !== details.match(/new\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim())) && (
                    <FormHelperText error>
                      Previous value: {embossingName}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.embossingnamear",
                      defaultMessage: "Arabic Embossing Name",
                    })}{" "}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.enterembossingnamear",
                      defaultMessage: "Enter Embossing Arabic Name",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={embossingNameArNew ? embossingNameArNew : (details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != null
                      && details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != undefined
                      && details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != "") ? details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() || "" : embossingNameAr}
                    disabled
                    autoComplete="off"
                  />
                  {embossingNameAr && ((embossingNameAr !== embossingNameArNew) || (details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim() != null && embossingNameAr !== details.match(/new\s*arabic\s*embossing\s*name\s*:\s*([^;]+)/i)?.[1]?.trim())) && (
                    <FormHelperText error>
                      Previous value: {embossingNameAr.trim() ? embossingNameAr : ""}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.deliveryBranch",
                      defaultMessage: "Delivery Branch",
                    })}{" "}
                    <span className="required">*</span>
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.enterdeliverybranch",
                      defaultMessage: "Enter Delivery Branch",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    //value={deliveryBranchNew==="" ? (deliveryBranchCode + " - " + deliveryBranchName) : deliveryBranchNew}
                    value={
                      deliveryBranchNew
                        ? deliveryBranchNew
                        : (
                          details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim() != null &&
                          details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim() != undefined &&
                          details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim() != ""
                        )
                          ? details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim() || ""
                          : (deliveryBranchCode + " - " + deliveryBranchName)
                    }
                    disabled
                    autoComplete="off"
                  />
                  {(deliveryBranchCode + " - " + deliveryBranchName) &&
                    (
                      ((deliveryBranchCode + " - " + deliveryBranchName) !== deliveryBranchNew && deliveryBranchNew != "") ||
                      (
                        details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim() != null &&
                        (deliveryBranchCode + " - " + deliveryBranchName) !== details.match(/new\s*delivery\s*branch\s*:\s*([^;]+)/i)?.[1]?.trim()
                      )
                    ) && (
                      <FormHelperText error>
                        Previous value: {(deliveryBranchCode + " - " + deliveryBranchName).trim() ? (deliveryBranchCode + " - " + deliveryBranchName) : ""}
                      </FormHelperText>
                    )}
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.cardtype",
                      defaultMessage: "Card Type",
                    })}{" "}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase

                    placeholder={intl.formatMessage({
                      id: "pendingact.cardtype",
                      defaultMessage: "Enter Card Type",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    // value={cardTypeInfoNew.trim() === "" ? "Select Card Type" : cardTypeInfoNew}
                    value={(details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != "" && details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != null && details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != undefined) ? details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() : cardTypeInfoCode + " - " + cardTypeInfoDesc}
                    disabled
                    autoComplete="off"
                  />
                  {(details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != "" && details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != null && details.match(/new\s*cardtype\s*:\s*([^;]+)/i)?.[1]?.trim() != undefined) && (
                    <FormHelperText error>
                      Previous value: {cardTypeInfoCode + " - " + cardTypeInfoDesc}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              {sectorNew != "null" && <Grid item xs={12} container>
                <Grid item xs={5} className="align-label">
                  <label>
                    {intl.formatMessage({
                      id: "pendingact.sector",
                      defaultMessage: "Sector",
                    })}{" "}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {" "}
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "pendingact.entersector",
                      defaultMessage: "Enter Sector",
                    })}
                    id="type"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                    value={sectorNew === " " ? sector : sectorNew}
                    disabled
                    autoComplete="off"
                  />
                  {sector && sector != " " && sector != "" && sector !== sectorNew && sectorNew != " " && (
                    <FormHelperText error>
                      Previous value: {sector}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>}
            </Grid>
            <Grid
              container
              alignItems="flex-end"
              className="bottom-container"
              sx={{
                borderTop: "1px dotted #bfbbbb",
                paddingTop: "20px",
                mt: "20px",
              }}
            >
              <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center">
                  <Grid item xs={1}>
                    <label>
                      {intl.formatMessage({
                        id: "Dashboard_3.note",
                        defaultMessage: "Note",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={11}>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Dashboard_3.enternote",
                        defaultMessage: "Enter Note",
                      })}
                      value={note}
                      onChange={(event: any) => setNote(event.target.value)}
                      id="pending-note"
                      rows={2}
                      multiline
                      fullWidth
                      className="textarea"
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div className="save-btn-grp">
              <Button
                variant="text"
                type="reset"
                className="cancel-maker-checker-btn"
                title="Cancel"
                disableElevation
                onClick={onCancel}
              >
                <FormattedMessage
                  id="Dashboard_1_2.cancel"
                  defaultMessage="Cancel"
                />
              </Button>

              <Grid item xs={12} md={6} lg={8}>
                <div className="specify-btn-grp">
                  <Link
                    to=""
                    type="button"
                    className="reject-btn"
                    onClick={() =>
                      cancelpendingAct(
                        pendingActData?.createdById as number,
                        pendingActData?.uuid as string,
                        note as string,
                        onCancel
                      )
                    }
                  >
                  </Link>
                </div>
              </Grid>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default PendingActivities;