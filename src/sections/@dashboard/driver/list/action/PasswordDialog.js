import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, InputAdornment } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

PasswordDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  driver_id: PropTypes.number,
  onRefresh: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function PasswordDialog({ open, onClose, driver_id, onRefresh }) {
  const { enqueueSnackbar } = useSnackbar();

  // validation schema
  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string().min(8).required('Зөв утга оруулна уу!'),
  });

  // initial values
  const defaultValues = {
    password: '',
  };

  // use form
  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  // extracting methods
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // handle submit
  const onSubmit = async (data) => {
    let fetchTerm = {
      driver_id,
      password: data.password,
    };
    try {
      const res = await axiosInstance.post('/changePassword', fetchTerm);
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

  return (
    <>
      {driver_id && (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
          <DialogTitle>Нууц үг солих</DialogTitle>

          <DialogContent dividers>
            <FormProvider methods={methods}>
              <RHFTextField
                sx={{ mt: 1 }}
                size="small"
                type="password"
                name="password"
                label="Шинэ нууц үг"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'carbon:password'} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormProvider>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              disabled={!isDirty}
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Хадгалах
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
