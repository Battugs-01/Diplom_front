import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
  emptyRows,
  TablePaginationCustom,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// sections
import { OnGoingTripTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { id: 'trip_id', label: 'Аялалын дугаар', align: 'left' },
  { id: 'driver_id', label: 'Ж/Нэр', align: 'left' },
  { id: 'phone', label: 'Ж/Утас', align: 'left' },
  { id: 'licence_plate', label: 'АУД', align: 'left' },
  { id: 'title', label: 'Машин', align: 'left' },
  { id: 'date', label: 'Огноо', align: 'left' },
  { id: 'user_phone', label: 'Х/Утас', align: 'left' },
  { id: 'caddress', label: 'Авах хаяг', align: 'left' },
  { id: 'daddress', label: 'Хүргэх хаяг', align: 'left' },
  { id: 'cab_minut', label: 'Авах минут', align: 'center' },
  { id: 'rmng_over_minut', label: 'Үлдсэн/Хэтэрсэн минут', align: 'left' },
  { id: 'prime_status_text', label: 'Төлөв', align: 'left' },
  { id: 'action', label: 'Үйлдэл', align: 'center' },
];

let interval;

// ----------------------------------------------------------------------

export default function OnGoingTripList() {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // use table
  const { page, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } = useTable();

  // total length of list
  const [total, setTotal] = useState(0);

  // table data state
  const [dataList, setDataList] = useState([]);

  // checking data length
  const isNotFound = !dataList.length;

  // use effect
  useEffect(() => {
    getData();
    return function cleanup() {
      clearInterval(interval);
    };
  }, [page, rowsPerPage]);

  // fetching data every 3 seconds
  async function getData() {
    getOnGoingTripList();
    interval = setInterval(async () => {
      getOnGoingTripList();
    }, 3000);
  }

  // fetching data
  async function getOnGoingTripList() {
    let fetchTerm = {
      listQuery: {
        search: { type: 'OnGoingTrip', value: '', lat: '', long: '' },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: 'registration_date', order: 'desc' },
      },
    };
    await axiosInstance
      .post('/findDriverInfo', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setDataList(data?.rows || []);
        setTotal(data?.count || 0);
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
        push(PATH_DASHBOARD.controlpanel.charts);
      });
  }

  // rendering-----------------------------------------------------------------------

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 2000 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={total}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {dataList.map((row, index) => (
                <OnGoingTripTableRow
                  key={index}
                  row={row}
                  rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                />
              ))}

              <TableEmptyRows height={42} emptyRows={emptyRows(page, rowsPerPage, total)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

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
    </>
  );
}
