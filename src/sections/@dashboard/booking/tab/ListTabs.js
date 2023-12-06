import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';
// @mui
import { Card, Tabs, Tab, Box } from '@mui/material';
// hooks
import useTabs from 'src/hooks/useTabs';
//components
import Iconify from 'src/components/iconify';
// utils
import axiosInstance from 'src/utils/axios';
// sections
import {
  DriverInfoList,
  NearestCabsList,
  OnGoingTripList,
  AddressLocationList,
  LaterBookingList,
  CanceledTripList,
  CanceledBookingList,
} from './lists';

//-------------------------------------------------------------------------------------

ListTabs.propTypes = {
  handleOnSetDaddress: PropTypes.func,
  handleOnSetSaddress: PropTypes.func,
  handleChangeLaterBooking: PropTypes.func,
  phoneNumber: PropTypes.number,
  passenger_lat_lon: PropTypes.object,
};

//-------------------------------------------------------------------------------------

export default function ListTabs({
  handleOnSetDaddress,
  handleOnSetSaddress,
  handleChangeLaterBooking,
  phoneNumber,
  passenger_lat_lon,
}) {
  const scrollRef = useRef(null);

  // use tabs
  const { currentTab, onChangeTab } = useTabs('driverInfoList');

  // previous trips list state
  const [tripByPhoneList, setTripByPhoneList] = useState([]);

  // use effect
  useEffect(() => {
    window.addEventListener('keydown', keyListener);
  }, []);

  // use effect
  useEffect(() => {
    if (phoneNumber?.length === 8) {
      getTripByPhoneList(phoneNumber);
      onChangeTab('', 'driverInfoList');
      scrollToDriverTab(scrollRef);
    }
  }, [phoneNumber]);

  // use effect
  useEffect(() => {
    if (passenger_lat_lon?.lat !== null && passenger_lat_lon?.lon !== null) {
      onChangeTab('', 'nearestCabsList');
    }
  }, [passenger_lat_lon]);

  const scrollToDriverTab = (ref) => {
    scroll.scrollTo(ref.current.offsetTop - window.innerHeight / 4, {
      duration: 1000,
      delay: 100,
      smooth: true,
    });
  };

  // changing tab section depend on keyboard key
  async function keyListener(e) {
    switch (e.keyCode) {
      // F5
      case e.ctrlKey && 116:
        e.preventDefault();
        onChangeTab(e, 'canceledBookingList');
        return;
      // F6
      case 117:
        e.preventDefault();
        onChangeTab(e, 'addressLocationList');
        return;
      // F7
      case 118:
        e.preventDefault();
        onChangeTab(e, 'canceledTripList');
        return;
      // F8
      case 119:
        e.preventDefault();
        onChangeTab(e, 'laterBookingList');
        return;
      // F9
      case 120:
        e.preventDefault();
        onChangeTab(e, 'onGoingTripList');
        return;
      // F10
      case 121:
        e.preventDefault();
        onChangeTab(e, 'nearestCabsList');
        return;
    }
  }

  async function getTripByPhoneList(phoneNumber) {
    let fetchTerm = {
      listQuery: {
        phone: phoneNumber,
        search: { value: '' },
        limit: 40,
        currentPage: 1,
        sort: { prop: 'saddress', order: 'desc' },
      },
    };
    await axiosInstance
      .post('/findLocationTripByPhone', fetchTerm)
      .then((res) => {
        let data = res?.data?.data || [];
        setTripByPhoneList(data?.rows || []);
        if (data?.rows.length > 0) {
          onChangeTab('', 'addressLocationList');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // profile tabs list
  const PROFILE_TABS = [
    {
      value: 'driverInfoList',
      icon: <Iconify icon={'bi:person-lines-fill'} width={20} height={20} />,
      component: <DriverInfoList />,
      label: 'Жолоочийн мэдээлэл',
    },
    {
      value: 'nearestCabsList',
      icon: <Iconify icon={'icon-park-outline:taxi'} width={20} height={20} />,
      component: <NearestCabsList passenger_lat_lon={passenger_lat_lon} />,
      label: 'Ойрхон машинууд F10',
    },
    {
      value: 'onGoingTripList',
      icon: <Iconify icon={'bx:trip'} width={20} height={20} />,
      component: <OnGoingTripList />,
      label: 'Гүйцэтгэж буй захиалга F9',
    },
    {
      value: 'addressLocationList',
      icon: <Iconify icon={'ep:map-location'} width={20} height={20} />,
      component: (
        <AddressLocationList
          saddress={handleOnSetSaddress}
          daddress={handleOnSetDaddress}
          tripByPhoneList={tripByPhoneList}
        />
      ),
      label: 'Байршил F6',
    },
    {
      value: 'laterBookingList',
      icon: <Iconify icon={'ic:outline-watch-later'} width={20} height={20} />,
      component: <LaterBookingList change={handleChangeLaterBooking} />,
      label: 'Урьдчилсан захиалга F8',
    },
    {
      value: 'canceledTripList',
      icon: <Iconify icon={'flat-color-icons:end-call'} width={20} height={20} />,
      component: <CanceledTripList />,
      label: 'Цуцалсан дуудлага F7',
    },
    {
      value: 'canceledBookingList',
      icon: <Iconify icon={'material-symbols:cancel-outline-rounded'} width={20} height={20} />,
      component: <CanceledBookingList />,
      label: 'Цуцалсан захиалга CTRL+F5',
    },
  ];

  // rendering-------------------------------------------------------------------------------------------------------

  return (
    <div ref={scrollRef}>
      <Card>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          sx={{ bgcolor: 'background.neutral', pl: 2 }}
        >
          {PROFILE_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
              sx={{ fontSize: 12 }}
            />
          ))}
        </Tabs>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Card>
    </div>
  );
}
