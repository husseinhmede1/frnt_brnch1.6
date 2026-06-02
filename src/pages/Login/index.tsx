import { yupResolver } from "@hookform/resolvers/yup";
import {
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputBase,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { lockIcon, logo, userIcon } from "../../assets/images";
import { ILoginModel } from "../../models/login/LoginModel";
import { LoginService } from "../../services/login-service";
import { ModuleService } from "../../services/lookup/module-service";
import { ApplicationLanguage, StatusCode } from "../../utils/constant";
import { LOCALSTORAGE_KEYS, setLocalStorage, signOut } from "../../utils/helper";
import validations from "../../utils/validations";

function Login() {
    const navigate = useNavigate();
    const intl = useIntl();
    const [error, setError] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ILoginModel>({
        resolver: yupResolver(validations.loginValidations),
    });

    useEffect(() => {
        signOut()
    }, [])

    const onSubmit = async (value: ILoginModel) => {
        LoginService.loginUser(value)
            .then(async (res: any) => {
                if (res.status === StatusCode.Success) {
                    const data = JSON.stringify(res.data);
                    if (res.data?.user && res.data?.user?.institution?.length === 0) {
                        toast.error("Unable to login as no institution assigned");
                    } else {
                        setLocalStorage(LOCALSTORAGE_KEYS.USER, data);

                        const filteredInstitute = res.data?.user?.institution?.filter(
                            (s: any) => s.status === "1"
                        );

                        // if (filteredInstitute?.length === 1) {
                        //   setLocalStorage(
                        //     LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE,
                        //     filteredInstitute[0]?.institutionId
                        //   );
                        // }

                        //         const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
                        // let user = JSON.parse(userStr as string);
                        // setSelectInstitutionVal(user?.defaultInstitutionId);
                        // console.log("default inst", user?.defaultInstitutionId);

                        // setLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE, user?.defaultInstitutionId);

                        if (res.data?.user?.defaultInstitutionId) {
                            setLocalStorage(
                                LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE,
                                res.data?.user?.defaultInstitutionId
                            );
                        }

                        if(res.data?.user?.preferedLanguageCodeDescription.toString().toLowerCase() === 'arabic') {
                            setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ARABIC);
                        }

                        if (res.data?.user?.userRoles) {
                            setLocalStorage(
                                LOCALSTORAGE_KEYS.ROLE_ACTIVITY,
                                JSON.stringify(res.data?.user?.userRoles)
                            );
                        }

                        setLocalStorage(
                            LOCALSTORAGE_KEYS.INSTITUTES,
                            JSON.stringify(filteredInstitute)
                        );
                        try {
                            const modulesRes = await ModuleService.getAllModulesByUser();
                            setLocalStorage(
                                LOCALSTORAGE_KEYS.MODULES,
                                JSON.stringify(modulesRes.data)
                            );
                        } catch (_) { /* non-critical */ }

                        toast.success("Successfully logged in");
                        window.location.href = "/dashboard";
                    }
                }
            })
            .catch((err: any) => {
                const errorMessage =err?.response?.data?.errors?.[0] ||"Incorrect Username or Password";
                if (err?.response?.status === 401) {
                    toast.error(errorMessage);
                } else {
                    toast.error(err?.response?.data?.errors?.[0] ||err?.message ||"Something went wrong");
                }
            });
        };
    return (
        <section className="login-wrapper">
            <a href="#" title="MAS Prime" className="logo">
                <img src={logo} alt="Logo" />
            </a>
            <Card className="login-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader
                        title={intl.formatMessage({
                            id: "Login.signin",
                            defaultMessage: "Sign In",
                        })}
                        subheader={intl.formatMessage({
                            id: "Login.toyouraccount",
                            defaultMessage: "To your Account",
                        })}
                        titleTypographyProps={{ variant: "h2", component: "h2" }}
                        subheaderTypographyProps={{ variant: "h4", component: "h4" }}
                    />
                    <FormHelperText
                        id="error-helper-text"
                        error
                        style={{ paddingBottom: "25px" }}
                    >
                        {error}
                    </FormHelperText>
                    <CardContent>
                        <FormGroup>
                            <FormControl>
                                <InputBase
                                    placeholder={intl.formatMessage({
                                        id: "Login.username",
                                        defaultMessage: "User Name",
                                    })}
                                    error
                                    fullWidth
                                    id="username"
                                    autoComplete="off"
                                    aria-describedby="error-helper-text"
                                    {...register("username")}
                                    className="bg-primary"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <em>
                                                <img src={userIcon} alt="user" />
                                            </em>
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText id="error-helper-text" error>
                                    {errors.username?.message}
                                </FormHelperText>
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="mb-0">
                            <FormControl>
                                <InputBase
                                    placeholder={intl.formatMessage({
                                        id: "Login.password",
                                        defaultMessage: "Password",
                                    })}
                                    fullWidth
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    autoComplete="off"
                                    className="bg-primary"
                                    {...register("password")}
                                    endAdornment={
                                        <InputAdornment position="end" onClick={()=> setIsPasswordVisible(!isPasswordVisible)}>
                                            <IconButton>
                                                <img src={lockIcon} alt="lock" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText id="error-helper-text" error>
                                    {errors.password?.message}
                                </FormHelperText>
                            </FormControl>
                        </FormGroup>
                        <div className="default-link">
                            <a href="/forgot-password" title="Forgot Password">
                                {intl.formatMessage({
                                    id: "Login.forgotpassword?",
                                    defaultMessage: "Forgot Password?",
                                })}
                            </a>
                        </div>
                        <Button
                            disableElevation
                            type="submit"
                            variant="contained"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {intl.formatMessage({
                                id: "Login.submit",
                                defaultMessage: "Submit",
                            })}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </section>
    );
}

export default Login;
