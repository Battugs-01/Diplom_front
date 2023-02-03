import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Card, Container, Table, TableBody, TableContainer, Typography } from '@mui/material';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { label: '№', align: 'center', width: '30px' },
  { id: 'trip_request_date', label: 'Огноо', align: 'left' },
  { label: 'Хаяг', align: 'left', width: '240px' },
  { label: 'Ж/нэр', align: 'left', width: '160px' },
  { label: 'Ж/утас', align: 'left' },
  { label: 'Х/нэр', align: 'left' },
  { label: 'Х/утас', align: 'left' },
  { label: 'АУД', align: 'left' },
  { id: 'trip_generate_fare', label: 'Төлбөр', align: 'left' },
  { id: 'distance', label: 'Км', align: 'left' },
  { id: 'active', label: 'Төлөв', align: 'left' },
  { label: 'Үйлдэл', align: 'center' },
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
    getTripList();
  }, [page, rowsPerPage, order, orderBy, filterModel, filterName, showSign, distanceSign]);

  // fetching trip list data
  async function getTripList() {
    let fetchTerm = {
      listQuery: {
        search: {
          multi: [
            {
              attribute: 'saddress',
              value: filterModel?.saddress || null,
              option: 'like',
              join: false,
            },
            {
              attribute: 'rd.name',
              value: filterName || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'rd.phone',
              value: filterModel?.rdPhone || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'ru.phone',
              value: filterModel?.ruPhone || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'rd.dv.licence_plate',
              value: filterModel?.licence_plate || null,
              option: 'like',
              join: true,
            },
            {
              attribute: 'trip_generate_fare',
              value: filterModel?.trip_generate_fare || null,
              option: showSign ? 'greater' : 'less',
              join: false,
            },
            {
              attribute: 'distance',
              value: filterModel?.distance || null,
              option: distanceSign ? 'greater' : 'less',
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
    await axiosInstance
      .post('/tripList', fetchTerm)
      .then((response) => {
        setDataList(response?.data?.data?.rows || []);
        setTotal(response?.data?.data?.count || 0);
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
          variant: 'warning',
        });
      });

    setTimeout(() => {
      setLoaderState(false);
    }, 500);
  }

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

  // rendering ----------------------------------------------------------------------------

  return (
    <>
      <Head>
        <title> Аялалын мэдээлэл </title>
      </Head>

      <Container maxWidth={false} sx={{ padding: '10px !important' }}>
        <Typography variant="overline">Аялалын жагсаалт</Typography>

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
