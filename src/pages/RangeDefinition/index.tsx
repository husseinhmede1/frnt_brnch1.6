import { useEffect, useState } from "react";
//import { yupResolver } from "@hookform/resolvers/yup";
import {
    FormControl,
    FormHelperText,
    Grid,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { IssRelation } from "../../models/configuration/IssuerRelationModel";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import {
    Institution,
    InstitutionType
} from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { Errors, StatusCode } from "../../utils/constant";
//import validations from "../../utils/validations";
import { IssuerRelationService } from "../../services/configuration/issuer-relation-service";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";

function RangeDefinition() {
    const { id } = useParams<{ id?: any }>();
    const { issuerAcqProfile } = useParams<{ issuerAcqProfile?: any }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [issuerRelationData, setIssuerRelationData] = useState<IssRelation>();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IssRelation>({
        mode: "onChange",
        //resolver: yupResolver(validations.createBankInfoValidations),
    });
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
    };

    const getIssuerRelationById = async () => {
        IssuerRelationService.getIssuerRelationsById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                reset(data);
                setIssuerRelationData(data);
                setSelectInstitutionVal(data.institutionId);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const checkDisabled = () => {
        if (!id) {
            return false;
        }
        else {
            return true;
        }
    }

    const onSubmit = async (value: IssRelation) => {
        const model = {
            recordSeqId: value.recordSeqId ? value.recordSeqId : 0,
            panRangeFrom: value.panRangeFrom,
            panRangeTo: value.panRangeTo,
            issuerAcqProfile: issuerAcqProfile,
            institutionId: value.institutionId,
        };
        await IssuerRelationService.saveOrUpdateIssuerRelation(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(`/issuer-relation/${id}/${issuerAcqProfile}`);

                    if (id) {
                        toast.success("Issuer Relation details updated successfully");
                    } else {
                        toast.success("Issuer Relation record added successfully");
                    }
                }
            })
            .catch((err) => {
                // if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // }
                // else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueIssuerRelation
                // ) {
                //     toast.error(Errors.uniqueIssuerRelation)
                // }
                // else {
                //       toast.error(err.response.data.errors[0])
                // }
                toast.error(err.response.data.errors[0])

            });
    };

    useEffect(() => {
        if (id != 0) {
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                      toast.error(error.response.data.errors[0]);
                });

            getIssuerRelationById();
        }
        else {
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            checkDisabled();
            setInstitutefromLocalStorage();
        }

    }, [id, reset]);

    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "IssuerRelation.title",
                                    defaultMessage: "Range definition",
                                })}
                            </Typography>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="inner-card">
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={4} sm={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label>
                                            {intl.formatMessage({
                                                id: "Institution.label",
                                                defaultMessage: "Institution",
                                            })}
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                value={selectInstitutionVal}
                                                {...register("institutionId")}
                                                onChange={handleInstitutionChange}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                            >

                                                {institutions &&
                                                    institutions.length > 0 &&
                                                    institutions.map((type) => {
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
                                <Grid item xs={18} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "Issuer.Profile",
                                                defaultMessage: "Issuer Profile",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterIssuerProfilePlaceholder",
                                                    defaultMessage: "Write your issuer profile id",
                                                })}
                                                value={issuerAcqProfile}
                                                disabled
                                                error
                                                fullWidth
                                                id="issuerProfile"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                            //{...register("issuerAcqProfile")}
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "IssuerRelation.panRangeFrom",
                                                defaultMessage: "Pan Range From",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterPanRangeFromPlaceholder",
                                                    defaultMessage: "Write the pan range from",
                                                })}
                                                error
                                                fullWidth
                                                id="panRangeFrom"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                {...register("panRangeFrom")}
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "IssuerRelation.panRangeTo",
                                                defaultMessage: "Pan Range To",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterPanRangeToPlaceholder",
                                                    defaultMessage: "Write the pan range to",
                                                })}
                                                error
                                                fullWidth
                                                id="panRangeTo"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                {...register("panRangeTo")}
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
                                    id="IssuerRelation.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" disableElevation variant="contained" disabled={isSubmitting}>
                                <FormattedMessage id="IssuerRelation.save" defaultMessage="Save" />
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default RangeDefinition;