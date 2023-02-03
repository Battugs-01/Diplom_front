import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// sections
import {
  AppTopAuthors,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
} from 'src/sections/@dashboard/controlpanel/charts';
// utils
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

ChartPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ChartPage() {
  // use theme
  const theme = useTheme();

  // quantitative state array
  const [quantitativeStatistics, setQuantitativeStatistics] = useState([]);

  // trip statistics state array
  const [tripStatistics, setTripStatistics] = useState([]);

  // driver statistics state array
  const [driverStatistics, setDriverStatistics] = useState([]);

  // top drivers state array
  const [topDrivers, setTopDrivers] = useState([]);

  // month top drivers state array
  const [monthTopDrivers, setMonthTopDrivers] = useState([]);

  // payment statistics state array
  const [paymentStatistics, setPaymentStatistics] = useState([]);

  // triggering all fetch func -> useEffect
  useEffect(() => {
    getQuantitativeStatistics();
    getTripStatistics();
    getDriverStatistics();
    getTopDrivers();
    getPaymentStatistics();
  }, []);

  // fetching quantitatitve statistics data
  const getQuantitativeStatistics = async () => {
    await axiosInstance
      .get('/quantitative-statistics')
      .then((res) => {
        setQuantitativeStatistics(res?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetching trip statistics data
  const getTripStatistics = async () => {
    await axiosInstance
      .get('/trip-statistics')
      .then((res) => {
        setTripStatistics(res?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetching driver statistics data
  const getDriverStatistics = async () => {
    await axiosInstance
      .get('/driver-statistics')
      .then((res) => {
        setDriverStatistics(res?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetching top driver data
  const getTopDrivers = async () => {
    await axiosInstance
      .get('/top-drivers')
      .then((res) => {
        setTopDrivers(res?.data?.data || []);
        setMonthTopDrivers(res?.data?.month_data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetching payment statistics data
  const getPaymentStatistics = async () => {
    await axiosInstance
      .get('/payment-statistics')
      .then((res) => {
        setPaymentStatistics(res?.data?.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // rendering --------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Хяналтын самбар </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Идэвхтэй хэрэглэгчид"
              percent={0.2}
              total={quantitativeStatistics?.user}
              chartColor={theme.palette.success.main}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Идэвхтэй жолоочид"
              percent={2.6}
              total={quantitativeStatistics?.driver}
              chartColor={theme.palette.success.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Компани"
              percent={-0.1}
              total={quantitativeStatistics?.company}
              chartColor={theme.palette.warning.main}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Админ"
              percent={1}
              total={quantitativeStatistics?.admin}
              chartColor={theme.palette.success.main}
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Нийт аялал"
              percent={0.2}
              total={quantitativeStatistics?.trip}
              chartColor={theme.palette.info.main}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Идэвхтэй аялал"
              percent={2.6}
              total={quantitativeStatistics?.active_trip}
              chartColor={theme.palette.success.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Амжилттай дууссан аялал"
              percent={-0.1}
              total={quantitativeStatistics?.finish_trip}
              chartColor={theme.palette.success.main}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AppWidgetSummary
              title="Цуцлагдсан аялал"
              percent={1}
              total={quantitativeStatistics?.cancel_trip}
              chartColor="#E53935"
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <AppCurrentDownload
              title="Нийт үйлчилгээ үзүүлэгчийн төлөв"
              chart={{
                colors: [theme.palette.success.main, '#E0E0E0', '#E53935'],
                series: driverStatistics,
              }}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <AppAreaInstalled
              title="Аяллын төлөв (сараар)"
              subheader=""
              chart={{
                colors: [theme.palette.success.main, '#E53935'],
                categories: [
                  '1-р сар',
                  '2-р сар',
                  '3-р сар',
                  '4-р сар',
                  '5-р сар',
                  '6-р сар',
                  '7-р сар',
                  '8-р сар',
                  '9-р сар',
                  '10-р сар',
                  '11-р сар',
                  '12-р сар',
                ],
                series: tripStatistics,
              }}
            />
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <AppAreaInstalled
              title="Аяллын дүн (сараар)"
              subheader=""
              chart={{
                colors: [theme.palette.info.dark, theme.palette.success.main, theme.palette.warning.main, '#E53935'],
                categories: [
                  '1-р сар',
                  '2-р сар',
                  '3-р сар',
                  '4-р сар',
                  '5-р сар',
                  '6-р сар',
                  '7-р сар',
                  '8-р сар',
                  '9-р сар',
                  '10-р сар',
                  '11-р сар',
                  '12-р сар',
                ],
                series: paymentStatistics,
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
          <AppCurrentDownload
              title="Нийт үйлчилгээ үзүүлэгчийн төлөв"
              chartColors={[theme.palette.primary.dark, theme.palette.primary.main, theme.palette.primary.light]}
              chartData={driverStatistics}
            />
        </Grid> */}

          <Grid item xs={12} md={4} lg={4}>
            <Stack spacing={3}>
              <AppTopAuthors title="Шилдэг жолоочид" subheader=" *** " list={topDrivers} />
              <AppTopAuthors title="Сарын шилдэг" subheader=" *** " list={monthTopDrivers} />
            </Stack>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} colors="warning" chartData={75} />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
