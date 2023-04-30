import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography, IconButton } from '@mui/material';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';
// ----------------------------------------------------------------------

TripTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TripTableRow({ row, onViewRow, rowQueue }) {
  // extracting row
  const { Customer, Category, start_time, end_time } = row;

  const { id, phone } = Customer;

  const { name } = Category;
  // extracting rowQueue
  const { index, rowsPerPage, page } = rowQueue;

  // if (name === 'Шүд') {
  // }
  return (
    <TableRow hover>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      {/* <TableCell align="left">
        <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
          {fDateTimeSuffix(trip_request_date)}
        </Label>
      </TableCell> */}

      <TableCell align="left" sx={{ minWidth: 100 }}>
        {Customer.name}
      </TableCell>

      {/* <TableCell align="left">{firstname}</TableCell> */}

      <TableCell align="left">{phone}</TableCell>

      {/* <TableCell align="left">{name}</TableCell> */}

      <TableCell align="left">
        <Label
          variant="soft"
          color={name === 'Шүд' ? 'error' : name === 'Нүд' ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {name}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label variant="soft" color="info">
          {start_time}
        </Label>
      </TableCell>

      <TableCell align="left" sx={{ minWidth: 120 }}>
        <Label variant="soft" color="info">
          {end_time}
        </Label>
      </TableCell>

      <TableCell align="center">
        <IconButton color="inherit">
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      {/* <TableCell align="left">{trip_generate_fare}</TableCell> */}

      {/* <TableCell align="left">{distance}</TableCell> */}

      {/* <TableCell align="left">
        <Label
          variant="soft"
          color={active === 'Canceled' ? 'error' : active === 'Finished' ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {active === 'Canceled' ? 'Цуцалсан' : active === 'Finished' ? 'Дэлгэрэнгүй' : 'Зорчигчтой'}
        </Label>
      </TableCell> */}

      {/* {active === 'Finished' && (
        <TableCell align="center">
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon={'bx:trip'} />
          </IconButton>
        </TableCell>
      )} */}
    </TableRow>
  );
}
