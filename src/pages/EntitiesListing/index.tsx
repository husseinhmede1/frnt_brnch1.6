import React, { useEffect, useMemo, useState } from "react";
import Button from '@mui/material/Button';
import { add_rounded, clone_ic, delete_ic, down_arrow_icon, edit_ic, search_ic } from "../../assets/images";
import { Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputBase, MenuItem, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from 'react-intl';
import { EntityService } from "../../services/entityManagement/entity-service";
import { EntityLevelModel, EntityListModel, EntitySearchCriteria, EntitySearchRequestModel } from "../../models/entityManagement/EntityModel";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ConfigurationActivities, Errors, StatusCode, rowsPerPageOptionsConst, CodePrefix } from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";
import { visuallyHidden } from "@mui/utils";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { Controller, useForm } from "react-hook-form";
import { SystemCodeModel } from "../../models/entityManagement/SystemCodeModel";
import { SystemCodeServices } from "../../services/entityManagement/system-code-services";
import ReactSelect, { createFilter } from "react-select";
import { MccService } from "../../services/configuration/mcc-services";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function EntitiesListing() {
  const navigate = useNavigate();
  const [openCloneModal, setCloneModalOpen] = React.useState(false);
  const [entityList, setEntityList] = React.useState<EntityListModel[]>([]);
  const [ActiveEntityList, setActiveEntityList] = React.useState<EntityListModel[]>([]);
  const [clonedEntityId, setClonedEntityId] = React.useState("");
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [institution, setInstitution] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const intl = useIntl();

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.ENTITIES), []);
  const canAdd = perms.accessAdd === "1";
  const canUpdate = perms.accessUpdate === "1";
  const canDelete = perms.accessDelete === "1";
  const canView = perms.accessView === "1";
  const [businessTypeList, setBusinessTypeList] = React.useState<
    SystemCodeModel[]
  >([]);
    const getAllBusinessTypes = async (id: string) => {
      const model = {
        codePrefix: CodePrefix.BUSINESS_TYPE,
        institutionId: id,
      };
      await SystemCodeServices.getSystemCodesByPrefixSuffix(model)
        .then((res) => {
          setBusinessTypeList([...res.data]);
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    };
  const cloneModalOpen = () => {
    setCloneModalOpen(true);
  };
  const cloneModalClose = () => {
    setCloneModalOpen(false);
  };
    const [mccErr, setMccErr] = React.useState("");
  
  const handleMccChange = (e: any) => {
    setMccId({ value: e?.value!, label: e?.label! });
    setMccErr("");
  };
  useEffect(() => {
    if(openCloneModal){
    getActiveEntities(selectInstitutionVal);
    }
  }, [openCloneModal]);
  const onSubmit = async () => {
    await EntityService.cloneEntity(clonedEntityId,selectInstitutionVal).then(res => {
      if (res && res.data && res.data.entityId) {
        navigate(`/entities-definition-clone/${clonedEntityId}`,{ state: { instId: selectInstitutionVal }})
      }
    }).catch(err => {
        toast.error(err.response.data.errors[0]);
    })
  }
    const onSubmitSearch = async () => {

          onSearch(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc", (getValues("institutionId")=="" || getValues("institutionId")==null|| getValues("institutionId")==undefined ) ? selectInstitutionVal :getValues("institutionId"), searchTerm);
          
  }
  const [mccId, setMccId] = useState<{ label: string; value: string }>();

  const handleEntityChange = (e: any) => {
    setClonedEntityId(e && e.target && e.target.value);
  }
  const [entityLevels, setEntityLevels] = React.useState<EntityLevelModel[]>(
    []
  );
  const getAllEntityLevelsByInstitutionId = async (id: string) => {
      await EntityService.getAllEntityLevelsByInstitutionId(id)
        .then((res) => {
          setEntityLevels([...res.data]);
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    };
  useEffect(() => {
    getActiveInstitution();
    setInstitutefromLocalStorage();
  }, []);

  const setInstitutefromLocalStorage = async () => {
    
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
      console.log("institution>>>>>>>",instID);
      getActiveEntities(instID);
      onSearch(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc", instID, searchTerm);
    }
    getAllEntityLevelsByInstitutionId(instID);
    getAllBusinessTypes(instID);
    getAllMcc();
  };

  const onSubmitCloneEntity = async (entityId: any) => {    
    await EntityService.cloneEntity(entityId,selectInstitutionVal).then(res => {
      if (res && res.data && res.data.entityId) {
        navigate(`/entities-definition-clone/${entityId}`,{ state: { instId: selectInstitutionVal }})
      }
    }).catch(err => {
        toast.error(err.response.data.errors[0]);
    })
  }

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitution([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };


  const getActiveEntities = async (instID: string) => {
    await EntityService.getByInstitutionId(instID)
      .then((res) => {
        setActiveEntityList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const editEntity = async (id: string) => {
    cloneModalOpen();
    navigate(`/entities-definition/${id}`,{ state: { instId: selectInstitutionVal }})
  }

  const changeStatusApprooved = async (id: string, enable: string, changeAllFlag: string) => {
    const model = {
      id: 0,
      status: enable,
      idString: id,
      changeAllFlag: changeAllFlag,
    };
    EntityService.changeStatus(model,selectInstitutionVal)
      .then((res) => {
        Swal.fire("Status Changed!", "Status Changed.", "success");
        setPage(0);
        onSearch(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc", selectInstitutionVal, searchTerm);
      })
      .catch((err) => {
        toast.error(err.response.data.errors[0]);
      }
      );
  }

  const hasChildrenEntities = async (id: any) => {
    try {
      const res = await EntityService.hasChildrenEntities(id);
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data || "An error occurred");
    }
  }

  const changeStatus = async (id: string, event: any) => {
    let enable = event.target.checked;
    switch (enable) {
      case true:
        if (await hasChildrenEntities(id)) {
          Swal.fire({
            title: intl.formatMessage({
              id: "changeStatusAlert.title",
              defaultMessage: "Do you want to enable all the entity child?",
            }),
            text: intl.formatMessage({
              id: "changeStatusAlert.text",
              defaultMessage: "You won't be able to revert this!",
            }),
            icon: "warning",

            showCancelButton: true,
            cancelButtonText: intl.formatMessage({
              id: "changeStatusAlert.cancelButtonText",
              defaultMessage: "Cancel",
            }),

            confirmButtonText: intl.formatMessage({
              id: "changeStatusAlert.confirmButtonText",
              defaultMessage: "Yes!",
            }),

            showDenyButton: true,
            denyButtonText: intl.formatMessage({
              id: "changeStatusAlert.denyButtonText",
              defaultMessage: "No!",
            })
          }).then((result: any) => {
            if (result.isConfirmed) {
              changeStatusApprooved(id, "1", "Y");
            } else if (result.isDenied) {
              changeStatusApprooved(id, "1", "N");
            }
          });
        } else {
          changeStatusApprooved(id, "1", "N");
        }
        break;
      case false:
        changeStatusApprooved(id, "0", "Y");
        break;
      default:
        break;
    }
  };

  const onDelete = (id: string) => {
    Swal.fire({
      title: intl.formatMessage({
        id: "DeleteAlert.title",
        defaultMessage: "Are you sure?",
      }),
      text: intl.formatMessage({
        id: "DeleteAlert.text",
        defaultMessage: "You won't be able to revert this!",
      }),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: intl.formatMessage({
        id: "DeleteAlert.cancelButtonText",
        defaultMessage: "Cancel",
      }),
      confirmButtonText: intl.formatMessage({
        id: "DeleteAlert.confirmButtonText",
        defaultMessage: "Yes, delete it!",
      }),
    }).then((result: any) => {
      if (result.isConfirmed) {
        EntityService.deleteById(id,selectInstitutionVal)
          .then((res) => {
            if (res.status === StatusCode.Success) {
              Swal.fire({
                title: intl.formatMessage({
                  id: "DeleteAlert.DeleteSuccess.title",
                  defaultMessage: "Deleted!",
                }),
                text: intl.formatMessage({
                  id: "DeleteAlert.DeleteSuccess.text",
                  defaultMessage: "Record has been deleted.",
                }),
                icon: "success",
                confirmButtonText: intl.formatMessage({
                  id: "DeleteAlert.okButtonText",
                  defaultMessage: "OK",
                }),
              });
              window.location.reload(); // Refresh the page
            }
            setPage(0);
            onSearch(0, rowsPerPage, "", "", selectInstitutionVal, searchTerm);
          })
          .catch((err) => {
            if (err && err.response 
           //   && err.response.data === Errors.ReferenceExists
            ) {
              Swal.fire({
                title: intl.formatMessage({
                  id: "DeleteAlert.DeleteError.title",
                  defaultMessage: "Cannot be deleted!",
                }),
                text: intl.formatMessage({
                  id: "DeleteAlert.DeleteError.referenceExist",
                                defaultMessage:err.response.data.errors[0]
                }),
                icon: "error",
                confirmButtonText: intl.formatMessage({
                  id: "DeleteAlert.okButtonText",
                  defaultMessage: "OK",
                }),
              });
            }
          });
      }
    });
  };
    const [isLoading, setIsLoading] = React.useState(false);
    const [mccList, setMccList] = React.useState<
      { label: string; value: string }[]
    >([]);
  const getAllMcc = async () => {
    setIsLoading(true);
    let option: any = [];
    await MccService.getAllMcc()
      .then((res: { data: any[]; }) => {
        if (res.data) {
          option = res?.data?.map((data) => {
            const label = `${data.mcc} - ${data.description}`;
            const value = data.mccId.toString();
            return { label, value };
          });
        }
        setMccList(option);
        setIsLoading(false);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };
  const handleInstitutionChange = (event: SelectChangeEvent) => {
    reset({
  businessTypeId: "",
  mccId: "",
  entityStatus: "",
  entityLevelId: "",
});
    setSelectInstitutionVal(event.target.value);
    getAllEntityLevelsByInstitutionId(event.target.value);
    getAllBusinessTypes(event.target.value);
    getAllMcc();

    //setPage(0);
    //onSearch(0, rowsPerPage, currentSortColumn, isSortOrderASC ? "asc" : "desc", event.target.value, searchTerm);
  };

  const [page, setPage] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptionsConst[0]);
  const [currentSortColumn, setCurrentSortColumn] = React.useState("");
  const [isSortOrderASC, setIsSortOrderASC] = React.useState<boolean>(true);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onSearch(
      newPage,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      searchTerm
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    onSearch(
      page,
      +event.target.value,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      searchTerm
    );
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchBtnClick = () => {
    onSearch(
      page,
      rowsPerPage,
      currentSortColumn,
      isSortOrderASC ? "asc" : "desc",
      selectInstitutionVal,
      searchTerm
    );
  }

  const clearFilters = () => {
reset({
  search: "",
  businessTypeId: "",
  parentId: "",
  mccId: "",
  entityStatus: "",
  entityId: "",
  fromDate: "",
  toDate: "",
  entityLevelId: "",
  entityName: "",
  hotMerchantFlag: "",
  hotMerchantFlagBoolean: false
});
};

  const createSortHandler = async (columnName: string) => {
    let isSortOrderASCL = isSortOrderASC
    if (currentSortColumn === columnName) {
      setIsSortOrderASC(!isSortOrderASC);
      isSortOrderASCL = !isSortOrderASC
    } else {
      setIsSortOrderASC(true);
      isSortOrderASCL = true
    }
    setCurrentSortColumn(columnName);
    onSearch(
      page,
      rowsPerPage,
      columnName,
      isSortOrderASCL ? "asc" : "desc",
      selectInstitutionVal,
      searchTerm
    );
  };
  const {
    register,
    // handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    watch,
  } = useForm<EntitySearchCriteria>({
    // mode: "onChange",
    // resolver: yupResolver(
    //   entityIdDisabled ? validations.entityUpdateValidations : validations.entityValidations
    // ),
  });
  const entityLevelId = watch("entityLevelId");
  const entityStatus = watch("entityStatus");
  const businessTypeId = watch("businessTypeId");

  const onSearch = async (
    pageNo: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    instId: string |null,
    search: string,
  ) => {
    const model = new EntitySearchCriteria();

    model.institutionId = instId;
    model.search = getValues("search") !== "" ? getValues("search") : null;
    model.pageNo = pageNo;
    model.pageSize = pageSize;
    model.parentId= getValues("parentId")!="" ? getValues("parentId"):null;
    model.businessTypeId= getValues("businessTypeId")!="" ? getValues("businessTypeId"):null;
    model.mccId= getValues("mccId")!="" ? getValues("mccId"):null;
    model.entityStatus=getValues("entityStatus")!="" ? getValues("entityStatus"):null;
    model.entityId= getValues("entityId")!="" ? getValues("entityId"):null;
    model.fromDate= getValues("fromDate")!="" ? getValues("fromDate") : null;
    model.toDate= getValues("toDate")!="" ? getValues("toDate"):null;
    model.entityLevelId=getValues("entityLevelId")!="" ? getValues("entityLevelId") :null ;
    model.entityName= getValues("entityName")!="" ? getValues("entityName") : null;
    model.hotMerchantFlag= getValues("hotMerchantFlagBoolean") ? 'Y' :'N';
    if (sortColumn && sortOrder) {
      model.sort = [{ column: sortColumn, sortOrder: sortOrder.toUpperCase() }];
    } else {
      setCurrentSortColumn("ENTITY_NAME");
      setIsSortOrderASC(true);
      model.sort = [{ column: 'ENTITY_NAME', sortOrder: 'ASC' }];
    }
    EntityService.searchCriteria(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if (res.data.totalRecords > 0) {
            setTotalRecords(res.data.totalRecords);
            setEntityList([...res.data.data]);
          } else {
            setEntityList([]);
          }
        } else {
          setEntityList([]);
        }
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const {
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onChange"
  })

const exportToExcel = async () => {
  try {
    toast.info("Generating Excel file...");

    const model = new EntitySearchCriteria();
    model.institutionId = getValues("institutionId");
    model.search = getValues("search") !== "" ? getValues("search") : null;
    model.pageNo = 0;
    model.pageSize = totalRecords; // Fetch all records
    model.parentId = getValues("parentId") !== "" ? getValues("parentId") : null;
    model.businessTypeId = getValues("businessTypeId") !== "" ? getValues("businessTypeId") : null;
    model.mccId = getValues("mccId") !== "" ? getValues("mccId") : null;
    model.entityStatus = getValues("entityStatus") !== "" ? getValues("entityStatus") : null;
    model.entityId = getValues("entityId") !== "" ? getValues("entityId") : null;
    model.fromDate = getValues("fromDate") !== "" ? getValues("fromDate") : null;
    model.toDate = getValues("toDate") !== "" ? getValues("toDate") : null;
    model.entityLevelId = getValues("entityLevelId") !== "" ? getValues("entityLevelId") : null;
    model.entityName = getValues("entityName") !== "" ? getValues("entityName") : null;
    model.hotMerchantFlag = getValues("hotMerchantFlagBoolean") ? 'Y' : 'N';
    
    if (currentSortColumn && isSortOrderASC !== undefined) {
      model.sort = [{ column: currentSortColumn, sortOrder: isSortOrderASC ? 'ASC' : 'DESC' }];
    }

    const res = await EntityService.searchCriteria(model);

    if (res.status === StatusCode.Success && res.data.data.length > 0) {
      const allData = res.data.data;

      const excelData = allData.map((row: any) => ({
        [intl.formatMessage({ id: "Entity.label.entityId", defaultMessage: "Entity Id" })]: row.entityId,
        [intl.formatMessage({ id: "Entity.label.entityName", defaultMessage: "Entity Name" })]: row.entityName,
        [intl.formatMessage({ id: "Entity.label.DBAName", defaultMessage: "DBA Name" })]: row.dbaName,
        [intl.formatMessage({ id: "Entity.label.businessType", defaultMessage: "Business Type" })]: row.businessTypeCodeDescription,
        [intl.formatMessage({ id: "Entity.label.entityLevel", defaultMessage: "Entity Level" })]: row.typeDescription,
        [intl.formatMessage({ id: "Entity.label.parent", defaultMessage: "Parent" })]: row.parentName,
        [intl.formatMessage({ id: "Entity.label.bankCode", defaultMessage: "Bank Code" })]: row.bankCodeName,
        [intl.formatMessage({ id: "Entity.label.contractDate", defaultMessage: "Contract Date" })]: row.contractDate || "",
        [intl.formatMessage({ id: "Entity.label.status", defaultMessage: "Status" })]: 
          row.entityStatus === "P" ? "Production" : row.entityStatus === "T" ? "Testing" : "Pilot",
        [intl.formatMessage({ id: "Entity.label.onHold", defaultMessage: "On Hold" })]: row.onHoldInd,
        [intl.formatMessage({ id: "Entity.label.hot", defaultMessage: "Hot" })]: row.hotMerchantFlag,
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Entities");

      const maxWidth = 100;
      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.min(
          Math.max(
            key.length,
            ...excelData.map(row => String(row[key] || '').length)
          ),
          maxWidth
        )
      }));
      ws['!cols'] = colWidths;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `Entities_Export_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);
      toast.success(`Excel file exported successfully: ${allData.length} records`);
    } else {
      toast.warning("No data to export");
    }
  } catch (err: any) {
    console.error("Export to Excel error:", err);
    toast.error(err.response?.data?.errors?.[0] || "Failed to export to Excel");
  }
};

const exportToPDF = async () => {
  try {
    toast.info("Generating PDF file...");

    const model = new EntitySearchCriteria();
    model.institutionId = getValues("institutionId");
    model.search = getValues("search") !== "" ? getValues("search") : null;
    model.pageNo = 0;
    model.pageSize = totalRecords; 
    model.parentId = getValues("parentId") !== "" ? getValues("parentId") : null;
    model.businessTypeId = getValues("businessTypeId") !== "" ? getValues("businessTypeId") : null;
    model.mccId = getValues("mccId") !== "" ? getValues("mccId") : null;
    model.entityStatus = getValues("entityStatus") !== "" ? getValues("entityStatus") : null;
    model.entityId = getValues("entityId") !== "" ? getValues("entityId") : null;
    model.fromDate = getValues("fromDate") !== "" ? getValues("fromDate") : null;
    model.toDate = getValues("toDate") !== "" ? getValues("toDate") : null;
    model.entityLevelId = getValues("entityLevelId") !== "" ? getValues("entityLevelId") : null;
    model.entityName = getValues("entityName") !== "" ? getValues("entityName") : null;
    model.hotMerchantFlag = getValues("hotMerchantFlagBoolean") ? 'Y' : 'N';
    
    if (currentSortColumn && isSortOrderASC !== undefined) {
      model.sort = [{ column: currentSortColumn, sortOrder: isSortOrderASC ? 'ASC' : 'DESC' }];
    }

    const res = await EntityService.searchCriteria(model);

    if (res.status === StatusCode.Success && res.data.data.length > 0) {
      const allData = res.data.data;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFontSize(16);
      doc.text('Entities Report', 14, 15);

      doc.setFontSize(10);
      doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Records: ${allData.length}`, 14, 27);
      const tableHeaders = [
        intl.formatMessage({ id: "Entity.label.entityId", defaultMessage: "Entity Id" }),
        intl.formatMessage({ id: "Entity.label.entityName", defaultMessage: "Entity Name" }),
        intl.formatMessage({ id: "Entity.label.DBAName", defaultMessage: "DBA Name" }),
        intl.formatMessage({ id: "Entity.label.businessType", defaultMessage: "Business Type" }),
        intl.formatMessage({ id: "Entity.label.entityLevel", defaultMessage: "Entity Level" }),
        intl.formatMessage({ id: "Entity.label.parent", defaultMessage: "Parent" }),
        intl.formatMessage({ id: "Entity.label.bankCode", defaultMessage: "Bank Code" }),
        intl.formatMessage({ id: "Entity.label.contractDate", defaultMessage: "Contract Date" }),
        intl.formatMessage({ id: "Entity.label.status", defaultMessage: "Status" }),
        intl.formatMessage({ id: "Entity.label.onHold", defaultMessage: "On Hold" }),
        intl.formatMessage({ id: "Entity.label.hot", defaultMessage: "Hot" }),
      ];

      const tableData = allData.map((row: any) => [
        row.entityId,
        row.entityName,
        row.dbaName,
        row.businessTypeCodeDescription,
        row.typeDescription,
        row.parentName,
        row.bankCodeName,
        row.contractDate || "",
        row.entityStatus === "P" ? "Production" : row.entityStatus === "T" ? "Testing" : "Pilot",
        row.onHoldInd,
        row.hotMerchantFlag,
      ]);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 32,
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [66, 66, 66], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 32, left: 14, right: 14 },
        didDrawPage: (data: any) => {
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `Entities_Export_${timestamp}.pdf`;
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


  return (
    <>
      <div className="wrapper">
        <main className="main-content" >
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  {intl.formatMessage({
                    id: "Entity.entities",
                    defaultMessage: "Entities",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Entity.subTitle",
                    defaultMessage: "List of defined Entities",
                  })}
                </p>
              </div>
              <div className="right-block">
                {/* <FormControl>
                  <InputBase placeholder={
                    intl.formatMessage({
                      id: "Entity.button.search",
                      defaultMessage: "Search"
                    })
                  }
                    onChange={handleSearchTermChange}
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearchBtnClick}>
                          <img src={search_ic} alt="lock" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl> */}
                <Button variant="contained"
                  disabled={!canUpdate}
                  disableElevation color="secondary"
                  className="btn-light"
                  endIcon={<img src={clone_ic}
                    alt="clone" />}
                  onClick={cloneModalOpen}
                >
                  <FormattedMessage
                    id="Entity.button.cloneEntity"
                    defaultMessage="Clone Entity"
                  />
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  onClick={() => navigate("/entities-definition", { state: { institutionId: selectInstitutionVal } })}
                  disabled={!canAdd}
                >
                  <FormattedMessage
                    id="Entity.button.addEntity"
                    defaultMessage="Add Entity"
                  />
                </Button>
              </div>
            </div>
<form onSubmit={handleSubmit(onSubmitSearch)}>
<Grid spacing={3} container>
  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.institution",
          defaultMessage: "Institution"
        })}
      </label>
      <FormControl fullWidth>
        <Select
                      value={selectInstitutionVal}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
          IconComponent={() => <img src={down_arrow_icon} alt="" />}
          {...register("institutionId")}
          onChange={handleInstitutionChange}
          defaultValue={getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) || selectInstitutionVal}
        >
          {/* <MenuItem value="">
            <em>Select Institution</em>
          </MenuItem> */}
          {institution &&
            institution.length > 0 &&
            institution.map((type) => {
              return (
                <MenuItem
                  key={type.institutionId}
                  value={type.institutionId}
                >
                  {type.institutionName}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.parent",
          defaultMessage: "Parent"
        })}
      </label>
      <FormControl fullWidth>
      <InputBase
        fullWidth
        {...register("parentId")}
        placeholder={intl.formatMessage({
          id: "Entity.placeholder.parent",
          defaultMessage: "Enter Parent"
        })}
          inputProps={{ maxLength: 30 }}

      />
      </FormControl>
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.businessType",
          defaultMessage: "Business Type"
        })}
      </label>
      <FormControl fullWidth>
        <Select
          displayEmpty
        value={businessTypeId ?? ""}
          IconComponent={() => (
            <img src={down_arrow_icon} alt="" />
          )}
          defaultValue=""
          {...register("businessTypeId")}
        >
          <MenuItem value="">
            <em>Select Business Type</em>
          </MenuItem>
          {businessTypeList &&
            businessTypeList.length > 0 &&
            businessTypeList.map((type) => {
              return (
                <MenuItem
                  value={type.systemCodeId}
                  key={type.systemCodeId}
                >
                  {type.description}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.mcc",
          defaultMessage: "MCC"
        })}
      </label>
      <FormControl fullWidth>
        <Controller
          name="mccId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <ReactSelect
              {...field}
              filterOption={createFilter({
                matchFrom: "any",
                stringify: (option) => `${option.label}`,
              })}
              onChange={(e) => field.onChange(e?.value || "")}
              value={mccList.find(option => option.value === field.value) || null}
              options={mccList}
              isLoading={isLoading}
              placeholder="Select MCC"
              isClearable
            />
          )}
        />
        <FormHelperText id="error-helper-text" error>
          {mccErr !== "" ? mccErr : ""}
        </FormHelperText>
      </FormControl>
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.status",
          defaultMessage: "Status"
        })}
      </label>
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={entityStatus ?? ""}
          IconComponent={() => (
            <img src={down_arrow_icon} alt="" />
          )}
          placeholder={intl.formatMessage({
            id: "Entity.select",
            defaultMessage: "Select",
          })}
          {...register("entityStatus")}
          defaultValue=""
        >
          <MenuItem value="">
            <em>Select Status</em>
          </MenuItem>
          <MenuItem value={"D"} key={"D"}>
            Pilot
          </MenuItem>
          <MenuItem value={"T"} key={"T"}>
            Testing
          </MenuItem>
          <MenuItem value={"P"} key={"P"}>
            Production
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.entityId",
          defaultMessage: "Entity ID"
        })}
      </label>
      <InputBase
        fullWidth
        {...register("entityId")}
        placeholder={intl.formatMessage({
          id: "Entity.placeholder.entityId",
          defaultMessage: "Enter Entity ID"
        })}
          inputProps={{ maxLength: 30 }}

      />
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.fromDate",
          defaultMessage: "From Date"
        })}
      </label>
      <InputBase
        fullWidth
        type="date"
        {...register("fromDate")}
      />
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.toDate",
          defaultMessage: "To Date"
        })}
      </label>
      <InputBase
        fullWidth
        type="date"
        {...register("toDate")}
      />
    </div>
  </Grid>

  <Grid item xs={12} lg={4} sm={6} xl={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.entityLevel",
          defaultMessage: "Entity Level"
        })}
      </label>
      <FormControl fullWidth>
        <Select
          displayEmpty
            value={entityLevelId ?? ""}
          IconComponent={() => (
            <img src={down_arrow_icon} alt="" />
          )}
          placeholder={intl.formatMessage({
            id: "Entity.select",
            defaultMessage: "Select",
          })}
          defaultValue=""
          {...register("entityLevelId")}
        >
          <MenuItem value="">
            <em>Select Entity Level</em>
          </MenuItem>
          {entityLevels &&
            entityLevels.length > 0 &&
            entityLevels.map((item) => (
              <MenuItem
                value={item.entityLevelId}
                key={item.entityLevelId}
              >
                {item.hierarchyLevel} - {item.typeDescription}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  </Grid>

  {/* Entity Name */}
  <Grid item xs={12} md={4}>
    <div className="input-with-label form-group">
      <label>
        {intl.formatMessage({
          id: "Entity.label.entityName",
          defaultMessage: "Entity Name"
        })}
      </label>
      <InputBase
        fullWidth
        {...register("entityName")}
        placeholder={intl.formatMessage({
          id: "Entity.placeholder.entityName",
          defaultMessage: "Enter Entity Name"
        })}
        inputProps={{ maxLength: 50 }}
      />
    </div>
  </Grid>

  {/* Checkbox */}
  <Grid item xs={6} md={2}>
    <div className="input-with-label form-group">
      <Controller
        name="hotMerchantFlagBoolean"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={intl.formatMessage({
              id: "Entity.label.hotMerchantFlagBoolean",
              defaultMessage: "Hot-hold"
            })}
          />
        )}
      />
    </div>
  </Grid>

  {/* Buttons */}
  <Grid item xs={6} md={6}>
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        height: "100%"
      }}
    >
      <Button
        variant="contained"
        disableElevation
        color="secondary"
        className="btn-light"
        type="submit"
        endIcon={<img src={search_ic} alt="search" />}
        disabled={
          !canUpdate
        }
      >
        <FormattedMessage
          id="Entity.button.search"
          defaultMessage="Search"
        />
      </Button>

      <Button
        variant="outlined"
        disableElevation
        className="btn-light"
        onClick={clearFilters}
      >
        <FormattedMessage
          id="Entity.button.clear"
          defaultMessage="Clear"
        />
      </Button>

      <Button
        variant="outlined"
        disableElevation
        className="btn-light"
        onClick={exportToPDF}
        disabled={!entityList || entityList.length === 0}
      >
        <FormattedMessage
          id="Entity.button.exportpdf"
          defaultMessage="Export PDF"
        />
      </Button>

      <Button
        variant="outlined"
        disableElevation
        className="btn-light"
        onClick={exportToExcel}
        disabled={!entityList || entityList.length === 0}
      >
        <FormattedMessage
          id="Entity.button.exportexcel"
          defaultMessage="Export Excel"
        />
      </Button>
    </div>
  </Grid>

