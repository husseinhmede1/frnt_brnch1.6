import axios from "axios";
import { toast } from "react-toastify";
import { Errors } from "../utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../utils/helper";
import { env as envInject } from '../env'

const _baseUrl: string = envInject.REACT_APP_API_ROOT_URL ?? "";
export const _version: string = process.env.REACT_APP_VERSION ?? "";
export const _type1: string = process.env.REACT_APP_TYPE1 ?? "";
export const _type2: string = process.env.REACT_APP_TYPE2 ?? "";
export const _type3: string = process.env.REACT_APP_TYPE3 ?? "";
export const _type4: string = process.env.REACT_APP_TYPE4 ?? "";
export const _type5: string = process.env.REACT_APP_TYPE5 ?? "";

const AssignRolesStr = getLocalStorage(LOCALSTORAGE_KEYS.ROLE_ACTIVITY);
export const AssignRoles = JSON.parse(AssignRolesStr as string);

const selectedInstStr = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE);
export const selectedInst = selectedInstStr;

export const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
const InstStr = getLocalStorage(LOCALSTORAGE_KEYS.INSTITUTES);
export const InstitutionList = InstStr ? JSON.parse(InstStr as string) : [];

const request = axios.create({
    baseURL: `${_baseUrl}`,
    responseType: "json",
});

let requests: string[] = [];
let conflictRequest: string = "";

// Request interceptors Customize based on your need
request.interceptors.request.use(
    async (config: any) => {
        if (config.headers) {
            config.headers["Content-Type"] = "application/json";
            config.headers["Access-Control-Allow-Origin"] = "*";
        }
        const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
        const selectedinstID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE);

        showLoader(true);

        if (userStr) {
            const user = JSON.parse(userStr);
            config.headers.Authorization =
                user && user.token ? `Bearer ${user.token}` : "";
            if (selectedinstID) {
                config.headers.instId = selectedinstID
                    ? selectedinstID
                    : user && user.user.instId
                        ? user.user.instId
                        : null;
            }
        }
        requests.push(config.url);
        return config;
    },
    (error: any) => {
        alert(error);
        Promise.reject(error);
    }
);

// Response interceptors Customize based on your need
request.interceptors.response.use(
    (response: any) => {
        const { data } = response;
        //console.log(response, "get response from api call");
        removeRequest(response.config.url);

        if (data?.code && data?.code !== "OK") {
            return Promise.reject(new Error(response.message || "Error"));
        } else {
            return Promise.resolve(response);
        }
    },
    (error: any) => {
        console.log(error, "errors from api call");
        removeRequest(error.config.url);
        showLoader(false);

        //These conditions means , page level catch are kept so 500 should not be thrown for these handled errors

        if (error?.response?.status === 401 && error.config.url !== '/authenticate') {
            // window.location.href = "/";
        }

        // if (
        //     error &&
        //     error.response &&
        //     error?.response?.status !== 401 &&
        //     error?.response?.status !== 406 &&
        //     error.response.data !== Errors.ReferenceExists &&
        //     error.response.data !== Errors.institutionNotFound &&
        //     error.response.data !== Errors.uniqueEntity &&
        //     error.response.data !== Errors.IdAlreadyExists &&
        //     error.response.data !== Errors.uniqueInstitution &&
        //     error.response.data !== Errors.uniqueCurrencyCode &&
        //     error.response.data !== Errors.uniqueCurrencyName &&
        //     error.response.data !== Errors.uniqueCurrencyNameAndCode &&
        //     error.response.data !== Errors.representmentAlreadyDone &&
        //     error.response.data !== Errors.reversalAlreadyDone &&
        //     error.response.data !== Errors.userDisable &&
        //     error.response.data !== Errors.uniqueEmail &&
        //     error.response.data !== Errors.userNameExist &&
        //     error.response.data !== Errors.dataIntegrity &&
        //     error.response.data !== Errors.defaultRole &&
        //     error.response.data !== Errors.RoleNameExist &&
        //     error.response.data !== Errors.transIdNotFound &&
        //     error.response.data !== Errors.validInstId &&
        //     error.response.data !== Errors.invalidRole &&
        //     error.response.data !== Errors.transactionGroupExists &&
        //     error.response.data !== Errors.codeSuffixExists &&
        //     error.response.data !== Errors.currencyConversionExists &&
        //     error.response.data !== Errors.currencyRateValueLarger &&
        //     error.response.data !== Errors.mccAlreadyExists &&
        //     error.response.data !== Errors.terminalTypeExists &&
        //     error.response.data !== Errors.incorrectUsername
        // ) {
        //     if (error.response.data === Errors.backDatedCurrencyRate) {
        //         toast.error(Errors.backDatedCurrencyRateErr);
        //     } else {
                // toast.error(error.response.data);
          //toast.error(error.response.data.errors[0])
                
        //     }
        // }

        return Promise.reject(error);
    }
);

const showLoader = (show: boolean) => {
    if (show) {
        if (document.getElementById("loading")) {
            document.getElementById("loading")?.classList?.add("loading");
            document.getElementById("loading")?.classList?.remove("spinner-disable");
        }
    } else {
        if (document.getElementById("loading")) {
            document.getElementById("loading")?.classList?.remove("loading");
            document.getElementById("loading")?.classList?.add("spinner-disable");
        }
    }
};

// remove completed request
function removeRequest(req: string) {
    const i = requests.indexOf(req);
    if (i >= 0) {
        requests.splice(i, 1);
    }

    if (requests.length > 0) {
        showLoader(true);
    } else {
        showLoader(false);
    }
    if (req === conflictRequest) {
        conflictRequest = "";
        requests = requests.filter((request) => request !== req);
    }
}

export default request;
