import Lottie from 'lottie-react';
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
// next
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
// @mui
import { Container, Card, Box, Typography, Grid, Divider } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import Label from 'src/components/label';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
const Map = dynamic(() => import('src/sections/@dashboard/trip/detail/map'), { ssr: false });
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// animated icon
import trip_icon from 'public/assets/animated/trip_icon.json';

// ----------------------------------------------------------------------

TripDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TripDetailPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { query } = useRouter();

  // taking id from query
  const { id } = query;

  // each person trip detail state
  const [tripDetail, setTripDetail] = useState();

  // fetching trip detail
  const getTripDetail = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/tripDetail', {
        trip_id: id,
      });
      let data = response?.data?.data || [];
      setTripDetail(data);
    } catch (error) {
      enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
        variant: 'warning',
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getTripDetail();
    }
  }, [getTripDetail, id]);

  return (
    <>
      <Head>
        <title> Аялалын || дэлгэрэнгүй </title>
      </Head>

      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading="Аялалын дэлгэрэнгүй"
          links={[
            {
              name: 'Аялал',
              href: PATH_DASHBOARD.trip.root,
            },
            { name: 'Дэлгэрэнгүй' },
          ]}
        />

        {tripDetail && (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div style={{ width: '100px', height: '100px' }}>
                  <Lottie animationData={trip_icon} />
                </div>
              </Grid>

              <Grid item xs={12} sm={6} alignSelf="center">
                <Box sx={{ textAlign: { sm: 'right' } }}>
                  <Label variant="soft" color="success">
                    <Typography variant="subtitle2">{'Амжилттай.'}</Typography>
                  </Label>
                </Box>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Явсан зам
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Map trip={tripDetail} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Аялалын мэдээлэл
                </Typography>
                <Typography variant="subtitle2">Төлөв : Амжилттай </Typography>

                <Typography variant="subtitle2">
                  Огноо : {moment(tripDetail?.trip_request_date).format('L')}{' '}
                  {moment(tripDetail?.trip_request_date).format('LTS')}
                </Typography>
                <Typography variant="subtitle2">Авах хаяг : {tripDetail?.saddress}</Typography>
                <Typography variant="subtitle2">Очих хаяг : {tripDetail?.daddress}</Typography>
                <Typography variant="subtitle2">Туулсан зам : {tripDetail?.distance}км</Typography>
                <Typography variant="subtitle2">Хугацаа : {tripDetail?.distance}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Төлбөрийн мэдээлэл
                </Typography>
                <Typography variant="subtitle2">Эхний км : {tripDetail?.base_fare}₮ </Typography>
                <Typography variant="subtitle2">Дуудлагийн хөлс : {tripDetail?.min_fare_diff}₮</Typography>
                <Typography variant="subtitle2">Хүлээлгэ : {tripDetail?.waiting_fees}₮</Typography>
                <Typography variant="subtitle2">Туулсан замын төлбөр : {tripDetail?.price_per_km}₮</Typography>
                <Divider sx={{ mt: 2 }} />
                <Typography variant="subtitle2">Нийт Дүн : {tripDetail?.fare}₮</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Жолооч
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  Овог : {tripDetail?.rd?.last_name}
                </Typography>
                <Typography variant="subtitle2">Нэр : {tripDetail?.rd?.name}</Typography>
                <Typography variant="subtitle2">Утас : {tripDetail?.rd?.phone}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Хэрэглэгч
                </Typography>
                <Typography variant="subtitle2">Овог : {tripDetail?.ru?.user_id}</Typography>
                <Typography variant="subtitle2">Нэр : {tripDetail?.ru?.user_id}</Typography>
                <Typography variant="subtitle2">Утас: : {tripDetail?.ru?.phone}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Тээврийн хэрэгсэл
                </Typography>
                <Typography variant="subtitle2">УАД : {tripDetail?.rd?.dv?.licence_plate}</Typography>
                <Typography variant="subtitle2">Өнгө : {tripDetail?.rd?.dv?.colour}</Typography>
              </Grid>
            </Grid>
          </Card>
        )}
      </Container>
    </>
  );
}
