import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
} from '@mui/material';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { fDateTimeSuffix } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

StatusDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.number,
  onClose: PropTypes.func,
  changeStatus: PropTypes.string,
  onRefresh: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function StatusDialog({ open, onClose, id, changeStatus, onRefresh }) {
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  // last 3 driver status history
  const [driverStatusList, setDriverStatusList] = useState([]);

  // fetching driver status list
  const getDriverStatusList = useCallback(async () => {
    let fetchTerm = {
      listQuery: {
        search: { id },
        limit: 3,
        currentPage: 1,
        sort: {
          prop: 'id',
          order: 'descending',
        },
      },
    };
    try {
      const response = await axiosInstance.post('/driver/status/log', fetchTerm);
      let data = response?.data?.data?.rows || [];
      setDriverStatusList(data);
      console.log('asfsa', response?.data?.data?.rows);
    } catch (error) {
      enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
        variant: 'warning',
      });
    }
  }, [id]);

  // use effect
  useEffect(() => {
    if (id) {
      getDriverStatusList();
    }
  }, [getDriverStatusList, id]);

  // validation schema
  const ChangeStatusSchema = Yup.object().shape({
    description: Yup.string().min(1).required('Зөв утга оруулна уу!'),
  });

  // initial values
  const defaultValues = {
    status: changeStatus,
    driver_id: id || null,
    description: '',
  };

  // use form
  const methods = useForm({
    resolver: yupResolver(ChangeStatusSchema),
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
      user_id: user.admin_id,
      driver_id: data.driver_id,
      status: data.status,
      description: data.description,
    };

    try {
      const res = await axiosInstance.post('/changeDriverStatus', fetchTerm);
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
      enqueueSnackbar(error?.message || 'Амжилтгүй.', {
        variant: 'warning',
      });
      onRefresh();
      onClose();
    }
  };

  return (
    <>
      {id && (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
          <DialogTitle>Жолоочийн төлөв солих</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              <FormProvider methods={methods}>
                <RHFTextField size="small" name="description" label="Тайлбар" multiline rows={2} sx={{ mt: 1 }} />
              </FormProvider>

              {driverStatusList?.length > 0 && (
                <Card>
                  <Scrollbar>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                            '& th': { backgroundColor: 'transparent' },
                          }}
                        >
                          <TableRow>
                            <TableCell width={40}>№</TableCell>
                            <TableCell align="left">Тайлбар</TableCell>
                            <TableCell align="left">Төлөв</TableCell>
                            <TableCell align="left">Админы нэр</TableCell>
                            <TableCell align="left">Огноо</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {driverStatusList?.map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                              }}
                            >
                              <TableCell>
                                <Typography variant="subtitle2">{index + 1}</Typography>
                              </TableCell>

                              <TableCell sx={{ width: '20%' }}>{row?.description}</TableCell>

                              <TableCell>
                                <Label
                                  variant="soft"
                                  color={
                                    (row?.status === 'active' && 'success') ||
                                    (row?.status === 'Deleted' && 'error') ||
                                    (row?.status === 'inactive' && 'default')
                                  }
                                >
                                  {(row?.status === 'active' && 'Идэвхитэй') ||
                                    (row?.status === 'Deleted' && 'Архивласан') ||
                                    (row?.status === 'inactive' && 'Идэвхгүй')}
                                </Label>
                              </TableCell>

                              <TableCell>{row?.admin?.first_name}</TableCell>

                              <TableCell>
                                <Label variant="soft" color="info">
                                  {fDateTimeSuffix(row?.date)}
                                </Label>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Card>
              )}
            </Stack>
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
      )}
    </>
  );
}
