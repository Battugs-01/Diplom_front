import React, { useEffect, useState } from 'react';
// leaflet
import 'leaflet/dist/leaflet.css';
import L, { latLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// componentss
import LoadingScreen from 'src/components/loading-screen';
// utils
import { connectMap } from 'src/utils/axiosCustom';

// -----------------------------------------------------------------------------

const center = ['47.9187', '106.917782'];

let ssid;

// -----------------------------------------------------------------------------

export default function IndexMap({ trip }) {
  const [positions, setPositions] = useState([]);
  const [startPoint, setStartPoint] = useState(['47.9187', '106.917782']);
  const [endPoint, setEndPoint] = useState(['47.9187', '106.917782']);
  const [bounds, setBounds] = useState([]);
  const [saddress, setSaddress] = useState('');
  const [daddress, setDaddress] = useState('');

  useEffect(() => {
    getPositions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBouns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  const setBouns = async () => {
    const data = await getBounds();
    if (data?.[0]?.[0]) {
      setBounds(data);
    }
    ssid = await connectMap();
  };

  const start_icon = L.icon({
    iconUrl: '/assets/map/point_red.png',
    iconSize: [26, 40],
    iconAnchor: [13, 37],
    popupAnchor: [0, 0],
  });

  const end_icon = L.icon({
    iconUrl: '/assets/map/point_gray.png',
    iconSize: [26, 40],
    iconAnchor: [13, 37],
    popupAnchor: [0, 0],
  });

  async function getPositions() {
    // eslint-disable-next-line react/prop-types
    if (trip?.route.length > 0) {
      // eslint-disable-next-line react/prop-types
      setPositions(trip?.route || []);
      // eslint-disable-next-line react/prop-types
      setStartPoint(trip?.route?.[0] || []);
      // eslint-disable-next-line react/prop-types
      setEndPoint(trip?.route?.[trip?.route.length - 1] || []);
      // eslint-disable-next-line react/prop-types
      setSaddress(trip?.saddress || '');
      // eslint-disable-next-line react/prop-types
      setDaddress(trip?.daddress || '');
    }
  }

  async function getBounds() {
    const boundsArr = (await Array.isArray(positions)) && positions.length && latLngBounds(positions);
    const returnArr = [],
      northEast = [],
      southWest = [];
    northEast.push(boundsArr?._northEast?.lat);
    northEast.push(boundsArr?._northEast?.lng);
    southWest.push(boundsArr?._southWest?.lat);
    southWest.push(boundsArr?._southWest?.lng);
    returnArr.push(northEast);
    returnArr.push(southWest);
    return returnArr;
  }

  return (
    <>
      {bounds?.length > 0 ? (
        <MapContainer
          style={{ height: '50vh', width: '100wh' }}
          center={center}
          // zoom={14}
          minZoom={5}
          maxZoom={28}
          scrollWheelZoom={true}
          bounds={bounds}
          maxBounds={bounds}
          attributionControl={false}
        >
          <TileLayer
            attribution={'&copy; <a href="https://imap.mn/#16/47.9187/106.9178">Imap</a> 1950'}
            url={`https://cloudgis.mn/map/v1/tilemap/std/{z}/{x}/{y}?ssid=${ssid}`}
          />
          <Marker position={startPoint} icon={start_icon}>
            <Popup>{saddress ? saddress : 'Авах хаяг оруулаагүй'}.</Popup>
          </Marker>
          <Polyline color="red" positions={positions} />
          <Marker position={endPoint} icon={end_icon}>
            <Popup>{daddress ? daddress : 'Очих хаяг оруулаагүй'}.</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

// https://www.cloudgis.mn/map/v1/init/pc?mskey=T-002-0002-B01
