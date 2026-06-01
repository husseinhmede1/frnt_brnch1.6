import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  TableSortLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  date_ic,
  down_arrow_icon,
  ic_flag,
  ic_hand,
  ic_info_orange,
  ic_reload,
  ic_check,
  ic_checked,
} from "../../assets/images";
import EntityHaltPayDialog from "../../components/EntityHaltPayDialog";
import EntityRepresenmentDialog from "../../components/EntityRepresenmentDialog";
import EntityReversalTransactionDialog from "../../components/EntityReversalTransactionDialog";
import { Institution } from "../../models/configuration/InstitutionModel";
import { TransactionsModel } from "../../models/configuration/TransactionGroupModel";
import {
  AcquiringTransactionFilterModel,
  AcquiringTransactionModel,
  TransactionCurrentModel
} from "../../models/entityManagement/AcquiringTransactionModel";
import { TerminalModel } from "../../models/entityManagement/EntityModel";
import { TransactionGroupService } from "../../services/configuration/transaction-group-service";
import { AcquiringTransactionServices } from "../../services/entityManagement/acquiring-transaction-service";
import { EntityService } from "../../services/entityManagement/entity-service";
import { TerminalService } from "../../services/entityManagement/terminal-service";
import {
  ENTITY_LEVEL,
  Errors,
  OptionType,
  rowsPerPageOptionsConst,
  StatusCode,
} from "../../utils/constant";
import * as XLSX from 'xlsx-js-style';
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";
import { visuallyHidden } from "@mui/utils";
import { InstitutionService } from "../../services/configuration/institution-service";
import EntityUnhaltPayDialog from "../../components/EntityUnhaltPayDialog";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AcquiringTransactions() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<AcquiringTransactionFilterModel>({
    mode: "onChange",
    resolver: yupResolver(validations.filterAcquiringTransactionValidation),
  });

  const [institutionList, setInstitutionList] = useState<Institution[]>([]);
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [transactionFilterDetails, setTransactionFilterDetails] =
    React.useState<AcquiringTransactionFilterModel>(
      new AcquiringTransactionFilterModel()
    );
  const [entityList, setEntityList] = React.useState<{ label: string; value: string; desc: string }[]>();
  const [merchantNamesList, setMerchantNamesList] = React.useState<{ label: string; value: string; desc: string }[]>();
  const [terminalList, setTerminalList] = React.useState<TerminalModel[]>([]);
  const [entityDesc, setEntityDesc] = React.useState("");
  const [transactionList, setTransactionList] = React.useState<
    TransactionsModel[]
  >([]);
  const [acquiringTransactions, setAcquiringTransactions] = React.useState<
    TransactionCurrentModel[]
  >([]);
  const [filterState, setFilterState] = React.useState<any>(null);
  const [acquiringTransactionDetails, setAcquiringTransactionDetails] =
    React.useState<TransactionCurrentModel>(new TransactionCurrentModel());
  const [representmentDialogId, setRepresentmentDialogId] =
    React.useState<number>(0);
  const [reversalDialogId, setReversalDialogId] = React.useState<number>(0);
  const [haltDialogId, setHaltDialogId] = React.useState<number>(0);
  const [merchantPaymentDate, setMerchantPaymentDate] = React.useState<Date>();

  const [page, setPage] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    rowsPerPageOptionsConst[0]
  );
  const [currentSortColumn, setCurrentSortColumn] = React.useState("");
  const [isSortOrderASC, setIsSortOrderASC] = React.useState<boolean>(true);
  const [outletId, setOutletId] = useState<{ label: string; value: string }>();
  const [merchantName, setMerchantName] = useState<{ label: string; value: string }>();
  const [outletErr, setOutletErr] = React.useState("");
  const [merchantNameErr, setMerchantNameErr] = React.useState("");

  const [selectManualEntry, setSelectManualEntry] = React.useState('');

  const [shownHalt, setShownHalt] = React.useState(false);
  const [holdTransactionsMessage, setHoldTransactionsMessage] = React.useState('Halt payment');
  const [initalyHiddenHoldButton, setInitalyHiddenHoldButton] = React.useState(true);

  const outLetIdRequired = "Entity/Outlet ID is required.";

  const intl = useIntl();

  const [selectAll, setSelectAll] = useState(false);
  const [accountingAdjustmentList, setAccountingAdjustmentList] = React.useState<number[]>([]);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [sentBatch, setSentBatch] = React.useState<boolean>(false);


  const [isHold, setIsHold] = React.useState(false);

  const [selectedSettlMerchHalt, setSelectedSettlMerchHalt] = React.useState("N");

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TransactionCurrentModel>('recordSeqId');

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      getValuesBySearch(filterState)
      setSelectedIds([])
      setRefresh(!refresh);
    }
  }, [refresh])