</Grid>
</form>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.entityId",
                          defaultMessage: "Entity Id",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "ENTITY_NAME"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("ENTITY_NAME")}
                      >
                        {
                          intl.formatMessage({
                            id: "Entity.label.entityName",
                            defaultMessage: "Entity Name"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {isSortOrderASC
                            ? "sorted ascending"
                            : "sorted descending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={currentSortColumn === "DBA_NAME"}
                        direction={isSortOrderASC ? "asc" : "desc"}
                        onClick={() => createSortHandler("DBA_NAME")}
                      > {
                          intl.formatMessage({
                            id: "Entity.label.DBAName",
                            defaultMessage: "DBA Name"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {isSortOrderASC
                            ? "sorted ascending"
                            : "sorted descending"}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.businessType",
                          defaultMessage: "Business Type"
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.entityLevel",
                          defaultMessage: "Entity Level",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.parent",
                          defaultMessage: "Parent",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.bankCode",
                          defaultMessage: "Bank Code",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.contractDate",
                          defaultMessage: "Contract Date",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.status",
                          defaultMessage: "Status",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.onHold",
                          defaultMessage: "On Hold",
                        })
                      }
                    </TableCell>
                    <TableCell>
                      {
                        intl.formatMessage({
                          id: "Entity.label.hot",
                          defaultMessage: "Hot",
                        })
                      }
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {
                        intl.formatMessage({
                          id: "Entity.label.actions",
                          defaultMessage: "Actions",
                        })
                      }
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entityList && entityList.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>{row.entityId}</TableCell>
                      <TableCell>{row.entityName}</TableCell>
                      <TableCell>{row.dbaName}</TableCell>
                      <TableCell>{row.businessTypeCodeDescription}</TableCell>
                      <TableCell>{row.typeDescription}</TableCell>
                      <TableCell>{row.parentName}</TableCell>
                      <TableCell>{row.bankCodeName}</TableCell>
                      <TableCell>

                        {row.contractDate ?
                          row.contractDate
                          : ""}
                      </TableCell>
                      <TableCell>{row.entityStatus === "P" ? "Production" : row.entityStatus === "T" ? "Testing" : "Pilot"}</TableCell>
                      <TableCell>{row.onHoldInd}</TableCell>
                      <TableCell>{row.hotMerchantFlag}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
                        <div className="action btns-block">
                        <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => onSubmitCloneEntity(row.entityId)}
                            disabled={!canUpdate}
                          >
                            <img src={clone_ic} alt="clone" />
                          </IconButton>
                          <Switch
                            className="custom"
                            checked={row.status === "1" ? true : false}
                            onChange={(e) =>
                              changeStatus(row.entityId, e)
                            }
                            disabled={!canUpdate}
                          />
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => editEntity(row.entityId)}
                            disabled={!canUpdate}
                          >
                            <img src={edit_ic} alt="edit" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => onDelete(row.entityId)}
                            disabled={!canDelete}
                          >
                            <img src={delete_ic} alt="delete" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {entityList &&
                    entityList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "Entity.noDataFound",
                              defaultMessage: "No Data Found",
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
        </main >
        <Dialog open={openCloneModal} onClose={cloneModalClose} className="c-dialog sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle component={"div"}>
              <div className="title-block mb-0">
                <div className="left-block mb-0">
                  <Typography variant={"h2"}>
                    {intl.formatMessage({
                      id: "Entity.button.cloneEntity",
                      defaultMessage: "Clone Entity",
                    })}
                  </Typography>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="inner-card">
                <Grid spacing={3} container>
                  <Grid item xs={12}>
                    <div className="input-with-label">
                      <label>
                        {intl.formatMessage({
                          id: "Entity.label.entityName",
                          defaultMessage: "Entity name",
                        })}</label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder={
                            intl.formatMessage({
                              id: "Entity.select",
                              defaultMessage: "Select"
                            })
                          }
                          onChange={handleEntityChange}
                        >
                          <MenuItem value="">
                            <em>
                              {
                                intl.formatMessage({
                                  id: "Entity.select",
                                  defaultMessage: "Select"
                                })
                              }
                            </em>
                          </MenuItem>
                          {
                            ActiveEntityList && ActiveEntityList.length > 0 &&
                            ActiveEntityList.map(entity => (
                              <MenuItem value={entity.entityId} key={entity.entityId}>{entity.entityName}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions className="btns-block right">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                onClick={cloneModalClose}
              >

                {intl.formatMessage({
                  id: "Entity.button.cancel",
                  defaultMessage: "Cancel",
                })}
              </Button>
              <Button disableElevation variant="contained" type="submit" disabled={isSubmitting}>
                {intl.formatMessage({
                  id: "Entity.button.save",
                  defaultMessage: "Save",
                })}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div >
    </>
  );
}

export default EntitiesListing;
function getValues(arg0: string) {
  throw new Error("Function not implemented.");
}

function register(arg0: string): JSX.IntrinsicAttributes & import("@mui/material").SelectProps<unknown> {
  throw new Error("Function not implemented.");
}

