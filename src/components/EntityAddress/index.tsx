import {
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  MenuItem,
  Select,
} from "@mui/material";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { down_arrow_icon } from "../../assets/images";
import { CountryModel } from "../../models/configuration/CountryModel";
import {
  CityByCountryIdModel,
  EntityAddressModel,
} from "../../models/entityManagement/EntityModel";
import { CountryService } from "../../services/configuration/country-service";
import { AddressServices } from "../../services/entityManagement/address-services";
import { StatusCode } from "../../utils/constant";

const EntityAddress = forwardRef((props: any, ref: any) => {
  const {
    TabPanel,
    value,
    errors,
    register,
    getValues,
    reset,
    institutionId,
    checkIsEmptyModules,
  } = props;
  const { id } = useParams<{ id?: string }>();
  const intl = useIntl();
  const [addressValues, setAddressValues] = React.useState<EntityAddressModel>(
    new EntityAddressModel()
  );
  const [countryList, setCountryList] = React.useState<CountryModel[]>([]);
  const [cityList, setCityList] = React.useState<CityByCountryIdModel[]>([]);

  const handleChange = (e: any) => {
    setAddressValues({ ...addressValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getAllCountries();
    if (id) {
      getAddressByEntityId(id);
    }
  }, []);

  const getAddressByEntityId = async (id: string) => {
    await AddressServices.getByEntityId(id).then((res) => {
      const data = JSON.parse(JSON.stringify(res.data));
      if (data && data.length === 0) {
        checkIsEmptyModules("address", true);
      } else {
        checkIsEmptyModules("address", false);
      }
      reset(data && data.length > 0 && data[0]);
      setAddressValues(data && data.length > 0 && data[0]);
    });
  };

  useImperativeHandle(ref, () => ({
    onSubmitAddress() {
      let model = new EntityAddressModel();
      model = {
        address1: getValues("address1") ? getValues("address1") : "",
        address2: getValues("address2") ? getValues("address2") : "",
        address3: getValues("address3") ? getValues("address3") : "",
        address4: getValues("address4") ? getValues("address4") : "",
        addressId: addressValues.addressId ? addressValues.addressId : 0,
        cityId: addressValues.cityId ? addressValues.cityId : 0,
        cntryId: addressValues.cntryId ? addressValues.cntryId : 0,
        emailAddress1: getValues("emailAddress1")
          ? getValues("emailAddress1")
          : "",
        emailAddress2: getValues("emailAddress2")
          ? getValues("emailAddress2")
          : "",
        entityId: id ? id : "",
        fax: getValues("fax") ? getValues("fax") : "",
        freeText1: getValues("freeText1") ? getValues("freeText1") : "",
        freeText2: addressValues.freeText2 ? addressValues.freeText2 : "",
        geoCode: getValues("geoCode") ? getValues("geoCode") : "",
        institutionId: institutionId,
        mobile1: getValues("mobile1") ? getValues("mobile1") : "",
        mobile2: getValues("mobile2") ? getValues("mobile2") : "",
        phone2: getValues("phone2") ? getValues("phone2") : "",
        phoneExternal: addressValues.phoneExternal
          ? addressValues.phoneExternal
          : "",
        postalCodeZip: getValues("postalCodeZip")
          ? getValues("postalCodeZip")
          : "",
        url: getValues("url") ? getValues("url") : "",
        phone1: getValues("phone1") ? getValues("phone1") : "",
      };
      if(model.phone1!="" && model.mobile1!=""){
      AddressServices.saveOrUpdate(model)
        .then((res) => {
          if (res && res.status === StatusCode.Success) {
            toast.success("Address details updated successfully");
          }
          getAddressByEntityId(model.entityId);
        })
        .catch((err) => {
          toast.error(err.response.data.errors[0])
        });
      }
    },
    values: addressValues,
  }));

  const getAllCountries = async () => {
    await CountryService.getActiveCountries()
      .then((res) => {
        setCountryList([...res.data]);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0])
);
  };

  const getCitiesByCountry = async (id: number) => {
    await AddressServices.getAllCitiesByCountryId(id)
      .then((res) => {
        setCityList([...res.data]);
      })
      .catch((err) =>           toast.error(err.response.data.errors[0]));
  };

  const handleSelectChange = (event: any) => {
    const name = event.target.name;
    const id = event.target.value;
    if (name === "cntryId") {
      if (id !== 0) {
        getCitiesByCountry(id);
      }
    }
    setAddressValues({
      ...addressValues,
      [name]: id,
    });
  };

  return (
    <>
      <TabPanel value={value} index={5}>
        <form>
          <div className="panel-body">
            <Grid spacing={5} container>
              <Grid item xs={12} md={6} lg={4}>
                <div className="input-with-label form-group">
                  <label>
                    {" "}
                    {intl.formatMessage({
                      id: "Entity.contact.label.address1",
                      defaultMessage: "Address 1",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("address1")}
                      // onChange={handleChange}
                      // value={addressValues.address1}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.address1?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.address2",
                      defaultMessage: "Address 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("address2")}
                      // onChange={handleChange}
                      // value={addressValues.address2}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.address2?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.address3",
                      defaultMessage: "Address 3",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("address3")}
                      // onChange={handleChange}
                      // value={addressValues.address3}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.address3?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.address4",
                      defaultMessage: "Address 4",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("address4")}
                      // onChange={handleChange}
                      // value={addressValues.address4}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.address4?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.otherDetails",
                      defaultMessage: "Other details",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("freeText1")}
                      // onChange={handleChange}
                      // value={addressValues.freeText1}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.freeText1?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.country",
                      defaultMessage: "Country",
                    })}{" "}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={
                        addressValues.cntryId
                          ? addressValues.cntryId.toString()
                          : "0"
                      }
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder={intl.formatMessage({
                        id: "Entity.select",
                        defaultMessage: "Select",
                      })}
                      {...register("cntryId")}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value={0}>
                        <em>
                          {intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select",
                          })}
                        </em>
                      </MenuItem>
                      {countryList &&
                        countryList.length > 0 &&
                        countryList.map((country) => (
                          <MenuItem value={country.cntryId}>
                            {country.cntryName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {" "}
                    {intl.formatMessage({
                      id: "Entity.contact.label.city",
                      defaultMessage: "City",
                    })}{" "}
                  </label>
                  <FormControl fullWidth>
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder={intl.formatMessage({
                        id: "Entity.select",
                        defaultMessage: "Select",
                      })}
                      {...register("cityId")}
                      onChange={handleSelectChange}
                      value={
                        addressValues.cityId
                          ? addressValues.cityId.toString()
                          : ""
                      }
                    >
                      <MenuItem value="">
                        <em>
                          {intl.formatMessage({
                            id: "Entity.select",
                            defaultMessage: "Select",
                          })}
                        </em>
                      </MenuItem>
                      {cityList &&
                        cityList.length > 0 &&
                        cityList.map((city) => (
                          <MenuItem value={city.cityId}>
                            {city.cityName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.postalCode",
                      defaultMessage: "Postal Code",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("postalCodeZip")}
                      // onChange={handleChange}
                      // value={addressValues.postalCodeZip}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.postalCodeZip?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.geoCode",
                      defaultMessage: "Geo Code",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("geoCode")}
                      // onChange={handleChange}
                      // value={addressValues.geoCode}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.geoCode?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.phone1",
                      defaultMessage: "Phone 1",
                    })}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("phone1")}
                      // onChange={handleChange}
                      // value={addressValues.phone1}
                      id="phone1"
                      autoComplete="off"
                      aria-describedby="error-helper-text"
                      type="number"
                      className="hidearrow"
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.phone1?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.phone2",
                      defaultMessage: "Phone 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("phone2")}
                      type="number"
                      className="hidearrow"
                      // onChange={handleChange}
                      // value={addressValues.phone2}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.phone2?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.mobile1",
                      defaultMessage: "Mobile 1",
                    })}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("mobile1")}
                      type="number"
                      className="hidearrow"
                      // onChange={handleChange}
                      // value={addressValues.mobile1}
                    />

                    <FormHelperText id="error-helper-text" error>
                      {errors.mobile1?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.mobile2",
                      defaultMessage: "Mobile 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("mobile2")}
                      type="number"
                      className="hidearrow"
                      // onChange={handleChange}
                      // value={addressValues.mobile2}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.mobile2?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
            <Grid spacing={5} container>
              <Grid item xs={12} md={6} lg={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.fax",
                      defaultMessage: "Fax",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("fax")}
                      // onChange={handleChange}
                      // value={addressValues.fax}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.fax?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.url",
                      defaultMessage: "URL",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("url")}
                      // onChange={handleChange}
                      // value={addressValues.url}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.url?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.email1",
                      defaultMessage: "Email 1",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("emailAddress1")}
                      // onChange={handleChange}
                      // value={addressValues.emailAddress1}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.emailAddress1?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label>
                    {intl.formatMessage({
                      id: "Entity.contact.label.email2",
                      defaultMessage: "Email 2",
                    })}
                  </label>
                  <FormControl fullWidth>
                    <InputBase
                      placeholder="Write"
                      error
                      fullWidth
                      {...register("emailAddress2")}
                      // onChange={handleChange}
                      // value={addressValues.emailAddress2}
                    />
                    <FormHelperText id="error-helper-text" error>
                      {errors.emailAddress2?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </TabPanel>
    </>
  );
});

export default EntityAddress;
