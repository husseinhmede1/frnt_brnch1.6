import React, { useEffect } from "react";
import Button from '@mui/material/Button';
import { add_rounded, delete_ic, down_arrow_icon, edit_ic, ic_check, ic_checked, ic_per, search_ic } from "../../assets/images";
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputBase, MenuItem, Radio, RadioGroup, Select, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { CityByCountryIdModel, ContactDefinationModel, ContactGridModel } from "../../models/entityManagement/EntityModel";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validations from "../../utils/validations";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { ContactServices } from "../../services/entityManagement/contacts-services";
import { CountryModel } from "../../models/configuration/CountryModel";
import { useParams } from "react-router";
import { useIntl } from "react-intl";

function EntityContacts(props: any) {
    const { value, TabPanel, institutionId, checkIsEmptyModules } = props;
    const { id } = useParams<{ id?: any }>();
    const intl = useIntl()
    const [openContactModal, setContactModalOpen] = React.useState(false);
    const [contactsList, setContactsList] = React.useState<ContactGridModel[]>([]);
    const [countryList, setCountryList] = React.useState<CountryModel[]>([]);
    const [cityList, setCityList] = React.useState<CityByCountryIdModel[]>([]);
    const [contactDetails, setContactDetails] = React.useState<ContactDefinationModel>(new ContactDefinationModel());
    const [editedId, setEditedId] = React.useState<number | undefined>(0);
    const [eStatement, setEStatement] = React.useState<boolean>(false);

    const contactModalOpen = (isEdit: boolean) => {
        if (!isEdit) {
            reset(new ContactDefinationModel());
            setEStatement(false)
            setContactDetails(new ContactDefinationModel())
        }
        getAllCountries();
        setContactModalOpen(true);
        clearErrors();
    };
    const contactModalClose = () => {
        setContactModalOpen(false);
    };

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<ContactDefinationModel>({
        mode: "onChange",
        resolver: yupResolver(validations.contactValidation),
    });


    useEffect(() => {
        if (id && value === 6) {
            getAllContacts()
        }
    }, [value])

    const getAllContacts = async () => {
        await ContactServices.getContactsByEntityId(id,institutionId).then((res) => {
            setContactsList([...res.data]);
            if (res && res.data && res.data.length === 0) {
                checkIsEmptyModules("contacts", true)
            }
            else {
                checkIsEmptyModules("contacts", false)
            }
        }).catch(err =>           toast.error(err.response.data.errors[0])
        );
    }

    const getAllCountries = async () => {
        await ContactServices.getAllCountry().then((res) => {
            setCountryList([...res.data]);
        }).catch(err =>           toast.error(err.response.data.errors[0])
        );
    }

    const editContactDetails = (id: number | undefined) => {
        setEditedId(id);
        getContactById(id);
        contactModalOpen(true)
    }

    const onDelete = (id: number | undefined) => {
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
                ContactServices.deleteById(id).then(res => {
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
                    getAllContacts();
                }).catch(err => {
                    if (err && err.response
                      //   && err.response.data === Errors.ReferenceExists
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


    const getContactById = async (id: number | undefined) => {
        ContactServices.getById(Number(id)).then((res) => {
            const data = JSON.parse(JSON.stringify(res.data));
            reset(data);
            setContactDetails(data);
            setEStatement(data.receiveEstatement === "y" || data.receiveEstatement === "Y" ? true : false)
            if (data.cntryId) {
                getCitiesByCountry(data.cntryId)
            }
        }).catch(err =>          toast.error(err.response.data.errors[0])
        );
    }

    const handleChange = (event: any) => {
        const name = event.target.name;
        const id = event.target.value;
        if (name === "cntryId") {
            getCitiesByCountry(id)
        }
        setContactDetails({
            ...contactDetails,
            [name]: id
        })
    }

    const getCitiesByCountry = async (id: number) => {
        await ContactServices
            .getAllCitiesByCountryId(id).then((res) => {
                setCityList([...res.data]);
            }).catch(err =>           toast.error(err.response.data.errors[0])
            );
    }

    const onSubmit = (values: ContactDefinationModel) => {
        ContactServices.saveOrUpdate({ ...values, phone: "", receiveEstatement: eStatement ? "Y" : "N", entityId: id, institutionId: institutionId }).then((res) => {
            if (res.status === StatusCode.Success) {
                if (editedId !== 0) {
                    toast.success("Contact details updated successfully");
                } else {
                    toast.success("New Contact details is added successfully");
                }
                contactModalClose();
            }
            getAllContacts();
        }).catch(err =>          toast.error(err.response.data.errors[0])
        );
    }

    return (
        <>
            <TabPanel value={value} index={6}>
                <div className="panel-body">
                    <div className="title-block">
                        <div className="left-block mb-0">
                        </div>
                        <div className="right-block">
                            <Button
                                variant="contained"
                                disableElevation
                                className="btn-light"
                                endIcon={<img src={add_rounded} alt="add" />}
                                onClick={() => contactModalOpen(false)}
                            >
                                {
                                    intl.formatMessage({
                                        id: "Entity.contact.button.add",
                                        defaultMessage: "Add Contact"
                                    })
                                }
                            </Button>
                        </div>
                    </div>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {
                                            intl.formatMessage({
                                                id: "Entity.contact.label.contactName",
                                                defaultMessage: "Contact Name"
                                            })
                                        }</TableCell>
                                    <TableCell>{
                                        intl.formatMessage({
                                            id: "Entity.contact.label.role",
                                            defaultMessage: "Role"
                                        })
                                    }</TableCell>
                                    <TableCell>{
                                        intl.formatMessage({
                                            id: "Entity.contact.label.receiveEStatement",
                                            defaultMessage: "Receive E-statement"
                                        })
                                    }</TableCell>
                                    <TableCell align="center" width="190px" className="last-column-border-header">{
                                        intl.formatMessage({
                                            id: "Entity.label.actions",
                                            defaultMessage: "Actions"
                                        })
                                    }</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contactsList.map((row, i) => (
                                    <TableRow
                                        key={i}
                                    >
                                        <TableCell>{row.firstName} {row.lastName}</TableCell>
                                        <TableCell>{row.professionalTitle}</TableCell>
                                        <TableCell>{row.receiveEstatement}</TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border">
                                            <div className="action btns-block">
                                                <IconButton className="border-icon-btn no-border sm" onClick={() => editContactDetails(row.contactId)}>
                                                    <img src={edit_ic} alt="edit" />
                                                </IconButton>
                                                <IconButton className="border-icon-btn no-border sm" onClick={() => onDelete(row.contactId)}>
                                                    <img src={delete_ic} alt="delete" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </TabPanel>
            <Dialog open={openContactModal} onClose={contactModalClose} className="c-dialog lg">
                <form>

                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>

                                    {
                                        intl.formatMessage({
                                            id: "Entity.contact.add.title",
                                            defaultMessage: "Contact Definition"
                                        })
                                    }</Typography>
                                <p className="pb-0"> {
                                    intl.formatMessage({
                                        id: "Entity.contact.add.subTitle",
                                        defaultMessage: "Add a Contact"
                                    })
                                }</p>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>

                        <div className="inner-card">
                            <div className="form-group">
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.firstName",
                                                    defaultMessage: "First Name"
                                                })
                                            }
                                                <span style={{ color: "red" }}>*</span></label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder=
                                                    {
                                                        intl.formatMessage({
                                                            id: "Entity.contact.placeholder.firstName",
                                                            defaultMessage: "Enter First Name"
                                                        })
                                                    } fullWidth
                                                    {...register("firstName")} />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.firstName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.middleName",
                                                    defaultMessage: "Middle Name"
                                                })
                                            }
                                                <span style={{ color: "red" }}>*</span></label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.middleName",
                                                        defaultMessage: "Enter Middle Name"
                                                    })
                                                } fullWidth
                                                    {...register("middleName")}
                                                />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.middleName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.lastName",
                                                    defaultMessage: "Last Name"
                                                })
                                            }
                                                <span style={{ color: "red" }}>*</span></label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.lastName",
                                                        defaultMessage: "Enter Last Name"
                                                    })
                                                } fullWidth
                                                    {...register("lastName")} />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.lastName?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.professionalTitle",
                                                    defaultMessage: "Professional Title"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.professionalTitle",
                                                        defaultMessage: "Enter Professional Title"
                                                    })
                                                } fullWidth
                                                    {...register("professionalTitle")} />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.professionalTitle?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                            <div className="form-group">
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label form-group">
                                            <label className="lg">
                                                {
                                                    intl.formatMessage({
                                                        id: "Entity.contact.label.address1",
                                                        defaultMessage: "Address 1"
                                                    })
                                                }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.address1",
                                                        defaultMessage: "Enter Address 1"
                                                    })
                                                } fullWidth
                                                    {...register("address1")} />
                                                    <FormHelperText id="error-helper-text" error>
                                                    {errors.address1?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">
                                                {
                                                    intl.formatMessage({
                                                        id: "Entity.contact.label.address2",
                                                        defaultMessage: "Address 2"
                                                    })
                                                }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.address2",
                                                        defaultMessage: "Enter Address 2"
                                                    })
                                                } fullWidth
                                                    {...register("address2")} />
                                                    <FormHelperText id="error-helper-text" error>
                                                    {errors.address2?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">
                                                {
                                                    intl.formatMessage({
                                                        id: "Entity.contact.label.address3",
                                                        defaultMessage: "Address 3"
                                                    })
                                                }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.address3",
                                                        defaultMessage: "Enter Address 3"
                                                    })
                                                } fullWidth
                                                    {...register("address3")} />
                                                    <FormHelperText id="error-helper-text" error>
                                                    {errors.address3?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group mb-0">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.address4",
                                                    defaultMessage: "Address 4"
                                                })
                                            } </label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.address4",
                                                        defaultMessage: "Enter Address 4"
                                                    })
                                                } fullWidth
                                                    {...register("address4")} />
                                                    <FormHelperText id="error-helper-text" error>
                                                    {errors.address4?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.country",
                                                    defaultMessage: "Country"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <Select
                                                    displayEmpty
                                                    defaultValue=""
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                    placeholder={
                                                        intl.formatMessage({
                                                            id: "Entity.select",
                                                            defaultMessage: "Select"
                                                        })
                                                    }
                                                    {...register("cntryId")}
                                                    onChange={handleChange}
                                                    value={contactDetails.cntryId ? contactDetails.cntryId.toString() : ""}
                                                >
                                                    <MenuItem value="">
                                                        <em>{
                                                            intl.formatMessage({
                                                                id: "Entity.select",
                                                                defaultMessage: "Select"
                                                            })
                                                        }
                                                        </em>
                                                    </MenuItem>
                                                    {
                                                        countryList && countryList.length > 0
                                                        && countryList.map(country => (
                                                            <MenuItem value={country.cntryId}>{country.cntryName}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.city",
                                                    defaultMessage: "City"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <Select
                                                    displayEmpty
                                                    defaultValue=""
                                                    IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                    placeholder={
                                                        intl.formatMessage({
                                                            id: "Entity.select",
                                                            defaultMessage: "Select"
                                                        })
                                                    }
                                                    value={contactDetails.cityId ? contactDetails.cityId.toString() : ""}
                                                    {...register("cityId")}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="">
                                                        <em>{
                                                            intl.formatMessage({
                                                                id: "Entity.select",
                                                                defaultMessage: "Select"
                                                            })
                                                        }</em>
                                                    </MenuItem>
                                                    {
                                                        cityList && cityList.length > 0 &&
                                                        cityList.map(city => (
                                                            <MenuItem value={city.cityId}>{city.cityName}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.postalCode",
                                                    defaultMessage: "Postal code"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.postalCode",
                                                        defaultMessage: "Enter Postal Code"
                                                    })
                                                } fullWidth
                                                    {...register("postalCodeZip")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.postalCodeZip?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group mb-0">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.geoCode",
                                                    defaultMessage: "Geo Code"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.geoCode",
                                                        defaultMessage: "Enter Geo Code"
                                                    })
                                                } fullWidth
                                                    {...register("geoCode")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.geoCode?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.phone1",
                                                    defaultMessage: "Phone 1"
                                                })
                                            }
                                                <span style={{ color: "red" }}>*</span></label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.phone1",
                                                        defaultMessage: "Enter Phone 1"
                                                    })
                                                } fullWidth
                                                    {...register("phone1")} />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.phone1?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.phone2",
                                                    defaultMessage: "Phone 2"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.phone2",
                                                        defaultMessage: "Enter Phone 2"
                                                    })
                                                } fullWidth
                                                    {...register("phone2")} />
                                                    <FormHelperText id="error-helper-text" error>
                                                    {errors.phone2?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.mobile1",
                                                    defaultMessage: "Mobile 1"
                                                })
                                            }
                                                <span style={{ color: "red" }}>*</span></label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.mobile1",
                                                        defaultMessage: "Enter Mobile 1"
                                                    })
                                                } fullWidth
                                                    {...register("mobile1")} />
                                                <FormHelperText id="error-helper-text" error>
                                                    {errors.mobile1?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div className="input-with-label form-group mb-0">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.mobile2",
                                                    defaultMessage: "Mobile 2"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.mobile2",
                                                        defaultMessage: "Enter Mobile 2"
                                                    })
                                                } fullWidth
                                                    {...register("mobile2")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.mobile2?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                            <div className="form-group mb-0">
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.fax",
                                                    defaultMessage: "Fax"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.fax",
                                                        defaultMessage: "Enter Fax"
                                                    })
                                                } fullWidth
                                                    {...register("fax")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.fax?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.email1",
                                                    defaultMessage: "Email 1"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.email1",
                                                        defaultMessage: "Enter Email 1"
                                                    })} fullWidth
                                                    {...register("emailAddress1")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.emailAddress1?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.email2",
                                                    defaultMessage: "Email 2"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.email2",
                                                        defaultMessage: "Enter Email 2"
                                                    })} fullWidth
                                                    {...register("emailAddress2")} />
                                                     <FormHelperText id="error-helper-text" error>
                                                    {errors.emailAddress2?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label">
                                            <label className="lg">{
                                                intl.formatMessage({
                                                    id: "Entity.contact.label.url",
                                                    defaultMessage: "URL"
                                                })
                                            }</label>
                                            <FormControl fullWidth>
                                                <InputBase placeholder={
                                                    intl.formatMessage({
                                                        id: "Entity.contact.placeholder.url",
                                                        defaultMessage: "Enter URL"
                                                    })} fullWidth
                                                    {...register("url")} />
                                                      <FormHelperText id="error-helper-text" error>
                                                    {errors.url?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <div className="input-with-label form-group mb-0">
                                            <FormGroup row className="checbox-grp">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            icon={<img src={ic_check} alt="" />}
                                                            checkedIcon={<img src={ic_checked} alt="" />}
                                                            onChange={(e) => setEStatement(e.target.checked)}
                                                            checked={eStatement}
                                                        />}
                                                    label="Receive E-statement" labelPlacement="start" />
                                            </FormGroup>
                                        </div>
                                    </Grid>

                                </Grid>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="btns-block right">
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            onClick={contactModalClose}
                        >
                            {
                                intl.formatMessage({
                                    id: "Entity.button.cancel",
                                    defaultMessage: "Cancel"
                                })
                            }
                        </Button>
                        <Button disableElevation variant="contained" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                            {
                                intl.formatMessage({
                                    id: "Entity.button.save",
                                    defaultMessage: "Save"
                                })
                            }
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>
        </>
    )
}

export default EntityContacts;