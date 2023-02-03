import PropTypes from 'prop-types';
// @mui
import { Avatar, TableRow, TableCell, Typography } from '@mui/material';
// components
import Label from 'src/components/label';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';

//------------------------------------------------------

DriverInfoTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  rowQueue: PropTypes.object,
};

//------------------------------------------------------

export default function DriverInfoTableRow({ row, selected, rowQueue }) {
  // extracting data
  const { name, image, phone, registration_date, dv, trip_status, app_version, driver_id, device_type } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  // row style based on table cell status
  const rowStyle = {
    color:
      trip_status === 'Active'
        ? '#42a5f5'
        : trip_status === 'Arrived'
        ? '#B76E00'
        : trip_status === 'On Going Trip'
        ? '#ef5350'
        : '#1B806A',
  };

  // setting trip status
  const setTripStatus = (trip_status) => {
    if (trip_status === 'Active') {
      return 'Хаягтай';
    } else if (trip_status === 'Arrived') {
      return 'Хүлээж байна';
    } else if (trip_status === 'On Going Trip') {
      return 'Зорчигчтой';
    } else {
      return 'Сул';
    }
  };

  // rendering -------------------------------------------------------------------

  return (
    <TableRow hover selected={selected} style={rowStyle}>
      <TableCell align="center" style={rowStyle}>
        {index + page * rowsPerPage + 1}
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3" noWrap>
          {driver_id}
        </Typography>
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
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3" noWrap>
          {phone}
        </Typography>
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3" noWrap>
          {device_type}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }} style={rowStyle}>
        <Typography variant="subtitle3" noWrap>
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
          >
            {fDateTimeSuffix(registration_date)}
          </Label>
        </Typography>
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3">{dv?.model?.title}</Typography>
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3">{dv?.licence_plate}</Typography>
      </TableCell>

      <TableCell align="left" style={rowStyle}>
        <Typography variant="subtitle3">{dv?.colour}</Typography>
      </TableCell>

      <TableCell align="center" style={rowStyle}>
        <Typography variant="subtitle3">{app_version}</Typography>
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
    </TableRow>
  );
}
