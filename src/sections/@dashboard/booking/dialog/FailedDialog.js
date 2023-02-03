import PropTypes from 'prop-types';
import Lottie from 'lottie-react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Button,
  Typography,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
// animated icon
import failed_icon from 'public/assets/animated/failed_icon.json';

//--------------------------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

FailedDialog.propTypes = {
  open: PropTypes.bool,
  when: PropTypes.string,
  close: PropTypes.func,
  title: PropTypes.string,
  clear: PropTypes.func,
  phone: PropTypes.string,
  comment: PropTypes.string,
  saddress: PropTypes.string,
  daddress: PropTypes.string,
  vehicle_type: PropTypes.number,
  onClickOrderAgain: PropTypes.func,
  combinedString: PropTypes.string,
  daddressCombinedStr: PropTypes.string,
};

//--------------------------------------------------------------------------------------

export default function FailedDialog({
  open,
  when,
  close,
  title,
  clear,
  phone,
  comment,
  saddress,
  daddress,
  vehicle_type,
  combinedString,
  daddressCombinedStr,
  onClickOrderAgain,
}) {
  // rendering ---------------------------------------------------------------------------------------------

  return (
    <Dialog open={open} keepMounted>
      <DialogTitle sx={{ alignSelf: 'center' }}>
        <div style={{ width: '120px', height: '120px' }}>
          <Lottie animationData={failed_icon} />
        </div>
      </DialogTitle>
      <DialogContent align="center">
        <Typography style={{ color: 'error.main' }} sx={{ pb: 2 }}>
          {title}
        </Typography>

        <TableBody>
          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="right">
              <Typography>Утас:</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: 'error.main' }}>{phone}</Typography>
            </TableCell>
          </RowResultStyle>

          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="right">
              <Typography>Авах хаяг:</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: 'error.main' }}>{combinedString ? combinedString : saddress}</Typography>
            </TableCell>
          </RowResultStyle>

          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="right">
              <Typography>Очих хаяг:</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: 'error.main' }}>
                {daddressCombinedStr ? daddressCombinedStr : daddress}
              </Typography>
            </TableCell>
          </RowResultStyle>

          {comment?.length > 0 && (
            <RowResultStyle>
              <TableCell colSpan={3} />
              <TableCell align="right">
                <Typography>Нэмэлт тайлбар:</Typography>
              </TableCell>
              <TableCell align="left" width={250}>
                <Typography sx={{ color: 'error.main' }}>{comment}</Typography>
              </TableCell>
            </RowResultStyle>
          )}

          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="right">
              <Typography>Таксины төрөл:</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: 'error.main' }}>
                {(vehicle_type === 1 && 'Стандарт такси') ||
                  (vehicle_type === 3 && 'Замын унаа') ||
                  (vehicle_type === 352 && 'ВИП такси') ||
                  (vehicle_type === 611 && 'Жолооч')}
              </Typography>
            </TableCell>
          </RowResultStyle>

          <RowResultStyle>
            <TableCell colSpan={3} />
            <TableCell align="right">
              <Typography>Хэзээ:</Typography>
            </TableCell>
            <TableCell align="left" width={250}>
              <Typography sx={{ color: 'error.main' }}>{when === 'now' ? 'Одоо' : 'Дараа'}</Typography>
            </TableCell>
          </RowResultStyle>
        </TableBody>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            onClickOrderAgain();
            close();
          }}
        >
          Дахин захиалах
        </Button>
        <Button
          color="error"
          onClick={() => {
            close();
            clear();
          }}
        >
          Хаах
        </Button>
      </DialogActions>
    </Dialog>
  );
}
