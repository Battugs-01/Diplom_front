import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// next
import { useTheme } from '@mui/material/styles';
import { Stack, Divider, Box } from '@mui/material';
// layouts
import NotificationsPopover from 'src/layouts/dashboard/header/NotificationsPopover';
// sections
import DriverAnalytic from './DriverAnalytic';
import axiosInstance from 'src/utils/axios';

//-------------------------------------------------------------------------------------

let interval;

DriverAnalytic.propTypes = {
  status: PropTypes.string,
  setStatus: PropTypes.func,
  setMarkers: PropTypes.func,
  handleLaterBooking: PropTypes.func,
  drivers: PropTypes.array,
};

//-------------------------------------------------------------------------------------

export default function MapHeader({ status, drivers, setStatus, setMarkers, handleLaterBooking }) {
  const theme = useTheme();
  // sending mn status to handle on click status depend on status , driver
  useEffect(() => {
    switch (status) {
      case 'Arrived':
        handleOnClickStatus('Хүлээж байна');
        break;
      case 'going':
        handleOnClickStatus('going');
        break;
      case 'Available':
        handleOnClickStatus('Сул');
        break;
      case 'Active':
        handleOnClickStatus('Хаягтай');
        break;
      case 'Not Available':
        handleOnClickStatus('Идэвхигүй');
        break;
      default:
        handleOnClickStatus('Сул');
    }
  }, [status, drivers]);

  // handling which cars should appear on map
  const handleOnClickStatus = (status) => {
    if (status === 'Сул') {
      const available_drivers = drivers?.driver_available?.rows || [];
      setMarkers(available_drivers);
      setStatus('Available');
    } else if (status === 'Хаягтай') {
      const active_drivers = drivers?.drivers?.rows.filter(
        (driver) => driver.trip_status === 'Active' && driver.status === 'active'
      );
      setMarkers(active_drivers);
      setStatus('Active');
    } else if (status === 'Хүлээж байна') {
      const arrived_drivers = drivers?.drivers?.rows.filter(
        (driver) => driver.trip_status === 'Arrived' && driver.status === 'active'
      );
      setMarkers(arrived_drivers);
      setStatus('Arrived');
    } else if (status === 'going') {
      const on_going_trip_drivers = drivers ? [drivers[0]] : [];
      setMarkers(on_going_trip_drivers);
      setStatus('On Going Trip');
    } else if (status === 'Нийт') {
      const available_drivers = drivers?.driver_available?.rows || [];
      setMarkers(available_drivers);
      setStatus('Available');
    } else if (status === 'Идэвхигүй') {
      const not_available_drivers = drivers?.drivers?.rows.filter(
        (driver) => driver.availability === 'Not Available' && driver.status === 'active'
      );
      setMarkers(not_available_drivers);
      setStatus('Not Available');
    } else {
      setStatus('Available');
    }
  };

  // calculating percentage
  const getPercentByStatus = (total, count) => (count / total) * 100;

  // calculating not available cars
  const notAvailable = () =>
    drivers?.drivers?.count -
    drivers?.count_active -
    drivers?.count_arrived -
    drivers?.count_on_going_trip -
    drivers?.count_available;

  // rendering --------------------------------------------------------------------------------------------

  return (
    <>
      <Stack sx={{ height: 60 }} direction="row" alignItems="center" justifyContent="space-between">
        <DriverAnalytic
          title="Нийт"
          total={drivers?.orders || 0}
          percent={100}
          icon="tabler:sum"
          color={theme.palette.info.dark}
          onClickStatus={handleOnClickStatus}
        />

        {/* <DriverAnalytic
          title="Сул"
          total={drivers?.count_available || 0}
          percent={getPercentByStatus(drivers?.drivers?.count || 0, drivers?.count_available || 0)}
          icon="eva:checkmark-circle-2-fill"
          color={theme.palette.success.main}
          onClickStatus={handleOnClickStatus}
        />

        <DriverAnalytic
          title="Хаягтай"
          total={drivers?.count_active || 0}
          percent={getPercentByStatus(drivers?.drivers?.count || 0, drivers?.count_active || 0)}
          icon="bx:trip"
          color={theme.palette.info.main}
          onClickStatus={handleOnClickStatus}
        /> */}
        <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ pr: 3 }}>
          <NotificationsPopover selectItem={handleLaterBooking} />
        </Box>
      </Stack>
    </>
  );
}
