import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// hook form
import { useForm } from 'react-hook-form';
// @mui
import {
  Dialog,
  Button,
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
  Card,
} from '@mui/material';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import DialogLoader from 'src/components/dialog';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { fCurrency } from 'src/utils/formatNumber';
import { fDateSuffix } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

ViewDialog.propTypes = {
  open: PropTypes.bool,
  row: PropTypes.any,
  onClose: PropTypes.func,
};

var phoneList = [];

// ----------------------------------------------------------------------

export default function ViewDialog({ open, onClose, row }) {
  const { enqueueSnackbar } = useSnackbar();

  // each people detail data state
  const [driverVehicleList, setDriverVehicleList] = useState([]);

  // dialog laoder state
  const [dialogLoader, setDialogLoader] = useState(false);

  // use effect
  useEffect(() => {
    setDialogLoader(true);
    if (row) {
      reset(defaultValues);
    }
    getData();
    setDialogLoader(false);
  }, []);

  // fetching each driver vehicle list
  async function getData() {
    let fetchTerm = {
      driver_id: row?.driver_id,
    };
    try {
      await axiosInstance.post('/driverVehicleList', fetchTerm).then((res) => {
        if (res?.data?.action === 1) {
          let data = res?.data?.data || [];
          setDriverVehicleList(data);
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

  // initial values
  const defaultValues = useMemo(
    () => ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row]
  );

  // use form
  const methods = useForm({
    defaultValues,
  });

  // extracting methods
  const { watch, reset } = methods;

  // all values
  const values = watch();

  // spliting phone number by -> ,
  if (values.phones !== '') {
    phoneList = values.phones.split(',');
  }

  console.log(onClose, 'asdfgd');
  // rendering---------------------------------------------------------------------------------------------

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <DialogTitle>Жолоочийн дэлгэрэнгүй</DialogTitle>

        <DialogContent dividers>
          {dialogLoader && <DialogLoader />}

          {!dialogLoader && (
            <FormProvider methods={methods}>
              <Stack spacing={1.5}>
                <Box>
                  <RHFUploadAvatar disabled name="image" />
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 1,
                    rowGap: 0,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Typography align="center" variant="subtitle2">
                    Бүртгүүлсэн огноо
                  </Typography>
                  <Typography align="center" variant="subtitle2">
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
                  <RHFTextField disabled name="last_name" label="Овог" size="small" />
                  <RHFTextField disabled name="name" label="Нэр" size="small" />
                  <RHFTextField disabled name="email" label="Имэйл" size="small" />
                  <RHFTextField disabled name="phone" label="Утас" size="small" />
                  <RHFTextField disabled name="bank_name" label="Банкны нэр" size="small" />
                  <RHFTextField disabled name="account_number" label="Банкны данс" size="small" />
                  <RHFTextField
                    disabled
                    name="bank_account_holder_name"
                    label="Банкны данс эзэмшигчийн нэр"
                    size="small"
                  />
                  <RHFTextField disabled name="address" label="Гэрийн хаяг" size="small" />
                </Box>

                {/* Нэмэлт утас */}

                {phoneList?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ p: 1 }}>
                      Нэмэлт утас
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <TableContainer sx={{ minWidth: 500, overflow: 'unset' }}>
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
                    </Card>
                  </Box>
                )}

                {/* Тээврийн хэрэгсэл */}

                {driverVehicleList?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ p: 1 }}>
                      Тээврийн хэрэгсэл
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <TableContainer sx={{ minWidth: 400 }}>
                          <Table>
                            <TableHead
                              sx={{
                                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                                '& th': { backgroundColor: 'transparent' },
                              }}
                            >
                              <TableRow>
                                <TableCell width={40}>№</TableCell>
                                <TableCell align="left">АУД</TableCell>
                                <TableCell align="left">Машин</TableCell>
                                <TableCell align="left">Төлөв</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {driverVehicleList.map((row, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                                  }}
                                >
                                  <TableCell align="left">
                                    <Typography variant="subtitle2">{index + 1}</Typography>
                                  </TableCell>
                                  <TableCell>{row.licence_plate}</TableCell>
                                  <TableCell>{row.title}</TableCell>
                                  <TableCell>
                                    <Label color={row.status === 'Active' ? 'success' : 'default'}>
                                      {row.status === 'Active' ? 'Идэвхитэй' : 'Идэвхгүй'}
                                    </Label>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Scrollbar>
                    </Card>
                  </Box>
                )}
              </Stack>
            </FormProvider>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Хаах
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
