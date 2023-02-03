import { useState, useEffect } from 'react';
// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// sections
import { DriverInfoTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { id: 'driver_id', label: 'Ж/Код', align: 'left' },
  { label: 'Ж/Нэр', align: 'left' },
  { label: 'Ж/Утас', align: 'left' },
  { id: 'device_type', label: 'Төхөөрөмж', align: 'left' },
  { id: 'registration_date', label: 'Бүртгүүлсэн огноо', align: 'left' },
  { label: 'Модел', align: 'left' },
  { label: 'АУД', align: 'left' },
  { label: 'Өнгө', align: 'left' },
  { id: 'app_version', label: 'Хувилбар', align: 'center' },
  { id: 'trip_status', label: 'Төлөв', align: 'left' },
];

let interval;

// ----------------------------------------------------------------------

export default function DriverInfoList() {
  const { enqueueSnackbar } = useSnackbar();

  // use table
  const { page, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'registration_date',
    defaultOrder: 'desc',
  });

  // table data state
  const [dataList, setDataList] = useState([]);

  // total number of data length
  const [total, setTotal] = useState(0);

  // checking data length
  const isNotFound = !dataList.length;

  // use effect
  useEffect(() => {
    getData();
    return function cleanup() {
      clearInterval(interval);
    };
  }, [page, rowsPerPage, order, orderBy]);

  // calling api every 3 second
  async function getData() {
    getDriverInfoList();
    interval = setInterval(async () => {
      getDriverInfoList();
    }, 3000);
  }

  // fetching driver info list
  async function getDriverInfoList() {
    let fetchTerm = {
      listQuery: {
        search: { type: 'DriverInfo', value: '' },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: orderBy, order: order === 'asc' ? 'ascending' : 'descending' },
      },
    };
    try {
      await axiosInstance.post('/findDriverInfo', fetchTerm).then((res) => {
        if (res?.data?.action === 1) {
          let data = res?.data?.data || [];
          setDataList(data?.rows || []);
          setTotal(data?.count || 0);
        }
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  }

  // rendering---------------------------------------------------------------------------------------

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 1400 }}>
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
                <DriverInfoTableRow
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
