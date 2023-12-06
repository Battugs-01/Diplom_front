import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography, IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

TripByPhoneTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleSaddress: PropTypes.func,
  handleDaddress: PropTypes.func,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TripByPhoneTableRow({ row, selected, handleSaddress, handleDaddress, rowQueue }) {
  // extracting data
  const { daddress, saddress, start_lat, start_long } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{saddress}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle3">{daddress}</Typography>
      </TableCell>
      <TableCell align="center">
        <IconButton
          onClick={() => {
            handleSaddress(saddress, parseFloat(start_lat), parseFloat(start_long));
          }}
        >
          <Iconify icon="material-symbols:location-on-rounded" width={20} height={20} color="#F9511B" />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDaddress(saddress, parseFloat(start_lat), parseFloat(start_long));
          }}
        >
          <Iconify icon="material-symbols:location-on-rounded" width={20} height={20} color="#8A8583" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
