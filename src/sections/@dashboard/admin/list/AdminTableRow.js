// prop types
import PropTypes from 'prop-types';
// React
import { useState } from 'react';
// @mui
import { TableRow, TableCell, Typography, MenuItem, IconButton, Button } from '@mui/material';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';
// components
import Label from 'src/components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

AdminTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  rowQueue: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function AdminTableRow({ row, selected, onEditRow, onViewRow, onDeleteRow, rowQueue }) {
  // extracting data
  const { first_name, last_name, group, email, contact_no, created_date } = row;

  // extracting data
  const { index, rowsPerPage, page } = rowQueue;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  // rendering----------------------------------------------------------

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {first_name ? first_name?.substring(0, 1) + '. ' : ''}
            {last_name}
          </Typography>
        </TableCell>

        <TableCell align="left">{group?.desc}</TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success">
            {email}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="info">
            {fDateTimeSuffix(created_date)}
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
