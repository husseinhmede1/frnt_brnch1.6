import { down_arrow_icon, saveIcon, ic_check, ic_checked } from "../../assets/images";
import LayoutSection from "../../components/LayoutSection";
import { RootState } from "../../feature/store";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FileElementResponseModel,
  FileLayoutModel,
  InputOutputLayoutModel,
  LayoutModel,
  layoutDetailsResponseModel,
} from "../../models/configuration/fileLayoutModel";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  FileLayoutService,
  LayoutService,
} from "../../services/configuration/file-layout-service";
import {
  CustomeComparator,
  CustomeComparatorNumber,
  getValues,
} from "../../utils/commonfunction";
import { StatusCode, fileLayoutSectionType, fileFormatList, InOut, CardActivities } from "../../utils/constant";
import validations from "../../utils/validations";
import { CheckboxSelectionComponent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./NewFileLayout.css";

function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

function ExpandMoreIcon() {
  return (
    <div className="accordion-icon">
      <img src={down_arrow_icon} alt="arrow" />
    </div>
  );
}

function CheckboxIcon() {
  return <img src={ic_check} alt="checkbox" />;
}

function CheckedboxIcon() {
  return <img src={ic_checked} alt="checkbox" />;
}


const AddEditFileLayout = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { layoutId } = useParams<{ layoutId?: string }>();
  const gridRef = React.useRef<AgGridReact>(null);
  const gridRefBody = React.useRef<AgGridReact>(null);
  const gridRefFooter = React.useRef<AgGridReact>(null);
  const user = localStorage.getItem("user");
  const [fileId, setFileId] = React.useState<string>(" ");
  const [filenameList, setFilenameList] = React.useState<InputOutputLayoutModel[]>([]);
  const [elementList, setElementList] = React.useState<
    FileElementResponseModel[]
  >([]);
  const [layoutFormat, setLayoutFormat] = React.useState<string>(" ");
  const [layoutSeparator, setLayoutSeparator] = React.useState<string>("");

  useEffect(() => {
    FileLayoutService.getallActiveFiles()
      .then((res) => {
        if (res.status === StatusCode.Success && res.data?.length > 0) {
          setFilenameList([...res.data]);
        } else {
          setFilenameList([]);
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
        setFilenameList([]);
      });
  }, []);

  const [headerlayoutEleList, setHeaderLayoutEleList] = React.useState<
    layoutDetailsResponseModel[]
  >([]);
  const headerLayoutEleListRef =
    React.useRef<layoutDetailsResponseModel[]>(headerlayoutEleList);

  const [deletedElements, setDeletedElements] = React.useState<
    layoutDetailsResponseModel[]
  >([]);

  const [deletedBodyElements, setDeletedBodyElements] = React.useState<
    layoutDetailsResponseModel[]
  >([]);

  const [deletedFooterElements, setDeletedFooterElements] = React.useState<
    layoutDetailsResponseModel[]
  >([]);
  const [includesHeader, setIncludesHeader] = useState<boolean>(false);
  const handleIncludesHeader = (value: any) => {
    setIncludesHeader(!includesHeader);
  }

  const handlePadding = (event: SelectChangeEvent, params: any) => {
    let newEleList = [...headerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingType = event.target.value;
    headerLayoutEleListRef.current = newEleList;
  };

  const handlePaddingValue = (event: any, params: any) => {
    let newEleList = [...headerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingValue = event.target.value;
    headerLayoutEleListRef.current = newEleList;
  };

  const handleElementLength = (event: any, params: any) => {
    let newEleList = [...headerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementLength = event.target.value;
    headerLayoutEleListRef.current = newEleList;
  };

  const handleAddEle = (layoutEle: FileElementResponseModel) => {
    if (layoutEle.isRepeated === "1" || !headerlayoutEleList.find(body => body.elementId === layoutEle.elementId)) {
      let newLayout = headerLayoutEleListRef.current;
      newLayout.push({
        detailsFlag: "",
        detailsId: 0,
        elementId: layoutEle.elementId,
        elementName: layoutEle.elementName,
        elementLength: 0,
        elementOrder: newLayout.length === 0 ? 1 : newLayout.length,
        elementParentId: layoutEle?.elementParentId,
        elementParentName: "",
        elementSection: layoutEle?.elementSection,
        elementPaddingType: " ",
        elementPaddingValue: "",
        validationFormat: layoutEle?.validationFormat,
        validationLength: layoutEle?.validationLength,
        validationRequired: layoutEle?.validationRequired,
      });

      setHeaderLayoutEleList([...newLayout]);
      headerLayoutEleListRef.current = [...newLayout];
    }
  };

  const onDeleteEle = (
    layoutEle: layoutDetailsResponseModel,
    index: number
  ) => {
    let newLayout = headerLayoutEleListRef.current;
    let deletedElement = newLayout.splice(index, 1)[0];
    setHeaderLayoutEleList(newLayout);
    headerLayoutEleListRef.current = [...newLayout];
    deletedElement = {
      ...deletedElement,
      detailsFlag: "D",
    };
    setDeletedElements((prevDeletedElements) => [
      ...prevDeletedElements,
      deletedElement,
    ]);
  };

  const [bodylayoutEleList, setBodyLayoutEleList] = React.useState<
    layoutDetailsResponseModel[]
  >([]);
  const [bodylayoutElePrevList, setBodyLayoutElePrevList] = React.useState<
    layoutDetailsResponseModel[]
  >([]);
  const bodyLayoutEleListRef =
    React.useRef<layoutDetailsResponseModel[]>(bodylayoutEleList);

  const handleBodyPadding = (event: SelectChangeEvent, params: any) => {
    let newEleList = [...bodyLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingType = event.target.value;
    bodyLayoutEleListRef.current = newEleList;

  };

  const handleBodyPaddingValue = (event: any, params: any) => {
    let newEleList = [...bodyLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingValue = event.target.value;
    bodyLayoutEleListRef.current = newEleList;
  };

  const handleBodyElementLength = (event: any, params: any) => {
    let newEleList = [...bodyLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementLength = event.target.value;
    bodyLayoutEleListRef.current = newEleList;
  };

  const handleBodyAddEle = (layoutEle: FileElementResponseModel) => {
    console.log("sasa", layoutEle);
    console.log("bodylayoutEleList", bodylayoutEleList);
    
    if (layoutEle.isRepeated === "1" || !bodylayoutEleList.find(body => body.elementId === layoutEle.elementId)) {
      console.log("bodyLayoutEleListRef", bodyLayoutEleListRef.current);
      
      let newLayout = bodyLayoutEleListRef.current;
      newLayout.push({
        detailsFlag: "",
        detailsId: 0,
        elementId: layoutEle.elementId,
        elementName: layoutEle.elementName,
        elementLength: 0,
        elementOrder: newLayout.length === 0 ? 1 : newLayout.length,
        elementParentId: layoutEle?.elementParentId,
        elementParentName: "",
        elementSection: layoutEle?.elementSection,
        elementPaddingType: " ",
        elementPaddingValue: "",
        validationFormat: layoutEle?.validationFormat,
        validationLength: layoutEle?.validationLength,
        validationRequired: layoutEle?.validationRequired,
      });
      console.log("newLayout", newLayout);
      
      setBodyLayoutEleList([...newLayout]);
      bodyLayoutEleListRef.current = [...newLayout];
    }
  };

  useEffect(() => {
    if (((filenameList?.length > 0 && fileId != " ") ? filenameList.find((fileName) => fileName.fileId?.toString() === fileId?.toString())?.fileTypeCode : fileLayoutPrevData?.fileResponseDto.fileTypeCode ? fileLayoutPrevData?.fileResponseDto?.fileTypeCode : "") === "Input") {
      let newEleList = [...bodyLayoutEleListRef.current];
      newEleList.forEach(element => {
        element.elementLength = 0;
        element.elementPaddingValue = '';
        element.elementPaddingType = '';
      });
      bodyLayoutEleListRef.current = newEleList;
    }
  }, [bodyLayoutEleListRef.current])

  const onDeleteBodyEle = (
    layoutEle: layoutDetailsResponseModel,
    index: number
  ) => {
    let newLayout = bodyLayoutEleListRef.current;
    let isLastRecord = false;
    let deletedBodyElement = newLayout.splice(index, 1)[0];
    setBodyLayoutEleList(newLayout);
    bodyLayoutEleListRef.current = [...newLayout];
    deletedBodyElement = {
      ...deletedBodyElement,
      detailsFlag: "D",
    };
    setDeletedBodyElements((prevDeletedElements) => [
      ...prevDeletedElements,
      deletedBodyElement,
    ]);

    if (isLastRecord) {
      let deletedBodyElement = newLayout.splice(newLayout.indexOf(newLayout.find(l => l.elementName === 'LIST_OF_DEBIT_ACCOUNTS')!), 1)[0];
      setBodyLayoutEleList(newLayout);
      bodyLayoutEleListRef.current = [...newLayout];
      deletedBodyElement = {
        ...deletedBodyElement,
        detailsFlag: "D",
      };
      setDeletedBodyElements((prevDeletedElements) => [
        ...prevDeletedElements,
        deletedBodyElement,
      ]);
    }
  };

  const [footerlayoutEleList, setFooterLayoutEleList] = React.useState<
    layoutDetailsResponseModel[]
  >([]);
  const footerLayoutEleListRef =
    React.useRef<layoutDetailsResponseModel[]>(footerlayoutEleList);
  const handleFooterPadding = (event: SelectChangeEvent, params: any) => {
    let newEleList = [...footerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingType = event.target.value;
    footerLayoutEleListRef.current = newEleList;
  };

  const handleFooterPaddingValue = (event: any, params: any) => {
    let newEleList = [...footerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementPaddingValue = event.target.value;
    footerLayoutEleListRef.current = newEleList;
  };

  const handleFooterElementLength = (event: any, params: any) => {
    let newEleList = [...footerLayoutEleListRef.current];
    newEleList[params.node.rowIndex].elementLength = event.target.value;
    footerLayoutEleListRef.current = newEleList;
  };

  const handleFooterAddEle = (layoutEle: FileElementResponseModel) => {
    if (layoutEle.isRepeated === "1" || !footerlayoutEleList.find(body => body.elementId === layoutEle.elementId)) {
      let newLayout = footerLayoutEleListRef.current;
      newLayout.push({
        detailsFlag: "",
        detailsId: 0,
        elementId: layoutEle.elementId,
        elementName: layoutEle.elementName,
        elementLength: 0,
        elementOrder: newLayout.length === 0 ? 1 : newLayout.length,
        elementParentId: layoutEle?.elementParentId,
        elementParentName: "",
        elementSection: layoutEle?.elementSection,
        elementPaddingType: " ",
        elementPaddingValue: "",
        validationFormat: layoutEle?.validationFormat,
        validationLength: layoutEle?.validationLength,
        validationRequired: layoutEle?.validationRequired,
      });

      setFooterLayoutEleList([...newLayout]);
      footerLayoutEleListRef.current = [...newLayout];
    }
  };

  const onDeleteFooterEle = (
    layoutEle: layoutDetailsResponseModel,
    index: number
  ) => {
    let newLayout = footerLayoutEleListRef.current;
    let deletedFooterElement = newLayout.splice(index, 1)[0];
    setFooterLayoutEleList(newLayout);
    footerLayoutEleListRef.current = [...newLayout];
    deletedFooterElement = {
      ...deletedFooterElement,
      detailsFlag: "D",
    };
    setDeletedFooterElements((prevDeletedElements) => [
      ...prevDeletedElements,
      deletedFooterElement,
    ]);
  };

  const [formsubmit, setFormsubmit] = React.useState<boolean>(false);
  const [fileLayoutPrevData, setFileLayoutPrevData] =
    React.useState<LayoutModel>();

  const selectedFileName = React.useMemo(() => {
    return (filenameList?.length > 0 && fileId !== " ")
      ? filenameList.find((fileName) => fileName.fileId?.toString() === fileId?.toString())?.fileName ?? ""
      : fileLayoutPrevData?.fileResponseDto?.fileName ?? "";
  }, [filenameList, fileId, fileLayoutPrevData]);

  const isApplyKycFile = selectedFileName === CardActivities.ApplyKYC;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues: getFileLayoutData,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LayoutModel>({
    mode: "all",
    resolver: yupResolver((((filenameList?.length > 0 && fileId != " ") && filenameList.find((fileName) => fileName.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
      (fileLayoutPrevData?.fileResponseDto?.fileTypeCode && fileLayoutPrevData?.fileResponseDto?.fileTypeCode === "Input")) ? validations.addFileLayoutValidations : validations.addFileLayoutValidationsOutput),
  });


  useEffect(() => {
    console.log(layoutId, "layoutId");
    
    if (layoutId) {
      console.log("layoutId1", layoutId);
      
      FileLayoutById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutId, reset]);

  const FileLayoutById = (
    fileLayoutId: number | string = layoutId as string,
    isUpdate: boolean = false
  ) => {

    LayoutService.getLayoutbyID(Number(fileLayoutId))
      .then((res) => {
        if (res.status === StatusCode.Success) {
          reset(res.data);
          setFileId(res.data?.fileResponseDto?.fileId?.toString());
          setIncludesHeader(res.data?.includesHeader);
          setLayoutSeparator(res.data?.layoutSeparator);
          setValue("layoutSeparator", res.data?.layoutSeparator)
          setLayoutFormat(res.data?.layoutFormat);
          setValue("layoutFormat", res.data?.layoutFormat)
          getElementList(
            res.data?.fileResponseDto?.fileId?.toString(),
            res.data.listLayoutDetailsResponse
          );
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  const getElementList = (
    fileId: string,
    listLayoutDetailsResponse: layoutDetailsResponseModel[] | any = []
  ) => {
    if (fileId?.trim()) {
      FileLayoutService.getAllelementsbyFileID(Number(fileId))
        .then((res) => {
          if (
            res.status === StatusCode.Success &&
            res.data?.fileElementResponseDto?.length > 0
          ) {
            setElementList([...res.data.fileElementResponseDto]);
          } else {
            setElementList([]);
          }
        })
        .catch((err) => {
          err?.response?.data?.errors?.map((e: string) => toast.error(e));
          setElementList([]);
        });
    }
    if (listLayoutDetailsResponse?.length > 0) {
      setHeaderLayoutEleList(
        listLayoutDetailsResponse
          ?.filter((data: any) =>
            isElementSectionMatch(data.elementSection, fileLayoutSectionType.Header)
          )
          ?.sort((item1: any, item2: any): any => {
            if (item1?.elementOrder && item2?.elementOrder) {
              return item1?.elementOrder - item2?.elementOrder;
            }
          }) as any
      );
      headerLayoutEleListRef.current = listLayoutDetailsResponse
        ?.filter((data: any) =>
          isElementSectionMatch(data.elementSection, fileLayoutSectionType.Header)
        )
        ?.sort((item1: any, item2: any): any => {
          if (item1?.elementOrder && item2?.elementOrder) {
            return item1?.elementOrder - item2?.elementOrder;
          }
        }) as any;
      setBodyLayoutEleList(
        listLayoutDetailsResponse
          ?.filter((data: any) =>
            isElementSectionMatch(data.elementSection, fileLayoutSectionType.Body)
          )
          ?.sort((item1: any, item2: any): any => {
            if (item1?.elementOrder && item2?.elementOrder) {
              return item1?.elementOrder - item2?.elementOrder;
            }
          }) as any
      );
      bodyLayoutEleListRef.current = listLayoutDetailsResponse
        ?.filter((data: any) =>
          isElementSectionMatch(data.elementSection, fileLayoutSectionType.Body)
        )
        ?.sort((item1: any, item2: any): any => {
          if (item1?.elementOrder && item2?.elementOrder) {
            return item1?.elementOrder - item2?.elementOrder;
          }
        }) as any;
      setFooterLayoutEleList(
        listLayoutDetailsResponse
          ?.filter((data: any) =>
            isElementSectionMatch(data.elementSection, fileLayoutSectionType.Footer)
          )
          ?.sort((item1: any, item2: any): any => {
            if (item1?.elementOrder && item2?.elementOrder) {
              return item1?.elementOrder - item2?.elementOrder;
            }
          }) as any
      );
      footerLayoutEleListRef.current = listLayoutDetailsResponse
        ?.filter((data: any) =>
          isElementSectionMatch(data.elementSection, fileLayoutSectionType.Footer)
        )
        ?.sort((item1: any, item2: any): any => {
          if (item1?.elementOrder && item2?.elementOrder) {
            return item1?.elementOrder - item2?.elementOrder;
          }
        }) as any;
    } else {
      setHeaderLayoutEleList([]);
      setBodyLayoutEleList([]);
      setFooterLayoutEleList([]);
      headerLayoutEleListRef.current = [];
      bodyLayoutEleListRef.current = [];
      footerLayoutEleListRef.current = [];
    }
  };

  const isElementSectionMatch = (section?: string, targetSection?: string) => {
    if (!section || !targetSection) return false;
    const normalized = section.trim().toUpperCase();
    if (normalized === targetSection) return true;
    if (targetSection === fileLayoutSectionType.Body && /^[0-9]+$/.test(normalized)) {
      return true;
    }
    return false;
  };

  const [headerData, setHeaderData] =
    React.useState<layoutDetailsResponseModel[]>();
  const [bodyData, setBodyData] =
    React.useState<layoutDetailsResponseModel[]>();
  const [footerData, setFooterData] =
    React.useState<layoutDetailsResponseModel[]>();

  const getKycGroupSuffix = (elementName?: string) => {
    if (!elementName) return undefined;
    if (elementName.startsWith("CUST_CH_")) return elementName.slice("CUST_CH_".length);
    if (elementName.startsWith("CUSTOMER_")) return elementName.slice("CUSTOMER_".length);
    if (elementName.startsWith("CARD_")) return elementName.slice("CARD_".length);
    return undefined;
  };

  const getKycEquivalentNames = (elementName?: string) => {
    const suffix = getKycGroupSuffix(elementName);
    if (!suffix) return elementName ? [elementName] : [];
    const equivalents = [`CUST_CH_${suffix}`, `CUSTOMER_${suffix}`, `CARD_${suffix}`];
    // Special case: include "GENDER" for CUSTOMER_GENDER equivalents
    if (suffix === "GENDER") {
      equivalents[1] = "GENDER"; // Replace CUSTOMER_GENDER with GENDER
    }
    return equivalents;
  };

  const thereMandatoryFieldNotSelectedSection = (
    elementListParams: FileElementResponseModel[],
    layoutEleListRefParams: layoutDetailsResponseModel[],
    sectionType: string
  ) => {
    const layoutIds = new Set(layoutEleListRefParams.map((item) => item.elementId));
    const sectionElements = elementListParams.filter((element) =>
      isElementSectionMatch(element.elementSection, sectionType)
    );
    const filteredElements = sectionElements.filter(
      (element) => !layoutIds.has(element.elementId)
    );
    const layoutNames = new Set(
      layoutEleListRefParams.map((item) => item.elementName)
    );

    return filteredElements.some((filter) => {
      if (filter.isMandatory !== "1") return false;
      if (
        isApplyKycFile &&
        sectionType === fileLayoutSectionType.Body &&
        getKycGroupSuffix(filter.elementName)
      ) {
        const equivalentNames = getKycEquivalentNames(filter.elementName);
        return !equivalentNames.some((name) => layoutNames.has(name));
      }
      return true;
    });
  };

  const thereMandatoryFieldNotSelected = (
    elementListParams: FileElementResponseModel[],
    l1: layoutDetailsResponseModel[],
    l2: layoutDetailsResponseModel[],
    l3: layoutDetailsResponseModel[]
  ) => {
    return (
      thereMandatoryFieldNotSelectedSection(
        elementListParams,
        l1,
        fileLayoutSectionType.Header
      ) &&
      thereMandatoryFieldNotSelectedSection(
        elementListParams,
        l2,
        fileLayoutSectionType.Body
      ) &&
      thereMandatoryFieldNotSelectedSection(
        elementListParams,
        l3,
        fileLayoutSectionType.Footer
      )
    );
  };

  const onSubmit = (values: LayoutModel) => {
    let headerLayoutDetail: any[] = [];
    let bodyLayoutDetail: any[] = [];
    let footerLayoutDetail: any[] = [];

    const createDateElementId = elementList.find(
      (data: FileElementResponseModel) => data.elementName === "CREATED_DATE"
    )?.elementId;

    const systemDateElementId = elementList.find(
      (data: FileElementResponseModel) => data.elementName === "SYSTEM_DATE"
    )?.elementId;

    setHeaderLayoutEleList([...headerLayoutEleListRef?.current]);


    if ((((filenameList?.length > 0 && fileId != " ") && filenameList.find((fileName) => fileName.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
      (fileLayoutPrevData?.fileResponseDto?.fileTypeCode && fileLayoutPrevData.fileResponseDto?.fileTypeCode === "Input"))) {
      if (!values.layoutSeparator) {
        toast.error("Please Select All Mandatory Fileds")
        return;
      }
    } else {
      if (bodyLayoutEleListRef.current.find(body => ((body.elementPaddingType?.trim() != "") && (body.elementPaddingValue === "")))) {
        return;
      }
      if (bodyLayoutEleListRef.current.find(body => ((body.elementPaddingType?.trim() == "") && (body.elementPaddingValue != "")))) {
        return;
      }

    }


    if (thereMandatoryFieldNotSelected(elementList, headerLayoutEleListRef?.current, bodyLayoutEleListRef?.current, footerLayoutEleListRef?.current)) {
      toast.error("Please Select All Mandatory Elements")
      return;
    }

    headerLayoutEleListRef?.current?.forEach((row, i) => {
      headerLayoutDetail.push({
        detailsFlag: row.detailsId !== 0 ? "U" : "A",
        detailsId: row.detailsId ?? 0,
        elementId: row.elementId,
        elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
          "1" : row.elementLength ?? 0,
        elementOrder: i + 1,
        elementParentId: 0,
        elementSection: fileLayoutSectionType.Header,
        paddingType: row.elementPaddingType?.trim(),
        paddingValue: row.elementPaddingValue,
        validationFormat: row.validationFormat,
        validationLength: row.validationLength,
        validationRequired: row.validationRequired,
      });
    });

    setBodyLayoutEleList([...bodyLayoutEleListRef?.current]);
    bodyLayoutEleListRef?.current?.forEach((row, i) => {
      bodyLayoutDetail.push({
        detailsFlag: row.detailsId !== 0 ? "U" : "A",
        detailsId: row.detailsId ?? 0,
        elementId: row.elementId,
        elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
          "1" : row.elementLength ?? 0,
        elementOrder: headerLayoutEleListRef?.current?.length + i + 1,
        elementParentId: 0,
        elementSection: fileLayoutSectionType.Body,
        paddingType: row.elementPaddingType?.trim(),
        paddingValue: row.elementPaddingValue,
        validationFormat: row.validationFormat,
        validationLength: row.validationLength,
        validationRequired: row.validationRequired,
      });
    });

    setFooterLayoutEleList([...footerLayoutEleListRef?.current]);
    footerLayoutEleListRef?.current?.forEach((row, i) => {
      footerLayoutDetail.push({
        detailsFlag: row.detailsId !== 0 ? "U" : "A",
        detailsId: row.detailsId ?? 0,
        elementId: row.elementId,
        elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
          "1" : row.elementLength ?? 0,
        elementOrder:
          headerLayoutEleListRef?.current?.length +
          bodyLayoutEleListRef?.current?.length +
          i +
          1,
        elementParentId: 0,
        elementSection: fileLayoutSectionType.Footer,
        paddingType: row.elementPaddingType?.trim(),
        paddingValue: row.elementPaddingValue,
        validationFormat: row.validationFormat,
        validationLength: row.validationLength,
        validationRequired: row.validationRequired,
      });
    });

    deletedElements?.forEach((row, i) => {
      if (row.detailsId !== 0) {
        return headerLayoutDetail.push({
          detailsFlag: row.detailsFlag,
          detailsId: row.detailsId ?? 0,
          elementId: row.elementId,
          elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
            "1" : row.elementLength ?? 0,
          elementOrder:
            footerLayoutEleListRef?.current?.length +
            headerLayoutEleListRef?.current?.length +
            bodyLayoutEleListRef?.current?.length +
            i +
            1,
          elementParentId: 0,
          elementSection: fileLayoutSectionType.Header,
          paddingType: row.elementPaddingType?.trim(),
          paddingValue: row.elementPaddingValue,
          validationFormat: row.validationFormat,
          validationLength: row.validationLength,
          validationRequired: row.validationRequired,
        });
      }
    });

    deletedBodyElements?.forEach((row, i) => {
      if (row.detailsId !== 0) {
        bodyLayoutDetail.push({
          detailsFlag: row.detailsFlag,
          detailsId: row.detailsId ?? 0,
          elementId: row.elementId,
          elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
            "1" : row.elementLength ?? 0,
          elementOrder:
            footerLayoutEleListRef?.current?.length +
            headerLayoutEleListRef?.current?.length +
            bodyLayoutEleListRef?.current?.length +
            deletedElements.length +
            i +
            1,
          elementParentId: 0,
          elementSection: fileLayoutSectionType.Body,
          paddingType: row.elementPaddingType?.trim(),
          paddingValue: row.elementPaddingValue,
          validationFormat: row.validationFormat,
          validationLength: row.validationLength,
          validationRequired: row.validationRequired,
        });
      }
    });

    deletedFooterElements?.forEach((row, i) => {
      if (row.detailsId !== 0) {
        footerLayoutDetail.push({
          detailsFlag: row.detailsFlag,
          detailsId: row.detailsId ?? 0,
          elementId: row.elementId,
          elementLength: ['CIRCUMFLEX', 'COMMA', 'DASH', 'PERCENTAGE', 'QUESTION', 'SEMI_COLON', 'SPACE', 'ASTERISK'].includes(row.elementName) ?
            "1" : row.elementLength ?? 0,
          elementOrder:
            footerLayoutEleListRef?.current?.length +
            headerLayoutEleListRef?.current?.length +
            bodyLayoutEleListRef?.current?.length +
            deletedElements.length +
            deletedBodyElements.length +
            i +
            1,
          elementParentId: 0,
          elementSection: fileLayoutSectionType.Footer,
          paddingType: row.elementPaddingType?.trim(),
          paddingValue: row.elementPaddingValue,
          validationFormat: row.validationFormat,
          validationLength: row.validationLength,
          validationRequired: row.validationRequired,
        });
      }
    });
    if (((filenameList?.length > 0 && fileId != " ") ? filenameList.find((fileName) => fileName.fileId?.toString() === fileId?.toString())?.fileTypeCode : fileLayoutPrevData?.fileResponseDto?.fileTypeCode ? fileLayoutPrevData?.fileResponseDto?.fileTypeCode : "") === "Input") {
      LayoutService.saveLayout({
        fileId: fileId ? Number(fileId) : 0,
        layoutId: layoutId ? Number(layoutId) : 0,
        layoutName: values.layoutName,
        layoutFormat: values.layoutFormat,
        layoutSeparator: values.layoutSeparator,
        includesHeader: includesHeader,
        // layoutType: format,
        listLayoutDetailsRequest: [
          ...headerLayoutDetail,
          ...bodyLayoutDetail,
          ...footerLayoutDetail,
        ],
        status: "1",
      })
        .then((res) => {
          if (res.status === StatusCode.Success) {
            if (res.data?.message) {
              toast.success(res.data.message);
            } else {
              if (layoutId) {
                toast.success(`File layout details updated successfully`);
              } else {
                toast.success(`File layout record added successfully`);
              }
            }
            navigate(-1);
          }
        })
        .catch((err) => {
          err?.response?.data?.errors?.map((e: string) => toast.error(e));
        });
    } else {
      if (
        headerLayoutDetail?.find(
          (item) =>
            item.paddingValue?.length > 999 ||
            (item.paddingValue?.match(
              item.validationRequired === "1"
                ? item.validationFormat
                : /^[a-zA-Z\s0-9_-]*$/
            ) === null &&
              item.elementId !== createDateElementId &&
              item.elementId !== systemDateElementId) ||
            ((item.elementId === createDateElementId ||
              item.elementId === systemDateElementId) &&
              item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[A-Za-z0-9\s\-/]*$/
              ) === null)
        )
      ) {
        let index =
          headerLayoutDetail?.findIndex(
            (item) =>
              item.paddingValue?.length > 999 ||
              (item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[a-zA-Z\s0-9_-]*$/
              ) === null &&
                item.elementId !== createDateElementId &&
                item.elementId !== systemDateElementId) ||
              ((item.elementId === createDateElementId ||
                item.elementId === systemDateElementId) &&
                item.paddingValue?.match(
                  item.validationRequired === "1"
                    ? item.validationFormat
                    : /^[A-Za-z0-9\s\-/]*$/
                ) === null)
          ) ?? "";
        document
          .getElementById(
            `params-paddingValue-${index}-${fileLayoutSectionType.Header}`
          )
          ?.focus();
      }
      else if (
        bodyLayoutDetail?.find(
          (item) =>
            item.paddingValue?.length > 999 ||
            (item.paddingValue?.match(
              item.validationRequired === "1"
                ? item.validationFormat
                : /^[a-zA-Z\s0-9_-]*$/
            ) === null &&
              item.elementId !== createDateElementId &&
              item.elementId !== systemDateElementId) ||
            ((item.elementId === createDateElementId ||
              item.elementId === systemDateElementId) &&
              item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[A-Za-z0-9\s\-/]*$/
              ) === null)
        )
      ) {

        let index =
          bodyLayoutDetail?.findIndex(
            (item) =>
              item.paddingValue?.length > 999 ||
              (item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[a-zA-Z\s0-9_-]*$/
              ) === null &&
                item.elementId !== createDateElementId &&
                item.elementId !== systemDateElementId) ||
              ((item.elementId === createDateElementId ||
                item.elementId === systemDateElementId) &&
                item.paddingValue?.match(
                  item.validationRequired === "1"
                    ? item.validationFormat
                    : /^[A-Za-z0-9\s\-/]*$/
                ) === null)
          ) ?? "";
        document
          .getElementById(
            `params-paddingValue-${index}-${fileLayoutSectionType.Body}`
          )
          ?.focus();
      }
      else if (
        footerLayoutDetail?.find(
          (item) =>
            item.paddingValue?.length > 999 ||
            (item.paddingValue?.match(
              item.validationRequired === "1"
                ? item.validationFormat
                : /^[a-zA-Z\s0-9_-]*$/
            ) === null &&
              item.elementId !== createDateElementId &&
              item.elementId !== systemDateElementId) ||
            ((item.elementId === createDateElementId ||
              item.elementId === systemDateElementId) &&
              item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[A-Za-z0-9\s\-/]*$/
              ) === null)
        )
      ) {
        let index =
          footerLayoutDetail?.findIndex(
            (item) =>
              item.paddingValue?.length > 999 ||
              (item.paddingValue?.match(
                item.validationRequired === "1"
                  ? item.validationFormat
                  : /^[a-zA-Z\s0-9_-]*$/
              ) === null &&
                item.elementId !== createDateElementId &&
                item.elementId !== systemDateElementId) ||
              ((item.elementId === createDateElementId ||
                item.elementId === systemDateElementId) &&
                item.paddingValue?.match(
                  item.validationRequired === "1"
                    ? item.validationFormat
                    : /^[A-Za-z0-9\s\-/]*$/
                ) === null)
          ) ?? "";
        document
          .getElementById(
            `params-paddingValue-${index}-${fileLayoutSectionType.Footer}`
          )
          ?.focus();
      } else {
        LayoutService.saveLayout({
          fileId: fileId ? Number(fileId) : 0,
          layoutId: layoutId ? Number(layoutId) : 0,
          layoutName: values.layoutName,
          layoutFormat: values.layoutFormat,
          layoutSeparator: null,
          includesHeader: includesHeader,
          // layoutType: format,
          listLayoutDetailsRequest: [
            ...headerLayoutDetail,
            ...bodyLayoutDetail,
            ...footerLayoutDetail,
          ],
          status: "1",
        })
          .then((res) => {
            if (res.status === StatusCode.Success) {
              if (res.data?.message) {
                toast.success(res.data.message);
              } else {
                if (layoutId) {
                  toast.success(`File layout details updated successfully`);
                } else {
                  toast.success(`File layout record added successfully`);
                }
              }
              navigate(-1);
            }
          })
          .catch((err) => {
            err?.response?.data?.errors?.map((e: string) => toast.error(e));
          });
      }
    }
  };

  const Left = useSelector(
    (state: RootState) => state.selectedCard.position.left
  );
  const Top = useSelector(
    (state: RootState) => state.selectedCard.position.top
  );
  const [top, setTop] = React.useState(Top);
  const [left, setLeft] = React.useState(Left);
  useEffect(() => {
    setLeft(Left);
    setTop(Top);
  }, [Left, Top]);
  const layoutSeparatorInputRef = useRef<HTMLInputElement>(null);

  const onChangeLayoutSeparator = (event: any) => {
    const value = event.target.value;
    setLayoutSeparator(value);
    setValue("layoutSeparator", value);  // Update the value in react-hook-form
    layoutSeparatorInputRef.current?.blur();
    layoutSeparatorInputRef.current?.focus();
  };

return (
  <>
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">
          <Card className="fl-card">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent sx={{ p: "2rem !important" }}>
 
                {/* ── Page title ── */}
                <h2 className="fl-page-title">
                  {intl.formatMessage({
                    id: "FileLayout.add/editfilelayout",
                    defaultMessage: "Add/Edit File Layout",
                  })}
                </h2>
 
                {/* ── Top fields grid ── */}
                <div className="fl-fields-grid">
 
                  {/* File Name */}
                  <div className="fl-field-group">
                    <label className="fl-label">
                      {intl.formatMessage({ id: "FileLayout.filename", defaultMessage: "File Name" })}
                      <span className="fl-required">*</span>
                    </label>
                    <div className="fl-select-wrap">
                      <Select
                        id="select-filename"
                        fullWidth
                        className="fl-select"
                        value={fileId}
                        {...register("fileResponseDto.fileId")}
                        onChange={(event: any) => {
                          setFileId(event?.target.value);
                          getElementList(event?.target.value);
                          if (
                            (((filenameList?.length > 0 && event?.target.value != " ") &&
                              filenameList.find((f) => f.fileId?.toString() === event?.target.value?.toString())?.fileTypeCode === "Input") ||
                              (fileLayoutPrevData?.fileResponseDto?.fileTypeCode && fileLayoutPrevData.fileResponseDto?.fileTypeCode === "Input"))
                          ) {
                            setValue("layoutSeparator", "");
                            setLayoutSeparator("");
                            setValue("layoutFormat", " ");
                            setLayoutFormat(" ");
                          }
                        }}
                        disabled={layoutId ? true : false}
                        onFocus={getValues}
                        IconComponent={ArrowDown}
                        required
                        MenuProps={{ className: "select-item" }}
                      >
                        <MenuItem disabled value=" ">
                          <em>{intl.formatMessage({ id: "FileLayout.selectfilename", defaultMessage: "Select File Name" })}</em>
                        </MenuItem>
                        {filenameList?.length > 0 &&
                          filenameList
                            .filter((f) => f.fileName != "GoFile")
                            .sort((a, b) => CustomeComparator(a.fileName, b.fileName))
                            .map((data: InputOutputLayoutModel) => (
                              <MenuItem value={data.fileId?.toString()} key={data.fileId}>
                                {data.fileName}
                              </MenuItem>
                            ))}
                      </Select>
                      {fileId === " " && errors.fileResponseDto?.fileId?.message && (
                        <span className="fl-error">{errors.fileResponseDto?.fileId?.message}</span>
                      )}
                    </div>
                  </div>
 
                  {/* Layout Description */}
                  <div className="fl-field-group">
                    <label className="fl-label">
                      {intl.formatMessage({ id: "FileLayout.layoutdescription", defaultMessage: "Layout Description" })}
                      <span className="fl-required">*</span>
                    </label>
                    <InputBase
                      placeholder={intl.formatMessage({ id: "FileLayout.enterlayoutdescription", defaultMessage: "Enter Layout Description" })}
                      id="enter-layout-description"
                      fullWidth
                      className="fl-input"
                      {...register("layoutName")}
                      inputProps={{ maxLength: 100 }}
                      autoComplete="off"
                    />
                    {errors.layoutName?.message && (
                      <span className="fl-error">{errors.layoutName?.message}</span>
                    )}
                  </div>
 
                  {/* Layout Format */}
                  <div className="fl-field-group">
                    <label className="fl-label">
                      {intl.formatMessage({ id: "FileLayout.layoutformat", defaultMessage: "Layout Format" })}
                      <span className="fl-required">*</span>
                    </label>
                    <div className="fl-select-wrap">
                      <Select
                        id="select-layoutformat"
                        fullWidth
                        className="fl-select"
                        value={layoutFormat}
                        {...register("layoutFormat")}
                        onChange={(event: any) => {
                          setLayoutFormat(event?.target.value);
                          if (event?.target.value?.toString() != "3") {
                            if (
                              (((filenameList?.length > 0 && fileId != " ") &&
                                filenameList.find((f) => f.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
                                (fileLayoutPrevData?.fileResponseDto?.fileTypeCode && fileLayoutPrevData.fileResponseDto?.fileTypeCode === "Input"))
                            ) {
                              setValue("layoutSeparator", ",");
                              setLayoutSeparator(",");
                            } else {
                              setValue("layoutSeparator", "");
                              setLayoutSeparator("");
                            }
                          }
                        }}
                        onFocus={getValues}
                        IconComponent={ArrowDown}
                        required
                        MenuProps={{ className: "select-item" }}
                      >
                        <MenuItem disabled value=" ">
                          <em>{intl.formatMessage({ id: "FileLayout.selectlayoutFormat", defaultMessage: "Select Layout Format" })}</em>
                        </MenuItem>
                        {fileFormatList &&
                          fileFormatList.map((format: { key: string; value: string }) => (
                            <MenuItem key={format.key} value={format.key}>
                              {format.value}
                            </MenuItem>
                          ))}
                      </Select>
                      {layoutFormat === " " && errors.layoutFormat?.message && (
                        <span className="fl-error">{errors.layoutFormat?.message}</span>
                      )}
                    </div>
                  </div>
 
                  {/* Layout Separator (conditional) */}
                  {(((filenameList?.length > 0 && fileId != " ") &&
                    filenameList.find((f) => f.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
                    (fileLayoutPrevData?.fileResponseDto.fileTypeCode && fileLayoutPrevData?.fileResponseDto?.fileTypeCode === "Input")) && (
                    <div className="fl-field-group">
                      <label className="fl-label">
                        {intl.formatMessage({ id: "FileLayout.layoutseparator", defaultMessage: "Layout Separator" })}
                        <span className="fl-required">*</span>
                      </label>
                      <InputBase
                        placeholder={intl.formatMessage({ id: "FileLayout.enterlayoutseparator", defaultMessage: "Enter Layout Separator" })}
                        id="enter-layout-separator"
                        fullWidth
                        className="fl-input"
                        value={layoutSeparator}
                        {...register("layoutSeparator")}
                        onChange={onChangeLayoutSeparator}
                        inputProps={{ maxLength: 1 }}
                        autoComplete="off"
                        inputRef={layoutSeparatorInputRef}
                        disabled={layoutFormat != "3" && layoutFormat != "5"}
                      />
                      {!(errors.layoutSeparator?.message === "Separator is required" && layoutSeparator != "" && watch("layoutSeparator") != "") && (
                        <span className="fl-error">{errors.layoutSeparator?.message}</span>
                      )}
                    </div>
                  )}
 
                  {/* Includes Header checkbox (conditional) */}
                  {(((filenameList?.length > 0 && fileId != " ") &&
                    filenameList.find((f) => f.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
                    (fileLayoutPrevData?.fileResponseDto.fileTypeCode && fileLayoutPrevData?.fileResponseDto?.fileTypeCode === "Input")) && (
                    <div className="fl-field-group fl-checkbox-group">
                      <FormControlLabel
                        className="fl-checkbox-label"
                        label={intl.formatMessage({ id: "TransactionSecurity.includesheader", defaultMessage: "Includes Header" })}
                        control={
                          <Checkbox
                            onClick={(e) => handleIncludesHeader(e)}
                            checked={includesHeader}
                            icon={<CheckboxIcon />}
                            checkedIcon={<CheckedboxIcon />}
                            disableRipple
                            disableFocusRipple
                          />
                        }
                      />
                    </div>
                  )}
 
                  {/* File Type */}
                  <div className="fl-field-group">
                    <label className="fl-label">
                      {intl.formatMessage({ id: "FileLayout.filetype", defaultMessage: "File Type" })}
                    </label>
                    <div className="fl-readonly-badge">
                      {(filenameList?.length > 0 && fileId != " ")
                        ? filenameList.find((f) => f.fileId?.toString() === fileId?.toString())?.fileTypeCode
                        : fileLayoutPrevData?.fileResponseDto?.fileTypeCode
                        ? fileLayoutPrevData?.fileResponseDto?.fileTypeCode
                        : intl.formatMessage({ id: "Dashboard_3.filetype", defaultMessage: "No File Selected" })}
                    </div>
                  </div>
 
                </div>{/* /fl-fields-grid */}
 
                <div className="fl-divider" />
 
                {/* ── Header Section ── */}
                <Card className="fl-section-card">
                  <CardContent sx={{ p: "0 !important" }}>
                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="header-content" id="header-header" className="fl-accordion-summary">
                        <span className="fl-section-title">
                          {intl.formatMessage({ id: "FileLayout.headersection", defaultMessage: "Header Section" })}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails className="fl-accordion-details">
                        <LayoutSection
                          layoutEleListRef={headerLayoutEleListRef}
                          handlePadding={handlePadding}
                          formsubmit={formsubmit}
                          handlePaddingValue={handlePaddingValue}
                          handleElementLength={handleElementLength}
                          onDeleteEle={onDeleteEle}
                          setLayoutEleList1={setHeaderLayoutEleList}
                          handleAddElement={handleAddEle}
                          gridRef={gridRef}
                          layoutEleList1={headerlayoutEleList}
                          elementList={elementList?.filter((d) =>
                            isElementSectionMatch(d.elementSection, fileLayoutSectionType.Header)
                          )}
                          sectionType={fileLayoutSectionType.Header}
                          layoutUpdatedData={
                            headerData?.sort((a, b) => CustomeComparatorNumber(a.elementOrder, b.elementOrder)) ?? []
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
 
                {/* ── Body Section ── */}
                <Card className="fl-section-card">
                  <CardContent sx={{ p: "0 !important" }}>
                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="body-content" id="body-header" className="fl-accordion-summary">
                        <span className="fl-section-title">
                          {intl.formatMessage({ id: "FileLayout.bodysection", defaultMessage: "Body Section" })}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails className="fl-accordion-details">
                        <LayoutSection
                          layoutEleListRef={bodyLayoutEleListRef}
                          handlePadding={handleBodyPadding}
                          formsubmit={formsubmit}
                          handlePaddingValue={handleBodyPaddingValue}
                          handleElementLength={handleBodyElementLength}
                          onDeleteEle={onDeleteBodyEle}
                          setLayoutEleList1={setBodyLayoutEleList}
                          handleAddElement={handleBodyAddEle}
                          gridRef={gridRefBody}
                          layoutEleList1={bodylayoutEleList}
                          elementList={elementList?.filter((data) =>
                          data.elementSection?.includes(
                            fileLayoutSectionType.Body
                          )
                        )}
                          sectionType={fileLayoutSectionType.Body}
                          fileName={selectedFileName}
                          layoutUpdatedData={
                            bodyData?.sort((a, b) => CustomeComparatorNumber(a.elementOrder, b.elementOrder)) ?? []
                          }
                          fileTypeStatus={
                            (((filenameList?.length > 0 && fileId != " ") &&
                              filenameList.find((f) => f.fileId?.toString() === fileId?.toString())?.fileTypeCode === "Input") ||
                              (fileLayoutPrevData?.fileResponseDto?.fileTypeCode && fileLayoutPrevData.fileResponseDto?.fileTypeCode === "Input"))
                              ? "Input"
                              : "Output"
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
 
                {/* ── Footer Section ── */}
                <Card className="fl-section-card">
                  <CardContent sx={{ p: "0 !important" }}>
                    <Accordion disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="footer-content" id="footer-header" className="fl-accordion-summary">
                        <span className="fl-section-title">
                          {intl.formatMessage({ id: "FileLayout.footersection", defaultMessage: "Footer Section" })}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails className="fl-accordion-details">
                        <LayoutSection
                          layoutEleListRef={footerLayoutEleListRef}
                          handlePadding={handleFooterPadding}
                          formsubmit={formsubmit}
                          handlePaddingValue={handleFooterPaddingValue}
                          handleElementLength={handleFooterElementLength}
                          onDeleteEle={onDeleteFooterEle}
                          setLayoutEleList1={setFooterLayoutEleList}
                          handleAddElement={handleFooterAddEle}
                          gridRef={gridRefFooter}
                          layoutEleList1={footerlayoutEleList}
                          elementList={elementList?.filter((d) =>
                            isElementSectionMatch(d.elementSection, fileLayoutSectionType.Footer)
                          )}
                          sectionType={fileLayoutSectionType.Footer}
                          layoutUpdatedData={
                            footerData?.sort((a, b) => CustomeComparatorNumber(a.elementOrder, b.elementOrder)) ?? []
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
 
                {/* ── Action buttons ── */}
                <div className="fl-btn-row">
                  <Button
                    variant="text"
                    type="reset"
                    className="fl-btn-cancel"
                    disableElevation
                    onClick={() => navigate(-1)}
                  >
                    <FormattedMessage id="Dashboard_1_2.cancel" defaultMessage="Cancel" />
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    className="fl-btn-save"
                    disableElevation
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="Dashboard_1_2.save" defaultMessage="Save" />
                    <img src={saveIcon} alt="save" />
                  </Button>
                </div>
 
              </CardContent>
            </form>
          </Card>
        </div>
      </main>
    </div>
  </>);
};

export default AddEditFileLayout;
