import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, IconButton, Button } from '@mui/material';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

VehicleTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function VehicleTableRow({ row, selected, onEditRow, onViewRow, onDeleteRow, rowQueue }) {
  // extracting data
  const { driver_id, make, model, company, driver, colour, status } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  // handling delete modal
  const [openConfirm, setOpenConfirm] = useState(false);

  // handling table action popover
  const [openPopover, setOpenPopover] = useState(null);

  // handling open delete dialog
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  // handling close delete dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // handling open popover
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // handling close popover
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  // rendering----------------------------------------------------------

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

        <TableCell align="left">{make?.make}</TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success">
            {model ? model?.title : '-'}
          </Label>
        </TableCell>

        <TableCell align="left">{driver ? `${driver?.name} .${driver?.last_name}` : '-'}</TableCell>

        <TableCell align="left">{driver ? driver?.phone : '-'}</TableCell>

        <TableCell align="left">{colour ? colour : '-'}</TableCell>

        <TableCell align="left">
          <Label variant="soft" color={status === 'Inactive' ? 'default' : 'success'}>
            {(status === 'Inactive' && 'Идэвхгүй') || 'Идэвхитэй'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Засах
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Харах
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Устгах
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Устгах"
        content="Та устгахдаа итгэлтэй байна уу?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Устгах
          </Button>
        }
      />
    </>
  );
}
