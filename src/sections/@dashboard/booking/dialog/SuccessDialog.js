import PropTypes from 'prop-types';
import Lottie from 'lottie-react';
// @mui
import { Button, Typography, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
// animated icon
import correctIcon from 'public/assets/animated/correctIcon.json';

// ----------------------------------------------------------------------------------------------

SuccessDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------------------------------

export default function SuccessDialog({ open, close, title }) {
  // rendering --------------------------------------------------------------------

  return (
    <Dialog open={open} keepMounted onClose={close}>
      <DialogTitle sx={{ alignSelf: 'center' }}>
        <div style={{ width: '120px', height: '120px' }}>
          <Lottie animationData={correctIcon} width={200} height={200} />
        </div>
      </DialogTitle>
      <DialogContent align="center">
        <Typography variant="h5">{title}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="success"
          align="center"
          onClick={() => {
            close();
          }}
        >
          ОК
        </Button>
      </DialogActions>
    </Dialog>
  );
}
