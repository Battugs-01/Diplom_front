import PropTypes from 'prop-types';
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
import { LaterBookingTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'booking_id', label: 'Захиалгын код', align: 'left' },
  { id: 'admin_id', label: 'Бүртгэсэн', align: 'left' },
  { id: 'addred_date', label: 'Бүртгэсэн огноо', align: 'left' },
  { id: 'admin_idaaaaa', label: 'Өөрчилсөн', align: 'left' },
  { id: 'update_date', label: 'Өөрчилсөн огноо', align: 'left' },
  { id: 'phone', label: 'Утас', align: 'left' },
  { id: 'caddress', label: 'Авах хаяг', align: 'left' },
  { id: 'daddress', label: 'Очих хаяг', align: 'left' },
  { id: 'user_comment', label: 'Нэмэлт тайлбар', align: 'left' },
  { id: 'date', label: 'Авах огноо', align: 'left' },
  { id: 'vehicle_type', label: 'Тээврийн хэрэгслийн төрөл', align: 'left' },
  { id: 'cab_minut', label: 'Үлдсэн минут', align: 'left' },
  { id: 'action', label: 'Үйлдэл', align: 'left' },
];

let interval;

LaterBookingList.propTypes = {
  change: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function LaterBookingList({ change }) {
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
    getLaterBookingList();
    interval = setInterval(async () => {
      getLaterBookingList();
    }, 3000);
  }

  // fetching later booking list
  async function getLaterBookingList() {
    let fetchTerm = {
      listQuery: {
        search: { value: '' },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: 'booking_date', order: 'asc' },
      },
    };
    await axiosInstance
      .post('/findLaterBooking', fetchTerm)
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

  // rendering--------------------------------------------------------------------------------------

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
                <LaterBookingTableRow key={index} row={row} onChange={change} />
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
