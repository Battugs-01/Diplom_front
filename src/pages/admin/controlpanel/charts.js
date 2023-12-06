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
import { BankingExpensesCategories } from 'src/sections/@dashboard/general/banking';
import { EcommerceSaleByGender } from 'src/sections/@dashboard/general/e-commerce';

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
              title="Хяналтад байх ёстой өвчтөнгүүд"
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
              total={78}
              chartColor={theme.palette.warning.main}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Өдөрт хийж буй дуудлага"
              percent={1}
              total={34}
              chartColor={theme.palette.success.main}
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Худал дуудлагууд"
              percent={0.2}
              total={4}
              chartColor={theme.palette.info.main}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AppWidgetSummary
              title="Цуцлагдсан дуудлага"
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
              title="Сард хийж буй дуудлага"
              percent={1}
              total={967}
              chartColor="#E53935"
              chartData={[8, 9, 31, 69, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <EcommerceSaleByGender
              title="Хүйсний ангилал"
              total={2324}
              chart={{
                series: [
                  { label: 'Эмэгтэй', value: 44 },
                  { label: 'Эрэгтэй', value: 75 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <BankingExpensesCategories
              title="Дуудлагын төрлүүд"
              chart={{
                series: [
                  { label: 'Зүрх', value: 14 },
                  { label: 'Хугарал', value: 23 },
                  { label: 'Түлэгдэл', value: 21 },
                  { label: 'Ухаан алдах', value: 17 },
                  { label: 'Хууч өвчин', value: 15 },
                  { label: 'Цус алдалт', value: 10 },
                  { label: 'Ханиалга , Хатгаа', value: 12 },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.dark,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                ],
              }}
            />
          </Grid>
          {/* <Grid item xs={12} md={7} lg={8}>
            <BankingExpensesCategories
              title="Expenses Categories"
              chart={{
                series: [
                  { label: 'Category 1', value: 14 },
                  { label: 'Category 2', value: 23 },
                  { label: 'Category 3', value: 21 },
                  { label: 'Category 4', value: 17 },
                  { label: 'Category 5', value: 15 },
                  { label: 'Category 6', value: 10 },
                  { label: 'Category 7', value: 12 },
                  { label: 'Category 8', value: 17 },
                  { label: 'Category 9', value: 21 },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.dark,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.info.main,
                ],
              }}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
