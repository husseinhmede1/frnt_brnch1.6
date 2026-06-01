import {
  down_arrow_icon,
  date_ic,
  ic_check,
  ic_checked,
  clockIcon,
  cancelIcon,
  ios_arrow_forward,
  uncheck_rounded,
  check_rounded,
} from "../assets/images";
import { updateJobReload, updateJobState } from "../feature/jobSchedule";
import { RootState } from "../feature/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { JobModel } from "../models/jobs/JobModel";
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateValidationError } from "@mui/x-date-pickers/internals/hooks/validation/useDateValidation";
import { JobService } from "../services/job-list-service";
import { StatusCode, hoursConst, minutesConst } from "../utils/constant";
import validations from "../utils/validations";
import { format } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function datepickerIcon() {
  return <img src={date_ic} alt="calendar" />;
}
function timepickerIcon() {
  return <img src={clockIcon} alt="calendar" />;
}
function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

function CheckboxIcon() {
  return <img src={ic_check} alt="checkbox" />;
}
function CheckedboxIcon() {
  return <img src={ic_checked} alt="checkbox" />;
}

const ThickBlueCalendarWithSixSquaresIcon = () => (
  <SvgIcon style={{ color: '#5798FB', width: "95%" }} viewBox="0 0 70 70">
    {/* Thicker outer blue calendar frame */}
    <rect x="6" y="10" width="52" height="46" rx="5" ry="5" fill="#5798FB" />

    {/* Thicker top tabs */}
    <rect x="16" y="4" width="8" height="14" rx="1" fill="#5798FB" />
    <rect x="40" y="4" width="8" height="14" rx="1" fill="#5798FB" />

    {/* Inner white area (shrunk a bit to thicken outer border) */}
    {/* <rect x="18" y="24" width="28" height="26" rx="2" fill="white" /> */}
    {/* <rect x="10" y="24" width="44" height="26" rx="2" fill="white" /> */}
    <rect x="10" y="20" width="44" height="32" rx="2" fill="white" />

    {/* Six inner blue squares (2 rows x 3 columns) */}
    <rect x="20" y="28" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="29" y="28" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="38" y="28" width="6" height="6" rx="1" fill="#5798FB" />

    <rect x="20" y="38" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="29" y="38" width="6" height="6" rx="1" fill="#5798FB" />
    <rect x="38" y="38" width="6" height="6" rx="1" fill="#5798FB" />
  </SvgIcon>
);


