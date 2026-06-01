import React, { useState } from "react";
import "./App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { useLocation } from "react-router";
import RouteList from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import projectTheme from "./theme/theme";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { ApplicationLanguage } from "./utils/constant";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "./utils/helper";

const loginUser = JSON.parse(
    getLocalStorage(LOCALSTORAGE_KEYS.USER) as string
);
const defaultLocale =
    typeof window !== "undefined"
        ? getLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE)
            ? getLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE) === ApplicationLanguage.ARABIC
                ? "ar"
                : "en"
            : loginUser?.user?.preferedLanguageCodeDescription.toString().toLowerCase() === "arabic"
                ? "ar"
                : "en"
        : "en"; // English is default locale if none is set

const messages = {
    en: require("./../src/translations/en.json"),
    ar: require("./../src/translations/ar.json"),
};

function App() {
    const { pathname } = useLocation();
    const [currentLocale, setCurrentLocale] = useState<string>(
        defaultLocale === null ? "en" : defaultLocale
    );
    return (
        <>
            <IntlProvider
                locale={currentLocale}
                messages={currentLocale === "ar" ? messages.ar : messages.en}
            >
                <ThemeProvider theme={projectTheme}>
                    {pathname.startsWith("/designer") ? (
                        <RouteList></RouteList>
                    ) : (
                        <>
                            {pathname === "/" ? (
                                <Login></Login>
                            ) : pathname === "/forgot-password" ? (
                                <ForgotPassword></ForgotPassword>
                            ) : (
                                <>
                                    <Sidebar />
                                    <Header setCurrentLocale={setCurrentLocale} />
                                    <RouteList></RouteList>
                                </>
                            )}
                        </>
                    )}
                    <ToastContainer />
                </ThemeProvider>
            </IntlProvider>
        </>
    );
}

export default App;
