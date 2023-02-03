import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, TableRow, TableCell, Dialog, DialogContent, DialogActions, Stack } from '@mui/material';
// utils
// animated icon
import call_Icon from 'public/assets/animated/call_Icon.json';

//--------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

let interval;

CallDialog.propTypes = {
  title: PropTypes.string,
  saddress: PropTypes.string,
  daddress: PropTypes.string,
  phone: PropTypes.string,
  comment: PropTypes.string,
  vehicle_type: PropTypes.string,
  when: PropTypes.string,
  open: PropTypes.bool,
  close: PropTypes.func,
  clear: PropTypes.func,
  cancelCabRequestFunc: PropTypes.func,
  combinedString: PropTypes.string,
  daddressCombinedStr: PropTypes.string,
};

//--------------------------------------------------------------------

export default function CallDialog({
  title,
  saddress,
  daddress,
  phone,
  comment,
  vehicle_type,
  when,
  open,
  close,
  cancelCabRequestFunc,
  combinedString,
  daddressCombinedStr,
}) {
  // time state
  const [time, setTime] = useState(0);

  // useEffect
  useEffect(() => {
    handlingTimeInterval();
  }, []);

  // handling time interval func
  const handlingTimeInterval = () => {
    let i = 0;
    if (open) {
      interval = setInterval(function () {
        i = parseInt(i) + 1;
        setTime(i);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  };

  // rendering -------------------------------------------------------------------------------------

  return (
    <Dialog open={open} keepMounted>
      <DialogContent align="center" sx={{ mt: 4 }}>
        <Stack alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
          <Lottie animationData={call_Icon} />

          <Typography sx={{ color: '#00b36b' }}>{title}</Typography>

          <Typography variant="h5" sx={{ color: '#00b36b' }}>
            {time}
          </Typography>
        </Stack>

        <RowResultStyle>
          <TableCell colSpan={3} />
          <TableCell align="left">
            <Typography>Утас :</Typography>
          </TableCell>
          <TableCell align="left" width={250}>
            <Typography sx={{ color: '#00b36b' }} variant="subtitle2">
              {phone}
            </Typography>
          </TableCell>
        </RowResultStyle>

        <RowResultStyle>
          <TableCell colSpan={3} />
          <TableCell align="left">
            <Typography>Авах хаяг :</Typography>
          </TableCell>
          <TableCell align="left" width={250}>
            <Typography sx={{ color: '#00b36b' }} variant="subtitle2">
              {combinedString ? combinedString : saddress}
            </Typography>
          </TableCell>
        </RowResultStyle>

        <RowResultStyle>
          <TableCell colSpan={3} />
          <TableCell align="left">
            <Typography>Очих хаяг :</Typography>
          </TableCell>
          <TableCell align="left" width={250}>
            <Typography sx={{ color: '#00b36b' }} variant="subtitle2">
              {daddressCombinedStr ? daddressCombinedStr : daddress}
            </Typography>
          </TableCell>
        </RowResultStyle>

        {comment && (
          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="left">
              <Typography>Нэмэлт тайлбар :</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: '#00b36b' }} variant="subtitle2">
                {comment}
              </Typography>
            </TableCell>
          </RowResultStyle>
        )}

        <RowResultStyle>
          <TableCell colSpan={3} />
          <TableCell align="left">
            <Typography>Таксины төрөл :</Typography>
          </TableCell>
          <TableCell align="left" width={250}>
            <Typography sx={{ color: '#00b36b' }} variant="subtitle2">
              {(vehicle_type === 1 && 'Стандарт такси') ||
                (vehicle_type === 3 && 'Замын унаа') ||
                (vehicle_type === 352 && 'ВИП такси') ||
                (vehicle_type === 611 && 'Жолооч')}
            </Typography>
          </TableCell>
        </RowResultStyle>

        <RowResultStyle>
          <TableCell colSpan={3} />
          <TableCell align="left">
            <Typography>Хэзээ :</Typography>
          </TableCell>
          <TableCell align="left" width={250}>
            <Typography variant="subtitle2" sx={{ color: '#00b36b' }}>
              {when === 'now' ? 'Одоо' : 'Дараа'}
            </Typography>
          </TableCell>
        </RowResultStyle>
      </DialogContent>
      <DialogActions>
        <Button
          size="medium"
          color="error"
          onClick={() => {
            cancelCabRequestFunc();
          }}
        >
          <Typography variant="subtitle2">Цуцлах</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
