import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Card, Container, Table, TableBody, TableContainer, Typography, Grid } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  emptyRows,
  TablePaginationCustom,
  useTable,
  TableSkeleton,
} from 'src/components/table';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// sections
import { TripTableRow, TripTableToolbar } from 'src/sections/@dashboard/trip/list';
import { AnalyticsWidgetSummary } from '../../../sections/@dashboard/general/analytics';
import SvgColor from 'src/components/svg-color/SvgColor';
// ----------------------------------------------------------------------
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  trip: icon('ic_trip'),
  route: icon('ic_route'),
};
const TABLE_HEAD = [
  { label: '№', align: 'center' },
  { label: 'Х/Нэр', align: 'left' },
  { label: 'Х/утас', align: 'left' },
  { id: 'className', label: 'Тасгийн нэр', align: 'left' },
  { id: 'start_time', label: 'Эхлэх Огноо', align: 'left', width: '260px' },
  { id: 'end_time', label: 'Дуусах Огноо', align: 'left', width: '260px' },
  { id: 'active', label: 'Төлөв', align: 'left' },
];

// ----------------------------------------------------------------------

TripListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TripListPage() {
  const { enqueueSnackbar } = useSnackbar();

  // taking driver name from query params
  const { push, query } = useRouter();

  // taking rd name filter initial value from query param
  const { list } = query;

  // use table
  const {
    page,
    order,
    orderBy,
    setOrderBy,
    setOrder,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangePage,
    setRowsPerPage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'trip_id', defaultOrder: 'desc', defaultRowsPerPage: 25 });

  // table data list state
  const [dataList, setDataList] = useState([]);

  // table's max height state
  const [maxHeight, setMaxHeight] = useState(0);

  // full length of data list
  const [total, setTotal] = useState(0);

  // filter model state
  const [filterModel, setFilterModel] = useState({});

  // rd name filter
  const [filterName, setFilterName] = useState('');

  // table loader state
  const [loaderState, setLoaderState] = useState(false);

  // greater or less fare boolean state
  const [showSign, setShowSign] = useState(false);

  // distance greater or less boolean state
  const [distanceSign, setDistanceSign] = useState(false);

  // checking length of data list
  const isNotFound = !dataList.length;

  // handling initial value of driver name if list come through query params
  useEffect(() => {
    if (list !== 'default') {
      setFilterName(list);
    } else {
      setFilterName('');
    }
  }, [list]);

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
    getOrderData();
  }, [page, rowsPerPage, order, orderBy, filterModel, filterName, showSign, distanceSign]);

  // fetching trip list data
  // async function getTripList() {
  //   await axiosInstance
  //     .post('/companyOrder/getOrders', fetchTerm)
  //     .then((response) => {
  //       setDataList(response?.data?.data?.rows || []);
  //       setTotal(response?.data?.data?.count || 0);
  //     })
  //     .catch((error) => {
  //       enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
  //         variant: 'warning',
  //       });
  //     });
  //   setTimeout(() => {
  //     setLoaderState(false);
  //   }, 500);
  // }

  // handling page to trip detail page
  const handleView = async (id) => {
    push(PATH_DASHBOARD.trip.view(id));
  };

  // building filter model
  const handlingFilterModel = (name, value) => {
    setPage(0);
    setFilterModel({ ...filterModel, [name]: value });
  };

  // handling rdName filter
  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // clearing filter data and refreshing table once
  const handleClearFilter = () => {
    onSort('');
    setFilterModel({
      ...filterModel,
      rdName: '',
      rdPhone: '',
      saddress: '',
      licence_plate: '',
      ruPhone: '',
    });
    setPage(0);
    setRowsPerPage(10);
    getTripList();
    setShowSign(false);
    setDistanceSign(false);
    setOrder('desc');
    setOrderBy('trip_id');
    push(PATH_DASHBOARD.trip.list('default'));
  };

  // handling less or greater fare filter input
  const handleLessOrGreaterThan = () => {
    setShowSign((show) => !show);
  };

  // handling less or greater distance filter input
  const handleLessOrGreaterThanDistance = () => {
    setDistanceSign((show) => !show);
  };

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    getOrderData();
    setInterval(async () => {
      getOrderData();
    }, 5000);
  }
  async function getOrderData() {
    await axiosInstance
      .get('/order')
      .then((response) => {
        setDataList(response?.data?.orders || []);
        if (localStorage.getItem('total') < response.data.orders.length) {
          enqueueSnackbar(`Шинэ захиалга ирлээ`, {
            variant: 'success',
          });
          localStorage.setItem('total', response.data.orders.length);
        }
        setTotal(response?.data?.orders?.length || 0);
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
          variant: 'warning',
        });
      });
    setTimeout(() => {
      setLoaderState(false);
    }, 50000);
  }
  // const array = ['pending', 'confirmed', 'delivered', 'disabled', 'returning', 'returned'];
  // array.forEach((element) => {
  //   getOrderData(element);
  // });
  // const confirmed = () => {
  //   console.log('confirmed');
  // };

  // const delivered = () => {
  //   console.log('delivered');
  // };

  // const disabled = () => {
  //   console.log('cancelled');
  // };

  // const returning = () => {
  //   console.log('returning');
  // };

  // const returned = () => {
  //   console.log('returned');
  // };

  // rendering ----------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Захиалгын мэдээлэл </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Typography variant="overline">Захиалгын жагсаалт</Typography>

        {/* <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={2} onClick={() => getOrderData('pending')}>
            <AnalyticsWidgetSummary title="Нүд" color="secondary" icon="ant-design:android-filled" />
          </Grid>

          <Grid item xs={6} sm={6} md={2} onClick={() => getOrderData('confirmed')}>
            <AnalyticsWidgetSummary title="Чих" color="info" icon="ant-design:apple-filled" />
          </Grid>

          <Grid item xs={6} sm={6} md={2} onClick={() => getOrderData('delivered')}>
            <AnalyticsWidgetSummary title="Шүд" color="success" icon="ant-design:windows-filled" />
          </Grid>
        </Grid> */}

        <Card>
          <TripTableToolbar
            filterModel={filterModel}
            setFilterModel={setFilterModel}
            onFilterModel={handlingFilterModel}
            clearFilter={handleClearFilter}
            filterName={filterName}
            onFilterName={handleFilterName}
            setFilterName={setFilterName}
            showSign={showSign}
            onLessOrGreaterThan={handleLessOrGreaterThan}
            distanceSign={distanceSign}
            onLessOrGreaterThanDistance={handleLessOrGreaterThanDistance}
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
                {dataList?.map((row, index) =>
                  !loaderState && row ? (
                    <TripTableRow
                      key={index}
                      row={row}
                      rowQueue={{ index: index, rowsPerPage: rowsPerPage, page: page }}
                      onViewRow={() => handleView(row.trip_id)}
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
    </>
  );
}
