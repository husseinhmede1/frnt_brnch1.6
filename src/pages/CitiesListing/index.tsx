import { yupResolver } from "@hookform/resolvers/yup";
import { visuallyHidden } from "@mui/utils";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
    FormControl,
    FormHelperText,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  cancelIcon,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  saveIcon,
} from "../../assets/images";
import { CityModel } from "../../models/configuration/CityModel";
import { CityService } from "../../services/configuration/city-service";
import { CurrencyService } from "../../services/configuration/currency-service";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import validations from "../../utils/validations";
import { CountryModel } from "../../models/configuration/CountryModel";
import { CountryService } from "../../services/configuration/country-service";
import { ProvinceModel } from "../../models/configuration/ProvinceModel";
import { ProvinceService } from "../../services/configuration/province-service";

function CitiesListing() {
  const [open, setOpen] = React.useState(false);
  const [cities, setCities] = React.useState<CityModel[]>([]);
  const [citiesData, setCitiesData] = React.useState<CityModel>({
    cityId: 0,
    cityAbbrev: "",
    cityName: "",
    cityNameAlt: "",
    cntryCode: "",
    provStateAbbrev: "",
  });
  const [countryList, setCountryList] = React.useState<CountryModel[]>([]);
    const [provinceList, setProvinceList] = React.useState<ProvinceModel[]>([]);
  const [city, setCity] = React.useState<CityModel>(new CityModel());
  const [isUpdateState, setIsUpdateState] = React.useState<boolean>(false);

    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.CITY), []);
    const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.CITY, 'SCITY');
    const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.CITY, 'SCITY');
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.CITY, 'DCITY');
    const canView = perms.accessView === "1";
    const canLoadCountries  = hasApiAccess(ConfigurationActivities.CITY, 'GACOENTRY');
    const canLoadCities     = hasApiAccess(ConfigurationActivities.CITY, 'GACITY');
    const canLoadProvinces  = hasApiAccess(ConfigurationActivities.CITY, 'SPROVINCE');

    const handleClose = () => {
        setOpen(false);
    };

  useEffect(() => {
    getAllCity();
    getAllCountry();
    getAllProvince();

  }, []);

  const getAllCountry = async () => {
    if (!canLoadCountries) return;
    await CountryService.getActiveCountries()
      .then((res) => {
        setCountryList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };
  const getAllProvince = async () => {
    if (!canLoadProvinces) return;
    await ProvinceService.getAllProvince()
      .then((res) => {
        setProvinceList([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };
  const getAllCity = async () => {
    if (!canLoadCities) return;
    await CityService.getAllCity()
      .then((res) => {
        setCities([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const changeStatus = async (id: number, event: any) => {
    const model = {
      id: id,
      status: event.target.checked === true ? "1" : "0",
    };
    CityService.changeStatus(model)
      .then((res) => {
        getAllCity();
        toast.success(res?.data+"")
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

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

    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await CityService.deleteById(id).then((res) => {
          if (res.status === StatusCode.Success && res.data.toString()!='') {
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
          }else{
            Swal.fire({
              title: intl.formatMessage({
                id: "DeleteAlert.DeleteError.title",
                defaultMessage: "Cannot be deleted!",
              }),
              text: intl.formatMessage({
                id: "DeleteAlert.DeleteError.referenceExist",
                defaultMessage:"City Code Currently in use!"
              }),
              icon: "error",
              confirmButtonText: intl.formatMessage({
                id: "DeleteAlert.okButtonText",
                defaultMessage: "OK",
              }),
            });
          }
          getAllCity();
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
  const handleClickOpen = (isEdited: boolean,data:CityModel,isUpdate:boolean) => {
      handleReset();
    if(isUpdate){
      setIsUpdateState(true);
      handleReset();
      setCity(data);
    }else{
      setIsUpdateState(false);
    }
    setOpen(true);
  };
    const handleReset = (): void => {
      reset(new CityModel());
      setCity(new CityModel());
    };

  const {
    register,
    handleSubmit: recordHandleSubmit,
        reset,

      reset: recordReset,
      formState: { isSubmitting, errors }
  } = useForm<CityModel>({
    mode: "onChange",
    resolver: yupResolver(validations.addOrUpdateCitiesListing),
  });

  const onSave = async (data: CityModel) => {
    //data.datePattern = moment(data.datePattern).format("DD/MM/yyyy");
    await CityService.saveOrUpdateCity(data).then((res) => {
          if (res.status === StatusCode.Success) {
            if(data.cityId===undefined || data.cityId.toString()=="0"){
            toast.success(`City added successfully`);
            }else{
            toast.success(`City details updated successfully`);
            }
            handleClear();
            handleClose();
            getAllCity();
          }
          }).catch((error: any) => {
              toast.error(error.response.data.errors[0])
          });
  };

  const onEdit = (data: CityModel) => {
    // data.datePattern = moment(data.datePattern, "DD/MM/yyyy").format(
    //   "MM/DD/yyyy"
    // );
    setCitiesData(data);
    setOpen(false);
  };

  const handleClear = () => {
    setCitiesData({
    cityId: 0,
    cityAbbrev: "",
    cityName: "",
    cityNameAlt: "",
    cntryCode: "",
    provStateAbbrev: "",
    });
  };

  const handleSelectChange = (e: any) => {
    setCitiesData({ ...citiesData, [e.target.name]: e.target.value });
  };
// Add this state at the top of your component
const [sortConfig, setSortConfig] = React.useState<{
  key: 'cityName' | 'cityNameAlt' | null;
  direction: 'asc' | 'desc';
}>({ key: null, direction: 'asc' });

// Add this sorting function
const handleSort = (key: 'cityName' | 'cityNameAlt') => {
  let direction: 'asc' | 'desc' = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};

// Add this function to get sorted data
const getSortedCities = () => {
  if (!cities) return [];
  if (!sortConfig.key) return cities;

  return [...cities].sort((a, b) => {
    const key = sortConfig.key as keyof CityModel;
    const aValue = a[key] || '';
    const bValue = b[key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
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
                    id: "City.title",
                    defaultMessage: "Cities",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "City.subTitle",
                    defaultMessage: "List of Cities",
                  })}
                </p>
              </div>
                            <div className="right-block">
                              <Button
                                variant="contained"
                                disableElevation
                                className="btn-light"
                                endIcon={<img src={add_rounded} alt="add" />}
                                onClick={() => handleClickOpen(false,new CityModel,false)}
                                disabled={!canAdd}
                              >
                                <FormattedMessage
                                  id="City.addBtn"
                                  defaultMessage="Add City"
                                />
                              </Button>
                            </div>
            </div>
            <form onSubmitCapture={recordHandleSubmit(onSave)}>
<TableContainer className="has-vertical-scroll">
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>
          <TableSortLabel
            active={sortConfig.key === 'cityName'}
            direction={sortConfig.key === 'cityName' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('cityName')}
          >
            {intl.formatMessage({
              id: "City.cityName",
              defaultMessage: "City Name",
            })}
            {sortConfig.key === 'cityName' && (
              <Box component="span" sx={visuallyHidden}>
                {sortConfig.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            )}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          {intl.formatMessage({
            id: "City.cityAbbrev",
            defaultMessage: "City Abbreviation",
          })}
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortConfig.key === 'cityNameAlt'}
            direction={sortConfig.key === 'cityNameAlt' ? sortConfig.direction : 'asc'}
            onClick={() => handleSort('cityNameAlt')}
          >
            {intl.formatMessage({
              id: "City.cityNameAlt",
              defaultMessage: "Alternate Name",
            })}
            {sortConfig.key === 'cityNameAlt' && (
              <Box component="span" sx={visuallyHidden}>
                {sortConfig.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            )}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          {intl.formatMessage({
            id: "City.cntryCode",
            defaultMessage: "Country Code",
          })}
        </TableCell>
        <TableCell>
          {intl.formatMessage({
            id: "City.provStateAbbrev",
            defaultMessage: "Province State Abbreviation",
          })}
        </TableCell>
        <TableCell align="center" width="190px" className="sticky-table head last-column-border-header">
          {intl.formatMessage({
            id: "City.actions",
            defaultMessage: "Actions",
          })}
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {getSortedCities() &&
        getSortedCities().map((row, i) => (
          <TableRow key={i}>
            {citiesData?.cityId !== row?.cityId && (
              <>
                <TableCell>{row.cityName}</TableCell>
                <TableCell>{row.cityAbbrev}</TableCell>
                <TableCell>{row.cityNameAlt}</TableCell>
                <TableCell>{row.cntryCode}</TableCell>
                <TableCell>{row.provStateAbbrev}</TableCell>
                <TableCell align="center" width="190px" className="sticky-table column last-column-border">
                  <div className="action btns-block">
                    <IconButton
                      className="border-icon-btn no-border sm"
                      onClick={() => handleClickOpen(false,row,true)}
                      disabled={!canUpdate}
                    >
                      <img src={edit_ic} alt="mail" />
                    </IconButton>
                    <IconButton
                      className="border-icon-btn no-border sm"
                      onClick={() => onDelete(row.cityId)}
                      disabled={!canDelete}
                    >
                      <img src={delete_ic} alt="mail" />
                    </IconButton>
                  </div>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      {cities && cities.length === 0 && (
        <TableRow>
          <TableCell colSpan={13} className="last-column-border">
            <p style={{ textAlign: "center" }}>
              {intl.formatMessage({
                id: "City.noDataFound",
                defaultMessage: "No Data Found.",
              })}
            </p>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
            </form>
          </div>
        </main>
        <Dialog open={open} onClose={handleClose} className="c-dialog">
                    <form onSubmit={recordHandleSubmit(onSave)}>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>City</Typography>
                <p className="pb-0">  {isUpdateState ? "Update City" : "Add City"}</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card">
                                                   <FormControl fullWidth>
                                  <input
                                    type="hidden"
                                     value={
                                      city.cityId
                                        ? city.cityId
                                        : 0
                                    }
                                    {...register("cityId")}
                                              />
                                    </FormControl>
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>City Name<span style={{ color: 'red' }}>*</span></label>
   
                    <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write City Name"
                                    error
                                    fullWidth
                                     defaultValue={
                                      city.cityName
                                        ? city.cityName.toString()
                                        : ""
                                    }
                                    {...register("cityName")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cityName?.message}
                                              </FormHelperText>                    </FormControl>
                  </div>
                </Grid>
                 <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>Alternate Name<span style={{ color: 'red' }}>*</span></label>
                    <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write City Alternate Name"
                                    fullWidth
                                                                                 defaultValue={
                                      city.cityNameAlt
                                        ? city.cityNameAlt.toString()
                                        : ""
                                    }
                                    {...register("cityNameAlt")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cityNameAlt?.message}
                                              </FormHelperText>                    </FormControl>
                  </div>
                </Grid>
                                 <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>City Abbreviation<span style={{ color: 'red' }}>*</span></label>
                    <FormControl fullWidth>
                                  <InputBase
                                    placeholder="Write City Abbreviation Name"
                                    error
                                    fullWidth
                                                                       defaultValue={
                                      city.cityAbbrev
                                        ? city.cityAbbrev.toString()
                                        : ""
                                    }
                                    {...register("cityAbbrev")}
                                              />
                                              <FormHelperText id="error-helper-text" error>
                                                  {errors.cityAbbrev?.message}
                                              </FormHelperText>                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Country Code</label>
                    <FormControl fullWidth>
                      <Select
  IconComponent={() => (
    <img src={down_arrow_icon} alt="" />
  )}
  displayEmpty  // Add this
  {...register("cntryCode")}
  defaultValue={
    city.cntryCode
      ? city.cntryCode.toString()
      : ""
  }
  onChange={handleSelectChange}
>
  <MenuItem value="" disabled>  {/* Add disabled */}
    <em>Select Country Code</em>
  </MenuItem>
  {countryList &&
    countryList.length > 0 &&
    countryList.map((item: any) => (
      <MenuItem
        value={item.cntryCode}
        key={item.cntryCode}
      >
        {item.cntryCode}
      </MenuItem>
    ))}
</Select>
                    </FormControl>
                  </div>
                </Grid>
                               <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Province Abbreviation</label>
                    <FormControl fullWidth>
   <Select
  IconComponent={() => (
    <img src={down_arrow_icon} alt="" />
  )}
  displayEmpty
  {...register("provStateAbbrev")}
  defaultValue={
    city.provStateAbbrev
      ? city.provStateAbbrev.toString()
      : ""
  }
  onChange={handleSelectChange}
>
  <MenuItem value="" disabled>
    <em>Select Province Abbreviation</em>
  </MenuItem>
  {provinceList &&
    provinceList.length > 0 &&
    provinceList.map((item: any) => (
      <MenuItem
        value={item.provStateAbbrev}
        key={item.provStateAbbrev}
      >
        {item.provStateAbbrev}
      </MenuItem>
    ))}
</Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button            
 disableElevation variant="contained" type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </DialogActions>
                    </form>

        </Dialog>
      </div>
    </>
  );
}

export default CitiesListing;
