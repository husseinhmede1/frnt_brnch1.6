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
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { eyeClose, eyeOpen, logo } from "../../assets/images";
import {
  ChangePasswordModel,
  ChangePasswordReqModel
} from "../../models/security/UserModel";
import { UserService } from "../../services/security/user-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import validations from "../../utils/validations";

function VisibilityOff() {
  return <img src={eyeClose} alt="close" />;
}

function VisibilityOn() {
  return <img src={eyeOpen} alt="open" />;
}

const handleMouseDownOldPassword = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
};

const handleMouseDownNewPassword = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
};

const handleMouseDownPassword = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
};

function ChangePassword() {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const loginUser = JSON.parse(
    getLocalStorage(LOCALSTORAGE_KEYS.USER) as string
  );
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChangePasswordModel>({
    mode: "onChange",
    resolver: yupResolver(validations.changePasswordValidations),
  });

  const onSubmit = async (data: ChangePasswordModel) => {
    let values: ChangePasswordReqModel = {
      userId: loginUser.user ? loginUser.user.userId : 0,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    UserService.changePassword(values)
      .then((res) => {
        toast.success("Password changed successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <section className="login-wrapper">
      <em className="logo">
        <img src={logo} alt="Logo" />
      </em>
      <Card className="login-card change-pass">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader
            title={intl.formatMessage({
              id: "ChangePassword.title",
              defaultMessage: "Change Password",
            })}
            subheader={intl.formatMessage({
              id: "ChangePassword.subheader",
              defaultMessage: "Change your login Password",
            })}
            titleTypographyProps={{ variant: "h2", component: "h2" }}
            subheaderTypographyProps={{ variant: "h4", component: "h4" }}
          />
          <CardContent className="f-align-center">
            <div className="left">
              <FormGroup>
                <FormControl>
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "ChangePassword.oldPassword",
                      defaultMessage: "Old Password",
                    })}
                    fullWidth
                    id="oldpassword"
                    type={showOldPassword ? "text" : "password"}
                    {...register("oldPassword")}
                    autoComplete="off"
                    className="bg-primary"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          tabIndex={-1}
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          onMouseDown={handleMouseDownOldPassword}
                        >
                          {showOldPassword ? (
                            <VisibilityOff />
                          ) : (
                            <VisibilityOn />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="error-helper-text" error>
                    {errors.oldPassword?.message}
                  </FormHelperText>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormControl>
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "ChangePassword.newPassword",
                      defaultMessage: "New Password",
                    })}
                    fullWidth
                    id="newpassword"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword")}
                    autoComplete="off"
                    className="bg-primary"
                    value={newPass}
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setValue("newPassword", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <VisibilityOn />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="error-helper-text" error>
                    {errors.newPassword?.message}
                  </FormHelperText>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormControl>
                  <InputBase
                    placeholder={intl.formatMessage({
                      id: "ChangePassword.confirmPassword",
                      defaultMessage: "Confirm Password",
                    })}
                    fullWidth
                    id="setpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="off"
                    {...register("confirmPassword")}
                    className="bg-primary"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          tabIndex={-1}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <VisibilityOn />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="error-helper-text" error>
                    {errors.confirmPassword?.message}
                  </FormHelperText>
                </FormControl>
              </FormGroup>
            </div>
            <div className="password-info">
              <Typography variant="h5">
                {intl.formatMessage({
                  id: "ChangePassword.passwordPolicy",
                  defaultMessage: "Password Policy",
                })}
              </Typography>
              <ul>
                {newPass.length < 8 && newPass.length > 0 ? (
                  <li style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "ChangePassword.minimumChar",
                      defaultMessage: "Minimum 8 Characters",
                    })}
                  </li>
                ) : (
                  <li>
                    {intl.formatMessage({
                      id: "ChangePassword.minimumChar",
                      defaultMessage: "Minimum 8 Characters",
                    })}
                  </li>
                )}
                {newPass.search(/[a-z]/) < 0 && newPass.length > 0 ? (
                  <li style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "ChangePassword.lowercase",
                      defaultMessage: "1 Lowercase",
                    })}
                  </li>
                ) : (
                  <li>
                    {intl.formatMessage({
                      id: "ChangePassword.lowercase",
                      defaultMessage: "1 Lowercase",
                    })}
                  </li>
                )}
                {newPass.search(/[A-Z]/) < 0 && newPass.length > 0 ? (
                  <li style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "ChangePassword.uppercase",
                      defaultMessage: "1 Uppercase",
                    })}
                  </li>
                ) : (
                  <li>
                    {intl.formatMessage({
                      id: "ChangePassword.uppercase",
                      defaultMessage: "1 Uppercase",
                    })}
                  </li>
                )}
                {newPass.search(/[0-9]/) < 0 && newPass.length > 0 ? (
                  <li style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "ChangePassword.number",
                      defaultMessage: "1 Number",
                    })}
                  </li>
                ) : (
                  <li>
                    {intl.formatMessage({
                      id: "ChangePassword.number",
                      defaultMessage: "1 Number",
                    })}
                  </li>
                )}
                {newPass.search(/[!@#\$%\^&\*]/) < 0 && newPass.length > 0 ? (
                  <li style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "ChangePassword.specialChar",
                      defaultMessage: "1 Special Character",
                    })}
                  </li>
                ) : (
                  <li>
                    {intl.formatMessage({
                      id: "ChangePassword.specialChar",
                      defaultMessage: "1 Special Character",
                    })}
                  </li>
                )}
              </ul>
            </div>

            <Button
              disableElevation
              variant="contained"
              className="submit-btn"
              type="submit"
            >
              <FormattedMessage
                id="ChangePassword.updateBtn"
                defaultMessage="Update Password"
              />
            </Button>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}

export default ChangePassword;
