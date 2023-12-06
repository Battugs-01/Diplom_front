import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography, IconButton } from '@mui/material';
//components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

AddressLocationTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleSaddress: PropTypes.func,
  handleDaddress: PropTypes.func,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function AddressLocationTableRow({ row, selected, handleSaddress, handleDaddress, rowQueue }) {
  const {
    building_no,
    descr,
    district_name,
    latitude,
    longitude,
    name,
    position,
    position_eng,
    subdistrict_name,
    townname,
  } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

      <TableCell align="left" sx={{ width: '15%' }}>
        <Typography variant="subtitle3">{building_no}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '15%' }}>
        <Typography variant="subtitle3">{position}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '20%' }}>
        <Typography variant="subtitle3">{descr}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '10%' }}>
        <Typography variant="subtitle3">{townname}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '10%' }}>
        <Typography variant="subtitle3">{district_name}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '10%' }}>
        <Typography variant="subtitle3">{subdistrict_name}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ width: '10%' }}>
        <Typography variant="subtitle3">{name}</Typography>
      </TableCell>

      <TableCell align="center" sx={{ width: '10%' }}>
        <IconButton
          onClick={() => {
            handleSaddress(position, parseFloat(latitude), parseFloat(longitude));
          }}
        >
          <Iconify icon="material-symbols:location-on-rounded" width={20} height={20} color="#F9511B" />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDaddress(position, parseFloat(latitude), parseFloat(longitude));
          }}
        >
          <Iconify icon="material-symbols:location-on-rounded" width={20} height={20} color="#8A8583" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