function DesignerJobSchedule(props: any) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const scheduleState = useSelector(
    (state: RootState) => state.jobSchedule.value
  );
  const scheduleData = useSelector(
    (state: RootState) => state.jobSchedule.value1
  );

  const [formSubmit, setFormSubmit] = React.useState<boolean>(false);
  const [startdate, setStartDate] = React.useState<Date | null | string>(null);
  const [starttime, setStartTime] = React.useState<string|null>(null);

  const [expireFlag, setExpireFlag] = React.useState<boolean>(false);
  const [expiredate, setExpireDate] = React.useState<Date | null | string>(
    null
  );
  const [expiretime, setExpireTime] = React.useState<string|null>(
    null
  );

  const [recurring, setRecurring] = React.useState<boolean>(false);
  const [recurringFreq, setRecurringFreq] = React.useState<
    Date | null | string
  >(null);

  const [stoptask, setStoptask] = React.useState<boolean>(false);
  const [stoptaskTime, setStoptaskTime] = React.useState<Date | null | string>(
    null
  );
  const [enable, setEnable] = React.useState<boolean>(true);
  const [jobId, setJobId] = React.useState<number>(0);
  const [error, setError] = React.useState<DateValidationError | null>(null);
  const [errorEnd, setErrorEnd] = React.useState<DateValidationError | null>(
    null
  );
  const [dayFlag, setDayFlag] = React.useState<boolean>(false);

  const [openSchedule, setOpenSchedule] = React.useState(false);
  const [repeatHrs, setRepeatHrs] = React.useState(" ");
  const handleRepeatHrs = (event: SelectChangeEvent) => {
    setRepeatHrs(event.target.value);
    setValue("repeatHrs", event.target.value, { shouldValidate: true });
  };

  const [repeatMins, setRepeatMins] = React.useState(" ");
  const handleRepeatMins = (event: SelectChangeEvent) => {
    setRepeatMins(event.target.value);
    setValue("repeatMins", event.target.value, { shouldValidate: true });
  };

  const [repeatSecs, setRepeatSecs] = React.useState(" ");
  const handleRepeatSecs = (event: SelectChangeEvent) => {
    setRepeatSecs(event.target.value);
    setValue("repeatSecs", event.target.value, { shouldValidate: true });
  };

  const [stopHrs, setStopHrs] = React.useState(" ");
  const handleStopHrs = (event: SelectChangeEvent) => {
    setStopHrs(event.target.value);
  };

  const [stopMins, setStopMins] = React.useState(" ");
  const handleStopMins = (event: SelectChangeEvent) => {
    setStopMins(event.target.value);
  };
  //const handleOpenSchedule = () => setOpenSchedule(true);
  const handleCloseSchedule = () => {
    setOpenSchedule(false);
    setError(null);
    setErrorEnd(null);
    dispatch(updateJobState({ openSchedule: false }));
    dispatch(updateJobReload({reloadData: false}));
    handleReset();
  };
  const [view, setView] = React.useState("0");
  useEffect(() => {
    setOpenSchedule(scheduleState.openSchedule);
    setTimeout(() => {
      setError(null);
      // setErrorEnd(null);
    }, 100);
  }, [scheduleState.openSchedule]);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case "maxDate": {
        return "Start Date can't be after Expire Date";
      }
      case "minDate": {
        let year = new Date(startdate as string).getFullYear();
        if (year.toString().length < 4) {
          return "Invalid Date";
        }
        return "Start Date can't be before today's date";
      }

      case "invalidDate": {
        return "Invalid Date";
      }

      default: {
        let year = new Date(startdate as string).getFullYear();
        if (year.toString().length < 4) {
          return "Invalid Date";
        }
        return "";
      }
    }
  }, [error, startdate]);

  const errorMessageEnd = React.useMemo(() => {
    switch (errorEnd) {
      case "maxDate":
      case "minDate": {
        let year = new Date(expiredate as string).getFullYear();
        if (year.toString().length < 4) {
          return "Invalid Date";
        }
        return "Expire can't be before today's date and Start Date";
      }
      case "invalidDate": {
        return "Invalid Date";
      }
      default: {
        let year = new Date(expiredate as string).getFullYear();
        if (year.toString().length < 4) {
          return "Invalid Date";
        }
        return "";
      }
    }
  }, [errorEnd, expiredate]);

  
  const {
    register,
    reset,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobModel>({
    mode: "onChange",
    resolver: yupResolver(view === "3"? validations.addScheduleValidationContinuous: validations.addScheduleValidation),
  });

  useEffect(() => {
    if (scheduleData !== undefined) {
      reset(scheduleData);
      setView((scheduleData?.frequency?.toString() as string) ?? "0");
      setStartDate(
        (scheduleData?.startDate?.toString().slice(0, 10) as string) ?? null
      );
      setStartTime(
        (scheduleData?.startDate?.toString().slice(11, 16) as string) ?? ""
      );
      
      setRecurring(scheduleData?.recurring === "1" ? true : false);
      setRecurringFreq(
        scheduleData?.recurringFreq
          ? ((scheduleData?.startDate?.toString().slice(0, 11) +
            moment
              .utc()
              .startOf("day")
              .add(scheduleData?.recurringFreq, "minutes")
              .format("HH:mm")
              .toString() +
            ":00") as string)
          : null
      );
      setStoptask(scheduleData?.maxExceTime ? true : false);
      setStoptaskTime(
        scheduleData?.maxExceTime
          ? ((scheduleData?.startDate?.toString().slice(0, 11) +
            moment
              .utc()
              .startOf("day")
              .add(scheduleData?.maxExceTime, "minutes")
              .format("HH:mm")
              .toString() +
            ":00") as string)
          : null
      );
      setExpireFlag(scheduleData?.endDate ? true : false);
      setExpireDate(
        (scheduleData?.endDate?.toString().slice(0, 10) as string) ?? null
      );
      setDayFlag(scheduleData?.monthDay ? true : false);
      setExpireTime(
        (scheduleData?.endDate?.toString().slice(11, 16) as string) ?? null
      );
      setEnable(scheduleData?.enabled === "1" ? true : false);
      setJobId(scheduleData?.jobId as number);
      setStopHrs(
        scheduleData?.maxExceTime
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.maxExceTime, "minutes")
            .format("H") as string)
          : " "
      );
      setStopMins(
        scheduleData?.maxExceTime
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.maxExceTime, "minutes")
            .format("m") as string)
          : " "
      );
      setRepeatHrs(
        scheduleData?.recurringFreq
          ? scheduleData?.recurringFreq
          : " "
      );
      setRepeatMins(
        scheduleData?.recurringFreq
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.recurringFreq, "seconds")
            .format("m") as string)
          : " "
      );
      setRepeatSecs(
        scheduleData?.recurringFreq
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.recurringFreq, "seconds")
            .format("s") as string)
          : " "
      );
      setValue(
        "startDate",
        scheduleData?.startDate?.toString().slice(0, 10) ?
          format(new Date(scheduleData?.startDate?.toString().slice(0, 10) as string), 'MMM dd, yyyy')
          : undefined,
        { shouldValidate: true }
      );
      setValue("stopTaskFlag", scheduleData?.maxExceTime, {
        shouldValidate: true,
      });
      setValue("expireFlag", scheduleData?.endDate ? "1" : "0", {
        shouldValidate: true,
      });
      setValue(
        "endDate",
        scheduleData?.endDate?.toString().slice(0, 10) ?
          format(new Date(scheduleData?.endDate?.toString().slice(0, 10) as string), 'MMM dd, yyyy')
          : undefined,
        { shouldValidate: true }
      );
      // setValue(
      //   "expireTime",
      //   scheduleData?.endDate?.toString().slice(0, 19) as string,
      //   { shouldValidate: true }
      // );
      setValue("recurring", scheduleData?.recurring, { shouldValidate: true });
      setValue(
        "stopHrs",
        scheduleData?.maxExceTime
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.maxExceTime, "minutes")
            .format("H") as string)
          : " ",
        { shouldValidate: true }
      );
      setValue(
        "stopMins",
        scheduleData?.maxExceTime
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.maxExceTime, "minutes")
            .format("m") as string)
          : " ",
        { shouldValidate: true }
      );
      setValue(
        "repeatHrs",
        scheduleData?.recurringFreq
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.recurringFreq, "seconds")
            .format("H") as string)
          : " ",
        { shouldValidate: true }
      );
      setValue(
        "repeatMins",
        scheduleData?.recurringFreq
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.recurringFreq, "seconds")
            .format("m") as string)
          : " ",
        { shouldValidate: true }
      );
      setValue(
        "repeatSecs",
        scheduleData?.recurringFreq
          ? (moment
            .utc()
            .startOf("day")
            .add(scheduleData?.recurringFreq, "seconds")
            .format("s") as string)
          : " ",
        { shouldValidate: true }
      );
      setError(null);
      // setErrorEnd(null);
      // handleReset();
    }
  }, [scheduleData, openSchedule]);

  const onSubmit = (values: JobModel) => {
    setFormSubmit(true);
    // let recHours = moment(recurringFreq)
    //   .format("YYYY-MM-DDTHH:mm:ss")
    //   ?.toString()
    //   .substring(11, 13);
    // let recMinute = moment(recurringFreq)
    //   .format("YYYY-MM-DDTHH:mm:ss")
    //   ?.toString()
    //   .substring(14, 16);
    // let stopHours = moment(stoptaskTime)
    //   .format("YYYY-MM-DDTHH:mm:ss")
    //   ?.toString()
    //   .substring(11, 13);
    // let stopMinute = moment(stoptaskTime)
    //   .format("YYYY-MM-DDTHH:mm:ss")
    //   ?.toString()
    //   .substring(14, 16);
    let endDateTime = moment(expiredate)
      .format("YYYY-MM-DD")
      .concat(
        (expiretime && expiretime?.length > 0)? ` ${expiretime}:00` : " 00:00:00"
      );
    let startDateTime = moment(startdate)
      .format("YYYY-MM-DD")
      .concat(
        (starttime && starttime?.length > 0)? ` ${starttime}:00` : " 00:00:00"
      );

    let model = {
      // enabled: enable === true ? "1" : "0",
      endDateTime: expiredate === null ? "" : endDateTime,
      frequency: view ?? "0",
      jobId: jobId,
      monthDay: values.monthDay ? Number(values.monthDay) : 0,
      repeatTaskFlag: recurring === true ? "1" : "0",
      repeatTaskHour: repeatHrs === " " ? 0 : Number(repeatHrs),
      repeatTaskMinute: repeatMins === " " ? 0 : Number(repeatMins),
      repeatTaskSecond: repeatSecs === " " ? 0 : Number(repeatSecs),
      startDateTime: startdate === null? "": startDateTime,
      stopTaskFlag: stoptask === true ? "1" : "0",
      stopTaskHour: stopHrs === " " ? 0 : Number(stopHrs),
      stopTaskMinute: stopMins === " " ? 0 : Number(stopMins),
    };

    JobService.scheduleJob(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          if(res.data?.message){
            toast.success(res.data.message);
          }else {
            toast.success("Job schedule successfully");
          }
          dispatch(updateJobReload({reloadData: true}));
          dispatch(updateJobState({ openSchedule: false }));
          setFormSubmit(false);
        }
      })
      .catch((err) => {
        setFormSubmit(false);
        err?.response?.data?.errors?.map((e: any) => toast.error(e));
      });
  };

  const handleReset = (): void => {
    reset(new JobModel());
    setView("0");
    setStartDate(null);
    setStartTime(null);
    setExpireDate(null);
    setExpireTime(null);
    setRecurring(false);
    setRecurringFreq(null);
    setStoptask(false);
    setStoptaskTime(null);
    setExpireFlag(false);
    setDayFlag(false);
    setExpireDate(null);
    setEnable(false);
    setRepeatHrs(" ");
    setRepeatMins(" ");
    setRepeatSecs(" ");
    setStopHrs(" ");
    setStopMins(" ");
    setValue("stopTaskFlag", "0", { shouldValidate: true });
    setValue("expireFlag", "0", { shouldValidate: true });
    setValue("expireTime", null, { shouldValidate: true });
    setValue("endDate", null, { shouldValidate: true });
    setValue("recurring", "0", { shouldValidate: true });
    setValue("stopHrs", " ", { shouldValidate: true });
    setValue("stopMins", " ", { shouldValidate: true });
    setValue("repeatHrs", " ", { shouldValidate: true });
    setValue("repeatMins", " ", { shouldValidate: true });
  };

  const handleFrequencyChange = (event: any) => {
    setView(event.target.value);
    setValue("frequency", Number(event.target.value));
    setStopHrs(" ");
    setStopMins(" ");
    setStoptask(false);
    setStoptaskTime(null);
    setExpireFlag(false);
    setExpireDate(null);
    setExpireTime(null);
    setRepeatHrs(" ");
    setRepeatMins(" ");
    setRepeatSecs(" ");
    setRecurring(false);
    setValue("stopTaskFlag", "0", { shouldValidate: true });
    setValue("expireFlag", "0", { shouldValidate: true });
    setValue("expireTime", null, { shouldValidate: true });
    setValue("endDate", null, { shouldValidate: true });
    setValue("recurring", "0", { shouldValidate: true });
    setValue("stopHrs", " ", { shouldValidate: true });
    setValue("stopMins", " ", { shouldValidate: true });
    setValue("repeatHrs", " ", { shouldValidate: true });
    setValue("repeatMins", " ", { shouldValidate: true });
  };

  return (
    <Dialog open={openSchedule} aria-labelledby="modal-modal-title"   PaperProps={{
    style: {
      maxWidth: "none"   },
  }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="user-card-modal modal-schedule"   style={{ width: "3000px !important", maxWidth: "95vw !important", padding:"30px" }}
>
          <IconButton
            style={{float: "right",marginRight: "-20px",marginLeft: "0",marginTop:"-20px"}}
            size="small"
            onClick={handleCloseSchedule}
          >
            <img src={cancelIcon} alt="close" />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h6">
            <FormattedMessage
              id="PopUpOneTime_2_1.jobschedule"
              defaultMessage="Job Schedule"
            />
          </Typography>
          <Divider></Divider>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} container> */}
            <Grid item xs={12} container spacing={3}>
              <Grid item lg={2.5} xs={3}>
                <div className="align-label jobschedule-label">
                  <label>
                    <FormattedMessage
                      id="PopUpOneTime_2_1.choosefrequency"
                      defaultMessage="Choose Frequency"
                    />
                  </label>
                </div>
              </Grid>
              <Grid item lg={8} xs={9}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="0"
                      disabled={!props.isEdit}
                      {...register("frequency")}
                      control={
                        <Radio
                          checkedIcon={<img src={check_rounded} alt="radio" />}
                          icon={<img src={uncheck_rounded} alt="radio" />}
                          checked={view === "0"}
                          onChange={handleFrequencyChange}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpOneTime_2_1.onetime",
                        defaultMessage: "One time",
                      })}
                    />
                    <FormControlLabel
                      value="1"
                      {...register("frequency")}
                      control={
                        <Radio
                          checked={view === "1"}
                          disabled={!props.isEdit}
                          onChange={handleFrequencyChange}
                          // onChange={(event) => {
                          //     setView(event.target.value);
                          //     setValue("frequency", Number(event.target.value));
                          // }}
                          checkedIcon={<img src={check_rounded} alt="radio" />}
                          icon={<img src={uncheck_rounded} alt="radio" />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpOneTime_2_1.daily",
                        defaultMessage: "Daily",
                      })}
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={view === "2"}
                          disabled={!props.isEdit}
                          onChange={handleFrequencyChange}
                          // onChange={(event) => {
                          //     setView(event.target.value);
                          //     setValue("frequency", Number(event.target.value));
                          // }}
                          checkedIcon={<img src={check_rounded} alt="radio" />}
                          icon={<img src={uncheck_rounded} alt="radio" />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpOneTime_2_1.monthly",
                        defaultMessage: "Monthly",
                      })}
                      value="2"
                      {...register("frequency")}
                    />
                    <FormControlLabel
                      value="3"
                      disabled={!props.isEdit}
                      {...register("frequency")}
                      control={
                        <Radio
                          checkedIcon={<img src={check_rounded} alt="radio" />}
                          icon={<img src={uncheck_rounded} alt="radio" />}
                          checked={view === "3"}
                          onChange={handleFrequencyChange}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpOneTime_2_1.continuous",
                        defaultMessage: "Continuous",
                      })}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
{view != "3" &&            <Grid item xs={12} container spacing={3}>
              <Grid item lg={2.5} xs={3}>
                <div className="align-label">
                  <label>
                    <FormattedMessage
                      id="PopUpOneTime_2_1.startdate"
                      defaultMessage="Start Date"
                    />{" "}
                    <span className="required">*</span>
                  </label>
                </div>
              </Grid>
              <Grid item lg={4} xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="MMM dd, yyyy"
                    disabled={!props.isEdit}
                    value={startdate}
                    {...register("startDate")}
                    minDate={new Date()}
                    maxDate={
                      expiredate && expiredate >= new Date()
                        ? expiredate
                        : undefined
                    }
                    onError={(newError) => setError(newError)}
                    onChange={(newValue: any) => {
                      setStartDate(newValue);
                      setValue("startDate", newValue, {
                        shouldValidate: true,
                      });
                    }}
                    components={{
                      OpenPickerIcon: ThickBlueCalendarWithSixSquaresIcon,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="datepicker"
                        disabled={!props.isEdit}
                        autoComplete="off"
                        fullWidth
                        inputProps={{
                          ...params.inputProps,
                          id: "job-start",
                          placeholder: intl.formatMessage({
                            id: "PopUpOneTime_2_1.selectdate",
                            defaultMessage: "Select Date",
                          }),
                          readOnly: true,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {/* {startdate === null && errors.fromDate?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {errorMessage
                      ? errorMessage
                      : validations.addDelegation.startDate}
                  </FormHelperText>
                ) : (
                  (document?.activeElement?.id === "delegate-start" ||
                    errorMessage === "Invalid Date" ||
                    (startdate &&
                      new Date(startdate) < new Date())) && (
                    <FormHelperText id="error-helper-text" error>
                      {errorMessage}
                    </FormHelperText>
                  )
                )} */}
                {startdate === null && errors.startDate?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {errorMessage
                      ? errorMessage
                      : validations.ScheduleValidation.startDate}
                  </FormHelperText>
                ) : (
                  (document?.activeElement?.id === "job-start" ||
                    errorMessage === "Invalid Date" ||
                    (startdate &&
                      new Date(startdate) < new Date())) && (
                    <FormHelperText id="error-helper-text" error>
                      {errorMessage}
                    </FormHelperText>
                  )
                )}
              </Grid>
              <Grid item lg={4} xs={4}>
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopTimePicker
                    {...register("startTime")}
                    value={starttime}
                    ampm={false}
                    onChange={(newValue: any) => {
                      setStartTime(newValue);
                      setValue("startTime", newValue, {
                        shouldValidate: true,
                      });
                    }}
                    components={{
                      OpenPickerIcon: timepickerIcon,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="datepicker"
                        fullWidth
                        inputProps={{
                          ...params.inputProps,
                          readOnly: true,
                          placeholder: intl.formatMessage({
                            id: "PopUpOneTime_2_1.selecttime",
                            defaultMessage: "Select Time",
                          }),
                        }}
                      />
                    )}
                  />
                </LocalizationProvider> */}
                <InputBase
                  value={starttime}
                  disabled={!props.isEdit}
                  {...register("startTime")}
                  onChange={(event: any) => {
                    setStartTime(event.target.value)
                    setValue("startTime", event.target.value, {shouldValidate: true})
                  }}
                  id="starttime"
                  type="time"
                  fullWidth
                  autoComplete="off"
                />
                {(starttime === null || starttime === "") && errors.startTime?.message ? (
                  <FormHelperText id="error-helper-text" error>
                    {validations.ScheduleValidation.startTime}
                  </FormHelperText>
                ) : null}
              </Grid>
            </Grid>
}            {view === "2" ? (
              <Grid container spacing={2} item>
                <Grid item xs={12} container spacing={2}>
                  <Grid item lg={2} xs={3} alignSelf="center">
                    <FormControlLabel
                      value="day"
                      control={
                        <Radio
                          checked={dayFlag}
                          onChange={() => setDayFlag(!dayFlag)}
                          checkedIcon={<img src={check_rounded} alt="radio" />}
                          icon={<img src={uncheck_rounded} alt="radio" />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpMonthly_2_4.day",
                        defaultMessage: "Day",
                      })}
                    />
                  </Grid>
                  <Grid item xs={5} container spacing={2}>
                    <Grid item xs={2}>
                      <InputBase
                        placeholder="0"
                        // required
                        disabled={!dayFlag}
                        {...register("monthDay")}
                        id="days"
                        autoComplete="off"
                        inputProps={{ maxLength: 2 }}
                      />
                    </Grid>
                    <Grid item xs={6} alignSelf="center">
                      <label>
                        <FormattedMessage
                          id="PopUpMonthly_2_4.ofeverymonth"
                          defaultMessage="of every month"
                        />
                      </label>
                    </Grid>
                    <Grid item xs={9}>
                      {dayFlag && errors.monthDay?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {errors.monthDay?.message}
                        </FormHelperText>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
          <Divider className="divider"></Divider>
          {/* <Typography id="modal-modal-title" variant="h6" component="h6">
            <FormattedMessage
              id="PopUpOneTime_2_1.advancedsettings"
              defaultMessage="Advanced Settings"
            />
          </Typography> */}
          <Grid container spacing={3} className="setting-grid">
            {view === "1" && (
              <Grid item xs={12} container spacing={2}>
                <Grid item lg={3} xs={5} alignSelf="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckboxIcon />}
                        checked={recurring}
                        {...register("recurring")}
                        onChange={(event: any) => {
                          setRecurring(event.target.checked);
                          setValue(
                            "recurring",
                            event.target.checked ? "1" : "0",
                            { shouldValidate: true }
                          );
                        }}
                        checkedIcon={<CheckedboxIcon />}
                      />
                    }
                    label={intl.formatMessage({
                      id: "PopUpDaily_2_2.repeattaskevery",
                      defaultMessage: "Repeat task every",
                    })}
                  />
                </Grid>
                <Grid item lg={2} xs={3}>
                  <Select
                    // {...register("repeateHrs")}
                    id="select-hrs"
                    fullWidth
                    value={repeatHrs}
                    onChange={handleRepeatHrs}
                    IconComponent={ArrowDown}
                    disabled={!recurring}
                    MenuProps={{
                      className: "select-item",
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    }}
                  >
                    <MenuItem disabled value=" ">
                      <em>
                        {intl.formatMessage({
                          id: "PopUpOneTime_2_1.selecthours",
                          defaultMessage: "Select Hours",
                        })}
                      </em>
                    </MenuItem>
                    {hoursConst.length > 0 &&
                      hoursConst.filter(hourConst => hourConst != 0 && hourConst != 24)?.map((item: any) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                  </Select>
                  {recurring &&
                    repeatHrs === " " &&
                    errors.repeatHrs?.message ? (
                    <FormHelperText id="error-helper-text" error>
                      {errors.repeatHrs?.message}
                    </FormHelperText>
                  ) : null}
                </Grid>
                <Grid item lg={1} xs={3} alignSelf="center">
                  <label>
                    {intl.formatMessage({
                      id: "PopUpOneTime_2_1.hrs",
                      defaultMessage: "hrs",
                    })}
                  </label>
                </Grid>

              </Grid>
            )}

            {(view === "1" || view === "2") && (
              <>
                <Grid item xs={12} container spacing={3}>
                  <Grid item lg={3} xs={5} alignSelf="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<CheckboxIcon />}
                          checked={expireFlag}
                          onChange={(event: any) => {
                            setExpireFlag(event.target.checked);
                            setValue(
                              "expireFlag",
                              event.target.checked ? "1" : "0",
                              { shouldValidate: true }
                            );
                            if (!event.target.checked) {
                              setExpireDate(null);
                              setValue("endDate", null, {shouldValidate: true});
                              setExpireTime(null);
                              setValue("expireTime", null, {shouldValidate: true});
                            }
                          }}
                          checkedIcon={<CheckedboxIcon />}
                        />
                      }
                      label={intl.formatMessage({
                        id: "PopUpDaily_2_2.expire",
                        defaultMessage: "Expire",
                      })}
                    />
                  </Grid>
                  <Grid item lg={4} xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        disabled={!expireFlag}
                        inputFormat="MMM dd, yyyy"
                        value={expiredate}
                        // minDate={
                        //   errorMessage === null && startdate
                        //     ? startdate
                        //     : new Date()
                        // }
                        minDate={
                          startdate && new Date(startdate) >= new Date()
                            ? 
                            new Date(startdate as string)
                            : new Date()
                        }
                        onError={(newError) => setErrorEnd(newError)}
                        {...register("endDate")}
                        onChange={(newValue: any) => {
                          setExpireDate(newValue);
                          setValue("endDate", newValue, {
                            shouldValidate: true,
                          });
                          trigger("expireTime")
                        }}
                        components={{
                          OpenPickerIcon: ThickBlueCalendarWithSixSquaresIcon,
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="datepicker"
                            fullWidth
                            inputProps={{
                              ...params.inputProps,
                              id: "expire-date",
                              placeholder: intl.formatMessage({
                                id: "PopUpOneTime_2_1.selectdate",
                                defaultMessage: "Select Date",
                              }),
                              readOnly: true,
                            }}
                          />
                        )}
                      />
                      {expireFlag && expiredate === null && errors.endDate?.message ? (
                        <FormHelperText id="error-helper-text" error>
                          {errors.endDate?.message}
                        </FormHelperText>
                      ) : (
                        (errorMessageEnd === "Invalid Date" ||
                          (expiredate && new Date(expiredate) < new Date())) && (
                          <FormHelperText id="error-helper-text" error>
                            {errorMessageEnd}
                          </FormHelperText>
                        )
                      )}
                      {/* {expireFlag ? (
                        <FormHelperText id="error-helper-text" error>
                          {errors.endDate?.message ?? errorMessageEnd}
                        </FormHelperText>
                      ) : (
                        <FormHelperText id="error-helper-text" error>
                          {errorMessageEnd}
                        </FormHelperText>
                      )} */}
                    </LocalizationProvider>
                  </Grid>
                  <Grid item lg={4} xs={3}>
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopTimePicker
                        value={expiretime}
                        disabled={!expireFlag}
                        // {...register("endDate")}
                        ampm={false}
                        onChange={(newValue: any) => {
                          setExpireTime(newValue);
                          setValue("expireTime", newValue, {
                            shouldValidate: true,
                          });
                        }}
                        components={{
                          OpenPickerIcon: timepickerIcon,
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="datepicker"
                            fullWidth
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true,
                              placeholder: intl.formatMessage({
                                id: "PopUpOneTime_2_1.selecttime",
                                defaultMessage: "Select Time",
                              }),
                            }}
                          />
                        )}
                      /> */}
                    <InputBase
                      disabled={!expireFlag}
                      value={expiretime}
                      {...register("expireTime")}
                      onChange={(event: any) => {
                        setExpireTime(event.target.value)
                        setValue("expireTime", event.target.value, {
                          shouldValidate: true,
                        });
                      }}
                      id="expiretime"
                      type="time"
                      fullWidth
                      autoComplete="off"
                    />
                    {expireFlag && (
                      <FormHelperText id="error-helper-text" error>
                        {errors.expireTime?.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                {/* <Grid item xs={12} container>
                  <Grid item lg={4} xs={5} alignSelf="center">
                    {/* <FormControlLabel control={<Checkbox {...register("status")} icon={<CheckboxIcon />} checkedIcon={<CheckedboxIcon />} />} label={intl.formatMessage({ id: "PopUpDaily_2_2.enabled", defaultMessage: "Enabled" })} /> *\/

                    <FormControl>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>
                          {" "}
                          <label style={{ paddingTop: "0px" }}>
                            <FormattedMessage
                              id="JobDefinition_2.enabled"
                              defaultMessage="Enabled"
                            />
                          </label>
                        </Grid>
                        <Grid item xs={6}>
                          {" "}
                          <div className="switch">
                            <Typography>
                              <FormattedMessage
                                id="JobDefinition_2.no"
                                defaultMessage="No"
                              />
                            </Typography>
                            <Switch
                              checked={enable}
                              {...register("status")}
                              onChange={(e) => setEnable(e.target.checked)}
                            />
                            <Typography>
                              <FormattedMessage
                                id="JobDefinition_2.yes"
                                defaultMessage="Yes"
                              />
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                </Grid> */}
              </>
            )}
          </Grid>

          <div className="save-btn-grp" style={{marginTop:"15px"}}>
            <Button
              variant="text"
              type="button"
              className="cancel-btn"
              disableElevation
              onClick={handleCloseSchedule}
            >
              {" "}
              <FormattedMessage
                id="PopUpOneTime_2_1.cancel"
                defaultMessage="Cancel"
              />
            </Button>
            <Button
              variant="outlined"
              type="submit"
              className="submit-btn"
              disableElevation
              disabled={
                error || errorEnd || isSubmitting || formSubmit ? true : false
              }
            >
              <FormattedMessage
                id="PopUpOneTime_2_1.submit"
                defaultMessage="Submit"
              />
              <img src={ios_arrow_forward} alt="arrow" />
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default DesignerJobSchedule;
