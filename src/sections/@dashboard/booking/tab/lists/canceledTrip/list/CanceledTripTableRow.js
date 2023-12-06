import PropTypes from 'prop-types';
// @mui
import { Avatar, TableRow, TableCell, Typography, Box } from '@mui/material';
// components
import Label from 'src/components/label';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';

// -----------------------------------------------------------------------

CanceledTripTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  rowQueue: PropTypes.object,
};

// -----------------------------------------------------------------------

export default function CanceledTripTableRow({ row, selected, rowQueue }) {
  const { end_date, cancel_reason, cancel_by_admin_id, rd, ru, saddress, trip_id, admin } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {trip_id}
        </Typography>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={name}
            src={
              rd?.image
                ? `https://dev.1950.mn${rd?.image}`
                : `https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar.jpg`
            }
            sx={{ mr: 1, width: '30px', height: '30px' }}
          />
          {rd?.name || ''}
        </Box>
      </TableCell>

      <TableCell align="left">{rd?.phone}</TableCell>

      <TableCell align="left">
        {cancel_by_admin_id === 0
          ? 'Жолооч'
          : admin === null
          ? cancel_by_admin_id
          : '' + admin?.group?.desc + ' ~ ' + admin?.first_name}
      </TableCell>

      <TableCell align="left">
        <Label variant="soft" color="error">
          {fDateTimeSuffix(end_date)}
        </Label>
      </TableCell>

      <TableCell align="left">{cancel_reason}</TableCell>

      <TableCell align="left">{ru?.phone || ''}</TableCell>

      <TableCell align="left" sx={{ width: '30%' }}>
        {saddress}
      </TableCell>
    </TableRow>
  );
}
