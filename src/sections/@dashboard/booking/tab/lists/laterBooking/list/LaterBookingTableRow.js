import PropTypes from 'prop-types';
import moment from 'moment';
import { useState } from 'react';
// @mui
import { TableRow, TableCell, Typography, MenuItem, IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ------------------------------------------------------------------------------------

LaterBookingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onChange: PropTypes.func,
};

// ------------------------------------------------------------------------------------

export default function LaterBookingTableRow({ row, selected, onChange }) {
  const { enqueueSnackbar } = useSnackbar();

  // extracting row
  const {
    addred_date,
    booking_date,
    cab_booking_id,
    created_user_id,
    dest_address,
    source_addresss,
    update_date,
    update_user_id,
    user_comment,
    ru,
    vt,
  } = row;

  // menu pop over state
  const [openPopover, setOpenPopover] = useState(null);

  // handling menu pop over
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // handle closing menu pop over
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const diff_minutes = (bookTime, now) => {
    const arriveTime = new Date(bookTime.getTime());
    const diffMill = Math.abs(now - arriveTime);
    const diff = Math.ceil(diffMill / (1000 * 60));
    return arriveTime < now ? `${diff} минут хоцорсон` : `${diff} минут үлдсэн`;
  };

  //... dahin harah
  async function cancelLaterBook(item) {
    let fetchTerm = {
      cab_booking_id: item?.cab_booking_id,
      user_id: item?.user_id,
      driver_id: 0,
      cancel_reason: 'Хэрэглэгч цуцлав',
      cancel_by: 'Admin',
      cancel_by_user_id: '111',
    };
    await axiosInstance
      .post('/cancelLaterBook', fetchTerm)
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

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {cab_booking_id}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {created_user_id}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Typography variant="subtitle3" noWrap>
          {moment(addred_date).format('L')} {moment(addred_date).format('LTS')}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {update_user_id !== 0 ? update_user_id : ' - '}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Typography variant="subtitle3" noWrap>
          {update_date ? `${moment(update_date).format('L')} ${moment(update_date).format('LTS')} ` : '-'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{ru?.phone || ''}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{source_addresss}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dest_address}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{user_comment ? user_comment : ' - '}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Typography variant="subtitle3" noWrap>
          {moment(booking_date).format('L')} {moment(booking_date).format('LTS')}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{vt?.vehicle_type || ''}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{booking_date && diff_minutes(new Date(booking_date), new Date())}</Typography>
      </TableCell>

      <TableCell align="left">
        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            onChange(row);
            handleClosePopover();
          }}
        >
          <Iconify icon={'eva:edit-fill'} />
          Засах
        </MenuItem>
        <MenuItem
          onClick={() => {
            cancelLaterBook(row);
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={'material-symbols:cancel-outline-rounded'} />
          Цуцлах
        </MenuItem>
      </MenuPopover>
    </TableRow>
  );
}