const exportToExcel = async () => {
    try {
      let sort;
      if (currentSortColumn && isSortOrderASC !== undefined) {
        sort = [
          {
            column: currentSortColumn,
            sortOrder: isSortOrderASC ? "ASC" : "DESC",
          },
        ];
      } else {
        sort = [{ column: "MERCHANT_NAME", sortOrder: "ASC" }];
      }

      const filtermodel = {
        institutionId: selectInstitutionVal,
        pageNo: 0,
        pageSize: totalRecords,
        sort: sort,
        fromProcessingDate: transactionFilterDetails.fromProcessingDate
          ? moment(transactionFilterDetails.fromProcessingDate).format("DD/MM/yyyy")
          : "",
        toProcessingDate: transactionFilterDetails.toProcessingDate
          ? moment(transactionFilterDetails.toProcessingDate).format("DD/MM/yyyy")
          : "",
        entitiesId: transactionFilterDetails.outletId,
        manualEntry: transactionFilterDetails.manualEntry ? transactionFilterDetails.manualEntry : '2',
        cardNumber: transactionFilterDetails.cardNumber || "",
        terminalId: transactionFilterDetails.terminalId || undefined,
        transactionId: transactionFilterDetails.transactionId || "",
        settlMerchHalt: selectedSettlMerchHalt,
        authorizationNumber: transactionFilterDetails.authorizationNumber || "",
        batchId: transactionFilterDetails.batchId || "",
        merchantName: transactionFilterDetails.merchantName || "",
        merchantAccountNumber: transactionFilterDetails.merchantAccountNumber || "",
      };

      const res = await AcquiringTransactionServices.getBySearch(filtermodel);

      if (res.status === StatusCode.Success && res.data.data.length > 0) {
        const allData = res.data.data;

        const title = "Acquiring Transactions Report";
        const criteria = [
          [
            "Institution", institutionList.find((i) => i.institutionId === selectInstitutionVal)?.institutionName || "",
            "Entity/Outlet ID", outletId?.label || "",
            "Merchant Name", merchantName?.label || "",
            "Manual", selectManualEntry === '1' ? 'Yes' : selectManualEntry === '0' ? 'No' : 'Both'
          ],
          [
            "From Processing Date", transactionFilterDetails.fromProcessingDate ? moment(transactionFilterDetails.fromProcessingDate).format("DD/MM/yyyy") : "",
            "To Processing Date", transactionFilterDetails.toProcessingDate ? moment(transactionFilterDetails.toProcessingDate).format("DD/MM/yyyy") : "",
            "Card Number", transactionFilterDetails.cardNumber || "",
            "Transaction ID", transactionFilterDetails.transactionId || ""
          ],
          [
            "Terminal ID", transactionFilterDetails.terminalId || "",
            "Halt Transactions", selectedSettlMerchHalt === 'Y' ? 'Yes' : 'No',
            "Authorization Code", transactionFilterDetails.authorizationNumber || "",
            "Batch Number", transactionFilterDetails.batchId || "",
            "Merchant Account Number", transactionFilterDetails.merchantAccountNumber || ""
          ],
        ];

        const headers = [
          "Outlet", "Name", "Terminal", "Processing Date", "Card",
          "Trans. ID", "Trans. Date", "Trans. Amount", "Trans. Currency",
          "Auth. Code", "Sett. Amount"
        ];

        const dataRows = allData.map((row) => [
          row.outletCode,
          row.merchantName,
          row.terminalId,
          row.processingDate ? new Date(row.processingDate).toLocaleDateString('en-GB') : '',
          row.maskPan,
          row.transId,
          row.transactionDate ? new Date(row.transactionDate).toLocaleDateString('en-GB') : '',
          row.transactionAmount,
          row.transCurrency,
          row.authorizationNumber,
          row.settlementAmount,
        ]);

        // aoa layout:
        // r=0  → title
        // r=1  → empty
        // r=2  → criteria row 1
        // r=3  → criteria row 2
        // r=4  → criteria row 3
        // r=5  → empty
        // r=6  → headers
        // r=7+ → data rows
        const aoa = [
          [title],
          [],
          ...criteria,
          [],
          headers,
          ...dataRows,
        ];

        const ws = XLSX.utils.aoa_to_sheet(aoa);

        // Merge title across all columns
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        ];

        // ===== Title (r=0) =====
        ws['A1'].s = {
          font: { bold: true, sz: 18 },
          fill: { patternType: 'solid', fgColor: { rgb: "FFFFFF" } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };

        // ===== Row height for title =====
        ws['!rows'] = [{ hpt: 30 }]; // taller row to accommodate larger font

        const thinBorder = {
          top:    { style: 'thin',   color: { rgb: "000000" } },
          bottom: { style: 'thin',   color: { rgb: "000000" } },
          left:   { style: 'thin',   color: { rgb: "000000" } },
          right:  { style: 'thin',   color: { rgb: "000000" } },
        };

        const thickBorder = {
          top:    { style: 'medium', color: { rgb: "000000" } },
          bottom: { style: 'medium', color: { rgb: "000000" } },
          left:   { style: 'medium', color: { rgb: "000000" } },
          right:  { style: 'medium', color: { rgb: "000000" } },
        };

        // ===== Criteria rows (r=2 to r=4) =====
        for (let R = 2; R <= 4; ++R) {
          for (let C = 0; C <= 10; ++C) {
            const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
            if (!ws[cellRef]) continue;
            const isLabel = C % 2 === 0;
            ws[cellRef].s = {
              font: { bold: isLabel, sz: 10 },
              fill: { patternType: 'solid', fgColor: { rgb: isLabel ? "EFEFEF" : "FFFFFF" } },
              border: thinBorder,
              alignment: { horizontal: 'left', wrapText: true },
            };
          }
        }

        // ===== Header row (r=6) =====
        for (let C = 0; C <= 10; ++C) {
          const cellRef = XLSX.utils.encode_cell({ c: C, r: 6 });
          if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' };
          ws[cellRef].s = {
            font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
            fill: { patternType: 'solid', fgColor: { rgb: "424242" } },
            border: thickBorder,
            alignment: { horizontal: 'center', wrapText: true },
          };
        }

        // ===== Data rows (r=7 onward) =====
        if (ws['!ref']) {
          const range = XLSX.utils.decode_range(ws['!ref'] as string);
          for (let R = 7; R <= range.e.r; ++R) {
            for (let C = 0; C <= 10; ++C) {
              const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
              if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' };
              ws[cellRef].s = {
                border: thinBorder,
                fill: { patternType: 'solid', fgColor: { rgb: R % 2 === 0 ? "F5F5F5" : "FFFFFF" } },
                alignment: { horizontal: 'left', wrapText: false },
              };
            }
          }
        }

        // ===== Column widths =====
        ws['!cols'] = [
          { wch: 18 }, // Outlet
          { wch: 28 }, // Name
          { wch: 14 }, // Terminal
          { wch: 16 }, // Processing Date
          { wch: 20 }, // Card
          { wch: 12 }, // Trans. ID
          { wch: 14 }, // Trans. Date
          { wch: 14 }, // Trans. Amount
          { wch: 14 }, // Trans. Currency
          { wch: 14 }, // Auth. Code
          { wch: 14 }, // Sett. Amount
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws, "Transactions");

        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `acquiring_transactions_${dateStr}.xlsx`;
        XLSX.writeFile(workbook, filename);

        toast.success(`Excel file exported successfully: ${allData.length} records`);
      } else {
        toast.warning("No data to export");
      }
    } catch (err: any) {
      console.error("Export to Excel error:", err);
      toast.error(err.response?.data?.errors?.[0] || "Failed to export to Excel");
    }
  };

