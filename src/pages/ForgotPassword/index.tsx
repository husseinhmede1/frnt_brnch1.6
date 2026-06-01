import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormHelperText,
  InputAdornment,
  InputBase,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logo, userIcon } from "../../assets/images";
import { ForgotPasswordModel } from "../../models/security/UserModel";
import { UserService } from "../../services/security/user-service";
import { Errors } from "../../utils/constant";
import validations from "../../utils/validations";

function ForgotPassword() {
  const navigate = useNavigate();
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordModel>({
    mode: "onChange",
    resolver: yupResolver(validations.forgotPasswordValidations),
  });

  const onSubmit = async (data: ForgotPasswordModel) => {
    UserService.resetPassword(data)
      .then((res) => {
        toast.success("Reset Password Email Sent");
        navigate("/");
      })
      .catch((err) => {
        // if (
        //   err &&
        //   err.response &&
        //   err.response.data === Errors.incorrectUsername
        // ) {
          // toast.error(Errors.incorrectUsername);
      // } else {
                    toast.error(err.response.data.errors[0])
      //  }
      });
  };

  return (
    <section className="login-wrapper">
      <em className="logo">
        <img src={logo} alt="Logo" />
      </em>
      <Card className="login-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader
            title={intl.formatMessage({
              id: "Forgot.title",
              defaultMessage: "Forgot Password",
            })}
            titleTypographyProps={{ variant: "h2", component: "h2" }}
            subheader={intl.formatMessage({
              id: "Forgot.subTitle",
              defaultMessage: "Please enter the username",
            })}
            subheaderTypographyProps={{ variant: "h4", component: "h4" }}
          />
          <CardContent>
            <FormGroup>
              <FormControl>
                <InputBase
                  placeholder={intl.formatMessage({
                    id: "Forgot.placeholder",
                    defaultMessage: "User Name",
                  })}
                  error
                  fullWidth
                  id="userName"
                  autoComplete="off"
                  aria-describedby="error-helper-text"
                  {...register("userName")}
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
                  {errors.userName?.message}
                </FormHelperText>
              </FormControl>
            </FormGroup>
            <div className="default-link">
              <a href="/" title="Return to login page">
                {intl.formatMessage({
                  id: "Forgot.returnlogin",
                  defaultMessage: "Back to Login Page",
                })}
              </a>
            </div>
            <Button
              disableElevation
              variant="contained"
              type="submit"
              className="submit-btn"
            >
              {intl.formatMessage({
                id: "Common.submit",
                defaultMessage: "Submit",
              })}
            </Button>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}

export default ForgotPassword;
