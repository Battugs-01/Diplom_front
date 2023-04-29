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

  // trip statistics state array
  const [tripStatistics, setTripStatistics] = useState([]);

  // driver statistics state array
  const [driverStatistics, setDriverStatistics] = useState([]);

  // triggering all fetch func -> useEffect
  useEffect(() => {
    getTripStatistics();
    getDriverStatistics();
  }, []);

  // fetching trip statistics data
  const getTripStatistics = () => {
    const res = [
      {
        year: '2023',
        data: [
          { name: 'Амжиллтай', data: [121, 222, 335, 172, 87, 198, 213, 417, 312, 451, 408, 532] },
          { name: 'Цуцалсан', data: [2, 7, 4, 13, 27, 18, 21, 28, 32, 14, 8, 32] },
        ],
      },
    ];
    setTripStatistics(res);
    console.log(res);
  };

  // fetching driver statistics data
  const getDriverStatistics = () => {
    const res = [
      { label: 'Чих', value: 200 },
      { label: 'Нүд', value: 150 },
      { label: 'Шүд', value: 300 },
    ];
    setDriverStatistics(res);
  };

  // rendering --------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Хяналтын самбар </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Нийт хэргэлсэн хүний тоо"
              percent={0.2}
              total={3710}
              chartColor={theme.palette.success.main}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Идэвхтэй хэрэглэгчид"
              percent={2.6}
              total={270}
              chartColor={theme.palette.success.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Нийт эмчийн тоо"
              percent={1.1}
              total={12}
              chartColor={theme.palette.warning.main}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Өдөрт хийж буй захиалга"
              percent={1}
              total={34}
              chartColor={theme.palette.success.main}
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Нийт цуцлагдсан захиалга"
              percent={0.2}
              total={4}
              chartColor={theme.palette.info.main}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Цуцлагдсан аялал"
              percent={1}
              total={34}
              chartColor="#E53935"
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Системийн админ тоо"
              percent={1}
              total={4}
              chartColor="#E53935"
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Сард хийж буй захиалга"
              percent={1}
              total={967}
              chartColor="#E53935"
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <AppCurrentDownload
              title="Нийт үйлчилгээ үзүүлэгчийн сонголт сараар"
              chart={{
                colors: [theme.palette.success.main, '#E0E0E0', '#E53935'],
                series: driverStatistics,
              }}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <AppAreaInstalled
              title="Захиалгын төлөв (сараар)"
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
        </Grid>
      </Container>
    </>
  );
}
