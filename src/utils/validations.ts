import * as Yup from "yup";
import { TaskAbbrev } from "./constant";

const phoneRegExp = /^\+?[0-9]{3,20}$|^$/;
const phoneNumberError = "Must be a valid phone number";
const decimal_12_3_RegExp = /^\d{1,12}(\.\d{1,3})?$/;
const decimal_9_3_RegExp = /^\d{1,9}(\.\d{1,3})?$/;
const decimal_9_7_RegExp = /^\d{1,9}(\.\d{1,7})?$/;
const decimal_18_8_RegExp = /^\d{1,18}(\.\d{1,8})?$/;
const decimal_3_3_RegExp = /^\d{1,3}(\.\d{1,3})?$/;
const decimalError = (x: number, y: number, errorMsg?: string) => {
  return errorMsg ? errorMsg : `Amount should not be more than ${x} digits`
}
const addJobValidation = Yup.object({
  jobName: Yup.string()
    .trim()
    .required("Job Name is required")
    .max(100, "Job Name should not exceed 100 characters")
    .matches(
      /^[a-zA-Z\s0-9,_-]+$/,
      "Job Name should be an alphanumeric string, the allowed special characters are “-“, “,“ and “_”"
    ),
  jobDescription: Yup.string()
    .trim()
    .required("Descriptions is required")
    .max(500, "Description should not exceed 500 characters")
    .matches(
      /^[a-zA-Z\s0-9,_-]+$/,
      "Description should be an alphanumeric string, the allowed special characters are “-“, “,“ and “_”"
    ),
});
const validations = {
    addFileLayoutValidations: Yup.object({
    layoutFormat: Yup.string().trim().required("Layout Format is required"),
    layoutName: Yup.string()
      .required("Layout Description is required")
      .matches(/^(?!\s*$)[A-Za-z\s]+$/, "Layout Description should be an alphabetic string"),
    // layoutType: Yup.string().notOneOf([" "], "Format is required").required("Format is required"),
    fileResponseDto: Yup.object({
      fileId: Yup.string()
        .notOneOf([" "], "File Name is required")  // Check for empty space
        .required("File Name is required")  // Ensure the field is not empty
    }),
    fileType: Yup.string(),
   
    layoutSeparator: Yup.string()
    .length(1, "Separator is required")
    .matches(/^[,#%^|~]$/, "Separator must be one of: ',', '#', '%', '^', '|', or '~'")
    .required("Separator is required")
    }),
    addFileLayoutValidationsOutput: Yup.object({
      layoutFormat: Yup.string().trim().required("Layout Format is required"),
      layoutName: Yup.string()
      .required("Layout Description is required")
      .matches(/^[A-Za-z\s][A-Za-z\s]*$/, "Layout Description should be alphabetic string")
      .notOneOf([" "], "Layout Description is required"),
      // layoutType: Yup.string().notOneOf([" "], "Format is required").required("Format is required"),
      fileResponseDto: Yup.object({
        fileId: Yup.string()
          .notOneOf([" "], "File Name is required")  // Check for empty space
          .required("File Name is required")  // Ensure the field is not empty
      }),
      fileType: Yup.string(),
      layoutSeparator: Yup.string()
    }),
    AlertOnSuccessAndFailure: addJobValidation.shape({
    successEmail: Yup.array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) {
          return value;
        }
        return originalValue ? originalValue.split(";") : [];
      })
      .of(
        Yup.string()
          .trim()
          .matches(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            "Enter valid Success Email"
          )
      )
      .required("Success Email is required"),

    failEmail: Yup.array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) {
          return value;
        }
        return originalValue ? originalValue.split(";") : [];
      })
      .of(
        Yup.string()
          .trim()
          .matches(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            "Enter valid Failure Email"
          )
      )
      .required("Failure Email is required"),
  }),

  successAlert: addJobValidation.shape({
    successEmail: Yup.array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) {
          return value;
        }
        return originalValue ? originalValue.split(";") : [];
      })
      .of(
        Yup.string()
          .trim()
          .matches(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            "Enter valid Success Email"
          )
      )
      .required("Success Email is required"),
  }),

  failureAlert: addJobValidation.shape({
    failEmail: Yup.array()
      .transform(function (value, originalValue) {
        if (this.isType(value) && value !== null) {
          return value;
        }
        return originalValue ? originalValue.split(";") : [];
      })
      .of(
        Yup.string()
          .trim()
          .matches(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            "Enter valid Failure Email"
          )
      )
      .required("Failure Email is required"),
  }),
  loginValidations: Yup.object().shape({
    username: Yup.string().required("User Name is required"),
    password: Yup.string().trim().required("Password is required"),
  }),
  entityValidations: Yup.object().shape({
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityLevelId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityName: Yup.string()
      .trim()
      .transform((value, originalValue) => (value ? (/^[^\s](.*[^\s])?$/).test(originalValue) ? value : NaN : undefined))
      .typeError("Please enter a valid name")
      .required("Name is required")
      .max(50, "Entity Name should not exceed 50 characters"),
    entityNameAlt: Yup.string()
      .trim()
      .transform((value, originalValue) => (value ? (/^[^\s](.*[^\s])?$/).test(originalValue) ? value : NaN : undefined))
      .typeError("Please enter a valid alternate name")
      .required("Alternate Name is required")
      .max(100, "Alternate Name should not exceed 100 characters"),
    dbaName: Yup.string()
      .trim()
      .nullable()
      .max(50, "Doing Business AS should not exceed 50 characters"),
    dbaNameAlt: Yup.string()
      .trim()
      .nullable()
      .max(100, "Doing Business AS Alt should not exceed 100 characters"),
    defSettlementCurrency: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    mccId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    businessTypeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityStatus: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    /*bankCodeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),*/
    salesmanId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    employeeIncharge: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityId: Yup.string()
      .trim()
      .required("Entity Id is required.")
      .max(30, "Entity Id should not exceed 30 characters"),
    companyRegisterNBR: Yup.string()
      .trim()
      .nullable()
      /*.max(30, "Company Registration No. should not exceed 30 characters")*/,
    companyVatNBR: Yup.string()
      .trim()
      .nullable()
      /*.max(30, "Company Vat No. should not exceed 30 characters")*/,
    contractDate: Yup.date()
      .required("Contract Date is required")
      .typeError("Contract Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    expStartDate: Yup.date()
      .nullable()
      .typeError("Expected Start Date format is invalid")
      .min(
        Yup.ref("contractDate"),
        "Expected start date can't be before contract date"
      ),
    actualStartDate: Yup.date()
      .required("Actual Start Date is required")
      .typeError("Actual Start format is invalid")
      .min(
        Yup.ref("contractDate"),
        "Actual start date can't be before contract date"
      ),
    terminationDate: Yup.date()
      .nullable()
      .typeError("Termination Date format is invalid")
      .min(Yup.ref("actualStartDate"),"Termination date can't be before actual start date"),
  }),
  entityUpdateValidations: Yup.object().shape({
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityLevelId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityName: Yup.string()
      .trim()
      .transform((value, originalValue) => (value ? (/^[^\s](.*[^\s])?$/).test(originalValue) ? value : NaN : undefined))
      .typeError("Please enter a valid name")
      .required("Name is required")
      .max(50, "Entity Name should not exceed 50 characters"),
    entityNameAlt: Yup.string()
      .trim()
      .transform((value, originalValue) => (value ? (/^[^\s](.*[^\s])?$/).test(originalValue) ? value : NaN : undefined))
      .typeError("Please enter a valid alternate name")
      .required("Alternate Name is required")
      .max(100, "Alternate Name should not exceed 100 characters"),
    dbaName: Yup.string()
      .trim()
      .nullable()
      .max(50, "Doing Business AS should not exceed 50 characters"),
    dbaNameAlt: Yup.string()
      .trim()
      .nullable()
      .max(100, "Doing Business AS Alt should not exceed 100 characters"),
    defSettlementCurrency: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    mccId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    businessTypeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityStatus: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    /*bankCodeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),*/
    salesmanId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    employeeIncharge: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    entityId: Yup.string()
      .trim()
      .required("Entity Id is required.")
      .max(30, "Entity Id should not exceed 30 characters"),
    companyRegisterNBR: Yup.string()
      .trim()
      .nullable()
      /*.max(30, "Company Registration No. should not exceed 30 characters")*/,
    companyVatNBR: Yup.string()
      .trim()
      .nullable()
      /*.max(30, "Company Vat No. should not exceed 30 characters")*/,
    contractDate: Yup.date()
      .required("Contract Date is required")
      .typeError("Contract Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    expStartDate: Yup.date()
      .nullable()
      .typeError("Expected Start Date format is invalid")
      .min(
        Yup.ref("contractDate"),
        "Expected start date can't be before contract date"
      ),
    actualStartDate: Yup.date()
      .required("Actual Start Date is required")
      .typeError("Actual Start format is invalid")
      .min(
        Yup.ref("contractDate"),
        "Actual start date can't be before contract date"
      ),
    terminationDate: Yup.date()
      .nullable()
      .typeError("Termination Date format is invalid")
      .min(
        Yup.ref("actualStartDate"),
        "Termination date can't be before actual start date"
      ),
    phone1: Yup.string()
      .trim()
      //.required("Phone1 is required")
      //.matches(phoneRegExp, phoneNumberError)
      .max(20, "Phone1 must be less then or equals to 20 digits"),
    mobile1: Yup.string()
      .trim()
      //.required("Mobile1 is required")
      //.matches(phoneRegExp, phoneNumberError)
      .max(20, "Mobile1 must be less then or equals to 20 digits"),
    phone2: Yup.string()
      .trim()
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Phone2 must be less then or equals to 20 digits")
      .nullable(),
    mobile2: Yup.string()
      .trim()
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Mobile2 must be less then or equals to 20 digits")
      .nullable(),
    address1: Yup.string()
      .trim()
      .max(50, "Address1 must be less then or equals to 50 characters")
      .nullable(),
    address2: Yup.string()
      .trim()
      .max(50, "Address2 must be less then or equals to 50 characters")
      .nullable(),
    address3: Yup.string()
      .trim()
      .max(50, "Address3 must be less then or equals to 50 characters")
      .nullable(),
    address4: Yup.string()
      .trim()
      .max(50, "Address4 must be less then or equals to 50 characters")
      .nullable(),
    postalCodeZip: Yup.string()
      .trim()
      .max(20, "Postal Code must be less then or equals to 20 characters")
      .nullable(),
    geoCode: Yup.string()
      .trim()
      .max(16, "Geo Code must be less then or equals to 16 characters")
      .nullable(),
    fax: Yup.string()
      .trim()
      .max(30, "Fax must be less then or equals to 30 characters")
      .nullable(),
    url: Yup.string()
      .trim()
      .max(255, "URL must be less then or equals to 255 characters")
      .nullable(),
    emailAddress1: Yup.string().email("Email format is invalid.")
      .trim()
      .max(100, "Email1 must be less then or equals to 100 characters")
      .nullable(),
    emailAddress2: Yup.string().email("Email format is invalid.")
      .trim()
      .max(100, "Email2 must be less then or equals to 100 characters")
      .nullable(),
    freeText1: Yup.string()
      .trim()
      .max(100, "Must be less then or equals to 100 characters")
      .nullable(),
  }),
  entityValidationMessages: {
    institutionId: "Institution is required",
    entityLevelId: "Entity Level is required",
    mccId: "MCC is required",
    businessTypeId: "Business Type is required",
    entityStatus: "Status is required",
    salesmanId: "Sales Man is required",
    employeeIncharge: "Employee in Charge is required",
    defSettlementCurrency: "Default Settlement Currency is required",
  },
  createInstitutionValidations: Yup.object().shape({
    institutionId: Yup.string()
      .trim()
      .required("Institution ID is required")
      .min(1, "Institution ID must be at least 1 character")
      .max(10, "Institution ID should not exceed 10 characters"),
    institutionName: Yup.string()
      .trim()
      .required("Institution Name is required")
      .min(1, "Institution Name must be at least 1 character")
      .max(50, "Institution Name should not exceed 50 characters"),
    institutionTypeAlt: Yup.string()
      .trim()
      .required("Institution Alternative Name is required")
      .min(1, "Institution Alternative Name must be at least 1 character")
      .max(100, "Institution Alternative Name should not exceed 100 characters"),
    institutionTypeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    baseCurrency: Yup.string().trim()
      .required("Base Currency is required"),
    merchantRateUsage: Yup.string().trim()
      .required("Merchant Rate Usage is required"),
    weekDay: Yup.string().trim()
      .required("Weekday is required"),
    outputDirectory: Yup.string().trim()
      .required("Output Directory is required")
      .min(1, "Output Directory must be at least 1 character")
      .max(40, "Output Directory should not exceed 40 characters"),
    inputDirectory: Yup.string().trim()
      .required("Input Directory is required")
      .min(1, "Input Directory must be at least 1 character")
      .max(40, "Input Directory should not exceed 40 characters"),
      discountReturnOn: Yup.string()
      .required("Discount Return On is required")
      .test("discountReturnOn", "Discount Return On must only contain numbers", (value) => {
        return Number.isNaN(Number.parseInt(value!)) ? false : true;
      })
      .test("discountReturnOn", "Discount Return On must not exceed 31 days", function (value) {
        let discountReturnOn = value;
        try {
          const bigDiscountReturnOn = BigInt(discountReturnOn as string);
          if (discountReturnOn !== undefined && bigDiscountReturnOn > 31) {
            return false;
          }
        } catch (Error) {
          return false;
        }
        return true;
      }),
  }),
  createInstitute: {
    institutionType: "Institution Type is required",
  },
  createTransactionGroupValidations: Yup.object().shape({
    transactionGroupName: Yup.string()
      .trim()
      .required("Transaction Group Name is required")
      .min(1, "Transaction Group Name must be at least 1 character")
      .max(12, "Transaction Group Name should not exceed 12 characters"),
    transactionGroupDescription: Yup.string()
      .trim()
      .required("Transaction Group Description is required")
      .max(
        100,
        "Transaction Group Description should not exceed 100 characters"
      ),
  }),
  createCardSchemeValidations: Yup.object().shape({
    cardSchemeId: Yup.string()
      .trim()
      .required("Scheme ID is required")
      .min(1, "Card Scheme ID be at least 1 character")
      .max(6, "Card Scheme ID should not exceed 6 characters")
      .matches(/^[0-9]*$/, "Card Scheme ID must only contain numbers"),
    cardSchemeName: Yup.string()
      .trim()
      .required("Scheme Name is required")
      .min(1, "Card Scheme name be at least 1 character")
      .max(50, "Card Scheme name should not exceed 50 characters"),
    cardSchemeSpecific: Yup.string().trim()
      .required("Scheme Specific is required")
      .max(10, "Scheme Specific should not exceed 10 character"),
  }),

  currencyValidation: Yup.object().shape({
    currencyCode: Yup.string()
      .trim()
      .required("Currency Code is required")
      .min(1, "Currency Code must be at least 1 character")
      .max(3, "Currency Code should not exceed 3 characters"),
    currencyName: Yup.string()
      .trim()
      .required("Currency Name is required")
      .min(1, "Currency Name must be at least 1 character")
      .max(50, "Currency Name should not exceed 50 characters"),
    currExponent: Yup.string()
      .trim()
      .max(1, "Exponent should not exceed 1 character")
      .nullable(),
    currCodeALPHA2: Yup.string()
      .trim()
      .max(2, "Code ALPHA 2 should not exceed 2 character")
      .nullable(),
    currCodeALPHA3: Yup.string()
      .trim()
      .max(3, "Code ALPHA 3 should not exceed 3 character")
      .nullable(),
  }),

  currencyConversionValidation: Yup.object().shape({
    currencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    baseCurrencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    roundingRule: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    rateExpression: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    midRateUsed: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
  }),
  currencyConversionValidationError: {
    currencyId: "Currency is required",
    baseCurrencyId: "Base Currency is required",
    roundingRule: "Rounding Rule is required",
    rateExpression: "Rate Expression is required",
    midRateUsed: "MID Rate Used is required",
  },
  mccValidations: Yup.object().shape({
    merchantTypeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    cardSchemeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    mcc: Yup.string()
      .trim()
      .required("MCC is required")
      .max(5, "MCC should not exceed 5 characters"),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .max(100, "Description should not exceed 100 characters"),
  }),
  createMccValidation: {
    merchantType: "Merchant Type is required",
    cardSCheme: "Card Scheme is required",
  },
  createTerminalTypeValidations: Yup.object().shape({
    terminalType: Yup.string()
      .trim()
      .required("Terminal Type is required")
      .min(1, "Terminal Type must be at least 1 character")
      .max(5, "Terminal Type should not exceed 5 characters"),
    makeModel: Yup.string()
      .trim()
      .nullable()
      .max(30, "Make Model should not exceed 30 characters"),
    makeName: Yup.string()
      .trim()
      .nullable()
      .max(30, "Make Name should not exceed 30 characters"),
    posCapability: Yup.string()
      .trim()
      .nullable()
      .max(100, "Capability should not exceed 100 characters"),
    freeText: Yup.string()
      .trim()
      .nullable()
      .max(100, "Description should not exceed 100 characters"),
  }),
  createCurrencyRateValidations: Yup.object().shape({
    isEdit: Yup.boolean(),
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    currencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    effectiveDate: Yup.date()
      .required("Effective Date is required")
      .typeError("Effective Date format is invalid")
      .when("isEdit", {
        is: false,
        then: Yup.date()
          .required("Effective Date is required")
          .typeError("Effective Date format is invalid")
          .min(new Date((new Date()).getTime() - 86400000), "Date must be greater than or equal to today's date"),
        otherwise: Yup.date()
          .required("Effective Date is required")
          .typeError("Effective Date format is invalid"),
      }),
    buyRate: Yup.number()
      .required("Buy Rate is required")
      .test('length', decimalError(18, 9, "Buy Rate should not be more than 9 digits"), (value) => Number.isNaN(Math.ceil(Math.log10(Number(value) + 1))) ? true : decimal_9_7_RegExp.test(value!.toString()))
      .transform((value) => (Number.isNaN(value) ? undefined : value))
      .typeError("Must be only digits"),
    midRate: Yup.number()
      .required("Mid Rate is required")
      .test('length', decimalError(18, 9, "Mid Rate should not be more than 9 digits"), (value) => Number.isNaN(Math.ceil(Math.log10(Number(value) + 1))) ? true : decimal_9_7_RegExp.test(value!.toString()))
      .transform((value) => (Number.isNaN(value) ? undefined : value))
      .typeError("Must be only digits"),
    sellRate: Yup.number()
      .required("Sell Rate is required")
      .test('length', decimalError(18, 9, "Sell Rate should not be more than 9 digits"), (value) => Number.isNaN(Math.ceil(Math.log10(Number(value) + 1))) ? true : decimal_9_7_RegExp.test(value!.toString()))
      .transform((value) => (Number.isNaN(value) ? undefined : value))
      .typeError("Must be only digits"),
  }),
  createCurrencyRateValidationError: {
    institutionId: "Institution is required",
    currencyId: "Currency is required",
  },
  currencyRateFilterValidation: Yup.object().shape({
    institution: Yup.string().nullable(),
    startDate: Yup.date()
      .typeError("Start Date format is invalid")
      .nullable()
      .max(Yup.ref("endDate"), "From date can't be after To date"),
    endDate: Yup.date()
      .typeError("End Date format is invalid")
      .nullable()
      .min(Yup.ref("startDate"), "To date can't be before From date")
  }),
  createEmployeeValidations: Yup.object().shape({
    employeeRoleId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    employeeName: Yup.string()
      .trim()
      .required("Employee Name is required")
      .max(50, "Employee Name should not exceed 50 characters"),
    employeePhone: Yup.string()
      .trim()
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Must be less then or equals to 20 digits")
      .transform((value, originalValue) => (/\s/.test(originalValue) ? NaN : value))
      .typeError(phoneNumberError)
      .nullable(),
    employeeExt: Yup.number()
      .test('length', 'Extension should not exceed 10 characters', (value) => {
        return Number.isNaN(Math.ceil(Math.log10(Number(value) + 1))) ? true : Math.ceil(Math.log10(Number(value) + 1)) <= 10
      })
      .transform((value) => (isNaN(value) ? undefined : value)).nullable(),
  }),
  createEmployeeValidationError: {
    employeeRoleId: "Role is required",
  },
  createActivityFeesPackage: Yup.object().shape({
    packageId: Yup.string().trim()
      .required("Package ID is required")
      .max(6, "Package ID should not exceed 6 characters"),
    packageName: Yup.string().trim()
      .required("Package Name is required")
      .max(50, "Package Name should not exceed 50 characters"),
  }),
  createActivityRecordPackage: Yup.object().shape(
    {
      isEdit: Yup.boolean(),
      chargeMethod: Yup.string().required("Charge method is required"),
      cardSchemeId: Yup.string().required("Card Scheme is required"),
      currencyId: Yup.string().required("Currency is required"),
      startDate: Yup.date()
        .required("Start Date is required")
        .typeError("Start Date format is invalid")
        .when("isEdit", {
          is: false,
          then: Yup.date()
            .required("Start Date is required")
            .typeError("Start Date format is invalid")
            .min(new Date((new Date()).getTime() - 86400000), "Start date must be greater than or equal to today's date")
            .max(Yup.ref("endDate"), "Start date can't be after end date"),
          otherwise: Yup.date()
            .required("Start Date is required")
            .typeError("Start Date format is invalid"),
        }),
      endDate: Yup.date()
        .required("End Date is required")
        .typeError("End Date format is invalid")
        .min(Yup.ref("startDate"), "End date can't be before start date and today's date"),
      transactionId: Yup.string().when("chargeMethod", {
        is: (val: string) => val === "5",
        then: Yup.string().required("Fee Id is required"),
        otherwise: Yup.string().notRequired().nullable(),
      }),
      percentageAmount: Yup
        .number()
        .required("% Amount is required")
        .test('length', decimalError(3, 3, "% Amount should not be more than 3 digits"), (value) => decimal_3_3_RegExp.test(value!.toString()))
        .when("fixAmount", {
          is: (val: number) => val <= 0,
          then: Yup.number()
            .min(0.00001, "Either fees amount or % amount is required")
            .typeError("% Amount is required"),
          otherwise: Yup.number().required().typeError("% Amount is required"),
        }),
      fixAmount: Yup
        .number()
        .required("Fees Amount is required")
        .test('length', decimalError(12, 3, "Fees Amount should not be more than 12 digits"), (value) => decimal_12_3_RegExp.test(value!.toString()))
        .when("percentageAmount", {
          is: (val: number) => val <= 0,
          then: Yup.number()
            .min(0.00001, "Either fees amount or % amount is required")
            .typeError("Fees Amount is required"),
          otherwise: Yup.number().required().typeError("Fees Amount is required"),
        }),
      minAmount: Yup
        .number()
        .test('length', decimalError(12, 3, "Min Amount should not be more than 12 digits"), (value) => decimal_12_3_RegExp.test(value!.toString()))
        .max(Yup.ref("maxAmount"), "Min Amount should not be greater than Max Amount")
        .transform((value) => (isNaN(value) ? undefined : value)).nullable(),
      maxAmount: Yup
        .number()
        .test('length', decimalError(12, 3, "Max Amount should not be more than 12 digits"), (value) => decimal_12_3_RegExp.test(value!.toString()))
        .min(Yup.ref("minAmount"), "Max Amount should be greater than Min Amount")
        .transform((value) => (isNaN(value) ? undefined : value)).nullable(),
      transactionGroupId: Yup.string().required(
        "Transaction Group is required"
      ),
      issuerId: Yup.string().required("Issuer is required"),
      tips: Yup.string().required("Tips is required"),
    },
    [["fixAmount", "percentageAmount"]]
  ),
  createActivityRecordPackageForCountAndValue: Yup.object().shape({
    isEdit: Yup.boolean(),
    chargeMethod: Yup.string().required("Charge method is required"),
    cardSchemeId: Yup.string().required("Card Scheme is required"),
    currencyId: Yup.string().required("Currency is required"),
    startDate: Yup.date()
      .required("Start Date is required")
      .typeError("Start Date format is invalid")
      .when("isEdit", {
        is: false,
        then: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid")
          .min(new Date((new Date()).getTime() - 86400000), "Date must be greater than or equal to today's date"),
        otherwise: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid"),
      }),
    endDate: Yup.date()
      .required("End Date is required")
      .typeError("End Date format is invalid")
      .min(Yup.ref("startDate"), "End date can't be before start date"),
    transactionGroupId: Yup.string().required("Transaction Group is required"),
    issuerId: Yup.string().required("Issuer is required"),
    tips: Yup.string().required("Tips is required"),
  }),
  createAddActivityPackageCharge: Yup.object().shape({
    frequencyId: Yup.string().required("Accumulation frequency is required"),
    percentageAmount: Yup.string()
      .trim()
      .required("Percentage amount is required")
      .test('length', decimalError(3, 3, "Percentage Amount should not be more than 3 digits"), (value) => decimal_3_3_RegExp.test(value!.toString())),
    fixAmount: Yup.string()
      .trim()
      .required("Fix amount is required")
      .test('length', decimalError(12, 3, "Fix Amount should not be more than 12 digits"), (value) => decimal_12_3_RegExp.test(value!.toString())),

    uptoAmount: Yup.string()
      .trim()
      .required("Up To Amount is required")
      .test('length', decimalError(12, 3, "Up To Amount should not be more than 12 digits"), (value) => decimal_12_3_RegExp.test(value!.toString())),
  }),
  changePasswordValidations: Yup.object().shape({
    oldPassword: Yup.string().trim().required("Password is required"),
    newPassword: Yup.string()
      .trim()
      .required("New Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[A-Za-z\d@$!%*?&]{8,15}$/,
        "Password Policy not satisfied"
      ),
    confirmPassword: Yup.string()
      .trim()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Confirm Password does not match"),
  }),
  createTerminal: Yup.object().shape({
    terminalId: Yup.string()
      .trim()
      .required("Terminal ID is required")
      .max(8, "Terminal ID should not exceed 8 digits"),
    serialNumber: Yup.string()
      .trim()
      .required("Serial Number is required")
      .max(30, "Serial Number should not exceed 30 characters"),
    terminalTypeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    currencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    mccId: Yup.string()
    .trim()
    .required("Mcc is required"),
    actualStartDate: Yup.date()
      .required("Start Date is required")
      .typeError("Start Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date")
      .max(
        Yup.ref("terminationDate"),
        "Start date can't be after Termination date"
      ),
    terminationDate: Yup.date()
      .required("Termination Date is required")
      .typeError("Termination Date format is invalid")
      .min(
        Yup.ref("actualStartDate"),
        "Termination date can't be before Start date"
      ),
  }),
  createTerminalValidationError: {
    terminalTypeId: "Type is required",
    currencyId: "Currency is required",
    mccId: "Mcc is required",
  },
  paymentAccountValidation: Yup.object().shape({
    accountNumber: Yup.string()
      .trim()
      .required("Account Number is required")
      .max(30, "Account Number should not exceed 30 characters"),
    iban: Yup.string()
      .trim()
      .required("IBAN is required")
      .max(30, "IBAN should not exceed 30 characters"),
    currencyMarkup: Yup.number()
      .test('length', decimalError(3, 3), (value) => value ? decimal_3_3_RegExp.test(value!.toString()) : true)
      .transform((value) => (isNaN(value) ? undefined : value)).nullable(),
    bankCodeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    branch: Yup.string().trim()
      .required("Branch is required")
      .min(1, "Branch must be at least 1 character")
      .max(10, "Branch should not exceed 10 characters")
      .matches(/^[a-zA-Z0-9-_ ]*$/, "Branch should be alphanumeric and the allowed special characters are '-' and '_' "),
    beneficiaryName: Yup.string().trim()
      .required("Beneficiary Name is required")
      .min(1, "Beneficiary Name must be at least 1 character")
      .max(50, "Beneficiary Name should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9\-_\u0600-\u06FF ]*$/, "Beneficiary Name should be alphanumeric and the allowed special characters are '-' and '_' "),
  }),
  createPaymentAccountValidation: {
    bankCode: "Bank Code is required",
  },
  contactValidation: Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .max(25, "First Name should not exceed 25 characters"),
    middleName: Yup.string()
      .trim()
      .required("Middle Name is required")
      .max(20, "Middle Name should not exceed 20 characters"),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .max(20, "Last Name should not exceed 20 characters"),
    professionalTitle: Yup.string()
      .trim()
      .max(50, "Professional Title should not exceed 50 characters")
      .nullable(),
    phone1: Yup.string()
      .trim()
      .required("Phone1 is required")
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Phone1 must be less then or equals to 20 digits"),
    mobile1: Yup.string()
      .trim()
      .required("Mobile1 is required")
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Mobile1 must be less then or equals to 20 digits"),
    phone2: Yup.string()
      .trim()
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Phone2 must be less then or equals to 20 digits")
      .nullable(),
    mobile2: Yup.string()
      .trim()
      .matches(phoneRegExp, phoneNumberError)
      .max(20, "Mobile2 must be less then or equals to 20 digits")
      .nullable(),
    address1: Yup.string()
      .trim()
      .max(50, "Address1 must be less then or equals to 50 characters")
      .nullable(),
    address2: Yup.string()
      .trim()
      .max(50, "Address2 must be less then or equals to 50 characters")
      .nullable(),
    address3: Yup.string()
      .trim()
      .max(50, "Address3 must be less then or equals to 50 characters")
      .nullable(),
    address4: Yup.string()
      .trim()
      .max(50, "Address4 must be less then or equals to 50 characters")
      .nullable(),
    postalCodeZip: Yup.string()
      .trim()
      .max(20, "Postal Code must be less then or equals to 20 characters")
      .nullable(),
    geoCode: Yup.string()
      .trim()
      .max(16, "Geo Code must be less then or equals to 16 characters")
      .nullable(),
    fax: Yup.string()
      .trim()
      .max(30, "Fax must be less then or equals to 30 characters")
      .nullable(),
    url: Yup.string()
      .trim()
      .max(255, "URL must be less then or equals to 255 characters")
      .nullable(),
    emailAddress1: Yup.string().email("Email format is invalid.")
      .trim()
      .max(100, "Email1 must be less then or equals to 100 characters")
      .nullable(),
    emailAddress2: Yup.string().email("Email format is invalid.")
      .trim()
      .max(100, "Email2 must be less then or equals to 100 characters")
      .nullable(),
    freeText1: Yup.string()
      .trim()
      .max(100, "Must be less then or equals to 100 characters")
      .nullable(),
  }),
  addressValidation: Yup.object().shape({
    phone1: Yup.string()
      .trim()
      .required("Phone1 is required")
      .matches(phoneRegExp, phoneNumberError),
    mobile1: Yup.string()
      .trim()
      .required("Mobile1 is required")
      .matches(phoneRegExp, phoneNumberError),
  }),
  createAndUpdateNonActivityValidation: Yup.object().shape({
    isEdit: Yup.boolean(),
    chargeMasterId: Yup.string().required("Charge type is required"),
    // chargeFirstTransaction: Yup.string().required("Change first transaction is required"),
    amount: Yup.string().trim().required("Amount is required").matches(decimal_12_3_RegExp, decimalError(12, 3)),
    currencyId: Yup.string().required("Currency is required"),
    startDate: Yup.date()
      .required("Start Date is required")
      .typeError("Start Date format is invalid")
      .max(Yup.ref("endDate"), "Start date can't be after end date")
      .when("isEdit", {
        is: false,
        then: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid")
          .min(new Date((new Date()).getTime() - 86400000), "Start Date must be greater than or equal to today's date"),
        otherwise: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid"),
      }),
    endDate: Yup.date()
      .required("End Date is required")
      .typeError("End Date format is invalid")
      .min(Yup.ref("startDate"), "End date can't be before start date and today's date"),
    // assignedTransactionId: Yup.string().required("Transaction is required"),
    maxAmount: Yup.string()
      .trim(),
    // .min(Yup.ref("amount"), "Max Amount can't be less than Amount"),
    // .matches(decimal_12_3_RegExp, decimalError(12, 3, "Max Amount should not be more than 12 digits"))
    // .required("Maximum Amount is required"),
    frequencyId: Yup.string().required("Frequency is required"),
    terminalTypeId: Yup.string().required("Terminal type is required"),
    numberOfInstallments: Yup.string()
      .trim()
      .max(4, "Value should not exceed 4 characters")
      .required("No Of Installment is required"),
    // cardSchemeId: Yup.string().required("Card scheme is required"),
  }),
  createAndUpdateNonActivityValidationforChangeCount: Yup.object().shape({
    isEdit: Yup.boolean(),
    chargeMasterId: Yup.string().required("Charge type is required"),
    amount: Yup.string().trim().required("Amount is required").matches(decimal_12_3_RegExp, decimalError(12, 3)),
    currencyId: Yup.string().required("Currency is required"),
    // maxAmount: Yup.string()
    //   .trim()
    //   .required("Maximum Amount is required")
    //   .matches(decimal_12_3_RegExp, decimalError(12, 3, "Max Amount should not be more than 12 digits")),
    startDate: Yup.date()
      .required("Start Date is required")
      .typeError("Start Date format is invalid")
      .when("isEdit", {
        is: false,
        then: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid")
          .min(new Date((new Date()).getTime() - 86400000), "Date must be greater than or equal to today's date"),
        otherwise: Yup.date()
          .required("Start Date is required")
          .typeError("Start Date format is invalid"),
      }),
    endDate: Yup.date()
      .required("End Date is required")
      .typeError("End Date format is invalid")
      .min(Yup.ref("startDate"), "End date can't be before start date"),
    frequencyId: Yup.string().required("Frequency is required"),
    terminalTypeId: Yup.string().required("Terminal type is required"),
    numberOfInstallments: Yup.string()
      .trim()
      .max(4, "Value should not exceed 4 characters")
      .required("Installment is required"),
    // cardSchemeId: Yup.string().required("Card scheme is required"),
  }),
  forgotPasswordValidations: Yup.object({
    userName: Yup.string().trim().required("User name is required"),
  }),
  updateCountriesListing: Yup.object().shape({
    cntryCode: Yup.string()
      .trim()
      .required("Country code is required")
      .max(3, "Country code should not exceed 3 characters"),
    cntryCodeAlpha2: Yup.string()
      .trim()
      .required("Country code alpha2 is required")
      .max(2, "Country code alpha2 should not exceed 2 characters"),
    cntryCodeAlpha3: Yup.string()
      .trim()
      .required("Country code alpha3 is required")
      .max(3, "Country code alpha3 should not exceed 3 characters"),
    cntryName: Yup.string()
      .trim()
      .required("Country name is required")
      .max(50, "Country name should not exceed 50 characters"),
    cntryNameAlt: Yup.string()
      .trim()
      .max(100, "Country alt name should not exceed 100 characters")
      .nullable(),
    cntryStatus: Yup.string().trim().required("Country status is required"),
    currPattern: Yup.string()
      .trim()
      .max(20, "Currency pattern should not exceed 20 characters")
      .nullable(),
    datePattern: Yup.string()
      .max(20, "Date pattern should not exceed 20 characters")
      .nullable(),
    economicAreaInd: Yup.string()
      .nullable()
      .matches(/^[aA-zZ\s]*$/, "Only alphabets are allowed for this field")
      .max(4, "Economic area should not exceed 4 characters"),
  }),
 addOrUpdateCitiesListing : Yup.object().shape({
  cityName: Yup.string()
    .trim()
    .required("City Name is required")
    .max(50, "City Name should not exceed 50 characters")
    .matches(
      /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 .\/-]*$/,
      "City Name must contain at least one letter or number and can only contain letters, numbers, spaces, '.', '/', and '-'"
    ),
  cityNameAlt: Yup.string()
    .trim()
    .required("City Alternate Name is required")
    .max(100, "City Alternate Name should not exceed 100 characters")
    .matches(
      /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 .\/-]*$/,
      "City Alternate Name must contain at least one letter or number and can only contain letters, numbers, spaces, '.', '/', and '-'"
    ),
  cityAbbrev: Yup.string()
    .trim()
    .required("City Abbreviation is required")
    .max(3, "City Abbreviation should not exceed 3 characters")
     .matches(
    /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9./-]*$/,
    "City Abbreviation must contain at least one letter or number and can only contain letters, numbers, '.', '/', and '-' (no spaces)"
  ),
  // cntryCode: Yup.string()
  //   .trim()
  //   .required("Country Code is required")
  //   .max(3, "Country Code should not exceed 3 characters")
  //   .nullable(),
  // provStateAbbrev: Yup.string()
  //   .trim()
  //   .max(3, "Province abbreviation should not exceed 3 characters")
  //   .nullable(),
}),
  addMerchantTransactionValidation: Yup.object().shape({
    cardNumber: Yup.string()
      .trim()
      .max(19, "Card Number should not be exceed 19 characters")
      .required("Card Number is required"),
    authorizationNumber: Yup.string()
      .max(6, "Authorization Number should not exceed 6 characters")
      .nullable(),
    cardSeqNbr: Yup.string()
      .max(4, "Card Sequence Number should not exceed 4 characters")
      .nullable(),
    tipsCurrency: Yup.string().max(
      3,
      "Tips Currency should not exceed 3 characters"
    ),
    comments: Yup.string()
      .max(100, "Description should not exceed 100 characters")
      .nullable(),
    terminalId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    transactionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
transactionDate: Yup.date()
  .nullable()
  .transform((value, originalValue) => {
    // If the cast result is Invalid Date, return null so typeError/test can handle it
    if (originalValue === "" || originalValue === null) return null;
    const parsed = new Date(originalValue);
    return isNaN(parsed.getTime()) ? new Date("") : parsed;
  })
  .typeError("Transaction Date format is invalid")  // handles Invalid Date from transform
  .test(
    "transactionDate",
    "Transaction Date is required",
    function (value) {
      const { createError, parent } = this;
      if (value === null || value === undefined) {
        return createError({ message: "Transaction Date is required" });
      }
      if (isNaN(new Date(value).getTime())) {
        return createError({ message: "Transaction Date format is invalid" });
      }
      // Fix 2: changed > to >= and updated the message
      if (parent.expiryDate && new Date(value) >= new Date(parent.expiryDate)) {
        return createError({
          message: "Transaction Date should not be greater than or equal to Expiry Date",
        });
      }
      return true;
    }
  )
  .min(new Date("01/01/1900"), "Please enter a valid date"),
    expiryDate: Yup.date()
      .required("Expiry Date is required")
      .nullable()
      .typeError("Expiry Date format is invalid")
      .min(Yup.ref("transactionDate"), "Expiry Date should be greater than transaction Date"),
    transactionAmount: Yup.string()
      .required("Transaction Amount is required")
      .test(
        "maxDigitsAfterDecimal",
        "Transaction amount must have 28 digits before decimal and 8 digits after decimal or less",
        (transactionAmount) =>
          /^\d+(\.\d{1,8})?$/.test(transactionAmount ? transactionAmount : "")
      )
      .matches(decimal_18_8_RegExp, decimalError(18, 8))
      .nullable(),
    tipsAmount: Yup.string()
      .test(
        "maxDigitsAfterDecimal",
        "Tips amount must have 28 digits before decimal and 8 digits after decimal or less",
        (tipsAmount) => /^\d*(\.\d{1,8})?$/.test(tipsAmount ? tipsAmount : "")
      )
      .max(35, "Tips Amount should not exceed 35 digits")
      .nullable(),
    transactionCurrencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
  }),
  merchantTransactionValidationMessage: {
    transactionId: "Transaction is required",
    transactionCurrencyId: "Currency is required",
    terminalId: "Terminal is required",
  },
  filterMerchantTransactionValidation: Yup.object({
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    fromTransactionDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    toTransactionDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(Yup.ref("fromTransactionDate"), "To Transaction Date should be greater or equal to From Transaction Date"),
  }),
  filterMerchantTransactionValidationMessage: {
    institutionId: "Institution is required",
  },
  filterAcquiringTransactionValidation: Yup.object({
    merchantName :  Yup.lazy((v) => {
      return Yup.string()
    }),
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    fromProcessingDate: Yup.date()
      .required("From Processing Date is required")
      .typeError("From Processing Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    toProcessingDate: Yup.date()
      .required("To Processing Date is required")
      .typeError("To Processing Date format is invalid")
      .min(Yup.ref("fromProcessingDate"), "To Processing Date should be greater than or equal to From Processing Date"),
  }),
  filterAcquiringTransactionValidationMessage: {
    institutionId: "Institution is required",
  },
  acquiringTransactionRepresenmentValidation: Yup.object({
    systemCodeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    chargebackComment: Yup.string().required("Comment is required"),
  }),
  acquiringTransactionRepresenmentValidationMessage: {
    systemCodeId: "Presentment Reason is required",
  },
  acquiringTransactionReversalValidation: Yup.object({
    systemCodeId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    reversalComment: Yup.string().required("Comment is required"),
  }),
  acquiringTransactionReversalMessage: {
    systemCodeId: "Reversal Reason is required",
  },
  haltPayValidation: Yup.object({
    payHaltStatus: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    payHaltComment: Yup.string().required("Comment is required"),
  }),
  haltPayValidationMessage: {
    payHaltStatus: "Halt/Pay status is required",
  },
  addManualNonActivityTransactionValidation: Yup.object({
    transactionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    transactionCurrencyId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    transactionDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    comments: Yup.string()
      .max(100, "Description should not exceed 100 characters")
      .nullable(),
    transactionAmount: Yup.string()
      .required("Transaction Amount is required")
      .matches(decimal_18_8_RegExp, decimalError(18, 8))
      .nullable(),
  }),
  manualNonActivityTransactionValidationMessage: {
    transactionId: "Transaction is required",
    transactionCurrencyId: "Transaction Currency is required",
  },
  filterManualNonActivityTransactionValidation: Yup.object({
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    fromTransactionDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    toTransactionDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(Yup.ref("fromTransactionDate"), "To Transaction Date should be greater than or equal to From Transaction Date"),
  }),
  filterManualNonActivityTransactionValidationMessage: {
    institutionId: "Institution is required",
  },
  filterNonActivityFeeQueryValidation: Yup.object({
    institutionId: Yup.lazy((v) => {
      if (v === "") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    fromProcessingDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    toProcessingDate: Yup.date()
      .required("Transaction Date is required")
      .typeError("Transaction Date format is invalid")
      .min(Yup.ref("fromProcessingDate"), "To Processing Date should be greater than or equal to From Processing Date"),
  }),
  filterNonActivityFeeQueryValidationMessage: {
    institutionId: "Institution is required",
  },

  createUserValidations: Yup.object({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .max(50, "First name not exceed 50 characters"),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .max(50, "Last name not exceed 50 characters"),
    username: Yup.string()
      .trim()
      .required("User Name is required")
      .max(50, "User Name not exceed 50 characters"),
    mobile: Yup.string()
      .trim()
      .required("Mobile Number is required")
      .matches(phoneRegExp, phoneNumberError),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        "Enter valid Email"
      )
      .min(6, "Email must be at least 6 characters")
      .max(70, "Email must not exceed 70 characters"),
    preferedLanguageCodeValue: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    status: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
  }),
  createUser: {
    language: "Preferred Interface Language is required",
    institution: "Default Institution is required",
    branch: "Default Branch is required",
    accesslevel: "Access Level is required",
    status: "Initial Status is required",
    assignedRoles: "Assign atleast one Role",
  },

  createRoleValidations: Yup.object({
    roleName: Yup.string()
      .trim()
      .required("Role Name is required")
      .max(50, "Role Name not exceed 50 characters"),
    roleDesc: Yup.string()
      .trim()
      .required("Role Description is required")
      .max(200, "Role Name not exceed 50 characters"),
  }),

  transactionValidations: Yup.object({
    transactionId: Yup.string()
      .trim()
      .required("Transaction Id is required")
      .max(50, "Transaction Id not exceed 50 characters"),
    description: Yup.string()
      .trim()
      .required("Transaction Description is required")
      .max(50, "Transaction Description not exceed 50 characters"),
    signFlag: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    transUsage: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
  }),

  createTransactionValidation: {
    transactionType: "Debit/Credit is required",
    transUsage: "Usage is required",
  },

  systemcodeValidations: Yup.object({
    institutionId: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    codePrefix: Yup.lazy((v) => {
      if (v === " ") {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    codeSuffix: Yup.string().trim().required("Suffix is required"),
    description: Yup.string().trim().required("Description is required"),
  }),

  createSystemCodesValidation: {
    institution: "institution is required",
    codePrefix: "Prefix is required",
  },
  createIssuerProfileValidations: Yup.object().shape({
    profileDescription: Yup.string().trim()
      .required("Profile Description is required")
      .min(1, "Profile Description must be at least 1 character")
      .max(50, "Profile Description should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9 ]*$/, "Profile Description must only contain letters and numbers"),
    issuerAcqProfile: Yup.string().trim()
      .required("Issuer Profile is required")
      .min(1, "Issuer Profile must be at least 1 character")
      .max(10, "Issuer Profile should not exceed 10 characters")
      .matches(/^[a-zA-Z0-9_*-]*$/, "Issuer Profile should be alphanumeric and the allowed special characters are '-' and '_' and '*'")
  }),
  createIssuerRelationValidations: Yup.object().shape({
    panRangeFrom: Yup.string().trim()
      .required("Pan Range From is required")
      .test("panRangeFrom", "Pan Range From must only contain numbers", (value) => {
        return Number.isNaN(Number.parseInt(value!)) ? false : true
      })
      .test("panRangeFrom", "Pan Range From must be less or equal to Pan Range To", function (value) {
        let panRangeTo = this.parent["panRangeTo"];
        let panRangeFrom = value;
        try {
          const bigPanRangeTo = BigInt(panRangeTo);
          const bigPanRangeFrom = BigInt(panRangeFrom as string);
          if (panRangeFrom !== undefined && bigPanRangeFrom > bigPanRangeTo) {
            return false;
          }
        } catch (Error) {
          return false;
        }
        return true;
      }),
    panRangeTo: Yup.string()
      .required("Pan Range To is required")
      .test("panRangeFrom", "Pan Range From must only contain numbers", (value) => {
        return Number.isNaN(Number.parseInt(value!)) ? false : true
      })
      .test("panRangeTo", "Pan Range To must be greater or equal to Pan Range From", function (value) {
        let panRangeFrom = this.parent["panRangeFrom"];
        let panRangeTo = value;
        try {
          const bigPanRangeFrom = BigInt(panRangeFrom);
          const bigPanRangeTo = BigInt(panRangeTo as string);
          if (panRangeTo !== undefined && bigPanRangeTo < bigPanRangeFrom) {
            return false;
          }
        } catch (Error) {
          return false;
        }
        return true;
      }),
  }),
  createBankInfoValidations: Yup.object().shape({
    bankName: Yup.string().trim()
      .required("Bank Name is required")
      .min(1, "Bank Name must be at least 1 character")
      .max(50, "Bank Name should not exceed 50 characters")
      .matches(/^[a-zA-Z ]*$/, "Bank Name must only contain letters"),
    altBankName: Yup.string().trim()
      .required("Alternative Bank Name is required")
      .min(1, "Alternative Bank Name must be at least 1 character")
      .max(100, "Alternative Bank Name should not exceed 100 characters")
      .matches(/^[a-zA-Z ]*$/, "Alternative Bank Name must only contain letters"),
    bankCode: Yup.string().trim()
      .required("Bank Code is required")
      .min(1, "Bank Code must be at least 1 character")
      .max(10, "Bank Code should not exceed 10 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Bank Code must only contain letters and numbers"),
    swiftCode: Yup.string().trim()
      .max(15, "Swift Code should not exceed 15 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Swift Code must only contain letters and numbers"),
  }),
  createInstitutionAccountsValidations: Yup.object().shape({
    issuerAcqProfile: Yup.string().trim()
      .required("Issuer Profile is required"),
    bankCode: Yup.string().trim()
      .required("Bank Code is required"),
    cardSchemeId: Yup.string().trim()
      .required("Card Scheme is required"),
    currencyCode: Yup.string().trim()
      .required("Currency is required"),
    accountType: Yup.string().trim()
      .required("Account Type is required")
      .min(1, "Account Type must be at least 1 character")
      .max(6, "Account Type should not exceed 6 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Account Type must only contain letters and numbers"),
    accountDescription: Yup.string().trim()
      .required("Account Description is required")
      .min(1, "Account Description must be at least 1 character")
      .max(50, "Account Description should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9 ]*$/, "Account Description must only contain letters and numbers"),
    accountNumber: Yup.string().trim()
      .required("Account Number is required")
      .min(1, "Account Number must be at least 1 character")
      .max(30, "Account Number should not exceed 30 characters")
      .matches(/^[0-9]*$/, "Account Number must only contain numbers"),
    iban: Yup.string().trim()
      .required("IBAN is required")
      .min(1, "IBAN must be at least 1 character")
      .max(30, "IBAN should not exceed 30 characters")
      .matches(/^[a-zA-Z0-9]*$/, "IBAN must only contain numbers and letters"),
    branch: Yup.string().trim()
      .required("Branch is required")
      .min(1, "Branch must be at least 1 character")
      .max(10, "Branch should not exceed 10 characters")
      .matches(/^[a-zA-Z0-9-_ ]*$/, "Branch should be alphanumeric and the allowed special characters are '-' and '_' "),
    beneficiaryName: Yup.string().trim()
      .required("Beneficiary Name is required")
      .min(1, "Beneficiary Name must be at least 1 character")
      .max(50, "Beneficiary Name should not exceed 50 characters")
      .matches( /^[a-zA-Z0-9\-_\u0600-\u06FF ]*$/, "Beneficiary Name should be alphanumeric and the allowed special characters are '-' and '_' "),
  }),
  createAccountingTemplateHDRValidations: Yup.object().shape({
    templateDescription: Yup.string().trim()
      .required("Template Description is required")
      .min(1, "Template Description must be at least 1 character")
      .max(50, "Template Description should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9 ]*$/, "Template Description must only contain letters and numbers"),
    accountTemplate: Yup.string().trim()
      .required("Template Code is required")
      .min(1, "Template Code must be at least 1 character")
      .max(10, "Template Code should not exceed 10 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Template Code must only contain letters and numbers"),
  }),
  createAccountingTemplateDetailsValidations: Yup.object().shape({
    accountOrigin: Yup.string().trim()
      .required("Account Origin is required"),
    amountType: Yup.string().trim()
      .required("Amount Type is required"),
    transId: Yup.string().trim()
      .required("Transaction is required"),
    signFlag: Yup.string().trim()
      .required("Sign Flag is required"),
    lineDescription: Yup.string().trim()
      .required("Line Description is required")
      .min(1, "Line Description must be at least 1 character")
      .max(50, "Line Description should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9 ]*$/, "Line Description must only contain letters and numbers"),
    percentageApplied: Yup.string()
      .matches(/^[0-9.]*$/, "Percentation Applied must only contain numbers"),
    percentSrc: Yup.string()
      .trim()
      .test("percentSrc", "Percentage Source is required", function (value: any) {
        let amountType = this.parent["amountType"];
        if (amountType === "COM" && (value === null || value === "") ) {
          return false;
        }
        return true;
      })
      .nullable()
  }),
  createOutputFileTemplateValidations: Yup.object().shape({
    sumPerAccount: Yup.string().trim()
      .required("Sum Per Account is required"),
    merchantSubSummary: Yup.string().trim()
      .required("Merchant Sub Summary is required"),
    instSubSummary: Yup.string().trim()
      .required("Institution Sub Summary is required"),
    outputFormat: Yup.string().trim()
      .required("Output Format is required"),
    outputFileType: Yup.string().trim()
      .required("Output File Type is required"),
    outputDescription: Yup.string().trim()
      .required("Output Description is required")
      .min(1, "Output Description must be at least 1 character")
      .max(50, "Output Description should not exceed 50 characters")
      .matches(/^[a-zA-Z0-9 ]*$/, "Output Description must only contain letters and numbers"),
    separator: Yup.string()
      .matches(/^[-/,|.]*$/, "Allowed Separators are /-,|.")
      .nullable(),
    outputFileTypeAbbr: Yup.string().trim()
    .required("Output File Type Abbreviation is required")
    .min(1, "Output File Type Abbreviation must be at least 1 character")
    .max(50, "Output File Type Abbreviation should not exceed 50 characters")
    .matches(/^[a-zA-Z0-9_]*$/, "Output File Type Abbreviation must be alphanumeric and only special character allowed is '_'"),
  }),
  createOutputFileTemplateDetailsValidations: Yup.object().shape({
    // fieldFormat: Yup.string().trim()
    //   .matches(/^[a-zA-Z]*$/, "Field Format must only contain letters"),
    fieldLength: Yup.string().trim()
      .matches(/^[0-9]*$/, "Field Length must only contain numbers"),
    // numericMultiply: Yup.string().trim()
    //   .matches(/^[0-9]*$/, "Numeric Multiply must only contain numbers"),
    fieldFormat: Yup.string()
    .trim()
    .test(
      'validate-numericMultiply',
      'Invalid input', // Generic error message that can be replaced below
      function (value: any) {
        const { description } = this.options.context || {};
      
        if (description === 'OUT ACCOUNTING ENTRY DESCRIPTION') {
          // If description is "OUT ACCOUNTING ENTRY DESCRIPTION"
          if (!value) {
            return this.createError({
              message: 'Numeric Multiply is required for OUT ACCOUNTING ENTRY DESCRIPTION',
            });
          }
          if (value.length > 100) {
            return this.createError({
              message: 'Maximum 100 characters allowed for this field',
            });
          }
          return true; // Valid input for this case
        } 

      if (description?.toLowerCase().includes('date')) {
        // If description includes "date"
        if (!value) {
          return this.createError({
            message: 'Format Syntax is required',
          });
        }
        if (!/^[a-zA-Z0-9\s-_]*$/.test(value)) {
          return this.createError({
            message: 'Format Syntax can contain letters, numbers, -, _, and spaces',
          });
        }
        return true; // Valid input for this case
      }

      if (!/^[0-9]*$/.test(value)) {
        return this.createError({
          message: 'Numeric Multiply must only contain numbers',
        });
      }
      if (value && value.length > 2) {
        return this.createError({
          message: 'Maximum 2 digits allowed',
        });
      }
      if (!value) {
        return this.createError({
          message: 'Numeric Multiply is required',
        });
      }
      
      return true; // If all validations pass
    }
  ),
  }),
  filterTaskExecutionLogValidation: Yup.object({
    // taskId: Yup.number()
    //   .required("Task is required"),
    startDatetime: Yup.date()
      .required("Start Date time is required")
      .typeError("Start Date time format is invalid")
      .min(new Date("01/01/1900"), "Please enter a valid date"),
    endDatetime: Yup.date()
      .required("End Date time is required")
      .typeError("End Date time format is invalid")
      .min(Yup.ref("startDatetime"), "End Date time should be greater than or equal to Start Date time"),
  }),
  accountingTemplateSubHDRValidations: Yup.object({
    templateCode: Yup.string()
      .trim()
      .required("Template Code is required")
      .matches(/^[a-zA-Z0-9]*$/, "Template Code must only contain letters and numbers"),
    tenplateDescription: Yup.string()
      .trim()
      .required("Template Description is required")
      .matches(/^[a-zA-Z0-9 ]*$/, "Template Description must only contain letters and numbers"),
  }),
  createAccountingTemplatesubHDRValidations: Yup.object({
    bankCode: Yup.lazy((v) => {
      if (v === "" || v === null) {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    tenplateDescription: Yup.string()
      .required("Description is required")
      .matches(/^[a-zA-Z0-9 ]*$/, "Template Description must only contain letters and numbers"),
  }),
  AccTemplateSubHDRValidationMsg: {
    bankCode: "Bank is required"
  },
  createInstitutionControlValidations: Yup.object().shape({
    baseCurrency: Yup.string().trim()
      .required("Base Currency is required"),
    merchantRateUsage: Yup.string().trim()
      .required("Merchant Rate Usage is required"),
    weekDay: Yup.string().trim()
      .required("Weekday is required"),
    outputDirectory: Yup.string().trim()
      .required("Output Directory is required")
      .min(1, "Output Directory must be at least 1 character")
      .max(40, "Output Directory should not exceed 40 characters"),
    inputDirectory: Yup.string().trim()
      .required("Input Directory is required")
      .min(1, "Input Directory must be at least 1 character")
      .max(40, "Input Directory should not exceed 40 characters"),
    discountReturnOn: Yup.string()
      .required("Discount Return On is required")
      .test("discountReturnOn", "Discount Return On From must only contain numbers", (value) => {
        return Number.isNaN(Number.parseInt(value!)) ? false : true
      })
      .test("discountReturnOn", "Discount Return On must not exceed 31 days", function (value) {
        let discountReturnOn = value;
        try {
          const bigDiscountReturnOn = BigInt(discountReturnOn as string);
          if (discountReturnOn !== undefined && bigDiscountReturnOn > 31) {
            return false;
          }
        } catch (Error) {
          return false;
        }
        return true;
      }),
    eodProcessByTxn: Yup.string().trim()
      .required("EOD Process by Transaction is required")
  }),

  importMerchantsValidations: Yup.object().shape({
    job: Yup.string()
    .trim()
    .required("Job is required"),
    filepath: Yup.string()
    .required("File Path is required")
    .matches(
      /^[a-zA-Z0-9./\\:]+$/,
      "File Path should be an alphanumeric string, the allowed special characters are â€œ.â€, â€œ/â€, â€œ:â€"
    ),
    backupFile: Yup.string()
    .required("Backup File is required")
    .matches(
      /^[a-zA-Z0-9./\\:]+$/,
      "Backup File should be an alphanumeric string, the allowed special characters are â€œ.â€, â€œ/â€, â€œ:â€"
    )
  }),
    ScheduleValidation: {
    startDate: "Start Date is required",
    startTime: "Start Time is required",
  },
  addScheduleValidationContinuous: Yup.object({
  }),
  addScheduleValidation: Yup.object({
    startDate: Yup.lazy((v) => {
      if (v === "" || v === null || v === undefined) {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
      // return Yup.date().max(
      //   Yup.ref("endDate"),
      //   "Start date can't be after End date"
      // );
    }),
    startTime: Yup.lazy((v) => {
      if (v === "" || v === null) {
        return Yup.object({ x: Yup.string().required() });
      }
      return Yup.string();
    }),
    monthDay: Yup.string()
      // .max(31, "Day should be a numeric value between 0 and 31")
      .test(
        "monthDay",
        "Day should be a numeric value between 0 and 31",
        function (value: any) {
          let freq = this.parent["frequency"] ?? "0";
          if (
            value !== undefined &&
            (Number(value) > 31 || Number(value) < 0) &&
            freq === "2"
          ) {
            return false;
          }
          return true;
        }
        // (val) => val?.length !== undefined && Number(val) < 32
      )
      .matches(/^[0-9]+$/, "Day should be a numeric value between 0 and 31"),
    stopHrs: Yup.string().test(
      "stopHrs",
      "Stop Task hours is required",
      function (value: any) {
        let stopFlag = this.parent["stopTaskFlag"] ?? "0";
        if (stopFlag === "1" && (value === " " || value === undefined)) {
          return false;
        }
        return true;
      }
    ),
    stopMins: Yup.string().test(
      "stopMins",
      "Stop Task minutes is required",
      function (value: any) {
        let stopFlag = this.parent["stopTaskFlag"] ?? "0";
        if (stopFlag === "1" && (value === " " || value === undefined)) {
          return false;
        }
        return true;
      }
    ),
    endDate: Yup.string()
      .test("stopHrs", "Expire date is required", function (value: any) {
        let expireFlag = this.parent["expireFlag"] ?? "0";
        if (expireFlag === "1" && (value === null || value === undefined)) {
          return false;
        }
        return true;
      })
      .nullable(true),
    expireTime: Yup.string()
      .test("stopHrs", "Expire time is required", function (value: any) {
        let expireFlag = this.parent["expireFlag"] ?? "0";
        if (expireFlag === "1" && (value === null || value === undefined || value === "")) {
          return false;
        }
        return true;
      })
      .nullable(true),
    repeatHrs: Yup.string().test(
      "repeatHrs",
      "Repeat task hours is required",
      function (value: any) {
        let stopFlag = this.parent["recurring"] ?? "0";
        let freq = this.parent["frequency"] ?? "0";
        if (
          (stopFlag === "1" || stopFlag === true) &&
          (value === " " || value === undefined) &&
          freq === "1"
        ) {
          return false;
        }
        return true;
      }
    ),
    // repeatMins: Yup.string().test(
    //   "repeatMins",
    //   "Repeat task minutes is required",
    //   function (value: any) {
    //     let stopFlag = this.parent["recurring"] ?? "0";
    //     let freq = this.parent["frequency"] ?? "0";
    //     if (
    //       (stopFlag === "1" || stopFlag === true) &&
    //       (value === " " || value === undefined) &&
    //       freq === "1"
    //     ) {
    //       return false;
    //     }
    //     return true;
    //   }
    // ),
    // repeatSecs: Yup.string().test(
    //   "repeatSecs",
    //   "Repeat task seconds is required",
    //   function (value: any) {
    //     let stopFlag = this.parent["recurring"] ?? "0";
    //     let freq = this.parent["frequency"] ?? "0";
    //     if (
    //       (stopFlag === "1" || stopFlag === true) &&
    //       (value === " " || value === undefined) &&
    //       freq === "1"
    //     ) {
    //       return false;
    //     }
    //     return true;
    //   }
    // ),
  }),
  
};

export default validations;
export {addJobValidation};