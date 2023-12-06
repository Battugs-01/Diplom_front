import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Card, Table, TableBody, TableContainer, Typography } from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  emptyRows,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// sections
import { AddressLocationTableRow, TripByPhoneTableRow, AddressLocationTableToolbar } from './list';

//----------------------------------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { label: 'Байр', align: 'left' },
  { label: 'Байршил', align: 'left' },
  { label: 'Тайлбар', align: 'left' },
  { label: 'Хотхон', align: 'left' },
  { label: 'Дүүрэг', align: 'left' },
  { label: 'Хороо', align: 'left' },
  { label: 'Төрөл', align: 'left' },
  { label: 'Үйлдэл', align: 'center' },
];

const TABLE_HEAD_PHONE = [
  { label: '№', align: 'center', width: 40 },
  { label: 'Авах хаяг', align: 'left' },
  { label: 'Очсон хаяг', align: 'left' },
  { label: 'Үйлдэл', align: 'center' },
];

AddressLocationList.propTypes = {
  tripByPhoneList: PropTypes.array,
  saddress: PropTypes.func,
  daddress: PropTypes.func,
};

// --------------------------------------------------------------------------------------------------

export default function AddressLocationList({ tripByPhoneList, saddress, daddress }) {
  const { enqueueSnackbar } = useSnackbar();

  // all functions and methods related to table
  const { page, setPage, order, orderBy, rowsPerPage, selected, onSort, onChangePage, onChangeRowsPerPage } =
    useTable();

  // total length of list
  const [total, setTotal] = useState(0);

  // table data state
  const [dataList, setDataList] = useState([]);

  // filter state
  const [filterArray, setFilterArray] = useState([]);

  // table loader state
  const [loaderState, setLoaderState] = useState(false);

  // checking length of location table list
  const isNotFound = !dataList.length;

  // checking length of trip by phone table list
  const isNotFoundTripByPhone = !tripByPhoneList?.length;

  // useEffect triggered by rows per page and filter array
  useEffect(() => {
    findLocationData();
  }, [rowsPerPage, filterArray, page]);

  // fetching find location data
  async function findLocationData() {
    let fetchTerm = {
      listQuery: {
        status: 'address',
        search: filterArray,
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: { prop: 'building_id', order: 'desc' },
      },
    };
    setLoaderState(true);
    await axiosInstance
      .post('/findLocationData', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setDataList(data || []);
        setTotal(data.length || 0);
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
    setTimeout(() => {
      setLoaderState(false);
    }, 500);
  }

  // handling filter array
  const handleFilterArray = (data) => {
    setPage(0);
    setFilterArray(data);
  };

  return (
    <>
      {!isNotFoundTripByPhone && (
        <Card sx={{ m: 2 }}>
          <Typography variant="subtitle1" sx={{ p: 2 }}>
            Аялалын түүх
          </Typography>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 1400 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_PHONE}
                  rowCount={total}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {tripByPhoneList?.map((row, index) => (
                    <TripByPhoneTableRow
                      key={index}
                      row={row}
                      handleSaddress={saddress}
                      handleDaddress={daddress}
                      rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                    />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      )}

      <AddressLocationTableToolbar
        onFilter={handleFilterArray}
        refreshTable={() => findLocationData()}
        refreshFilterArray={() => setFilterArray([])}
      />

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
              {dataList.map((row, index) =>
                !loaderState && row ? (
                  <AddressLocationTableRow
                    key={index}
                    row={row}
                    handleSaddress={saddress}
                    handleDaddress={daddress}
                    rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                  />
                ) : (
                  !isNotFound && <TableSkeleton key={index} sx={{ height: 48 }} />
                )
              )}

              <TableEmptyRows height={48} emptyRows={emptyRows(page, rowsPerPage, total)} />

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
