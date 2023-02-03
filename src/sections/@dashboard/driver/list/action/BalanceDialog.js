import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import { LoadingButton } from '@mui/lab';
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, InputAdornment, Typography } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

BalanceDialog.propTypes = {
  open: PropTypes.bool,
  driver_id: PropTypes.number,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
  balance: PropTypes.number,
};

// ----------------------------------------------------------------------

export default function BalanceDialog({ open, onClose, driver_id, onRefresh, balance }) {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  // validation schema
  const AddBalanceSchema = Yup.object().shape({
    balance: Yup.number().required('Зөв утга оруулна уу!'),
  });

  // initial values
  const defaultValues = {
    balance: '',
  };

  // use form
  const methods = useForm({
    resolver: yupResolver(AddBalanceSchema),
    defaultValues,
  });

  // extracting methods
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // handling submit
  const onSubmit = async (data) => {
    let fetchTerm = {
      user_id: user.admin_id,
      driver_id,
      balance: data.balance,
    };

    try {
      const res = await axiosInstance.post('/addMoneyDriver', fetchTerm);
      if (res?.data?.action === 1) {
        enqueueSnackbar(res?.data?.message || 'Амжилттай.');
      } else {
        enqueueSnackbar(res?.data?.message || 'Амжилтгүй.', {
          variant: 'warning',
        });
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Амжилтгүй.', {
        variant: 'warning',
      });
      onRefresh();
      onClose();
    }
  };

  // rendering ---------------------------------------------------------------------------

  return (
    <>
      {driver_id && (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
          <DialogTitle>Хэтэвч цэнэглэх</DialogTitle>

          <DialogContent dividers>
            <FormProvider methods={methods}>
              <Typography align="left" variant="subtitle2" sx={{ p: 1, mb: 1 }}>
                Үлдэгдэл дүн: {fCurrency(balance)}
              </Typography>

              <RHFTextField
                size="small"
                type="number"
                name="balance"
                label="Цэнэглэх мөнгөн дүн"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'mdi:currency-mnt'} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormProvider>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              disabled={!isDirty}
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Цэнэглэх
            </LoadingButton>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Хаах
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
