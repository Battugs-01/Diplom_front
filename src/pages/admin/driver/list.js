import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Stack, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { DriverNewEditDialog } from 'src/sections/@dashboard/driver/list/action';
import Iconify from '../../../components/iconify';
import { TableSkeleton } from '../../../components/table';
import { useSnackbar } from '../../../components/snackbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// utils
import axiosInstance from '../../../utils/axios';
// sections
import { DriverTableRow, DriverTableToolbar } from 'src/sections/@dashboard/driver/list';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';

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

DriversListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function DriversListPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { push } = useRouter();

  const {
    page,
    setPage,
    order,
    orderBy,
    setOrder,
    setOrderBy,
    rowsPerPage,
    setRowsPerPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'driver_id', defaultOrder: 'desc', defaultRowsPerPage: 25 });

  // table data list state
  const [dataList, setDataList] = useState([]);

  // full length of data list
  const [listLength, setListLength] = useState(0);
  const [dialogStatus, setDialogStatus] = useState('');
  const [currentRow, setCurrentRow] = useState({});
  // table's max height state
  const [maxHeight, setMaxHeight] = useState(0);

  // filter state
  const [filterModel, setFilterModel] = useState({});

  // table loader state
  const [loaderState, setLoaderState] = useState(false);

  // whether archive or driver button
  const [buttonStatus, setButtonStatus] = useState(true);

  // switch car count's filter mode less or greater state
  const [showCarCountSign, setCarCountSign] = useState(false);

  // switch balance's filter mode less or greater state
  const [showBalanceSign, setShowBalanceSign] = useState(false);

  // checking is not found or found depend on length
  const isNotFound = !dataList.length;

  // handling table max height depend on your computer screen size
  useEffect(() => {
    function handleResize() {
      setMaxHeight(window.innerHeight - 450);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getDriversList();
    // eslint-disable-next-line
  }, [page, rowsPerPage, order, orderBy, filterModel, buttonStatus, showBalanceSign, showCarCountSign]);

  // fetching admin list
  const getDriversList = async () => {
    const params = {
      listQuery: {
        search: {
          multi: [
            {
              attribute: 'name',
              value: filterModel?.name || null,
              option: 'like',
              join: false,
            },
            {
              attribute: 'phone',
              value: filterModel?.phone || null,
              option: 'like',
              join: false,
            },
            {
              attribute: 'car_count',
              value: filterModel?.car_count || null,
              option: showCarCountSign ? 'greater' : 'less',
              join: false,
            },
            {
              attribute: 'licence_plate',
              value: filterModel?.licence_plate || null,
              option: 'like',
              join: false,
            },
            {
              attribute: 'account_number',
              value: filterModel?.account_number || null,
              option: 'like',
              join: false,
            },
            {
              attribute: 'balance',
              value: filterModel?.balance || null,
              option: showBalanceSign ? 'greater' : 'less',
              join: false,
            },
          ],
        },
        limit: rowsPerPage,
        currentPage: page + 1,
        sort: {
          prop: orderBy,
          order: order === 'asc' ? 'ascending' : 'descending',
        },
      },
    };
    setLoaderState(true);
    let fetchUrl = 'user';
    if (!buttonStatus) {
      fetchUrl = 'deletedDriverList';
    }
    try {
      await axiosInstance
        .get(`/${fetchUrl}?role=driver`)
        .then((response) => {
          setDataList(response?.data?.data || []);
          setListLength(response?.data?.count || 0);
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

  const handleCreate = async () => {
    setDialogStatus('create');
    setCurrentRow({});
  };
  // handling driver vehicle filter to vehicle list page
  const handleFilterQueryVehicle = async (name) => {
    push(PATH_DASHBOARD.vehicle.list(name || 'default'));
  };

  // handling driver vehicle filter to vehicle list page
  const handleFilterQueryTrip = async (name) => {
    push(PATH_DASHBOARD.trip.list(name || 'default'));
  };

  // building filter model
  const handlingFilterModel = (name, value) => {
    setFilterModel({ ...filterModel, [name]: value });
  };

  // handling less or greater car count filter input
  const handleLessOrGreaterThanCarCount = () => {
    setCarCountSign((show) => !show);
  };

  const handleUpdate = async (row) => {
    setDialogStatus('update');
    setCurrentRow(row);
  };

  // handling view func
  const handleView = async (row) => {
    setDialogStatus('view');
    setCurrentRow(row);
  };
  // handling less or greater balance filter input
  const handleLessOrGreaterThanBalance = () => {
    setShowBalanceSign((show) => !show);
  };

  // clearing filter data and refreshing table once
  const handleClearFilter = () => {
    onSort('');
    setFilterModel({
      ...filterModel,
      name: '',
      phone: '',
      car_count: '',
      licence_plate: '',
      account_number: '',
      balance: '',
    });
    setOrder('desc');
    setOrderBy('driver_id');
    setPage(0);
    setRowsPerPage(10);
    getDriversList();
  };

  // console.log(row, '');
  // rendering-------------------------------------------------------------------------------------------
  return (
    <>
      <Head>
        <title> Жолоочийн жагсаалт </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="overline">{(!buttonStatus && 'Архивийн жагсаалт') || 'Жолоочийн жагсаалт'}</Typography>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleCreate()}>
            Нэмэх
          </Button>
        </Stack>

        <Card>
          <DriverTableToolbar
            filterModel={filterModel}
            setFilterModel={setFilterModel}
            onFilterModel={handlingFilterModel}
            clearFilter={handleClearFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'auto', maxHeight: maxHeight }}>
            <Table size="small" sx={{ minWidth: 1200 }} stickyHeader>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={listLength}
                onSort={onSort}
              />

              <TableBody>
                {dataList &&
                  dataList.map((row, index) =>
                    !loaderState && row ? (
                      <DriverTableRow
                        key={index}
                        row={row}
                        rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                        refresh={() => getDriversList()}
                        handleUpdate={() => handleUpdate(row)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleUpdate(row)}
                        onViewRow={() => handleView(row)}
                        handleFilterQueryTrip={() => handleFilterQueryTrip(row?.name)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: 48 }} />
                    )
                  )}

                <TableEmptyRows height={48} emptyRows={emptyRows(page, rowsPerPage, listLength)} />
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>

          <TablePaginationCustom
            showFirstButton
            showLastButton
            page={page}
            count={listLength || 0}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onRowsPerPageChange={onChangeRowsPerPage}
            labelRowsPerPage={'Хуудсанд:'}
            labelDisplayedRows={({ from, to, count }) => from + '-с ' + to + ' хүртэлх. ' + 'Нийт: ' + count}
          />
        </Card>
      </Container>
      {(dialogStatus === 'create' || dialogStatus === 'update' || dialogStatus === 'view') && (
        <DriverNewEditDialog
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
