import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useCallback } from 'react';
import * as Yup from 'yup';
// hook form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
// utils
import axiosInstance from 'src/utils/axios';
import { fDateSuffix } from 'src/utils/formatTime';
import { fCurrency, fData } from 'src/utils/formatNumber';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

EditDialog.propTypes = {
  open: PropTypes.bool,
  row: PropTypes.any,
  id: PropTypes.number,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

var phoneList = [];

// ----------------------------------------------------------------------

export default function EditDialog({ open, onClose, row, onRefresh }) {
  const { enqueueSnackbar } = useSnackbar();

  // bank List state
  const [bankList, setBankList] = useState([]);

  // use effect
  useEffect(() => {
    if (row) {
      reset(defaultValues);
    }
    getBankList();
  }, []);

  // fetching bank list
  async function getBankList() {
    try {
      await axiosInstance.get('/getBankList').then((res) => {
        if (res?.data?.action === 1) {
          let data = res?.data?.data?.rows || [];
          setBankList(data);
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'warning' });
        }
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  }

  // validation schema
  const EditSchema = Yup.object().shape({
    last_name: Yup.string().required('Зөв утга оруулна уу!'),
    name: Yup.string().required('Зөв утга оруулна уу!'),
    email: Yup.string().required('Зөв утга оруулна уу!').email('Зөв утга оруулна уу!'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Зөвхөн тоо')
      .min(8, 'Зөв утга оруулна уу')
      .max(8, 'Зөв утга оруулна уу')
      .required('..'),
    bank_name: Yup.string().required('Зөв утга оруулна уу!'),
    account_number: Yup.string()
      .matches(/^[0-9]+$/, 'Зөвхөн тоо')
      .min(8, 'Зөв утга оруулна уу')
      .max(14, 'Зөв утга оруулна уу')
      .required('..'),
    bank_account_holder_name: Yup.string().required('Зөв утга оруулна уу!'),
    image: Yup.mixed().test('...', 'Зөв утга оруулна уу!', (value) => value !== ''),
    address: Yup.string().min(5).required('Зөв утга оруулна уу!'),
  });

  // initial values
  const defaultValues = useMemo(
    () => ({
      driver_id: row?.driver_id || 0,
      name: row?.name || '',
      last_name: row?.last_name || '',
      email: row?.email || '',
      phone: row?.phone || '',
      bank_name: row?.bank_name || '',
      account_number: row?.account_number || '',
      bank_account_holder_name: row?.bank_account_holder_name || '',
      image: process.env.HOST_FILE_KEY + row?.image || '',
      status: row?.status || '',
      registration_date: row?.registration_date || Date(),
      balance: row?.balance || 0,
      driver_vehicle: row?.driver_vehicle || [],
      phones: row?.phones || '',
      address: row?.caddress || '',
    }),
    [row]
  );

  // use form
  const methods = useForm({
    resolver: yupResolver(EditSchema),
    defaultValues,
  });

  // extracting methods
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // all values
  const values = watch();

  // spliting phone number by -> ,
  if (values.phones !== '') {
    phoneList = values.phones.split(',');
  }

  // handle submit
  const onSubmit = async () => {
    try {
      const form = new FormData();
      if (values.image.length > 0) {
        form.append('file', row?.image || '');
      } else {
        form.append('file', values?.image || '');
      }
      form.append('driver_id', values?.driver_id || '');
      form.append('name', values?.name || '');
      form.append('last_name', values?.last_name || '');
      form.append('email', values?.email || '');
      form.append('bank_account_holder_name', values?.bank_account_holder_name || '');
      form.append('account_number', values?.account_number || '');
      form.append('bank_name', values?.bank_name || '');
      form.append('address', values?.address || '');
      form.append('phones', values?.phones || '');

      const res = await axiosInstance.post('/updateDriver', form);
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

  // handling avatar image
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // rendering ---------------------------------------------------------------------------------

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <DialogTitle>Жолоочийн дэлгэрэнгүй</DialogTitle>

        <DialogContent dividers>
          <FormProvider methods={methods}>
            <Stack spacing={1.5}>
              <Box>
                <RHFUploadAvatar
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      *.jpeg, *.jpg, *.png өргөтгөл зөвшөөрөгдсөн
                      <br /> хамгийн их хэмжээ {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 0,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Typography align="center" variant="subtitle2" sx={{ mt: 0.5 }}>
                  Бүртгүүлсэн огноо
                </Typography>
                <Typography align="center" variant="subtitle2" sx={{ mt: 0.5 }}>
                  Хэтэвч
                </Typography>
                <Typography align="center" variant="body2" sx={{ color: 'text.secondary' }}>
                  {fDateSuffix(values.registration_date)}
                </Typography>

                <Typography align="center" variant="body2" sx={{ color: 'text.secondary' }}>
                  {fCurrency(values.balance)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="last_name" label="Овог" size="small" />

                <RHFTextField name="name" label="Нэр" size="small" />

                <RHFTextField name="email" label="Имэйл" size="small" />

                <RHFTextField name="phone" label="Утас" size="small" />

                <RHFSelect name="bank_name" size="small">
                  {bankList &&
                    bankList.map((option, index) => (
                      <MenuItem
                        key={index}
                        value={option.bank_name_mn}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                      >
                        {option.bank_name_mn}
                      </MenuItem>
                    ))}
                </RHFSelect>

                <RHFTextField name="account_number" label="Банкны данс" size="small" />

                <RHFTextField name="bank_account_holder_name" label="Банкны данс эзэмшигчийн нэр" size="small" />

                <RHFTextField name="address" label="Гэрийн хаяг" size="small" />
              </Box>

              {/* <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 0,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <>
                  <Typography align="center" variant="subtitle2" sx={{ mt: 3 }}>
                    Нэмэлт утас
                  </Typography>

                  <Typography align="center" variant="subtitle2" sx={{ mt: 3 }}>
                    Тээврийн хэрэгсэл
                  </Typography>
                </> */}

              {/* <>
                  <Scrollbar>
                    <TableContainer sx={{ minWidth: 100 }}>
                      <Table>
                        <TableHead
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                            '& th': { backgroundColor: 'transparent' },
                          }}
                        >
                          <TableRow>
                            <TableCell width={40}>№</TableCell>
                            <TableCell align="left">Дугаар</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {phoneList.map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                              }}
                            >
                              <TableCell align="left">
                                <Typography variant="subtitle2">{index + 1}</Typography>
                              </TableCell>
                              <TableCell>{row}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </> */}
              {/* </Box> */}
            </Stack>
          </FormProvider>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isDirty}
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
    </>
  );
}
