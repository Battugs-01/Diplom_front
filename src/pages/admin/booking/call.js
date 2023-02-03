import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as Yup from 'yup';
// next
import Head from 'next/head';
// hook form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Grid,
  Container,
  Card,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { searchAdress, connectMap } from 'src/utils/axiosCustom';
// utils
import { phoneRegex, phoneRegexMsg, requiredMsg } from 'src/utils/regex';
// sections
import ListTabs from 'src/sections/@dashboard/booking/tab';
import MapHeader from 'src/sections/@dashboard/booking/mapHeader';
import { CallDialog, FailedDialog, SuccessDialog } from 'src/sections/@dashboard/booking/dialog';
import { useAuthContext } from 'src/auth/useAuthContext';
const MapSide = dynamic(() => import('src/sections/@dashboard/booking/map/MapSide'), { ssr: false });

// ----------------------------------------------------------------------

let count = 0;

let interval;

let SSID;

BookingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BookingPage() {
  const firstFieldRef = useRef();
  const secondFieldRef = useRef();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  // adding 30 minute to later radio group
  const bookingDate = new Date();
  bookingDate.setMinutes(bookingDate.getMinutes() + 30);

  // marker dot list state
  const [markers, setMarkers] = useState([]);

  // map header status state
  const [status, setStatus] = useState('Available');

  // drivers list state
  const [drivers, setDrivers] = useState([]);

  // passenger latitude and longitude object state
  const [passenger_lat_lon, setPassengerLatLon] = useState({ lat: null, lon: null });

  // dest latitude and longitude object state
  const [dest_lat_lon, setDesLatLon] = useState({ lat: null, lon: null });

  // s address text
  const [saddressText, setSaddressText] = useState('');

  // d address text
  const [daddressText, setDaddressText] = useState('');

  // search list
  const [searchResults, setSearchResults] = useState([]);

  // additional cost state
  const [additional_cost, setAdditionalCost] = useState(0);

  // vehicle type list
  const [vehicleTypeList, setVehicleTypeList] = useState([]);

  // failed dialog message state
  const [res_message, setResMessage] = useState('');

  // booking status state
  const [bookingStatus, setBookingStatus] = useState('call');

  // call dialog state
  const [openCall, setOpenCall] = useState(false);

  // failed dialog state
  const [openFailed, setOpenFailed] = useState(false);

  // success dialog state
  const [openSuccess, setOpenSuccess] = useState(false);

  // autocomplete's additional string
  const [saddressNewString, setSaddressNewString] = useState('');

  // autocomplete's additional string
  const [daddressNewString, setDaddressNewString] = useState('');

  // autcomplete's saddress combined string
  const [combinedString, setCombinedString] = useState('');

  // autocomplete's daddress combined string
  const [daddressCombinedStr, setDaddressCombinedStr] = useState('');

  // use effect
  useEffect(() => {
    getSSID();
    getData();
    getVehicleType();
    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  // combining saddress new string with autocomplete's value
  useEffect(() => {
    if (saddressNewString) {
      let combinedString = values?.saddress + saddressNewString;
      setCombinedString(combinedString);
    }
  }, [saddressNewString]);

  // combining daddress new string with autocomplete's value
  useEffect(() => {
    if (daddressNewString) {
      let combinedString = values?.daddress + daddressNewString;
      setDaddressCombinedStr(combinedString);
    }
  }, [daddressNewString]);

  // fetching SSID
  async function getSSID() {
    const { ssid } = await connectMap();
    SSID = ssid;
  }

  // fetching data every 3 seconds
  async function getData() {
    getMapDriverList();
    interval = setInterval(async () => {
      getMapDriverList();
    }, 3000);
  }

  // fetching map driver list
  async function getMapDriverList() {
    let fetchTerm = {
      listQuery: { search: {}, limit: 2000, currentPage: 1, sort: { prop: 'driver_id', order: 'asc' } },
    };
    await axiosInstance
      .post('/getMapDriverList', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setDrivers(data);
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
  }

  // fetching vehicle type list
  async function getVehicleType() {
    let fetchTerm = {
      type: 'Ride',
    };
    await axiosInstance
      .post('/getVehicleType', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setVehicleTypeList(data);
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
  }

  // calculating long distance additional cost
  async function longDistance(lat, lng) {
    let fetchTerm = {
      latitude: lat,
      longitude: lng,
    };
    const res = await axiosInstance.post('/longDistance', fetchTerm);
    const { action } = res.data;
    if (action === 1) {
      const data = res?.data?.data;
      setAdditionalCost(data?.longDistanceFare || 0);
    }
  }

  // validation schema
  const CallSchema = Yup.object().shape({
    phone: Yup.string().matches(phoneRegex, phoneRegexMsg).required(requiredMsg),
    saddress: Yup.string().required('Авах хаягаа оруулна уу.'),
    vehicle_type_id: Yup.string().required('Төрөл сонгох.'),
  });

  // initial values
  const defaultValues = {
    phone: 0,
    description: '',
    saddress: '',
    daddress: '',
    vehicle_type_id: 1,
    publish: true,
    when: 'now',
    dateTime: bookingDate,
    cab_booking_id: 0,
  };

  // use form
  const methods = useForm({
    resolver: yupResolver(CallSchema),
    defaultValues,
  });

  // extracting methods
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // all values
  const values = watch();

  //
  async function NewCall() {
    let fetchTerm = {
      listQuery: {
        phone: values?.phone || '12345678',
        when: values?.when || 'now',
        passenger_lat: passenger_lat_lon?.lat,
        passenger_lon: passenger_lat_lon?.lon,
        vehicle_type_id: values?.vehicle_type_id,
        pick_up_address: combinedString || values?.saddress,
        dest_address: daddressCombinedStr || values?.daddress,
        booking_date: values?.when === 'now' ? '' : values?.dateTime,
        driver_id: 0,
        dest_latitude: dest_lat_lon?.lat,
        dest_longitude: dest_lat_lon?.lon,
        distance: 0,
        duration: 0,
        type: 'Ride',
        status: 'Pending',
        auto_assign: 'Yes',
        pay_type: 'Cash',
        user_comment: values?.description,
        cab_booking_id: values?.cab_booking_id || 0,
        created_user_id: user?.admin_id,
      },
    };
    if (values?.when === 'now') {
      setOpenCall(true);
    }
    try {
      const response = await axiosInstance.post('/addBook', fetchTerm);
      const { action, message } = response?.data;
      if (action === 1) {
        setOpenCall(false);
        setResMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 100));
        handleClear();
        setOpenSuccess(true);
      } else {
        const newValue = watch();
        if (count === 0) {
          count++;
          if (newValue?.phone !== 0) {
            setOpenCall(false);
            setResMessage(message);
            await new Promise((resolve) => setTimeout(resolve, 100));
            setOpenFailed(true);
          }
        } else {
          count === 0;
          cancelCabRequestFunc();
        }
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  }

  // when booking status equal to edit this func will work
  async function EditBook() {
    let fetchTerm = {
      cab_booking_id: values?.cab_booking_id,
      source_addresss: combinedString || values?.saddress,
      source_latitude: passenger_lat_lon?.lat,
      source_longitude: passenger_lat_lon?.lon,
      dest_address: daddressCombinedStr || values?.daddress,
      dest_latitude: dest_lat_lon?.lat,
      dest_longitude: dest_lat_lon?.lon,
      booking_date: values?.dateTime,
      user_comment: values?.description,
      update_user_id: user?.admin_id,
    };
    try {
      const response = await axiosInstance.post('/updateLaterBook', fetchTerm);
      const { action, message } = response?.data;
      if (action === 1) {
        handleClear();
        enqueueSnackbar(message ? message : 'Алдаатай хүсэлт', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(message ? message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  }

  // handling booking card submit depend on booking status
  const onSubmit = async () => {
    if (bookingStatus === 'call') {
      NewCall();
    } else if (bookingStatus === 'later') {
      NewCall();
      setBookingStatus('call');
    } else if (bookingStatus === 'edit') {
      EditBook();
      setBookingStatus('call');
    }
  };

  // handling start point text n lat n lng
  const handleOnSetSaddress = (text, lat, lng) => {
    let values = watch();
    longDistance(parseFloat(lat), parseFloat(lng));
    reset({ ...values, saddress: text });
    setSaddressText(text);
    setPassengerLatLon({ ...passenger_lat_lon, lat: parseFloat(lat), lon: parseFloat(lng) });
  };

  // handling end point text n lat n lng
  const handleOnSetDaddress = (text, lat, lng) => {
    let values = watch();
    reset({ ...values, daddress: text });
    setDaddressText(text);
    setDesLatLon({ ...dest_lat_lon, lat: parseFloat(lat), lon: parseFloat(lng) });
  };

  // handling later booking table edit
  const handleChangeLaterBooking = (row) => {
    setBookingStatus('edit');
    if (row?.source_latitude !== null && row?.source_latitude !== '') {
      handleOnSetSaddress(row?.source_addresss, row?.source_latitude, row?.source_longitude);
    }
    if (row?.dest_latitude !== null && row?.dest_latitude !== '') {
      handleOnSetDaddress(row?.dest_address, row?.dest_latitude, row?.dest_longitude);
    }
    let values = watch();
    reset({
      ...values,
      phone: row?.ru?.phone,
      vehicle_type_id: row?.vehicle_type_id,
      when: 'later',
      dateTime: row?.booking_date,
      description: row?.user_comment,
      cab_booking_id: row?.cab_booking_id,
    });
  };

  // handling later booking request from notification
  const handleLaterBooking = (row) => {
    setBookingStatus('later');
    if (row?.source_latitude !== null && row?.source_latitude !== '') {
      handleOnSetSaddress(row?.source_addresss, row?.source_latitude, row?.source_longitude);
    }
    if (row?.dest_latitude !== null && row?.dest_latitude !== '') {
      handleOnSetDaddress(row?.dest_address, row?.dest_latitude, row?.dest_longitude);
    }
    let values = watch();
    reset({
      ...values,
      phone: row?.ru?.phone,
      vehicle_type_id: row?.vehicle_type_id,
      when: 'now',
      dateTime: row?.booking_date,
      description: row?.user_comment,
      cab_booking_id: row?.cab_booking_id,
    });
  };

  // cancel call and cab request func
  const cancelCabRequestFunc = async () => {
    const body = { phone: values?.phone };
    try {
      const res = await axiosInstance.post('/adminCancelCabRequest', body);
      const { action, message } = res.data;
      if (action === 1) {
        handleCloseCall();
        handleClear();
        enqueueSnackbar(message ? message : 'Алдаатай хүсэлт', {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  };

  // handling autocomplete search
  const handleSearch = async (value) => {
    try {
      if (value) {
        const response = await searchAdress(value);
        setSearchResults(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handling search when tap enter
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          handleSearch(event.target.value);
        }
        break;
      }
      default:
    }
  };

  // clearing all fields
  const handleClear = () => {
    setBookingStatus('call');
    setOpenCall(false);
    setOpenFailed(false);
    setOpenSuccess(false);
    reset(defaultValues);
    setAdditionalCost(0);
    setPassengerLatLon({ ...passenger_lat_lon, lat: null, lon: null });
    setDesLatLon({ ...dest_lat_lon, lat: null, lon: null });
    setSaddressText('');
    setDaddressText('');
    setSaddressNewString('');
    setCombinedString('');
    firstFieldRef.current.focus();
  };

  // handling radio group value
  const handleChange = (event) => {
    setValue('when', event.target.value);
  };

  // handling close call dialog
  const handleCloseCall = () => {
    setOpenCall(false);
  };

  // handling close call dialog
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  // handling close call dialog
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  // handling phone fields next
  useEffect(() => {
    if (values?.phone.length === 8) {
      handleFocusFunc();
    }
  }, [values?.phone]);

  // handling focus
  const handleFocusFunc = () => {
    secondFieldRef.current.focus();
  };

  // handling saddress autcomplete's value and passing to another function's parameters
  const handleSaddressOnchange = async (e, newValue) => {
    if (newValue) {
      let data = JSON?.parse(newValue?.value || '{}');
      handleOnSetSaddress(data?.value, data?.latlng?.lat, data?.latlng?.lng);
    } else {
      setPassengerLatLon({ lat: null, lon: null });
      setValue('saddress', '');
    }
  };

  // handling daddress autcomplete's value and passing to another function's parameters
  const handleDaddressOnchange = async (e, newValue) => {
    if (newValue) {
      let data = JSON?.parse(newValue?.value || '{}');
      handleOnSetDaddress(data?.value, data?.latlng?.lat, data?.latlng?.lng);
    } else {
      setDesLatLon({ lat: null, lon: null });
      setValue('daddress', '');
    }
  };

  // rendering--------------------------------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Захиалга | 1950 </title>
      </Head>

      <Container maxWidth={false} disableGutters>
        <Grid container columnSpacing={1} rowSpacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={2.5}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Card sx={{ p: 1.5, mb: 1 }}>
                <Stack spacing={2}>
                  <RHFTextField
                    autoFocus
                    name="phone"
                    label="Утас"
                    size="small"
                    inputRef={firstFieldRef}
                    inputProps={{ maxLength: 8 }}
                  />

                  <RHFAutocomplete
                    freeSolo
                    size="small"
                    name="saddress"
                    onChange={(e, newValue) => handleSaddressOnchange(e, newValue)}
                    options={searchResults.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <text {...getTagProps({ index })} key={option.id} size="small" label={option?.label} />
                      ))
                    }
                    renderInput={(params) => {
                      params.inputProps.onKeyDown = handleKeyDown;
                      return (
                        <TextField
                          {...params}
                          multiline
                          label="Авах хаяг"
                          inputRef={secondFieldRef}
                          value={saddressNewString}
                          onChange={(e) => setSaddressNewString(e.target.value)}
                          placeholder="Авах хаяг аа оруулна уу"
                        />
                      );
                    }}
                  />

                  <RHFAutocomplete
                    freeSolo
                    size="small"
                    name="daddress"
                    onChange={(e, newValue) => handleDaddressOnchange(e, newValue)}
                    options={searchResults.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <text {...getTagProps({ index })} key={option.id} size="small" label={option?.label} />
                      ))
                    }
                    renderInput={(params) => {
                      params.inputProps.onKeyDown = handleKeyDown;
                      return (
                        <TextField
                          {...params}
                          multiline
                          label="Очих хаяг"
                          value={daddressNewString}
                          onChange={(e) => setDaddressNewString(e.target.value)}
                          placeholder="Очих хаяг аа оруулна уу"
                        />
                      );
                    }}
                  />

                  <RHFTextField name="description" label="Нэмэлт тайлбар" size="small" multiline rows={4} />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Холын нэмэгдэл:
                    </Typography>
                    <Typography variant="subtitle2">{additional_cost}₮</Typography>
                  </Stack>

                  <RHFSelect name="vehicle_type_id" size="small">
                    {vehicleTypeList.map((vehicle, index) => {
                      return (
                        <MenuItem
                          disabled={vehicle?.status !== 'Active'}
                          key={index}
                          value={vehicle.vehicle_type_id}
                          sx={{
                            borderRadius: 0.75,
                            typography: 'body2',
                          }}
                        >
                          {vehicle.vehicle_type_mn}
                        </MenuItem>
                      );
                    })}
                  </RHFSelect>

                  <RadioGroup row onChange={handleChange} value={values?.when} name="row-radio-buttons-group">
                    {bookingStatus !== 'edit' && (
                      <FormControlLabel name="now" value={'now'} control={<Radio />} label="Одоо" />
                    )}

                    <FormControlLabel name="later" value={'later'} control={<Radio />} label="Дараа" />
                  </RadioGroup>

                  {values?.when === 'later' && (
                    <DateTimePicker
                      name="dateTime"
                      disablePast
                      ampm={false}
                      label="Огноо"
                      value={values?.dateTime}
                      onChange={(e) => setValue('dateTime', e)}
                      renderInput={(params) => <TextField size="small" {...params} />}
                    />
                  )}

                  <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                    <Button fullWidth color="inherit" variant="outlined" size="medium" onClick={handleClear}>
                      <Typography variant="caption">ЦЭВЭРЛЭХ</Typography>
                    </Button>

                    <LoadingButton fullWidth type="submit" variant="contained" size="medium" loading={isSubmitting}>
                      <Typography variant="caption">
                        {bookingStatus === 'edit'
                          ? 'ЗАСАХ'
                          : bookingStatus === 'later'
                          ? 'УРЬДЧИЛСАН ЗАХИАЛГА'
                          : 'ЗАХИАЛАХ'}
                      </Typography>
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Card>
            </FormProvider>
          </Grid>
          <Grid item xs={12} sm={9.5}>
            <Card>
              <MapHeader
                status={status}
                drivers={drivers}
                setStatus={setStatus}
                setMarkers={setMarkers}
                handleLaterBooking={handleLaterBooking}
              />
              <MapSide
                trip={{
                  route: [],
                  markers: markers,
                  status: status,
                  ssid: SSID,
                  passenger_lat: passenger_lat_lon?.lat,
                  passenger_lon: passenger_lat_lon?.lon,
                  dest_latitude: dest_lat_lon?.lat,
                  dest_longitude: dest_lat_lon?.lon,
                }}
                handleOnSaddress={handleOnSetSaddress}
                handleOnDaddress={handleOnSetDaddress}
                moving={(e) => {
                  e === true ? clearInterval(interval) : getData();
                }}
              />
            </Card>
          </Grid>
        </Grid>

        <ListTabs
          phoneNumber={values?.phone}
          passenger_lat_lon={passenger_lat_lon}
          handleOnSetDaddress={handleOnSetDaddress}
          handleOnSetSaddress={handleOnSetSaddress}
          handleChangeLaterBooking={handleChangeLaterBooking}
        />

        {openCall && (
          <CallDialog
            title="Дуудаж байна..."
            open={openCall}
            saddress={saddressText}
            daddress={daddressText}
            combinedString={combinedString}
            daddressCombinedStr={daddressCombinedStr}
            when={values?.when}
            phone={values?.phone}
            close={handleCloseCall}
            clear={handleClear}
            comment={values?.description}
            vehicle_type={values?.vehicle_type_id}
            cancelCabRequestFunc={cancelCabRequestFunc}
          />
        )}

        {openFailed && (
          <FailedDialog
            open={openFailed}
            saddress={saddressText}
            daddress={daddressText}
            combinedString={combinedString}
            daddressCombinedStr={daddressCombinedStr}
            when={values?.when}
            title={res_message}
            phone={values?.phone}
            close={handleCloseFailed}
            clear={handleClear}
            onClickOrderAgain={onSubmit}
            comment={values?.description}
            vehicle_type={values?.vehicle_type_id}
          />
        )}

        {openSuccess && <SuccessDialog open={openSuccess} title={res_message} close={handleCloseSuccess} />}
      </Container>
    </>
  );
}
