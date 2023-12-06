import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { Card, Table, TableBody, Container, Button, TableContainer, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
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
import { VehicleNewEditDialog } from 'src/sections/@dashboard/vehicle/action';
import { VehicleTableToolbar, VehicleTableRow } from 'src/sections/@dashboard/vehicle/list';
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Stack } from '@mui/system';
// import Button from 'src/theme/overrides/Button';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: 40 },
  { id: 'make', label: 'Mарк', align: 'left' },
  { label: 'Загвар', align: 'left' },
  { label: 'Ж/Нэр', align: 'left' },
  { label: 'Ж/Дугаар', align: 'left' },
  { id: 'colour', label: 'Өнгө', align: 'left' },
  { id: 'status', label: 'Төлөв', align: 'left' },
  { label: 'Үйлдэл', align: 'center' },
];

// ----------------------------------------------------------------------

VehicleListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function VehicleListPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { query, push } = useRouter();

  // taking driver name from query params
  const { list } = query;

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

  // mark list state
  const [markList, setMarkList] = useState([]);

  // company list state
  const [companyList, setCompanyList] = useState([]);

  // table's max height state
  const [maxHeight, setMaxHeight] = useState(0);

  // company list state
  const [driverList, setDriverList] = useState([]);

  // vehicle list state
  const [vehicleTypeList, setVehicleTypeList] = useState([]);

  // whether archive or car archive
  const [buttonStatus, setButtonStatus] = useState(true);

  // current checked row data state
  const [currentRow, setCurrentRow] = useState({});

  // full length of data list
  const [total, setTotal] = useState(0);

  // filter state
  const [filterModel, setFilterModel] = useState({});

  // dialog status state
  const [dialogStatus, setDialogStatus] = useState('');

  // table loader state
  const [loaderState, setLoaderState] = useState(false);

  // checking is not found or found depend on length
  const isNotFound = !dataList.length;

  // handling initial value of driver name if list come through query params
  useEffect(() => {
    if (list !== 'default') {
      setFilterModel({ ...filterModel, driver_name: list });
    } else {
      setFilterModel({});
    }
  }, [list]);

  // handling table max height depend on your computer screen size and calling api's
  useEffect(() => {
    getMarkList();
    getCompanyList();
    getDriverList();
    getVehicleType();
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
    getDriverVehicleList();
    // eslint-disable-next-line
  }, [page, rowsPerPage, order, orderBy, filterModel, buttonStatus]);

  // fetching driver vehicle list
  const getDriverVehicleList = async () => {
    const params = {
      listQuery: {
        search: {
          multi: [
            {
              attribute: 'make.make',
              value: filterModel?.make || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'model.title',
              value: filterModel?.model || null,
              option: 'like',
              join: true,
            },

            {
              attribute: 'driver.name',
              value: filterModel?.driver_name || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'driver.phone',
              value: filterModel?.phone || null,
              option: 'like',
              join: true,
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
    try {
      await axiosInstance
        .post('/driver/vehicle/list', params)
        .then((response) => {
          setDataList(response?.data?.data?.rows || []);
          setTotal(response?.data?.data?.count || 0);
          // console.log(response?.data?.data?.rows, 'driverList');
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
  console.log(driverList, 'asfd');
  console.log(markList, 'markaa');
  console.log(companyList, 'sarkaa');
  // fetching mark list
  const getMarkList = async () => {
    try {
      await axiosInstance
        .get('/make/list')
        .then((response) => {
          setMarkList(response?.data?.data?.rows || []);
          console.log('mar', response?.data?.data?.rows);
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
  };

  // fetching mark list
  const getDriverList = async () => {
    try {
      await axiosInstance
        .get('/driver/list')
        .then((response) => {
          setDriverList(response?.data?.data?.rows || []);
          console.log(response?.data?.data?.rows, 'driver');
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
  };

  // fetching admin list
  const getCompanyList = async () => {
    try {
      await axiosInstance
        .get('/company/list')
        .then((response) => {
          setCompanyList(response?.data?.data?.rows || []);
          console.log(response?.data?.data?.rows, 'compat');
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
  };

  // fetching vehicle type list
  async function getVehicleType() {
    let fetchTerm = {
      type: 'Ride',
    };
    await axiosInstance
      .post('/getVehicleType', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setVehicleTypeList(data);
        console.log('asfdf', data);
      })

      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : 'Алдаатай хүсэлт', {
          variant: 'warning',
        });
      });
  }

  // sending data using post request
  const handleSaveData = async (values) => {
    let action = 'create';
    if (dialogStatus === 'update') {
      action = 'update';
    }
    const body = {
      ...values,
      make_id: values?.make_id?.make_id,
      driver_id: values?.driver_id?.driver_id,
      company_id: values?.company_id?.company_id,
      model_id: values?.model_id?.model_id,
      car_type: String(values?.car_type),
    };
    try {
      await axiosInstance.post(`${action}DriverVehicle`, body).then((response) => {
        if (response?.data?.action === 1) {
          enqueueSnackbar(response?.data?.message ? response?.data?.message : 'Амжилттай.');
          setDialogStatus('');
          getDriverVehicleList();
        } else {
          enqueueSnackbar(response?.data?.message, { variant: 'warning' });
        }
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : 'Алдаа гарлаа.', {
        variant: 'warning',
      });
    }
  };

  // handling delete func
  const handleDeleteRow = async (driver_id, driver_vehicle_id) => {
    await axiosInstance
      .post('/deleteDriverVehicle', { driver_id, driver_vehicle_id })
      .then((response) => {
        enqueueSnackbar(response?.data?.message ? response?.data?.message : 'Амжилттай.');
        setPage(0);
        getDriverVehicleList();
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ? error?.message : `Алдаа гарлаа`, {
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

  // building filter model
  const handlingFilterModel = (name, value) => {
    setFilterModel({ ...filterModel, [name]: value });
  };

  // handling archive list
  const onClickArchive = async () => {
    setButtonStatus(false);
  };

  const onClickVihicle = async () => {
    setButtonStatus(true);
  };

  // clearing filter data and refreshing table once
  const handleClearFilter = () => {
    onSort('');
    setFilterModel({ ...filterModel, make: '', model: '', driver_name: '', phone: '' });
    setPage(0);
    setOrder('desc');
    setOrderBy('driver_id');
    setRowsPerPage(10);
    getDriverVehicleList();
    push(PATH_DASHBOARD.vehicle.list('default'));
  };

  // rendering-------------------------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Тээврийн хэрэгсэл </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="overline">{(!buttonStatus && 'Архивийн жагсаалт') || 'Тээврийн жагсаалт'}</Typography>
          {buttonStatus ? (
            <Button
              variant="contained"
              sx={{ minWidth: 160 }}
              onClick={onClickArchive}
              startIcon={<Iconify icon="fa-solid:file-archive" />}
            >
              Архив
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ maxWidth: 160 }}
              onClick={onClickVihicle}
              startIcon={<Iconify icon="material-symbols:format-list-bulleted-rounded" />}
            >
              Жагсаалт
            </Button>
          )}
        </Stack>

        <Card>
          <VehicleTableToolbar
            filterModel={filterModel}
            setFilterModel={setFilterModel}
            onFilterModel={handlingFilterModel}
            clearFilter={handleClearFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'auto', maxHeight: maxHeight }}>
            <Table size="small" sx={{ minWidth: 1000 }} stickyHeader>
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
                      <VehicleTableRow
                        key={index}
                        row={row}
                        rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                        onDeleteRow={() => handleDeleteRow(row?.driver_id, row?.driver_vehicle_id)}
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
          </TableContainer>

          <TablePaginationCustom
            showFirstButton
            showLastButton
            page={page}
            count={total || 0}
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
        <VehicleNewEditDialog
          dialogStatus={dialogStatus}
          currentRow={currentRow}
          markList={markList}
          companyList={companyList}
          vehicleTypeList={vehicleTypeList}
          driverList={driverList}
          saveData={(values) => handleSaveData(values)}
          changeDialogStatus={(e) => {
            setDialogStatus(e);
          }}
        />
      )}
    </>
  );
}
