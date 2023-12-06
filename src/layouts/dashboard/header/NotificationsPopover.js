import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
import axiosInstance from 'src/utils/axios';
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

NotificationsPopover.propTypes = {
  selectItem: PropTypes.func,
};

export default function NotificationsPopover({ selectItem }) {
  const [notifications, setNotifications] = useState([]);

  const totalUnRead = notifications.length;

  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    // getData();
  }, []);

  async function getData() {
    getBook();
    setInterval(async () => {
      getBook();
    }, 2000);
  }

  // ----------------- getBook -----------------

  async function getBook() {
    let fetchTerm = {
      type: 'Admin',
    };

    await axiosInstance
      .post('/getBook', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setNotifications(data?.rows);
        console.log('getbook', res?.data?.data);
      })
      .catch((error) => {
        console.log('🚀  NotificationsPopover', error);
      });
  }

  const selectLaterBook = (row) => {
    selectItem(row);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={22} height={22} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Захиалга
              </ListSubheader>
            }
          >
            {notifications.length > 0 &&
              notifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} handleItem={selectLaterBook} />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </MenuPopover>

      {/* <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
      
      </MenuPopover> */}
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.node,
    type: PropTypes.string,
    title: PropTypes.string,
    isUnRead: PropTypes.bool,
    description: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
  }),
};

function NotificationItem({ notification, handleItem }) {
  const { avatar, title, source_address, dest_address } = renderContent(notification);
  const time = fToNow(notification.booking_date);
  const myArray = time.split(' ');

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() => {
        handleItem(notification);
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} secondary={source_address} />
      <ListItemText
        primary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
            style={{ color: myArray[2] === 'minutes' ? 'green' : 'red' }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {myArray[2] === 'minutes' ? `${myArray[1]} минут үлдсэн` : `${myArray[0]} минут хоцорсон`}
          </Typography>
        }
        secondary={dest_address}
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = <Typography variant="subtitle2">{notification.cab_booking_id}</Typography>;

  const source_address = (
    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
      {notification.source_addresss}
    </Typography>
  );

  const dest_address = (
    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
      {notification.dest_address}
    </Typography>
  );

  if (notification.status === 'Pending') {
    return {
      avatar: (
        <img
          alt={notification.cab_booking_id}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
      source_address,
      dest_address,
    };
  }
  if (notification.status !== 'Pending') {
    return {
      avatar: (
        <img
          alt={notification.cab_booking_id}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
      source_address,
      dest_address,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
    source_address,
    dest_address,
  };
}
