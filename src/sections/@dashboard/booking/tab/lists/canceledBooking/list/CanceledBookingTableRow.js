import PropTypes from 'prop-types';
import moment from 'moment';
// @mui
import { TableRow, TableCell, Typography } from '@mui/material';

// -----------------------------------------------------------------------------------

CanceledBookingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};

// -----------------------------------------------------------------------------------

export default function CanceledBookingTableRow({ row, selected }) {
  const {
    addred_date,
    booking_date,
    cab_booking_id,
    //     cancel_by,
    //     cancel_by_user_id,
    cancel_date,
    //     cancel_reason,
    //     created_user_id,
    dest_address,
    ru,
    source_addresss,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {cab_booking_id}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {moment(addred_date).format('L')}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {moment(cancel_date).format('L')}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{ru?.phone}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {moment(booking_date).format('L')}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{source_addresss}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dest_address}</Typography>
      </TableCell>
    </TableRow>
  );
}