const buildCriteria = () => [
  [
    "Institution",
    institutionList.find(i => i.institutionId === getValues("institutionId"))?.institutionName || "",
    "Entity/Outlet ID",
    outletId?.label || "",
    "Merchant Name",
    merchantName?.label || "",
    "Manual",
    getValues("manualEntry") === '1' ? 'Yes' : getValues("manualEntry") === '0' ? 'No' : 'Both'
  ],
  [
    "From Processing Date",
    getValues("fromProcessingDate") ? moment(getValues("fromProcessingDate")).format("DD/MM/yyyy") : "",
    "To Processing Date",
    getValues("toProcessingDate") ? moment(getValues("toProcessingDate")).format("DD/MM/yyyy") : "",
    "Card Number",
    getValues("cardNumber") || "",
    "Transaction ID",
    getValues("transactionId") || ""
  ],
  [
    "Terminal ID",
    getValues("terminalId") || "",
    "Halt Transactions",
    selectedSettlMerchHalt === 'Y' ? 'Yes' : 'No',
    "Authorization Code",
    getValues("authorizationNumber") || "",
    "Batch Number",
    getValues("batchId") || ""
  ],
  [
    "Merchant Account Number",
    getValues("merchantAccountNumber") || "",
  ]
];
const exportToPDF = async () => {
    try {
      // Sorting
      let sort;
      if (currentSortColumn && isSortOrderASC !== undefined) {
        sort = [
          {
            column: currentSortColumn,
            sortOrder: isSortOrderASC ? "ASC" : "DESC",
          },
        ];
      } else {
        sort = [{ column: "MERCHANT_NAME", sortOrder: "ASC" }];
      }

      // Filter model
      const filtermodel = {
        institutionId: getValues("institutionId"),
        pageNo: 0,
        pageSize: totalRecords,
        sort: sort,
        fromProcessingDate: getValues("fromProcessingDate")
          ? moment(getValues("fromProcessingDate")).format("DD/MM/yyyy")
          : "",
        toProcessingDate: getValues("toProcessingDate")
          ? moment(getValues("toProcessingDate")).format("DD/MM/yyyy")
          : "",
        entitiesId: outletId?.value,
        manualEntry: getValues("manualEntry") ? getValues("manualEntry") : '2',
        cardNumber: getValues("cardNumber") || "",
        terminalId: getValues("terminalId") || undefined,
        transactionId: getValues("transactionId") || "",
        settlMerchHalt: selectedSettlMerchHalt,
        authorizationNumber: getValues("authorizationNumber"),
        batchId: getValues("batchId"),
        merchantName: merchantName?.value,
        merchantAccountNumber: getValues("merchantAccountNumber") || "",
      };

      const res = await AcquiringTransactionServices.getBySearch(filtermodel);

      if (res.status === StatusCode.Success && res.data.data.length > 0) {
        const allData = res.data.data;

        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        // ===== Title =====
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Acquiring Transactions Report', pageWidth / 2, 16, { align: 'center' });

        // ===== Subtitle line =====
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Exported: ${new Date().toLocaleString()}`, pageWidth / 2, 23, { align: 'center' });
        doc.text(`Total Records: ${allData.length}`, pageWidth / 2, 28, { align: 'center' });

        // ===== Criteria Section =====
        const criteria = buildCriteria();

        const criteriaBody = criteria.map(row => {
          const formattedRow: any[] = [];
          for (let i = 0; i < row.length; i += 2) {
            formattedRow.push(`${row[i]}: ${row[i + 1]}`);
          }
          return formattedRow;
        });

        autoTable(doc, {
          body: criteriaBody,
          startY: 33,
          styles: { fontSize: 8 },
          theme: 'grid',
          margin: { left: 14, right: 14 },
        });

        // Get Y position after criteria
        const finalY = (doc as any).lastAutoTable.finalY || 40;

        // ===== Table Headers =====
        const tableHeaders = [
          intl.formatMessage({ id: "Entity.label.outlet", defaultMessage: "Outlet" }),
          intl.formatMessage({ id: "Entity.label.name", defaultMessage: "Name" }),
          intl.formatMessage({ id: "Entity.label.terminal", defaultMessage: "Terminal" }),
          intl.formatMessage({ id: "AcquiringTransaction.processingDate", defaultMessage: "Processing Date" }),
          intl.formatMessage({ id: "Entity.label.card", defaultMessage: "Card" }),
          intl.formatMessage({ id: "AcquiringTransaction.transId", defaultMessage: "Trans. ID" }),
          intl.formatMessage({ id: "AcquiringTransaction.transactionDate", defaultMessage: "Trans. Date" }),
          intl.formatMessage({ id: "Entity.label.transAmount", defaultMessage: "Trans. Amount" }),
          intl.formatMessage({ id: "Entity.label.transCurrency", defaultMessage: "Trans. Currency" }),
          intl.formatMessage({ id: "Entity.label.authCode", defaultMessage: "Auth. Code" }),
          intl.formatMessage({ id: "Entity.label.settAmount", defaultMessage: "Sett. Amount" }),
        ];

        // ===== Table Data =====
        const tableData = allData.map((row: any) => [
          row.outletCode || "",
          row.merchantName || "",
          row.terminalId || "",
          row.processingDate
            ? new Date(row.processingDate).toLocaleDateString('en-GB')
            : "",
          row.maskPan || "",
          row.transId || "",
          row.transactionDate
            ? new Date(row.transactionDate).toLocaleDateString('en-GB')
            : "",
          row.transactionAmount || "",
          row.transCurrency || "",
          row.authorizationNumber || "",
          row.settlementAmount || "",
        ]);

        // ===== Transactions Table =====
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          startY: finalY + 5,
          styles: { fontSize: 7, cellPadding: 1.5 },
          headStyles: { fillColor: [66, 66, 66], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 14, right: 14 },
          didDrawPage: (data: any) => {
            // ===== Re-draw title on every page =====
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Acquiring Transactions Report', pageWidth / 2, 16, { align: 'center' });

            // ===== Page number footer =====
            const pageCount = (doc as any).internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
              `Page ${data.pageNumber} of ${pageCount}`,
              pageWidth / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          }
        });

        // ===== Save =====
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `Acquiring_Transactions_${dateStr}.pdf`;
        doc.save(filename);

        toast.success(`PDF file exported successfully: ${allData.length} records`);
      } else {
        toast.warning("No data to export");
      }
    } catch (err: any) {
      console.error("Export to PDF error:", err);
      toast.error(err.response?.data?.errors?.[0] || "Failed to export to PDF");
    }
  };
  /* START (sort table data) */
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string | Date },
    b: { [key in Key]: number | string | Date },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const createSortHandler = (
    property: keyof TransactionCurrentModel
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* END (sort table data) */

  // Function to handle "Select All" checkbox change
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSentBatch(true);
    setSelectAll(checked);

    if (checked) {
      const allTransactionIds = acquiringTransactions.map((row) => row.recordSeqId);
      setAccountingAdjustmentList(allTransactionIds);
      setSelectedIds(allTransactionIds)
    } else {
      setAccountingAdjustmentList([]);
      setSelectedIds([])
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, acquirerId: number) => {
    const checked = event.target.checked;

    if (!sentBatch && selectedIds.length > 0) {
      setSelectedIds([])
    }
    setSentBatch(true);

    if (checked) {
      setAccountingAdjustmentList((prevList) => [...prevList, acquirerId]);
      setSelectedIds((prevList) => [...prevList, acquirerId])
    } else {
      setAccountingAdjustmentList((prevList) =>
        prevList.filter((id) => id !== acquirerId)
      );
      setSelectedIds((prevList) =>
        prevList.filter((id) => id !== acquirerId)
      );
    }
  };
  useEffect(() => {
    setInstitutefromLocalStorage();
    setSelectManualEntry('2');
    //getMerchantNameList();
  }, []);

  useEffect(() => {
    if (transactionFilterDetails?.outletId) {
      getTerminalsByEntityId(transactionFilterDetails?.outletId);
    } else {
      if (!outletId?.value) {
        setValue("terminalId", "");
        setTerminalList([]);
        setTransactionFilterDetails({
          ...transactionFilterDetails,
          terminalId: "",
        });
      }
    }
  }, [transactionFilterDetails?.outletId]);

  useEffect(() => {
    if (selectInstitutionVal) {
      setEntityDesc("");
      setEntityList([]);
      setTransactionFilterDetails({
        ...transactionFilterDetails,
        outletId: "",
        merchantName: "",
      });
      getEntitiesByEntityLevelNameAndInstitution(selectInstitutionVal);
      getTransactionsMerchantNames(selectInstitutionVal)
    }
  }, [selectInstitutionVal]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getAllAcquiringTransactions(
      newPage,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal
    );
    setAccountingAdjustmentList([]);
    setSelectAll(false);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    getAllAcquiringTransactions(
      page,
      +event.target.value,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      transactionFilterDetails.institutionId
    );
    setAccountingAdjustmentList([]);
    setSelectAll(false);
  };

  const getValuesBySearch = (model: any) => {
    AcquiringTransactionServices.getBySearch(model)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res?.data?.totalRecords);
            setAcquiringTransactions([...res.data.data]);
            setInitalyHiddenHoldButton(false);

            if (selectedSettlMerchHalt == "Y") {
              setShownHalt(false);
              setHoldTransactionsMessage("Unhalt Payment");
            }
            else {
              setShownHalt(true);
              setHoldTransactionsMessage("Halt Payment");
            }
          } else {
            setAcquiringTransactions([]);
            setTotalRecords(0);
          }
        } else {
          setAcquiringTransactions([]);
          setTotalRecords(0);
        }

        setSelectAll(false);
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };

  const getAllAcquiringTransactions = (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string
  ) => {
    let sort;
    if (sortColumn && sortOrder) {
      sort = [{ column: sortColumn, sortOrder: sortOrder.toUpperCase() }];
    } else {
      setCurrentSortColumn("MERCHANT_NAME");
      setIsSortOrderASC(true);
      sort = [{ column: "MERCHANT_NAME", sortOrder: "ASC" }];
    }
    getValuesBySearch({
      ...filterState,
      pageNo,
      pageSize,
      sort,
      institutionId: instId,
    });
    setPage(pageNo);
    setRowsPerPage(pageSize);
    setCurrentSortColumn(sortColumn);
    setIsSortOrderASC(sortOrder.toUpperCase() === "ASC" ? true : false);
  };

  const getAllAcquiringTransactionsOnLoad = (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string
  ) => {
    let sort;
    if (sortColumn && sortOrder) {
      sort = [{ column: sortColumn, sortOrder: sortOrder.toUpperCase() }];
    } else {
      setCurrentSortColumn("MERCHANT_NAME");
      setIsSortOrderASC(true);
      sort = [{ column: "MERCHANT_NAME", sortOrder: "ASC" }];
    }
    let model = {
      institutionId: instId,
      fromTransactionDate: moment(new Date()).format("DD/MM/yyyy"),
      toTransactionDate: moment(new Date()).format("DD/MM/yyyy"),
      cardNumber: transactionFilterDetails.cardNumber
        ? transactionFilterDetails.cardNumber
        : "",
      manualEntry: transactionFilterDetails?.manualEntry === "Y" ? "1" : "0",
      pageNo,
      pageSize,
      sort,
    };
    AcquiringTransactionServices.getBySearch(model)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          if (res?.data?.totalRecords > 0) {
            setTotalRecords(res?.data?.totalRecords);
            setAcquiringTransactions([...res.data.data]);
          } else {
            setAcquiringTransactions([]);
            setTotalRecords(0);
          }
        } else {
          setAcquiringTransactions([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };

  const onSubmit = async (values: AcquiringTransactionFilterModel) => {
    if (selectManualEntry == "") {
      setSelectManualEntry('-1');
    }
    // if (
    //   outletId?.value === "" ||
    //   outletId?.value === undefined ||
    //   outletId?.value === null
    // ) {
    //   setOutletErr(outLetIdRequired);
    // } else {
    let sort;
    if (currentSortColumn && isSortOrderASC) {
      sort = [
        {
          column: currentSortColumn,
          sortOrder: isSortOrderASC ? "ASC" : "DESC",
        },
      ];
    } else {
      setCurrentSortColumn("MERCHANT_NAME");
      setIsSortOrderASC(true);
      sort = [{ column: "MERCHANT_NAME", sortOrder: "ASC" }];
    }

    let filtermodel = {
      institutionId: values?.institutionId,
      pageNo: page,
      pageSize: rowsPerPage,
      sort: sort,
      fromProcessingDate: values?.fromProcessingDate
        ? moment(values.fromProcessingDate).format("DD/MM/yyyy")
        : "",
      toProcessingDate: values?.toProcessingDate
        ? moment(values.toProcessingDate).format("DD/MM/yyyy")
        : "",
      entitiesId: outletId?.value,
      manualEntry: values.manualEntry ? values.manualEntry : '2',
      cardNumber: values.cardNumber ? values.cardNumber : "",
      terminalId: values.terminalId ? values.terminalId : undefined,
      transactionId: values.transactionId ? values.transactionId : "",
      settlMerchHalt: selectedSettlMerchHalt,
      authorizationNumber: values.authorizationNumber,
      batchId: values.batchId,
      merchantName: merchantName?.value,
      merchantAccountNumber: values.merchantAccountNumber ? values.merchantAccountNumber : "",
    };

    setFilterState(filtermodel);
    setTransactionFilterDetails({ ...values });
    getValuesBySearch(filtermodel);
    //}
  };

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    const institutions = JSON.parse(
      getLocalStorage(LOCALSTORAGE_KEYS.INSTITUTES) as string
    );
    if (institutions) {
      await InstitutionService.getActiveInstitution()
        .then((res) => {
          setInstitutionList([...res.data]);
        })
        .catch((err) => toast.error(err.response.data.errors[0]));
    }
    if (instID) {
      setSelectInstitutionVal(instID);
      getEntitiesByEntityLevelNameAndInstitution(instID);
      getTransactionsMerchantNames(instID)
      getDefaultTransactionIdByInstitutionId(instID);
      setValue("institutionId", instID);
      setTransactionFilterDetails((prev) => ({
        ...prev,
        institutionId: instID,
      }));
    }
    //getAllAcquiringTransactions(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc", instID);
    // getAllAcquiringTransactionsOnLoad(
    //   0,
    //   rowsPerPage,
    //   currentSortColumn,
    //   isSortOrderASC ? "asc" : "desc",
    //   instID
    // );
  };

  const getEntitiesByEntityLevelNameAndInstitution = async (instID: string) => {
    const model = {
      institutionId: instID,
      entityLevel: ENTITY_LEVEL.OUTLET,
    };
    await EntityService.getEntitiesByEntityLevelNameAndInstitution(model)
      .then((res) => {
        let option: any = [];
        if (res.data) {
          option = res.data.map((data) => {
            const label = data.entityId;
            const value = data.entityId;
            const desc = data.entityName;
            return { label, value, desc };
          });
        }
        setEntityList(option);
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };

  const getTransactionsMerchantNames = async (instID: string) => {
    await EntityService.getTransactionsEntityNames(instID)
      .then((res) => {
        let option: any = [];
        if (res.data) {
          option = res.data.map((data) => {
            const label = data;
            const value = data;
            return { label, value };
          });
        }
        setMerchantNamesList(option);
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };


const getTerminalsByEntityId = (entityID: string) => {
  TerminalService.getAllByEntityId(entityID)
    .then((res) => {
      setTerminalList(res?.data);
      setTransactionFilterDetails((prev) => ({
        ...prev,
        terminalId: "",
      }));
      setValue("terminalId", "");
    })
    .catch((err) => {
      toast.error(err.response.data.errors[0]);
      setTerminalList([]);
      setTransactionFilterDetails((prev) => ({
        ...prev,
        terminalId: "",
      }));
      setValue("terminalId", "");
    });
};
  const getDefaultTransactionIdByInstitutionId = (instID: string) => {
    TransactionGroupService.getDefaultTransactionIdByInstitutionId(instID)
      .then((res) => {
        setTransactionList(res?.data);
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };

  const checkIfAlreadyRepresented = (id: number) => {
    AcquiringTransactionServices.checkIfAlreadyRepresented(id)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setRepresentmentDialogId(id);
          setRePresentmentModalOpen(true);
        }
      })
      .catch((err) => {
        if (
          err &&
          err.response
          // &&
          // err.response.data === Errors.representmentAlreadyDone
        ) {
          Swal.fire(undefined, err.response.data.errors[0], "error");

        }
      });
  };

  const checkIfAlreadyReversed = (id: number, merchantPaymentDate: Date) => {
    AcquiringTransactionServices.checkIfAlreadyReversed(id)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setReversalDialogId(id);
          setMerchantPaymentDate(merchantPaymentDate);
          setReverseTransitionModalOpen(true);
        }
      })
      .catch((err) => {
        if (
          err &&
          err.response
          // &&
          // err.response.data === Errors.reversalAlreadyDone
        ) {
          Swal.fire(undefined, err.response.data.errors[0], "error");
        }
      });
  };

  const selectionValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setSelectedSettlMerchHalt(event.target.value);
    setTransactionFilterDetails((prev: any) => ({
      ...prev,
      [name]: (event.target as HTMLInputElement).value,
    }));
  };

  const [openReverseTransitionModal, setReverseTransitionModalOpen] =
    React.useState(false);

  const reverseTransitionModalOpen = (
    id: number,
    merchantPaymentDate: Date
  ) => {
    checkIfAlreadyReversed(id, merchantPaymentDate);
  };
  const reverseTransitionModalClose = () => {
    setReverseTransitionModalOpen(false);
  };

  const [openRePresentmentModal, setRePresentmentModalOpen] =
    React.useState(false);

  const rePresentmentModalOpen = (id: number) => {
    checkIfAlreadyRepresented(id);
  };

  const rePresentmentModalClose = () => {
    setRePresentmentModalOpen(false);
  };

  const [openHaltPayModal, setHaltPayModalOpen] = React.useState(false);
  const [openUnhaltPayModal, setOpenUnhaltPayModal] = React.useState(false);


  const haltPayModalOpen = (id: number[], merchantPaymentDate: Date) => {
    setHaltPayModalOpen(true);
  };

  const unHaltPayModalOpen = (message: string, id: number[], merchantPaymentDate: Date, batch: boolean) => {
    setOpenUnhaltPayModal(true);
  };

  const haltPayModalClose = () => {
    setHaltPayModalOpen(false);
  };

  const unhaltPayModalClose = () => {
    setOpenUnhaltPayModal(false);
  };

  const [openTransactionDetailsModal, setTransactionDetailsModalOpen] =
    React.useState(false);

  const TransactionDetailsModalOpen = (id: number) => {
    getAcquiringTransactionDetails(id);
    setTransactionDetailsModalOpen(true);
  };

  const getAcquiringTransactionDetails = async (id: number) => {
    AcquiringTransactionServices.getById(id)
      .then((res) => {
        if (res?.status === StatusCode.Success) {
          setAcquiringTransactionDetails(res.data);
        }
      })
      .catch((err) => toast.error(err.response.data.errors[0]));
  };

  const TransactionDetailsModalClose = () => {
    setTransactionDetailsModalOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setTransactionFilterDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "institutionId") {
      setSelectInstitutionVal(event.target.value);
      setEntityDesc("");
      setEntityList([]);
      setOutletId({ label: "", value: "" });
      setTransactionFilterDetails({
        ...transactionFilterDetails,
        [event.target.name]: event.target.value,
        outletId: "",
        merchantName: ""
      });
    }
  };

  const handleOutletChange = (e: OptionType) => {

    if (e) {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        outletId: e.value!.toString(),
      }));
      setOutletErr("");
      setEntityDesc(e.desc ? e.desc : "");
      setOutletId({ value: e?.value!, label: e?.label! });
      // getValuesBySearch({ ...filterState, entitiesId: e.value });
    } else {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        outletId: "",
      }));
      setOutletErr(outLetIdRequired);
      setEntityDesc("");
      setOutletId({ label: "", value: "" });
    }
  };

  const handleMerchantNameChange = (e: OptionType) => {
    if (e) {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        merchantName: e.value!.toString(),
      }));
      setMerchantNameErr("");
      setMerchantName({ value: e?.value!, label: e?.label! });
      // getValuesBySearch({ ...filterState, entitiesId: e.value });
    } else {
      setTransactionFilterDetails((prev) => ({
        ...prev,
        merchantName: "",
      }));
      setMerchantNameErr(outLetIdRequired);
      setMerchantName({ label: "", value: "" });
    }
  };

  const applyAccountingAdjustment = () => {
    if (accountingAdjustmentList.length === 0) {
      toast.error("Please select at least one transaction");
      return;
    }
    const model = {
      transactions: accountingAdjustmentList,
      hold: isHold,
    };
    AcquiringTransactionServices.applyAccountingAdjustment(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          toast.success("Accounting adjustment applied to the selected transactions");
          setAccountingAdjustmentList([]);
          setSelectAll(false);
        }
      })
      .catch((err) => {
        // if (err && err.response && err.response.data === Errors.reversalAlreadyDone) {
        Swal.fire(undefined, err.response.data.errors[0], "error");

        //   }
      });
  };

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  {intl.formatMessage({
                    id: "Entity.acquiringTransactions",
                    defaultMessage: "Acquiring Transactions",
                  })}
                </Typography>
                {/* <p className="pb-0">
                  {
                    intl.formatMessage({
                      id: "Entity.addUpdateTransactionMessage",
                      defaultMessage: "Add or update Activity Fees Packages"
                    })
                  }
                </p> */}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-elements">
                <Grid spacing={3} container className="compact-grid">
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.institution",
                          defaultMessage: "Institution",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("institutionId")}
                          value={
                            selectInstitutionVal
                              ? selectInstitutionVal.toString()
                              : ""
                          }
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "Entity.select",
                                defaultMessage: "Select",
                              })}
                            </em>
                          </MenuItem>
                          {institutionList &&
                            institutionList.length > 0 &&
                            institutionList.map((item) => (
                              <MenuItem
                                value={item.institutionId}
                                key={item.institutionId}
                              >
                                {item.institutionName}
                              </MenuItem>
                            ))}
                        </Select>
                        {(transactionFilterDetails.institutionId
                          ? transactionFilterDetails.institutionId.toString()
                          : "") === "" && errors?.institutionId?.message ? (
                          <FormHelperText id="error-helper-text" error>
                            {
                              validations
                                .filterAcquiringTransactionValidationMessage
                                .institutionId
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.entityOutletId",
                          defaultMessage: "Entity/Outlet ID",
                        })}
                        {/* <span className="required-field">*</span> */}
                      </label>
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="outletId"
                          render={() => (
                            <ReactSelect
                              value={outletId}
                              onChange={(e) => handleOutletChange(e!)}
                              isClearable={
                                outletId?.value === "" ? false : true
                              }
                              options={entityList}
                            // placeholder="select..."
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    {/* <FormHelperText id="error-helper-text" error>
                      {outletErr !== "" ? outletErr : ""}
                    </FormHelperText> */}
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <FormControl fullWidth className="field-space">
                        <InputBase
                          placeholder="Description"
                          fullWidth
                          value={entityDesc}
                          disabled
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.merchantName",
                          defaultMessage: "Merchant Name",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="outletId"
                          render={() => (
                            <ReactSelect
                              value={merchantName}
                              onChange={(e) => handleMerchantNameChange(e!)}
                              isClearable={
                                outletId?.value === "" ? false : true
                              }
                              options={merchantNamesList}
                            // placeholder="select..."
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    {/* <FormHelperText id="error-helper-text" error>
                      {outletErr !== "" ? outletErr : ""}
                    </FormHelperText> */}
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.manual",
                          defaultMessage: "Manual",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("manualEntry")}
                          value={
                            selectManualEntry
                              ? selectManualEntry.toString()
                              : ""
                          }
                          onChange={(event) => setSelectManualEntry(event.target.value)}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value='2'>{intl.formatMessage({ id: "AquiringTransactions.selectManualEntryDefault", defaultMessage: "Both" })}</MenuItem>
                          <MenuItem
                            value='1'
                            key='1'
                          >
                            Yes
                          </MenuItem>
                          <MenuItem
                            value='0'
                            key='0'
                          >
                            No
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label date-select-input">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.fromProcessingDate",
                          defaultMessage: "From Processing date",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="fromProcessingDate"
                            defaultValue={new Date()}
                            render={({ field }) => (
                              <DatePicker
                                inputFormat="dd/MM/yyyy"
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                    field.onChange(
                                      keyboardInput.length === 10 ? date : ""
                                    );
                                  } else {
                                    field.onChange(date);
                                  }
                                  setTransactionFilterDetails((prev) => ({
                                    ...prev,
                                    fromProcessingDate: date,
                                  }));
                                }}
                                value={field.value ?? null}
                                components={{
                                  OpenPickerIcon: () => {
                                    return <img src={date_ic} alt="date" />;
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {errors.fromProcessingDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label date-select-input">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.toProcessingDate",
                          defaultMessage: "To Processing date",
                        })}
                        <span className="required-field">*</span>
                      </label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            control={control}
                            name="toProcessingDate"
                            defaultValue={new Date()}
                            render={({ field }) => (
                              <DatePicker
                                inputFormat="dd/MM/yyyy"
                                onChange={(date, keyboardInput) => {
                                  if (keyboardInput) {
                                    field.onChange(
                                      keyboardInput.length === 10 ? date : ""
                                    );
                                  } else {
                                    field.onChange(date);
                                  }
                                  setTransactionFilterDetails((prev) => ({
                                    ...prev,
                                    toProcessingDate: date,
                                  }));
                                }}
                                value={field.value ?? null}
                                components={{
                                  OpenPickerIcon: () => {
                                    return <img src={date_ic} alt="date" />;
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <FormHelperText id="error-helper-text" error>
                          {errors.toProcessingDate?.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.cardNumber",
                          defaultMessage: "Card Number",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          inputProps={{ maxLength: 255 }}
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.number",
                            defaultMessage: "Enter Number",
                          })}
                          fullWidth
                          {...register("cardNumber")}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.transactionId",
                          defaultMessage: "Transaction ID",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          {...register("transactionId")}
                          value={
                            transactionFilterDetails.transactionId
                              ? transactionFilterDetails.transactionId.toString()
                              : ""
                          }
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => (
                            <img src={down_arrow_icon} alt="" />
                          )}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "AcquiringTransaction.transactionId",
                                defaultMessage: "Select Transaction Id",
                              })}
                            </em>
                          </MenuItem>
                          {transactionList &&
                            transactionList.length > 0 &&
                            transactionList.map((item) => (
                              <MenuItem
                                value={item.transactionId}
                                key={item.transactionId}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.termialId",
                          defaultMessage: "Terminal ID",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <Select
                          value={transactionFilterDetails.terminalId || ""}
                          onChange={(event) => {
                            const val = event.target.value;
                            const terminalValue = val === "" ? "" : val.toString();
                            setValue("terminalId", terminalValue);
                            setTransactionFilterDetails((prev) => ({
                              ...prev,
                              terminalId: terminalValue,
                            }));
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem value="">
                            <em>
                              {intl.formatMessage({
                                id: "AcquiringTransaction.selectTerminalId",
                                defaultMessage: "Select Terminal Id",
                              })}
                            </em>
                          </MenuItem>
                          {terminalList &&
                            terminalList.length > 0 &&
                            terminalList.map((item) => (
                              <MenuItem value={item.terminalId} key={item.terminalId}>
                                {item.terminalId}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.holdTransactions",
                          defaultMessage: "Halt Transactions",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          {...register("settlMerchHalt")}
                          value={
                            transactionFilterDetails?.settlMerchHalt
                              ? transactionFilterDetails.settlMerchHalt
                              : "N"
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setIsHold(selectedValue === "N");
                            selectionValueChange(e, "settlMerchHalt");
                          }}
                        >
                          <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                          <FormControlLabel value="N" control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.authorizationcode",
                          defaultMessage: "Authorization Code",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          inputProps={{ maxLength: 255 }}
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.authorizationcode",
                            defaultMessage: "Enter Authorization Code",
                          })}
                          fullWidth
                          {...register("authorizationNumber")}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.batchnumber",
                          defaultMessage: "Batch Number",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          inputProps={{ maxLength: 255 }}
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.batchnumber",
                            defaultMessage: "Enter Batch Number",
                          })}
                          fullWidth
                          {...register("batchId")}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} xl={3}>
                    <div className="input-with-label">
                      <label className="lg">
                        {intl.formatMessage({
                          id: "Entity.label.merchantAccountNumber",
                          defaultMessage: "Merchant Account Number",
                        })}
                      </label>
                      <FormControl fullWidth>
                        <InputBase
                          inputProps={{ maxLength: 30 }}
                          placeholder={intl.formatMessage({
                            id: "Entity.placeholder.merchantAccountNumber",
                            defaultMessage: "Enter Merchant Account Number",
                          })}
                          fullWidth
                          {...register("merchantAccountNumber")}
                          onChange={(e) => {
                            const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                            e.target.value = sanitized;
                            register("merchantAccountNumber").onChange(e);
                          }}
                          onKeyDown={(e) => {
                            if (/[^a-zA-Z0-9]/.test(e.key) && e.key.length === 1) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="btns-block right has-border form-group">
                <Button variant="contained"
                  disabled={!selectedIds || selectedIds.length === 0}
                  className={`${initalyHiddenHoldButton ? 'hide' : 'show'}`}
                  onClick={() => {
                    if (!shownHalt) {
                      unHaltPayModalOpen(
                        "Are you sure you want to unhalt selected transactions?",
                        selectedIds,
                        new Date(),
                        true
                      )
                    }
                    else {
                      // if(!sentBatch){
                      //   setSelectedIds([])
                      // }
                      setSentBatch(true);
                      haltPayModalOpen(selectedIds, new Date());
                    }
                  }}>
                  {intl.formatMessage({
                    id: "Entity.button.holdTransactions",
                    defaultMessage: `${holdTransactionsMessage}`,
                  })}
                </Button>
                <Button disableElevation variant="contained" type="submit">
                  {intl.formatMessage({
                    id: "Entity.button.search",
                    defaultMessage: "Search",
                  })}
                </Button>
                <Button disabled={acquiringTransactions.length == 0} variant="contained" onClick={() => { exportToExcel() }}>
                  {intl.formatMessage({
                    id: "Entity.button.exportToExcel",
                    defaultMessage: "Export to Excel",
                  })}
                </Button>
                <Button disabled={acquiringTransactions.length == 0} variant="contained" onClick={() => { exportToPDF() }}>
                  {intl.formatMessage({
                    id: "Entity.button.exportToPdf",
                    defaultMessage: "Export to PDF",
                  })}
                </Button>
              </div>
            </form>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      width="105px"
                    >
                      <FormGroup row className="checkbox-grp">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<img src={ic_check} alt="" />}
                              checkedIcon={<img src={ic_checked} alt="" />}
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          }
                          label=" "
                          labelPlacement="start"
                        />
                      </FormGroup>
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.outlet",
                        defaultMessage: "Outlet",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.name",
                        defaultMessage: "Name",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.terminal",
                        defaultMessage: "Terminal",
                      })}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'processingDate'}
                        direction={orderBy === 'processingDate' ? order : 'asc'}
                        onClick={() => createSortHandler("processingDate")}
                      >
                        {
                          intl.formatMessage({
                            id: "AcquiringTransaction.processingDate",
                            defaultMessage: "Processing Date"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.card",
                        defaultMessage: "Card",
                      })}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'recordSeqId'}
                        direction={orderBy === 'recordSeqId' ? order : 'asc'}
                        onClick={() => createSortHandler("recordSeqId")}
                      >
                        {
                          intl.formatMessage({
                            id: "AcquiringTransaction.transId",
                            defaultMessage: "Trans. ID"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'transactionDate'}
                        direction={orderBy === 'transactionDate' ? order : 'asc'}
                        onClick={() => createSortHandler("transactionDate")}
                      >
                        {
                          intl.formatMessage({
                            id: "AcquiringTransaction.transactionDate",
                            defaultMessage: "Trans. Date"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.transAmount",
                        defaultMessage: "Trans. Amount",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.transCurrency",
                        defaultMessage: "Trans. Currency",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.authCode",
                        defaultMessage: "Auth. Code",
                      })}
                    </TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: "Entity.label.settAmount",
                        defaultMessage: "Sett. Amount",
                      })}
                    </TableCell>
                    <TableCell
                      align="center"
                      width="205px"
                      className="last-column-border-header"
                    >
                      {intl.formatMessage({
                        id: "Entity.label.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acquiringTransactions.sort(getComparator(order, orderBy)).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">
                        <Checkbox
                          key={row.recordSeqId}
                          icon={<img src={ic_check} alt="" />}
                          checkedIcon={<img src={ic_checked} alt="" />}
                          checked={selectedIds.includes(row.recordSeqId)}
                          onChange={(e) => handleCheckboxChange(e, row.recordSeqId)}
                        />
                      </TableCell>
                      <TableCell>{row.outletCode}</TableCell>
                      <TableCell>{row.merchantName}</TableCell>
                      <TableCell>{row.terminalId}</TableCell>
                      <TableCell>{row.processingDate ? new Date(row.processingDate).toLocaleDateString('en-GB') : ''}</TableCell>
                      <TableCell>{row.maskPan}</TableCell>
                      <TableCell>{row.transId}</TableCell>
                      <TableCell>{row.transactionDate ? new Date(row.transactionDate).toLocaleDateString('en-GB') : ''}</TableCell>
                      <TableCell>{row.transactionAmount}</TableCell>
                      <TableCell>{row.transCurrency}</TableCell>
                      <TableCell>{row.authorizationNumber}</TableCell>
                      <TableCell>{row.settlementAmount}</TableCell>
                      <TableCell
                        align="center"
                        width="205px"
                        className="last-column-border"
                      >
                        <div className="action btns-block">
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => TransactionDetailsModalOpen(row.recordSeqId)}
                            title="Transaction Details"
                          >
                            <img src={ic_info_orange} alt="info" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => {
                              if (!shownHalt) {
                                setSelectedIds([])
                                setSentBatch(false);
                                setHaltDialogId(row.recordSeqId);
                                setSelectedIds((prev) => {
                                  if (!prev.includes(row.recordSeqId)) {
                                    return [...prev, row.recordSeqId];
                                  }
                                  return prev;
                                });
                                unHaltPayModalOpen(
                                  "Are you sure you want to unhalt transaction?",
                                  selectedIds,
                                  row.merchPaymentDate,
                                  false
                                )
                              }
                              else {
                                setSelectedIds([])
                                setSentBatch(false);
                                setHaltDialogId(row.recordSeqId);
                                setSelectedIds((prev) => {
                                  if (!prev.includes(row.recordSeqId)) {
                                    return [...prev, row.recordSeqId];
                                  }
                                  return prev;
                                });
                                haltPayModalOpen(selectedIds, row.merchPaymentDate)
                              }
                            }}
                            title={holdTransactionsMessage}
                          >
                            <img src={ic_flag} alt="flag" />
                          </IconButton>
                          {/* <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() =>
                              rePresentmentModalOpen(
                                row.recordSeqId
                              )
                            }
                            title="Re Presentment"
                          >
                            <img src={ic_hand} alt="hand" />
                          </IconButton> */}
                          {/* <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() =>
                              reverseTransitionModalOpen(
                                row.recordSeqId,
                                row.merchPaymentDate
                              )
                            }
                            title="Reverse Transaction"
                          >
                            <img src={ic_reload} alt="reload" />
                          </IconButton> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {acquiringTransactions &&
                    acquiringTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "AcquiringTransactions.noDataFound",
                              defaultMessage: "No Data Found.",
                            })}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptionsConst}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </main>

        {reversalDialogId ? (
          <EntityReversalTransactionDialog
            openHandler={openReverseTransitionModal}
            closeHandler={reverseTransitionModalClose}
            acquiringTransactionId={reversalDialogId}
            institutionId={selectInstitutionVal}
            merchantPaymentDate={merchantPaymentDate}
          />
        ) : null}

        {representmentDialogId ? (
          <EntityRepresenmentDialog
            openHandler={openRePresentmentModal}
            closeHandler={rePresentmentModalClose}
            acquiringTransactionId={representmentDialogId}
            institutionId={selectInstitutionVal}
          />
        ) : null}

        {openHaltPayModal ? (
          <EntityHaltPayDialog
            openHandler={openHaltPayModal}
            closeHandler={haltPayModalClose}
            acquiringTransactionIds={selectedIds}
            institutionId={selectInstitutionVal}
            setRefresh={setRefresh}
          />
        ) : null}

        {openUnhaltPayModal ? (
          <EntityUnhaltPayDialog
            openHandler={openUnhaltPayModal}
            closeHandler={unhaltPayModalClose}
            acquiringTransactionIds={selectedIds}
            institutionId={selectInstitutionVal}
            setRefresh={setRefresh}
          />
        ) : null}

        <Dialog
          open={openTransactionDetailsModal}
          onClose={TransactionDetailsModalClose}
          className="c-dialog lg"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Entity.label.transactionDetails",
                    defaultMessage: "Transaction details",
                  })}
                </Typography>
              </div>
              <div className="right-block mb-0">
                <Button
                  disableElevation
                  variant="contained"
                  onClick={TransactionDetailsModalClose}
                >
                  {intl.formatMessage({
                    id: "Entity.button.close",
                    defaultMessage: "Close",
                  })}
                </Button>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <Grid spacing={3} container>
              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.microfilmRefNbr",
                      defaultMessage: "MicroFilm Ref No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.microfilmRefNumber}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.refNumberSequence",
                      defaultMessage: "Sequence Ref No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.refNumberSeq}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.maskedpan",
                      defaultMessage: "Masked PAN",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.pan}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.cardScheme",
                      defaultMessage: "Card Scheme",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.cardScheme
                          ? acquiringTransactionDetails.cardScheme
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.cardScheme}
                      >
                        {acquiringTransactionDetails.cardScheme}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.linkupCode",
                      defaultMessage: "Linkup code",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.linkupCode}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.cardNumber",
                      defaultMessage: "Card No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.cardNumber}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingCode",
                      defaultMessage: "Processing Code",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingCode}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.transactionId",
                      defaultMessage: "Transaction ID",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.transId}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.reversal",
                      defaultMessage: "Reversal",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.reversalFlag === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.transactionAmount",
                      defaultMessage: "Transaction Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.transactionAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.transactionCurrency",
                      defaultMessage: "Transaction Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.transCurrency
                          ? acquiringTransactionDetails.transCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={
                          acquiringTransactionDetails.transCurrency
                        }
                      >
                        {acquiringTransactionDetails.transCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.billingAmount",
                      defaultMessage: "Billing Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.billingAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.billingCurrency",
                      defaultMessage: "Billing Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.billingCurrency
                          ? acquiringTransactionDetails.billingCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.billingCurrency}
                      >
                        {acquiringTransactionDetails.billingCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.localAmount",
                      defaultMessage: "Local Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.localAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.localCurrency",
                      defaultMessage: "Local Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.localCurrency
                          ? acquiringTransactionDetails.localCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.localCurrency}
                      >
                        {acquiringTransactionDetails.localCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.tipsAmount",
                      defaultMessage: "Tips Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.tipsAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.tipsCurrency",
                      defaultMessage: "Tips Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.tipsCurrency
                          ? acquiringTransactionDetails.tipsCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.tipsCurrency}
                      >
                        {acquiringTransactionDetails.tipsCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.dccAmount",
                      defaultMessage: "DCC Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.dccAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.dccCurrency",
                      defaultMessage: "DCC Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.dccCurrency
                          ? acquiringTransactionDetails.dccCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.dccCurrency}
                      >
                        {acquiringTransactionDetails.dccCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.dccMerchantAmount",
                      defaultMessage: "DCC Merchant Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.dccMerchantAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.dccMerchantSettlAmount",
                      defaultMessage: "DCC Merchant Sett. Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.dccMerchantAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.dccMerchantSettlAmountCurrency",
                      defaultMessage: "DCC Merchant Sett. Amount currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.dccMerchantSettlementCurrency
                          ? acquiringTransactionDetails.dccMerchantSettlementCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={
                          acquiringTransactionDetails.dccMerchantSettlementCurrency
                        }
                      >
                        {
                          acquiringTransactionDetails.dccMerchantSettlementCurrency
                        }
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantCommisionNumber",
                      defaultMessage: "Merchant Commission No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={
                        acquiringTransactionDetails.merchantCommission
                      }
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantMarkUpNumber",
                      defaultMessage: "Merchant Markup No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.chMarkup}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.chMarkUpNumber",
                      defaultMessage: "CH Markup No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.chMarkup}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.feeAmount1",
                      defaultMessage: "Fee Amount 1",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.feeAmount1}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.feeAmount1Currency",
                      defaultMessage: "Fee amount 1 Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.feeAmount1Currency
                          ? acquiringTransactionDetails.feeAmount1Currency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.feeAmount1Currency}
                      >
                        {acquiringTransactionDetails.feeAmount1Currency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.feeAmount2",
                      defaultMessage: "Fee Amount 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.feeAmount2}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.feeAmount2Currency",
                      defaultMessage: "Fee amount 2 Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.feeAmount2Currency
                          ? acquiringTransactionDetails.feeAmount2Currency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.feeAmount2Currency}
                      >
                        {acquiringTransactionDetails.feeAmount2Currency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.transactionDate",
                      defaultMessage: "Transaction Date",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.transactionDate}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.transactionTime",
                      defaultMessage: "Transaction Time",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.transTime}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.authorizationNumber",
                      defaultMessage: "Authorization No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.authorizationNumber}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.maskPan",
                      defaultMessage: "Mask Pan",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.maskPan}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.billingProcessingFlag",
                      defaultMessage: "Billing Processing flag",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.billingProcessingFlag === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.settlProcessingFlag",
                      defaultMessage: "Settlement Pro. flag",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.settlProcessingFlag === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.settlProcessingNbr",
                      defaultMessage: "Settlement Pro. No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.settlProcessingNumber}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.settlMerchantHalt",
                      defaultMessage: "Settlement Merchant Halt",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.settlMerchHalt === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantMarkUp",
                      defaultMessage: "Merchant Markup",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.merchMarkup}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.chMarkUp",
                      defaultMessage: "CH Markup",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.chMarkup}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.termialId",
                      defaultMessage: "Terminal ID",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.terminalId}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantCountry",
                      defaultMessage: "Merchant Country",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.merchantCountry}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.acquirerId",
                      defaultMessage: "Acquirer ID",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.acquirerId}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.issuerId",
                      defaultMessage: "Issuer ID",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.issuerId}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.issuerRefNum",
                      defaultMessage: "Issuer Ref. No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.issuerRefNumber}
                    />
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.outletCode",
                      defaultMessage: "Outlet Code",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.outletCode}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantName",
                      defaultMessage: "Merchant Name",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.merchantName}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantAccountNumber",
                      defaultMessage: "Merchant Account No.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.merchantAccountNumber
                          ? acquiringTransactionDetails.merchantAccountNumber
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={
                          acquiringTransactionDetails.merchantAccountNumber
                        }
                      >
                        {acquiringTransactionDetails.merchantAccountNumber}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantAccountCurrency",
                      defaultMessage: "Merchant Account Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.merchantAccountCurrency
                          ? acquiringTransactionDetails.merchantAccountCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={
                          acquiringTransactionDetails.merchantAccountCurrency
                        }
                      >
                        {acquiringTransactionDetails.merchantAccountCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantCategory",
                      defaultMessage: "Merchant Category",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.merchantCategory}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.terminalLocation",
                      defaultMessage: "Terminal Location.",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.terminalLocation}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.acquirerData",
                      defaultMessage: "Acquirer Data",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.acquirerData}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.issuerData",
                      defaultMessage: "Issuer Data",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.issuerData}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.terminalData",
                      defaultMessage: "Terminal Data",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.terminalData}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.eCommerce",
                      defaultMessage: "E-commerce",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.ecommerceFlag === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.originNetwork",
                      defaultMessage: "Origin Network",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.originNetwork
                          ? acquiringTransactionDetails.originNetwork
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.originNetwork}
                      >
                        {acquiringTransactionDetails.originNetwork}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.destinationNetwork",
                      defaultMessage: "Destination Network",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.destinationNetwork
                          ? acquiringTransactionDetails.destinationNetwork
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.destinationNetwork}
                      >
                        {acquiringTransactionDetails.destinationNetwork}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingDate",
                      defaultMessage: "Processing Date",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingDate}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.merchantSettlDate",
                      defaultMessage: "Merchant Sett. Date",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.merchSettlementDate}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.settlementAmount",
                      defaultMessage: "Sett. Amount",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.settlementAmount}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.settlementCurrency",
                      defaultMessage: "Sett. Currency",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        acquiringTransactionDetails.settlementCurrency
                          ? acquiringTransactionDetails.settlementCurrency
                          : null
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem
                        value={acquiringTransactionDetails.settlementCurrency}
                      >
                        {acquiringTransactionDetails.settlementCurrency}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.reversalReason",
                      defaultMessage: "Reversal Reason",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.reversalReason}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.reversalComment",
                      defaultMessage: "Reversal Comment",
                    })}
                  </label>
                  {/* TODO */}
                  {/* <Checkbox checked={acquiringTransactionDetails.reversalComment === "1" ? true : false} /> */}
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.Write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.reversalComment}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.manualEntry",
                      defaultMessage: "Manual Entry",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.manualEntry}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.manualComment",
                      defaultMessage: "Manual Comment",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.manualComment}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.chergebackReason",
                      defaultMessage: "Chargeback reason",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.chargebackReason}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.chargebackComment",
                      defaultMessage: "Chargeback Comment",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.chargebackComment}
                    />
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.payHaltComment",
                      defaultMessage: "Pay halt Comment",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                    //value={acquiringTransactionDetails.payHaltComment}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.accquierRecordToAppear",
                      defaultMessage: "Acquirer record to appear",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.acquirerRecordToAppear ===
                        "y" ||
                        acquiringTransactionDetails.acquirerRecordToAppear === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.issueRecordToAppear",
                      defaultMessage: "Issuer record to appear",
                    })}
                  </label>
                  <Checkbox
                    checked={
                      acquiringTransactionDetails.issuerRecordToAppear === "y" ||
                        acquiringTransactionDetails.issuerRecordToAppear === "Y"
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingRefNbr1",
                      defaultMessage: "Processing Ref. No. 1",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingRefNumber1}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingRefNbr2",
                      defaultMessage: "Processing Ref. No. 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingRefNumber2}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingRefNbr3",
                      defaultMessage: "Processing Ref. No. 3",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingRefNumber3}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingRefNbr4",
                      defaultMessage: "Processing Ref. No. 4",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingRefNumber4}
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <label className="lg">
                    {intl.formatMessage({
                      id: "Entity.label.processingRefNbr5",
                      defaultMessage: "Processing Ref. No. 5",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder={intl.formatMessage({
                        id: "Entity.placeholder.write",
                        defaultMessage: "Write",
                      })}
                      fullWidth
                      value={acquiringTransactionDetails.processingRefNumber5}
                    />
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default AcquiringTransactions;
