import PropTypes from 'prop-types';
import moment from 'moment';
// @mui
import { Avatar, TableRow, TableCell, Typography } from '@mui/material';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

NearestCabsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function NearestCabsTableRow({ row, selected, rowQueue }) {
  const { name, image, phone, registration_date, dv, app_version, dist, driver_id } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      {/* <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {driver_id}
        </Typography>
      </TableCell> */}

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {driver_id}
        </Typography>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
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

      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {phone}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Label variant="soft" color="info">
          {fDateTimeSuffix(registration_date)}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dv?.model?.title || 'KIA'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dv?.licence_plate || '1110УАУ'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dv?.colour || 'Мөнгөлөг'}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="subtitle3">{app_version}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{dist || 0}</Typography>
      </TableCell>
    </TableRow>
  );
}
