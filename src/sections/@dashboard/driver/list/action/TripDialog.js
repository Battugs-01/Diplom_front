import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Card,
  Typography,
  IconButton,
} from '@mui/material';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DialogLoader from 'src/components/dialog';
import { TablePaginationCustom, useTable } from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { fDateTimeSuffix } from 'src/utils/formatTime';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

TripDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  phone: PropTypes.number,
};

// ----------------------------------------------------------------------

export default function TripDialog({ open, onClose, driver_id }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // use table
  const { page, order, orderBy, rowsPerPage, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'trip_id',
    defaultOrder: 'desc',
    defaultRowsPerPage: 5,
  });

  // full length of data list
  const [total, setTotal] = useState(0);

  // trip detail list state
  const [tripDetailList, setTripDetailList] = useState([]);

  // dialog laoder state
  const [dialogLoader, setDialogLoader] = useState(false);

  // fetching trip detail
  const getTripDetailList = useCallback(async () => {
    let fetchTerm = {
      listQuery: {
        search: { driver_id },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: {
          prop: orderBy,
          order: order === 'asc' ? 'ascending' : 'descending',
        },
      },
    };
    try {
      const response = await axiosInstance.post('/tripList', fetchTerm);
      let data = response?.data?.data?.rows || [];
      let count = response?.data?.data?.count || 0;
      setTripDetailList(data);
      setTotal(count);
    } catch (error) {
      enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
        variant: 'warning',
      });
    }
  }, [driver_id, page, rowsPerPage]);

  // use effect
  useEffect(() => {
    setDialogLoader(true);
    if (driver_id) {
      getTripDetailList();
    }
    setDialogLoader(false);
  }, [getTripDetailList, driver_id]);

  // handling to trip detail page
  const handleView = async (id) => {
    push(PATH_DASHBOARD.trip.view(id));
  };

  // rendering -------------------------------------------------------------------------

  return (
    <>
      {tripDetailList?.length > 0 && (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
          <DialogTitle>Аялалын түүх</DialogTitle>

          <DialogContent dividers>
            {dialogLoader && <DialogLoader />}

            {!dialogLoader && (
              <Card>
                <Scrollbar>
                  <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Table sx={{ minWidth: 1000 }}>
                      <TableHead
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                          '& th': { backgroundColor: 'transparent' },
                        }}
                      >
                        <TableRow>
                          <TableCell width={40}>№</TableCell>
                          <TableCell align="left">Аялалын дугаар</TableCell>
                          <TableCell align="left">Хаяг</TableCell>
                          <TableCell align="left">Огноо</TableCell>
                          <TableCell align="left">Хэрэглэгчийн нэр, утас</TableCell>
                          <TableCell align="left">Нийт төлбөр</TableCell>
                          <TableCell align="left">Км</TableCell>
                          <TableCell align="left">Төлөв</TableCell>
                          <TableCell align="left">Үйлдэл</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {tripDetailList?.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                            }}
                          >
                            <TableCell align="left">
                              <Typography variant="subtitle2">{index + page * rowsPerPage + 1}</Typography>
                            </TableCell>

                            <TableCell>{row?.trip_id}</TableCell>

                            <TableCell>{row?.saddress}</TableCell>

                            <TableCell>
                              <Label variant="soft" color="info">
                                {fDateTimeSuffix(row?.trip_request_date)}
                              </Label>
                            </TableCell>

                            <TableCell>
                              {row?.ru?.name + ',' + ' '}
                              {row?.ru?.phone}
                            </TableCell>

                            <TableCell>{row?.trip_generate_fare}</TableCell>

                            <TableCell>{row?.distance}</TableCell>

                            <TableCell>
                              <Label
                                variant="soft"
                                color={
                                  row?.active === 'Canceled'
                                    ? 'error'
                                    : row?.active === 'Finished'
                                    ? 'success'
                                    : 'warning'
                                }
                                sx={{ textTransform: 'capitalize' }}
                              >
                                {row?.active === 'Canceled'
                                  ? 'Цуцалсан'
                                  : row?.active === 'Finished'
                                  ? 'Дэлгэрэнгүй'
                                  : 'Зорчигчтой'}
                              </Label>
                            </TableCell>

                            {row?.active === 'Finished' && (
                              <TableCell align="center">
                                <IconButton onClick={() => handleView(row.trip_id)}>
                                  <Iconify icon={'bx:trip'} />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePaginationCustom
                  showFirstButton
                  showLastButton
                  page={page}
                  count={total || 0}
                  rowsPerPage={rowsPerPage}
                  onPageChange={onChangePage}
                  onRowsPerPageChange={onChangeRowsPerPage}
                  labelRowsPerPage={'Хуудсанд:'}
                  labelDisplayedRows={({ from, to, count }) => from + '-с ' + to + ' хүртэлх. ' + 'Нийт: ' + count}
                />
              </Card>
            )}
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Хаах
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
