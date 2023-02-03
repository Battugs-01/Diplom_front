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
  const { trip_generate_fare, distance, active, saddress, ru, rd, trip_request_date } = row;

  // extracting rowQueue
  const { index, rowsPerPage, page } = rowQueue;

  return (
    <TableRow hover>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      <TableCell align="left">
        <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
          {fDateTimeSuffix(trip_request_date)}
        </Label>
      </TableCell>

      <TableCell align="left" sx={{ minWidth: 400 }}>
        {saddress}
      </TableCell>

      <TableCell align="left">{rd?.name}</TableCell>

      <TableCell align="left">{rd?.phone}</TableCell>

      <TableCell align="left">{ru?.name}</TableCell>

      <TableCell align="left">{ru?.phone}</TableCell>

      <TableCell align="left" sx={{ minWidth: 120 }}>
        {rd?.dv?.licence_plate}
      </TableCell>

      <TableCell align="left">{trip_generate_fare}</TableCell>

      <TableCell align="left">{distance}</TableCell>

      <TableCell align="left">
        <Label
          variant="soft"
          color={active === 'Canceled' ? 'error' : active === 'Finished' ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {active === 'Canceled' ? 'Цуцалсан' : active === 'Finished' ? 'Дэлгэрэнгүй' : 'Зорчигчтой'}
        </Label>
      </TableCell>

      {active === 'Finished' && (
        <TableCell align="center">
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon={'bx:trip'} />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
}
