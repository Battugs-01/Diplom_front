import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  useTable,
  TableEmptyRows,
  emptyRows,
  TablePaginationCustom,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// sections
import { CanceledTripTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { id: 'trip_id', label: 'Аялалын код', align: 'left' },
  { label: 'Ж/Нэр', align: 'left' },
  { label: 'Ж/Утас', align: 'left' },
  { id: 'cancel_by_admin_id', label: 'Цуцалсан', align: 'left' },
  { id: 'end_date', label: 'Цуцалсан огноо', align: 'left' },
  { id: 'cancel_reason', label: 'Цуцалсан шалтгаан', align: 'left' },
  { label: 'З/Утас', align: 'left' },
  { label: 'Авах хаяг', align: 'left' },
];

let interval;

// ----------------------------------------------------------------------

export default function CanceledTripList() {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // use table
  const { page, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'end_date',
    defaultOrder: 'desc',
  });

  // table data state
  const [dataList, setDataList] = useState([]);

  // total length of data list
  const [total, setTotal] = useState(0);

  // checking data length
  const isNotFound = !dataList.length;

  // use effect
  useEffect(() => {
    getData();
    return function cleanup() {
      clearInterval(interval);
    };
  }, [page, rowsPerPage, orderBy, order]);

  // fetching data every 3 seconds
  async function getData() {
    getCanceledTripList();
    interval = setInterval(async () => {
      getCanceledTripList();
    }, 3000);
  }

  // fetching canceled trip list
  async function getCanceledTripList() {
    let fetchTerm = {
      listQuery: {
        search: { value: '' },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: orderBy, order: order === 'asc' ? 'ascending' : 'descending' },
      },
    };
    await axiosInstance
      .post('/findCanceledTrip', fetchTerm)
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

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 1200 }}>
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
                <CanceledTripTableRow
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
