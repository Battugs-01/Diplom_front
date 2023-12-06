import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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
// sections
import { NearestCabsTableRow } from './list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { id: 'driver_id', label: 'Ж/Код', align: 'left' },
  { label: 'Ж/Нэр', align: 'left' },
  { label: 'Ж/Утас', align: 'left' },
  { id: 'registration_date', label: 'Бүртгүүлсэн огноо', align: 'left' },
  { label: 'Модел', align: 'left' },
  { label: 'АУД', align: 'left' },
  { label: 'Өнгө', align: 'left' },
  { id: 'app_version', label: 'Хувилбар', align: 'center' },
  { label: 'Зай', align: 'left' },
];

let interval;

NearestCabsList.propTypes = {
  passenger_lat_lon: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function NearestCabsList({ passenger_lat_lon }) {
  const { enqueueSnackbar } = useSnackbar();

  // use table
  const { page, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'registration_date',
    defaultOrder: 'desc',
  });

  // total length of list
  const [total, setTotal] = useState(0);

  // table data state
  const [dataList, setDataList] = useState([]);

  // checking data list length
  const isNotFound = !dataList.length;

  // use effect
  useEffect(() => {
    getData();
    return function cleanup() {
      clearInterval(interval);
    };
  }, [page, rowsPerPage, order, orderBy, passenger_lat_lon]);

  // fetching data every 25 seconds
  async function getData() {
    getNearestCabsList();
    interval = setInterval(async () => {
      getNearestCabsList();
    }, 25000);
  }

  // fetching nearest cabs  list
  async function getNearestCabsList() {
    let fetchTerm = {
      listQuery: {
        search: { type: 'NearestCabs', lat: passenger_lat_lon?.lat, long: passenger_lat_lon?.lon, value: null },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: orderBy, order: order === 'asc' ? 'ascending' : 'descending' },
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
      });
  }

  // rendering--------------------------------------------------------------------------------------------------

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 800 }}>
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
                <NearestCabsTableRow
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
