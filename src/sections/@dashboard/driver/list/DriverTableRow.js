import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableRow, TableCell, Typography, MenuItem, Avatar, IconButton } from '@mui/material';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// utils
import { fDateTimeSuffix } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
// sections
import { ViewDialog, EditDialog, BalanceDialog, PasswordDialog, StatusDialog, RestartDialog } from './action';

// ----------------------------------------------------------------------

DriverTableRow.propTypes = {
  row: PropTypes.object,
  rowQueue: PropTypes.object,
  refresh: PropTypes.func,
  handleFilterQueryVehicle: PropTypes.func,
  handleFilterQueryTrip: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function DriverTableRow({ row, rowQueue, refresh, handleFilterQueryVehicle, handleFilterQueryTrip }) {
  const { user } = useAuthContext();

  const { driver_id, name, phone, car_count, status, email, image, role } = row;

  // extracting row queue
  const { index, rowsPerPage, page } = rowQueue;

  // menu pop over state
  const [openPopover, setOpenPopover] = useState(null);

  // view dialog state
  const [openView, setOpenView] = useState(false);

  // edit dialog state
  const [openEdit, setOpenEdit] = useState(false);

  // balance dialog state
  const [openBalance, setOpenBalance] = useState(false);

  // password dialog state
  const [openPassword, setOpenPassword] = useState(false);

  // status dialog state
  const [openStatus, setOpenStatus] = useState(false);

  // restart dialog state
  const [openRestart, setOpenRestart] = useState(false);

  // change status dialog state
  const [changeStatus, setChangeStatus] = useState('');

  // handling menu pop over
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // handle closing menu pop over
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  // handling close view dialog
  const handleCloseView = () => {
    setOpenView(false);
  };

  // handling close edit dialog
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // handling close balance dialog
  const handleCloseBalance = () => {
    setOpenBalance(false);
  };

  // handling close password dialog
  const handleClosePassword = () => {
    setOpenPassword(false);
  };

  // handling status dialog
  const handleOpenStatus = (changeStatus) => {
    setChangeStatus(changeStatus);
    setOpenStatus(true);
  };

  // handling close status dialog
  const handleCloseStatus = () => {
    setOpenStatus(false);
  };

  // handling close restart dialog
  const handleCloseRestart = () => {
    setOpenRestart(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="center">{index + page * rowsPerPage + 1}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }} align="left">
          <Avatar alt={name} src={image ? process.env.HOST_FILE_KEY + image : ''} sx={{ mr: 1 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success">
            {`Жолооч`}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success">
            {email}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="info">
            {phone}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: car_count > 0 ? 200 : 140 }}
      >
        {status !== 'Deleted' && (
          <>
            <MenuItem
              onClick={() => {
                setOpenView(true);
                handleClosePopover();
              }}
            >
              <Iconify icon={'eva:eye-fill'} />
              Харах
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenEdit(true);
                handleClosePopover();
              }}
            >
              <Iconify icon={'eva:edit-fill'} />
              Засах
            </MenuItem>

            <MenuItem
              onClick={() => {
                setOpenPassword(true);
                handleClosePopover();
              }}
            >
              <Iconify icon={'carbon:password'} />
              Солих
            </MenuItem>
          </>
        )}
        {status !== 'Deleted' && user?.admin_id === 1 && (
          <MenuItem
            onClick={() => {
              setOpenBalance(true);
              handleClosePopover();
            }}
          >
            <Iconify icon={'dashicons:money-alt'} />
            Цэнэглэх
          </MenuItem>
        )}
        {status === 'inactive' && (
          <>
            <MenuItem
              onClick={() => {
                handleOpenStatus('active');
                handleClosePopover();
              }}
            >
              <Iconify icon={'material-symbols:notifications-active-outline-rounded'} />
              Идэвхтэй
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenStatus('Deleted');
                handleClosePopover();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon={'bxs:archive-in'} />
              Архивлах
            </MenuItem>
          </>
        )}
        {status === 'active' && (
          <>
            <MenuItem
              sx={{ alignItems: 'center' }}
              onClick={() => {
                handleOpenStatus('inactive');
                handleClosePopover();
              }}
            >
              <Iconify icon={'fluent:presence-offline-12-regular'} />
              Идэвхгүй
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleFilterQueryTrip();
                handleClosePopover();
              }}
            >
              <Iconify icon={'bx:trip'} />
              Аялалууд
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenRestart(true);
                handleClosePopover();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon={'ri:restart-fill'} />
              Цэвэрлэх
            </MenuItem>
          </>
        )}
        {car_count > 0 && (
          <MenuItem
            onClick={() => {
              handleFilterQueryVehicle();
              handleClosePopover();
            }}
          >
            <Iconify icon={'ic:outline-directions-car-filled'} />
            Тээврийн хэрэгсэл
          </MenuItem>
        )}
      </MenuPopover>

      {openView && <ViewDialog open={openView} onClose={handleCloseView} row={row} />}

      {openEdit && <EditDialog open={openEdit} onClose={handleCloseEdit} row={row} onRefresh={refresh} />}

      {openBalance && (
        <BalanceDialog
          open={openBalance}
          driver_id={driver_id}
          onRefresh={refresh}
          balance={row?.balance || 0}
          onClose={handleCloseBalance}
        />
      )}

      <PasswordDialog open={openPassword} onClose={handleClosePassword} driver_id={driver_id} onRefresh={refresh} />

      <BalanceDialog
        open={openBalance}
        onClose={handleCloseBalance}
        id={row?.driver_id}
        onRefresh={refresh}
        balance={row?.balance || 0}
      />

      {changeStatus.length > 0 && (
        <StatusDialog
          open={openStatus}
          onClose={handleCloseStatus}
          id={row?.driver_id}
          changeStatus={changeStatus}
          onRefresh={refresh}
        />
      )}

      <RestartDialog open={openRestart} onClose={handleCloseRestart} id={row?.driver_id} />
    </>
  );
}
