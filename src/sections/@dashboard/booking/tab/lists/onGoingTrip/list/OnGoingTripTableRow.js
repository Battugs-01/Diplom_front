import PropTypes from 'prop-types';
import moment from 'moment';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Avatar, MenuItem } from '@mui/material';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMoreMenu } from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { fDateTimeSuffix } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

OnGoingTripTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function OnGoingTripTableRow({ row, selected, rowQueue }) {
  const { enqueueSnackbar } = useSnackbar();

  const [openMenu, setOpenMenuActions] = useState(null);

  // extracting data
  const { trips, name, image, phone, trip_status, dv } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  // row style based on table cell status
  const rowStyle = {
    color:
      trip_status === 'Active'
        ? '#42a5f5'
        : trip_status === 'Arrived'
        ? '#ffee58'
        : trip_status === 'On Going Trip'
        ? '#ef5350'
        : '#66bb6a',
  };

  const setTripStatus = (trip_status) => {
    if (trip_status === 'Active') {
      return 'Хаягтай';
    } else if (trip_status === 'Arrived') {
      return 'Хүлээж байна';
    } else if (trip_status === 'On Going Trip') {
      return 'Зорчигчтой';
    } else {
      return '';
    }
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  //... dahin harah
  async function cancelTrip(item) {
    let fetchTerm = {
      user_id: item.trips[0].ru.user_id,
      trip_id: item.trips[0].trip_id,
      confirm_by_user: 'Yes',
      user_type: 'Passenger',
      driver_id: item.driver_id,
      reason: 'Зорчигчийн хүсэлтээр цуцалсан',
      cancel_by_admin_id: user?.admin_id,
    };
    await axiosInstance
      .post('/cancelTrip', fetchTerm)
      .then((res) => {
        let data = res?.data;
        if (data?.action === 1) {
          enqueueSnackbar(data?.message ? data?.message : 'Амжилттай', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(data?.message ? data?.message : 'Алдаа гарлаа', {
            variant: 'warning',
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
  }

  const diff_minutes = (bookTime, now, minutes = 0, status) => {
    const arriveTime = new Date(bookTime.getTime() + minutes * 60000);
    const diffMill = Math.abs(now - arriveTime);
    const diff = Math.ceil(diffMill / (1000 * 60));
    return status == 'Active' ? (arriveTime < now ? `${diff} минут хоцорсон` : `${diff} минут үлдсэн`) : 'Ирсэн';
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      <TableCell align="left" style={rowStyle}>
        {trips?.[0]?.trip_id || 0}
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }} style={rowStyle}>
        <Avatar
          alt={name}
          src={
            `https://dev.1950.mn${image}` ||
            `https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar.jpg`
          }
          sx={{ mr: 1, width: '30px', height: '30px' }}
        />
        {name}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {phone}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {dv?.licence_plate || ''}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {dv?.model?.title || ''}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }} style={rowStyle}>
        {fDateTimeSuffix(trips?.[0]?.trip_request_date)}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {trips?.[0]?.ru?.phone || '+976 _ _'}
      </TableCell>

      <TableCell align="left" sx={{ width: '10%' }} style={rowStyle}>
        {trips?.[0]?.saddress || ''}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {trips?.[0]?.daddress || ''}
      </TableCell>

      <TableCell align="center" style={rowStyle}>
        {trips?.[0]?.cab_minut}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        {trips?.[0] &&
          diff_minutes(new Date(trips?.[0]?.trip_request_date), new Date(), trips?.[0]?.cab_minut, trip_status)}
      </TableCell>

      <TableCell align="left">
        <Label
          variant="soft"
          color={
            trip_status === 'Active'
              ? 'info'
              : trip_status === 'Arrived'
              ? 'warning'
              : trip_status === 'On Going Trip'
              ? 'error'
              : 'success'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {setTripStatus(trip_status)}
        </Label>
      </TableCell>
      <TableCell align="center">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {trip_status !== 'On Going Trip' ? (
                <MenuItem
                  onClick={() => {
                    cancelTrip(row);
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'material-symbols:cancel-outline-rounded'} />
                  Цуцлах
                </MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                    }}
                  >
                    Цуцлах боломжгүй
                  </MenuItem>
                </>
              )}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
