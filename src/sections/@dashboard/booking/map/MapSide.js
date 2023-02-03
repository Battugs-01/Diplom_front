import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// leaflet
import 'leaflet-contextmenu';
import 'leaflet/dist/leaflet.css';
import L, { latLngBounds, useLeaflet } from 'leaflet';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// @mui
import { Button, Stack, Typography } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// utils
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { getAddress, getRouting } from 'src/utils/axiosCustom';
import { KanbanConfirmDialog } from '../../kanban';

// ----------------------------------------------------------------------------------------------------

MapSide.propTypes = {
  handleOnSaddress: PropTypes.func,
  handleOnDaddress: PropTypes.func,
};

const center = ['47.9187', '106.917782'];

// ----------------------------------------------------------------------------------------------------

export default function MapSide({ trip, handleOnSaddress, handleOnDaddress, moving }) {
  const { enqueueSnackbar } = useSnackbar();
  // const [center, setCenter] = useState(['47.9187', '106.917782']);
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState('Available');
  const [passenger_lat, setPasLat] = useState(null);
  const [passenger_lon, setPasLon] = useState(null);
  const [dest_latitude, setDesLat] = useState(null);
  const [dest_longitude, setDesLon] = useState(null);
  const [saddress, setSaddress] = useState('');
  const [daddress, setDaddress] = useState('');
  const markerRefStart = useRef(null);
  const markerRefEnd = useRef(null);
  const [routing, setRouting] = useState([]);
  const [startRoute, setStartRoute] = useState([]);
  const [endRoute, setEndRoute] = useState([]);
  const [travelDistance, setTravelDistance] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [ssid, setSSID] = useState('4kgildp9e1o9n9jqm256fi0snd');
  const [satellite, setSatellite] = useState(false);
  const [job, setJob] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverId, setDriverId] = useState(0);
  const [driverLatitude, setDriverLatitude] = useState(null);
  const [driverLongitude, setDriverLongitude] = useState(null);
  const [bounds, setBounds] = useState([]);
  const [centerLongLat, setCenterLongLat] = useState([]);

  useEffect(() => {
    getPositions();
  }, [trip]);

  useEffect(() => {
    getRoutings();
    setCenter();
  }, [dest_latitude, passenger_lat]);

  const carIcons = {
    Available: '/assets/map/car_green.png',
    Active: '/assets/map/car_blue.png',
    Arrived: '/assets/map/car_yellow.png',
    On_Going_Trip: '/assets/map/car_red.png',
    Not_Available: '/assets/map/car_gray.png',
    Red: '/assets/map/point_red.png',
    Gray: '/assets/map/point_gray.png',
  };

  const getIcon = (status) => {
    if (status === 'Available') {
      return carIcons?.Available || '/assets/map/point_red.png';
    } else if (status === 'Active') {
      return carIcons?.Active || '/assets/map/point_red.png';
    } else if (status === 'Arrived') {
      return carIcons?.Arrived || '/assets/map/point_red.png';
    } else if (status === 'On Going Trip') {
      return carIcons?.On_Going_Trip || '/assets/map/point_red.png';
    } else if (status === 'Not Available') {
      return carIcons?.Not_Available || '/assets/map/point_red.png';
    } else if (status === 'Red') {
      return carIcons?.Red || '/assets/map/point_red.png';
    } else if (status === 'Gray') {
      return carIcons?.Gray || '/assets/map/point_red.png';
    } else {
      return '/assets/map/point_red.png';
    }
  };
  const Icons = (status) =>
    L.icon({
      iconUrl: getIcon(status),
      iconSize: [20, 30],
      iconAnchor: [13, 37],
      popupAnchor: [0, 0],
    });

  const getPositions = () => {
    setMarkers(trip?.markers || []);
    setStatus(trip?.status || 'Available');
    setSSID(trip?.ssid || '4kgildp9e1o9n9jqm256fi0snd');
    setPasLat(trip?.passenger_lat);
    setPasLon(trip?.passenger_lon);
    setDesLat(trip?.dest_latitude);
    setDesLon(trip?.dest_longitude);
    if (trip?.passenger_lat === null && trip?.dest_latitude === null) {
      setRouting([]);
      setEndRoute([]);
      setStartRoute([]);
    }
  };

  const markStartPos = async (latlng) => {
    const { lat, lng } = latlng;
    setPasLat(lat);
    setPasLon(lng);
    const text = await getAddress(latlng, 'dest_address');
    setSaddress(text);
    handleOnSaddress(text, lat, lng);
  };

  const markEndPos = async (latlng) => {
    const { lat, lng } = latlng;
    setDesLat(lat);
    setDesLon(lng);
    const text = await getAddress(latlng, 'dest_address');
    setDaddress(text);
    handleOnDaddress(text, lat, lng);
  };

  const handleReset = () => {
    setPasLat(null);
    setPasLon(null);
    setDesLat(null);
    setDesLon(null);
    setSaddress('');
    setDaddress('');
    handleOnSaddress('', null, null);
    handleOnDaddress('', null, null);
  };

  const eventHandlersStartPos = useMemo(
    () => ({
      dragend() {
        moving(true);
        const marker = markerRefStart.current;
        if (marker != null) {
          // setPosition(marker.getLatLng());
          setPasLat(marker.getLatLng().lat);
          setPasLon(marker.getLatLng().lng);
          markStartPos(marker.getLatLng());
        }
      },
      mouseover() {
        moving(true);
      },
      mouseout() {
        moving(false);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const eventHandlersEndPos = useMemo(
    () => ({
      dragend() {
        const marker = markerRefEnd.current;
        if (marker != null) {
          setDesLat(marker.getLatLng().lat);
          setDesLon(marker.getLatLng().lng);
          markEndPos(marker.getLatLng());
        }
      },
      mouseover() {
        moving(true);
      },
      mouseout() {
        moving(false);
      },
    }),
    []
  );

  async function getRoutings() {
    if (
      passenger_lat === null ||
      dest_latitude === null ||
      (passenger_lat === dest_latitude && passenger_lon === dest_longitude)
    )
      return;

    try {
      let fetchTerm = {
        CMD: 'SELECT',
        START_X: passenger_lon,
        START_Y: passenger_lat,
        GOAL_X: dest_longitude,
        GOAL_Y: dest_latitude,
      };
      const res = await getRouting(fetchTerm);
      const { dist_m: distance, time_m: time, route } = JSON.parse(res.route);
      const [{ section }] = route.sort((x, y) => y.section.length - x.section.length);
      if (section) {
        const Routing = section
          .map((item) => item.link)
          .flat()
          .map((point) => [point.lat, point.lon]);

        setRouting(Routing);
        setStartRoute([[passenger_lat, passenger_lon], Routing[Routing.length - 1]]);
        setEndRoute([[dest_latitude, dest_longitude], Routing[0]]);
        setTravelDistance(distance);
        setTravelTime(time);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleClick = () => {
    if (satellite) {
      setSatellite(false);
    } else {
      setSatellite(true);
    }
  };

  const onCloseConfirm = () => {
    setJob(false);
  };

  async function turnOffDriver() {
    let fetchTerm = {
      driver_id: driverId,
      status_driver: 'Not Available',
      is_update_online_date: 'true',
      latitude: driverLatitude,
      longitude: driverLongitude,
      device_token: '',
    };

    const res = await axiosInstance.post('/updateDriverStatus', fetchTerm);
    const { action, message } = res.data;

    if (action === 1) {
      enqueueSnackbar(message ? message : 'Алдаатай хүсэлт', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(message ? message : 'Алдаатай хүсэлт', {
        variant: 'warning',
      });
    }
    setJob(false);
  }

  const setCenter = async () => {
    const data = await centerFunc();
    setCenterLongLat(data);
  };

  // async function getBounds() {
  //   const boundsArr = (await Array.isArray(routing)) && routing.length && latLngBounds(routing);
  //   const returnArr = [],
  //     northEast = [],
  //     southWest = [];
  //   northEast.push(boundsArr?._northEast?.lat);
  //   northEast.push(boundsArr?._northEast?.lng);
  //   southWest.push(boundsArr?._southWest?.lat);
  //   southWest.push(boundsArr?._southWest?.lng);
  //   returnArr.push(northEast);
  //   returnArr.push(southWest);
  //   return returnArr;
  // }

  // console.log(startRoute, 'startRoute');

  const centerFunc = () => {
    if (passenger_lat !== null && passenger_lon !== null) {
      const arr = [];
      arr.push(passenger_lat);
      arr.push(passenger_lon);
      return arr;
    }
    if (dest_latitude !== null && dest_longitude !== null) {
      const arr = [];
      arr.push(dest_latitude);
      arr.push(dest_longitude);
      return arr;
    }
  };

  return (
    <>
      <button
        style={{
          position: 'absolute',
          marginTop: 75,
          marginLeft: 10,
          zIndex: 1000,
          backgroundColor: '#FFFFFF',
          borderRadius: 0,
          width: 32,
          height: 30,
          borderRadius: 5,
          borderColor: '#DCDCDC',
        }}
        onClick={handleClick}
      >
        {satellite ? (
          <Iconify icon="ic:twotone-map" width={20} height={20} color={'black'} />
        ) : (
          <Iconify icon="gis:map-extent" width={20} height={20} color={'black'} />
        )}
      </button>
      <MapContainer
        style={{ height: '55vh', width: '100wh' }}
        center={centerLongLat?.length > 0 ? centerLongLat : center}
        zoom={14}
        minZoom={5}
        maxZoom={28}
        // bounds={[
        //   [50.505, -29.09],
        //   [52.505, 29.09],
        // ]}
        // maxBounds={[
        //   [50.505, -29.09],
        //   [52.505, 29.09],
        // ]}
        scrollWheelZoom={true}
        contextmenuWidth={130}
        contextmenu={true}
        attributionControl={false}
        contextmenuItems={[
          {
            text: 'Авах цэг',
            callback: ({ latlng }) => markStartPos(latlng),
          },
          {
            text: 'Очих цэг',
            callback: ({ latlng }) => markEndPos(latlng),
          },
          {
            text: 'Цэвэрлэх',
            callback: () => handleReset(),
          },
        ]}
      >
        {satellite === true && (
          <TileLayer
            attribution={'&copy; <a href="https://imap.mn/#16/47.9187/106.9178">Imap</a> 1950'}
            url={`https://cloudgis.mn/map/v1/tilemap/aerial/{z}/{x}/{y}?ssid=${ssid}`}
          />
        )}

        {satellite === false && (
          <TileLayer
            attribution={'&copy; <a href="https://imap.mn/#16/47.9187/106.9178">Imap</a> 1950'}
            url={`https://cloudgis.mn/map/v1/tilemap/std/{z}/{x}/{y}?ssid=${ssid}`}
          />
        )}

        {markers.map((marker) => (
          <Marker key={marker?.driver_id} position={[marker?.latitude, marker?.longitude]} icon={Icons(status)}>
            <Popup>
              <Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Ж/Код :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.driver_id || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Ж/Нэр :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.name || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Ж/Утас :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.phone || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    АУД :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.dv?.licence_plate || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Авах хаяг :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.trips?.[0]?.saddress || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Очих хаяг :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.trips?.[0]?.daddress || ' -- '}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start">
                  <Typography variant="subtitle3" noWrap>
                    Х/Утас :&nbsp;&nbsp;
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {marker?.trips?.[0]?.ru?.phone || ' -- '}
                  </Typography>
                </Stack>

                {marker?.availability === 'Available' && (
                  <Button
                    onClick={() => {
                      setDriverId(marker?.driver_id);
                      setDriverName(marker?.name);
                      setDriverLatitude(marker?.latitude || null);
                      setDriverLongitude(marker?.longitude || null);
                      setJob(true);
                    }}
                  >
                    Ажлаас буулгах
                  </Button>
                )}
              </Stack>
            </Popup>
          </Marker>
        ))}
        <Polyline color="gray" positions={startRoute} dashArray={(2, 6)} lineCap="square" />
        <Polyline color="red" positions={routing}>
          <Popup>
            Зам:{travelDistance}м <br /> Хугацаа:{travelTime}'
          </Popup>
        </Polyline>
        <Polyline color="gray" positions={endRoute} dashArray={(2, 6)} lineCap="square" />

        {passenger_lat !== null && passenger_lon !== null ? (
          <Marker
            position={[passenger_lat, passenger_lon]}
            icon={Icons('Red')}
            draggable="true"
            eventHandlers={eventHandlersStartPos}
            ref={markerRefStart}
          >
            <Popup>{saddress}</Popup>
          </Marker>
        ) : (
          <></>
        )}

        {dest_latitude !== null && dest_longitude !== null ? (
          <Marker
            position={[dest_latitude, dest_longitude]}
            icon={Icons('Gray')}
            draggable="true"
            eventHandlers={eventHandlersEndPos}
            ref={markerRefEnd}
          >
            <Popup>{daddress}</Popup>
          </Marker>
        ) : (
          <></>
        )}
      </MapContainer>
      {job === true && (
        <KanbanConfirmDialog
          open={job}
          onClose={onCloseConfirm}
          title={
            <Typography>
              <strong>{driverName}</strong>-ийг ажлаас буулгах уу?
            </Typography>
          }
          actions={
            <>
              <Button variant="outlined" color="inherit" onClick={onCloseConfirm}>
                Болих
              </Button>
              <Button variant="contained" color="error" onClick={turnOffDriver}>
                Тийм
              </Button>
            </>
          }
        />
      )}
    </>
  );
}
