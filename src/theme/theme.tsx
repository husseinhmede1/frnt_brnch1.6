import { createTheme } from "@mui/material/styles";
const breakpointsValues = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1560,
}

const customTheme = createTheme({
    breakpoints: {
        values: breakpointsValues,
    },
})
let projectTheme = createTheme({
    breakpoints: {
        values: breakpointsValues,
    },
    palette: {
        primary: {
            main: "#F08557",
            contrastText: "#fff"
        },
        secondary: {
            main: "#DFDFDF",
            contrastText: "#2E2E2E"
        },
        error: {
            main: "#E12020",
            contrastText: "#EA2828",
        },
        text: {
            primary: "#2E2E2E",
        },
    },
    spacing: 5,
    // Typography
    typography: {
        fontFamily: "Lato, sans-serif",
        h2: {
            fontSize: "24px",
            lineHeight: "28px",
            fontWeight: "700",
            [customTheme.breakpoints.up('xs')]: {
                fontSize: '20px',
            },
            [customTheme.breakpoints.up('md')]: {
                fontSize: '22px',
            },
            [customTheme.breakpoints.up('xl')]: {
                fontSize: '24px',
            },


        },
        body1: {
            fontFamily: "Lato, sans-serif",
        }

    },
});


projectTheme = createTheme(projectTheme, {
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: "1px solid #EBEBEB",
                    "& .MuiCardHeader-root": {
                        "& .MuiCardHeader-subheader": {
                            display: "flex",
                            flexWrap: "wrap",
                            lineHeight: '22px',
                            fontSize: '16px',
                            color: [projectTheme.palette.text.primary],
                        },
                    },
                },
            },
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: "16px",
                    lineHeight: "22px",
                    border: "1px solid #E9E9E9",
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    ":hover:not(&.Mui-disabled)": {
                        borderColor: '#F08557'
                    },
                    "& .MuiInputBase-input": {
                        padding: '0px',
                        height: "22px",
                        textOverflow: "ellipsis",
                    },
                    "&.Mui-focused": {
                        borderColor: '#F08557 !important',
                    },
                    "&.bg-primary": {
                        backgroundColor: "#FFF4E8",
                        borderColor: '#FCDDD0'
                    }
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "24px",
                    padding: "8px 22px",
                    [customTheme.breakpoints.up('xs')]: {
                        fontSize: "16px",
                        lineHeight: "20px",
                        padding: "6px 18px"
                    },
                    [customTheme.breakpoints.up('md')]: {
                        fontSize: "18px",
                        lineHeight: "22px",
                        padding: "7px 20px"
                    },
                    [customTheme.breakpoints.up('xl')]: {
                        fontSize: "20px",
                        lineHeight: "24px",
                        padding: "8px 22px"
                    },
                },
                containedError: {
                    color: "#EA2828",
                    backgroundColor: "#FFD6D6",
                    "&:hover:not(&.Mui-disabled)": {
                        backgroundColor: '#ffbfbf'
                    },
                }
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    marginTop: "15px",
                },
                selectLabel: {
                    color: "#323232",
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "0",
                },
                select: {
                    textAlign: "left",
                    fontWeight: "500",
                    textAlignLast: "left",
                    fontSize: "15px",
                    color: "#323232",
                    minWidth: "30px !important",
                },
                displayedRows: {
                    color: "#323232",
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "0",
                },
                actions: {
                    button: {
                        backgroundColor: "#d3d3d3",
                        borderRadius: "5px",
                        width: "25px",
                        height: "25px",
                        marginRight: "10px",
                        "&:last-child": {
                            marginRight: "0",
                        },
                        "&.Mui-disabled": {
                            backgroundColor: "#e5e5e5",
                        },
                        "&:hover:not(&.Mui-disabled)": {
                            backgroundColor: '#ffbfbf',
                            svg: {
                                fill: "#fff",
                            },
                        },
                    },
                },
            }
        },
    },

},
);


export default projectTheme;
