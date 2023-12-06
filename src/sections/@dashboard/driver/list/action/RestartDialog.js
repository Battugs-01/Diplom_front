import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Dialog, Button, Divider, DialogTitle, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

RestartDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.number,
  onClose: PropTypes.func,
};

export default function RestartDialog({ open, onClose, id }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewPasswordSchema = Yup.object().shape({
    driver_id: Yup.number().required('Зөв утга оруулна уу!'),
  });

  const defaultValues = {
    driver_id: id,
  };

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let fetchTerm = {
      driver_id: data.driver_id,
    };

    try {
      const res = await axiosInstance.post('/driverRestart', fetchTerm);
      if (res?.data?.action === 1) {
        enqueueSnackbar(res?.data?.message || 'Амжилттай.');
      } else {
        enqueueSnackbar(res?.data?.message || 'Амжилтгүй.', {
          variant: 'warning',
        });
      }
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Амжилтгүй.', {
        variant: 'warning',
      });
      onClose();
    }
  };

  return (
    <>
      {id && (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
          <DialogTitle align="center">Жолоочийг дахин ачааллах</DialogTitle>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {/* <Iconify align="center" sx={{ align: 'center' }} icon={'emojione-v1:warning'} /> */}

            <Divider />
            <DialogActions>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Тийм
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={onClose}>
                Хаах
              </Button>
            </DialogActions>
          </FormProvider>
        </Dialog>
      )}
    </>
  );
}
