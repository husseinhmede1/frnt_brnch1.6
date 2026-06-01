import { yupResolver } from "@hookform/resolvers/yup";
import {
    FormControl,
    FormHelperText,
    Grid,
    InputBase,
    Switch,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
    CardSchemeModel,
} from "../../models/configuration/CardSchemeModel";
import { CardSchemeService } from "../../services/configuration/card-scheme-service";
import { StatusCode } from "../../utils/constant";
import validations from "../../utils/validations";

function CardSchemeDefinition() {
    const { id } = useParams<{ id?: string }>();
    const {recordSequenceNumber} = useParams<{ recordSequenceNumber?: any }>();
    const intl = useIntl();
    const [enable, setIsEnable] = React.useState(true);

    const [isCardSchemeIdDisabled, setIsCardSchemeIdDisabled] = React.useState(false);

    const checkDisabled = () => {
        if (id) {
            setIsCardSchemeIdDisabled(true);
        }
        else {
            setIsCardSchemeIdDisabled(false);
        }
    }

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CardSchemeModel>({
        mode: "onChange",
        resolver: yupResolver(validations.createCardSchemeValidations),
    });


    useEffect(() => {
        if (id) {
            getCardSchemeById();
        }
        checkDisabled();
    }, [id, reset]);

    const getCardSchemeById = async () => {
        CardSchemeService.getCardSchemeById(id || "")
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                setIsEnable(data.status === "1" ? true : false);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const onSubmit = async (value: CardSchemeModel) => {
        const model = {
            recordSequenceNumber: recordSequenceNumber ? recordSequenceNumber : 0,
            cardSchemeId: value.cardSchemeId,
            cardSchemeName: value.cardSchemeName,
            cardSchemeSpecific: value.cardSchemeSpecific,
            status: enable ? "1" : "0",
        };
        await CardSchemeService.saveOrUpdateCardScheme(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(-1);

                    if (id) {
                        toast.success(`Card Scheme details updated successfully`);
                    } else {
                        toast.success("Card Scheme record added successfully");
                    }
                }
            })
            .catch((err) => {
               
                      toast.error(err.response.data.errors[0])
            
            });
    };

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "CardScheme.definition",
                                        defaultMessage: "Card Scheme Definition",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "CardScheme.addUpdateTitle",
                                        defaultMessage: "Add update Card Scheme",
                                    })}
                                </p>
                            </div>
                        </div>
                        <form onSubmitCapture={handleSubmit(onSubmit)}>
                            <div className="inner-card">
                                <Grid spacing={2} container>
                                    <Grid item xs={12} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "CardScheme.schemeId",
                                                    defaultMessage: "Scheme ID",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "CardScheme.enterId",
                                                        defaultMessage: "Write Card Scheme ID",
                                                    })}
                                                    error
                                                    fullWidth
                                                    disabled={isCardSchemeIdDisabled}
                                                    id="cardSchemeId"
                                                    autoComplete="off"
                                                    inputProps={{
                                                        maxLength: 6
                                                    }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("cardSchemeId")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.cardSchemeId?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="form-group input-with-label">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "CardScheme.schemeName",
                                                    defaultMessage: "Scheme Name",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "CardScheme.enterName",
                                                        defaultMessage: "Write Card Scheme Name",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="cardSchemeName"
                                                    autoComplete="off"
                                                    inputProps={{
                                                        maxLength: 50
                                                    }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("cardSchemeName")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.cardSchemeName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="form-group input-with-label mb-0">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "CardScheme.schemeSpecific",
                                                    defaultMessage: "Scheme Specific",
                                                })}
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputBase
                                                    placeholder={intl.formatMessage({
                                                        id: "CardScheme.enterSchemeSpecific",
                                                        defaultMessage: "Write Scheme Specific Name",
                                                    })}
                                                    error
                                                    fullWidth
                                                    id="cardSchemeSpecific"
                                                    autoComplete="off"
                                                    inputProps={{
                                                        maxLength: 10
                                                    }}
                                                    aria-describedby="error-helper-text"
                                                    {...register("cardSchemeSpecific")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.cardSchemeSpecific?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="form-group input-with-label card-toggle">
                                            <label className="lg">
                                                {intl.formatMessage({
                                                    id: "CardScheme.enableDisable",
                                                    defaultMessage: "Disable/Enable",
                                                })}
                                            </label>
                                            <FormControl fullWidth>
                                                <Switch
                                                    className="custom"
                                                    checked={enable}
                                                    onChange={(e) => setIsEnable(!enable)}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="btns-block right">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    <FormattedMessage
                                        id="CardScheme.cancel"
                                        defaultMessage="Cancel"
                                    />
                                </Button>
                                <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                    <FormattedMessage
                                        id="CardScheme.save"
                                        defaultMessage="Save"
                                    />
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}

export default CardSchemeDefinition;
