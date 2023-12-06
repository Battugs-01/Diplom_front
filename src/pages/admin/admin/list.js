import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Typography, Stack } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSnackbar } from '../../../components/snackbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// utils
import axiosInstance from '../../../utils/axios';
// sections
import { AdminNewEditDialog } from 'src/sections/@dashboard/admin/action';
import { AdminTableRow, AdminTableToolbar } from 'src/sections/@dashboard/admin/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { label: 'Нэр', align: 'left' },
  { id: 'group_id', label: 'Эрх', align: 'left' },
  { label: 'Цахим шуудан', align: 'left' },
  { id: 'phone', label: 'Утас', align: 'left' },
  { label: 'Үйлдэл', align: 'center' },
];

// ----------------------------------------------------------------------

AdminListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
export default function AdminListPage() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    page,
    setPage,
    order,
    orderBy,
    rowsPerPage,
    setRowsPerPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'admin_id', defaultOrder: 'desc' });

  // table data list state
  const [dataList, setDataList] = useState([]);

  // current checked row data state
  const [currentRow, setCurrentRow] = useState({});

  // full length of data list
  const [total, setTotal] = useState(0);

  // filter state
  const [filterName, setFilterName] = useState('');

  // dialog status state
  const [dialogStatus, setDialogStatus] = useState('');

  // table loader state
  const [loaderState, setLoaderState] = useState(false);

  // checking is not found or found depend on length
  const isNotFound = !dataList.length;

  useEffect(() => {
    getAdminList();
    // eslint-disable-next-line
  }, [page, rowsPerPage, order, orderBy, filterName]);

  // fetching admin list
  const getAdminList = async () => {
    const params = {
      listQuery: {
        search: { value: filterName },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: {
          prop: orderBy,
          order: order === 'asc' ? 'ascending' : 'descending',
        },
      },
    };
    setLoaderState(true);
    try {
      await axiosInstance
        .get('/user?role=super_admin&role=admin')
        .then((response) => {
          setDataList(response?.data?.data || []);
          setTotal(response?.data?.data?.count || 0);
          console.log(response, 'ressss');
        })
        .catch((error) => {
          enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
            variant: 'warning',
          });
        });
    } catch (error) {
      enqueueSnackbar('Алдаа гарлаа', { variant: 'error' });
      console.error(error);
    }
    setTimeout(() => {
      setLoaderState(false);
    }, 500);
  };
  console.log(dataList, 'dataList');
  // sending data using post request
  const handleSaveData = async (values) => {
    let action = 'user';
    if (dialogStatus === 'update') {
      action = 'update';
    }
    try {
      await axiosInstance.post(`/${action}`, values).then((response) => {
        enqueueSnackbar(response?.data?.message ? response?.data?.message : 'Амжилттай.');
        setDialogStatus('');
        getAdminList();
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  };

  // handling delete func
  const handleDeleteRow = async (id) => {
    await axiosInstance
      .post('/admin/del', { id })
      .then((response) => {
        enqueueSnackbar(response?.data?.message ? response?.data?.message : 'Амжилттай.');
        setPage(0);
        getAdminList();
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
          variant: 'warning',
        });
      });
  };

  // handling create func
  const handleCreate = async () => {
    setDialogStatus('create');
    setCurrentRow({});
  };

  // handling update func
  const handleUpdate = async (row) => {
    setDialogStatus('update');
    setCurrentRow(row);
  };

  // handling view func
  const handleView = async (row) => {
    setDialogStatus('view');
    setCurrentRow(row);
  };

  // handling filter name
  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // clearing filter data and refreshing table once
  const handleClearFilter = () => {
    onSort('');
    setFilterName('');
    setPage(0);
    setRowsPerPage(10);
    getAdminList();
  };

  // rendering-------------------------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title>Админ мэдээлэл </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="overline">Админы жагсаалт</Typography>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleCreate()}>
            Нэмэх
          </Button>
        </Stack>

        <Card>
          <AdminTableToolbar
            filterName={filterName}
            setFilterName={setFilterName}
            onFilterName={handleFilterName}
            clearFilter={handleClearFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 1000 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={total}
                  onSort={onSort}
                />
                <TableBody>
                  {dataList &&
                    dataList.map((row, index) =>
                      !loaderState && row ? (
                        <AdminTableRow
                          key={index}
                          row={row}
                          rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleUpdate(row)}
                          onViewRow={() => handleView(row)}
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
        </Card>
      </Container>
      {(dialogStatus === 'create' || dialogStatus === 'update' || dialogStatus === 'view') && (
        <AdminNewEditDialog
          dialogStatus={dialogStatus}
          currentRow={currentRow}
          saveData={(values) => handleSaveData(values)}
          changeDialogStatus={(e) => {
            setDialogStatus(e);
          }}
        />
      )}
    </>
  );
}
