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
  TablePaginationCustom,
  useTable,
  emptyRows,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// sections
import { CanceledBookingTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'cab_booking_id', label: 'Захиалгын код', align: 'left' },
  { id: 'addred_date', label: 'Үүсгэсэн', align: 'left' },
  { id: 'cancel_date', label: 'Цуцалсан', align: 'left' },
  { id: 'phone', label: 'Утас', align: 'left' },
  { id: 'booking_date', label: 'Авах Огноо', align: 'left' },
  { id: 'source_addresss', label: 'Авах хаяг', align: 'left' },
  { id: 'dest_address', label: 'Очих хаяг', align: 'left' },
];

let interval;

// ----------------------------------------------------------------------

export default function CanceledBookingList() {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // all functions and methods related to table
  const { page, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } = useTable();

  // total number of data length
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
  }, []);

  // fetching data every 3 seconds
  async function getData() {
    getCanceledBookingList();
    interval = setInterval(async () => {
      getCanceledBookingList();
    }, 3000);
  }

  // fetching canceled booking list
  async function getCanceledBookingList() {
    let fetchTerm = {
      listQuery: {
        search: { value: '' },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: 'cancel_date', order: 'desc' },
      },
    };
    await axiosInstance
      .post('/findCanceledLaterBook', fetchTerm)
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

  // rendering----------------------------------------------------------------------

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 1000 }}>
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
                <CanceledBookingTableRow key={index} row={row} />
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
