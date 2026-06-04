import {
    IconButton,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { add_rounded, delete_ic, edit_ic } from "../../assets/images";
import { CardSchemeModel } from "../../models/configuration/CardSchemeModel";
import { CardSchemeService } from "../../services/configuration/card-scheme-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";

function CardScheme() {
    const navigate = useNavigate();
    const intl = useIntl();

    const [CardSchemes, setCardSchemes] = useState<CardSchemeModel[]>([]);

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CARDSCH), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.CARDSCH, 'SCSCHEME');
    const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.CARDSCH, 'SCSCHEMESC');
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.CARDSCH, 'DCSCHEME');
    const canView = perms.accessView === "1";

    useEffect(() => {
        getAllCardScheme();
    }, []);

    const getAllCardScheme = async () => {
        await CardSchemeService.getAllCardScheme()
            .then((res) => {
                setCardSchemes([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const editInstitute = async (id: string, recordSequenceNumber: number) => {
        navigate(`/card-scheme-definition/${id}/${recordSequenceNumber}`);
    };

    const onDelete = (id: string) => {
        Swal.fire({
            title: intl.formatMessage({
                id: "DeleteAlert.title",
                defaultMessage: "Are you sure?"
            }),
            text: intl.formatMessage({
                id: "DeleteAlert.text",
                defaultMessage: "You won't be able to revert this!",
            }),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: intl.formatMessage({
                id: "DeleteAlert.cancelButtonText",
                defaultMessage: "Cancel",
            }),
            confirmButtonText: intl.formatMessage({
                id: "DeleteAlert.confirmButtonText",
                defaultMessage: "Yes, delete it!",
            }),

        }).then((result: any) => {
            if (result.isConfirmed) {
                CardSchemeService.deleteCardScheme(id).then((res) => {
                    if (res.status === StatusCode.Success) {
                        Swal.fire({
                            title: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.title",
                                defaultMessage: "Deleted!",
                            }),
                            text: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.text",
                                defaultMessage: "Record has been deleted.",
                            }),
                            icon: "success",
                            confirmButtonText: intl.formatMessage({
                                id: "DeleteAlert.okButtonText",
                                defaultMessage: "OK",
                            }),
                        })
                    }
                    getAllCardScheme();
                }).catch(err => {
                    if (err && err.response 
                    //    && err.response.data === Errors.ReferenceExists
                    ) {
                        Swal.fire({
                            title: intl.formatMessage({
                                id: "DeleteAlert.DeleteError.title",
                                defaultMessage: "Cannot be deleted!",
                            }),
                            text: intl.formatMessage({
                                id: "DeleteAlert.DeleteError.referenceExist",
                                defaultMessage:err.response.data.errors[0]
                            }),
                            icon: "error",
                            confirmButtonText: intl.formatMessage({
                                id: "DeleteAlert.okButtonText",
                                defaultMessage: "OK",
                            }),
                        });
                    }
                });
            }
        });
    };

    const changeStatus = async (id: string, event: any) => {
        const model = {
            id: 0,
            idString: id,
            status: event.target.checked === true ? "1" : "0",
        };
        CardSchemeService.changeCardSchemeStatus(model)
            .then((res) => {
                getAllCardScheme();
                toast.success(res?.data+"")
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <div className="left-block">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "CardScheme.title",
                                        defaultMessage: "Card Scheme",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "CardScheme.subTitle",
                                        defaultMessage: "Listing of all Scheme",
                                    })}
                                </p>
                            </div>
                            <div className="right-block">
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/card-scheme-definition")}
                                    disableElevation
                                    className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    disabled={!canAdd}
                                >
                                    <FormattedMessage
                                        id="CardScheme.addBtn"
                                        defaultMessage="Add Scheme"
                                    />
                                </Button>
                            </div>
                        </div>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "CardScheme.schemeId",
                                                defaultMessage: "Scheme ID",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "CardScheme.name",
                                                defaultMessage: "Name",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "CardScheme.schemeSpecific",
                                                defaultMessage: "Scheme Specific",
                                            })}
                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {intl.formatMessage({
                                                id: "CardScheme.actions",
                                                defaultMessage: "Actions",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {CardSchemes && CardSchemes.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.cardSchemeId}</TableCell>
                                            <TableCell>{row.cardSchemeName}</TableCell>
                                            <TableCell>{row.cardSchemeSpecific}</TableCell>
                                            <TableCell align="center" width="190px" className="last-column-border">
                                                <div className="action btns-block">
                                                    <Switch
                                                        className="custom"
                                                        checked={row.status === "1" ? true : false}
                                                        onChange={(e) => changeStatus(row.cardSchemeId, e)}
                                                        disabled={!canUpdate}
                                                    />
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => editInstitute(row.cardSchemeId, row.recordSequenceNumber)}
                                                        disabled={!canUpdate}
                                                    >
                                                        <img src={edit_ic} alt="mail" />
                                                    </IconButton>
                                                    <IconButton
                                                        className="border-icon-btn no-border sm"
                                                        onClick={() => onDelete(row.cardSchemeId)}
                                                        disabled={!canDelete}
                                                    >
                                                        <img src={delete_ic} alt="mail" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {CardSchemes &&
                                        CardSchemes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "CardScheme.noDataFound",
                                                            defaultMessage: "No Data Found.",
                                                        })}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </main>
            </div>
        </>
    );
}

export default CardScheme;
