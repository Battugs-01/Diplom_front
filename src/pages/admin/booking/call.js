import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// next
import Head from 'next/head';
// hook form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Card, Container, Grid, Stack } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// utils
import { phoneRegex, phoneRegexMsg, requiredMsg } from 'src/utils/regex';
// sections
import { useTheme } from '@emotion/react';
import MapHeader from 'src/sections/@dashboard/booking/mapHeader';
import { AnalyticsConversionRates, AnalyticsCurrentVisits } from 'src/sections/@dashboard/general/analytics';
const MapSide = dynamic(() => import('src/sections/@dashboard/booking/map/MapSide'), { ssr: false });

// ----------------------------------------------------------------------

let count = 0;

let interval;

let SSID;

BookingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BookingPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // adding 30 minute to later radio group
  const bookingDate = new Date();
  bookingDate.setMinutes(bookingDate.getMinutes() + 30);

  // marker dot list state
  const [markers, setMarkers] = useState([]);

  // map header status state
  const [status, setStatus] = useState('Available');

  const [drivers, setDrivers] = useState([]);

  // passenger latitude and longitude object state
  const [passenger_lat_lon, setPassengerLatLon] = useState({ lat: null, lon: null });

  // dest latitude and longitude object state
  const [dest_lat_lon, setDesLatLon] = useState({ lat: null, lon: null });

  async function getData() {
    getMapDriverList();
    // interval = setInterval(async () => {
    //   getMapDriverList();
    // }, 5000);
  }

  async function getMapDriverList() {
    await axiosInstance
      .get('/orders?status=going')
      .then((res) => {
        let data = res?.data || [];
        console.log('DAATAA', data.orders);
        setDrivers(data.orders);
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
  }

  const CallSchema = Yup.object().shape({
    phone: Yup.string().matches(phoneRegex, phoneRegexMsg).required(requiredMsg),
    saddress: Yup.string().required('Авах хаягаа оруулна уу.'),
    vehicle_type_id: Yup.string().required('Төрөл сонгох.'),
  });

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

    formState: { isSubmitting },
  } = methods;

  const handleOnSetSaddress = (text, lat, lng) => {
    let values = watch();
    longDistance(parseFloat(lat), parseFloat(lng));
    reset({ ...values, saddress: text });
    setSaddressText(text);
    setPassengerLatLon({ ...passenger_lat_lon, lat: parseFloat(lat), lon: parseFloat(lng) });
  };

  const handleOnSetDaddress = (text, lat, lng) => {
    let values = watch();
    reset({ ...values, daddress: text });
    setDaddressText(text);
    setDesLatLon({ ...dest_lat_lon, lat: parseFloat(lat), lon: parseFloat(lng) });
  };

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title> Захиалга | Khangardi </title>
      </Head>
      <Container maxWidth={false} disableGutters>
        <Grid container columnSpacing={1} rowSpacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={12}>
            <Card>
              <MapHeader
                status={'going'}
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
                  passenger_lat: 47.9176274 || 0,
                  passenger_lon: 106.8827759 || 0,
                  dest_latitude: 47.9207426 || 0,
                  dest_longitude: 106.9636219 || 0,
                }}
                handleOnSaddress={handleOnSetSaddress}
                handleOnDaddress={handleOnSetDaddress}
                moving={(e) => {
                  e === true ? clearInterval(interval) : undefined;
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={5}>
              <AnalyticsConversionRates
                title="Хэрэглэгчдийн насны ангилал"
                chart={{
                  series: [
                    { label: '0-5 нас', value: 80 },
                    { label: '5-10 нас', value: 71 },
                    { label: '10-20 нас', value: 40 },
                    { label: '20-30 нас', value: 44 },
                    { label: '30-40 нас', value: 43 },
                    { label: '40-50 нас', value: 43 },
                    { label: '50-60 нас', value: 43 },
                    { label: '60-70 нас', value: 47 },
                    { label: '70-80 нас', value: 54 },
                    { label: '80-85 нас', value: 58 },
                    { label: '85-90 нас', value: 29 },
                    { label: '90-95 нас', value: 27 },
                    { label: '95-100 нас', value: 10 },
                  ],
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AnalyticsCurrentVisits
              title="Дүүргүүдээс ирж буй дуудлага"
              chart={{
                series: [
                  { label: 'Баянгол', value: 4344 },
                  { label: 'Баянгол', value: 5435 },
                  { label: 'Сонгинохайрхан', value: 1443 },
                  { label: 'Сүхбаатар', value: 4443 },
                  { label: 'Хан-Уул', value: 4200 },
                  { label: 'Багануур', value: 4200 },
                  { label: 'Чингэлтэй', value: 4200 },
                  { label: 'Налайх', value: 4200 },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.info.dark,
                  theme.palette.error.main,
                  theme.palette.error.dark,
                  theme.palette.warning.main,
                  theme.palette.warning.dark,
                  theme.palette.primary.dark,
                ],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
