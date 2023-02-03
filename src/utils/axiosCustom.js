/* eslint-disable no-return-await */
import axiosInstance from './axios';
// const toQueryString = (obj) =>
//   "?".concat(
//     Object.keys(obj)
//       .map((e) => ${encodeURIComponent(e)}=${encodeURIComponent(obj[e])})
//       .join("&")
//   );
import axios from 'axios';
const MSKEY = 'T-002-0002-B01';
const MAP_URL = 'https://cloudgis.mn';
// const SSID = '4kgildp9e1o9n9jqm256fi0snd';

// const switchMethod = async (url, body, method) => {
//   switch (method) {
//     case "getMethod":
//       return getMethod(url + toQueryString(body));
//     case "postMethod":
//       return postMethod(url, body);
//     case "putMethod":
//       return putMethod(url, body);
//     case "noToken":
//       return getMethodNoToken(url + toQueryString(body));
//     default:
//       return deleteMethod(url, body);
//   }
// };

const postMethod = async (url, body) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL;
  return await axiosInstance.post(url, body);
};

const getMethod = async (url) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL;

  return await axiosInstance.get(url);
};

const postMethodChangePassword = async (url, body) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL_APP;

  return await axiosInstance.post(url, body);
};

const putMethod = async (url, body) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL;

  return await axiosInstance.put(url, body);
};

const deleteMethod = async (url, body) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL;

  return await axiosInstance.delete(url, body);
};

const getMethodNoToken = async (url) => {
  axiosInstance.defaults.baseURL = process.env.BASE_URL;
  return await axios.get(`${process.env.BASE_URL}/${url}`);
  // return await axiosInstance.get(url);
};

const postFetch = async (url, data = {}) => {
  const formData = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  const response = await axios.post(MAP_URL + url, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

const connectMap = async () => postFetch(`/map/v1/init/pc?mskey=${MSKEY}`);

const getText = (texts) =>
  Object.values(texts)
    .filter((text) => text)
    .join(', ');

// eslint-disable-next-line no-unused-vars
const getAddress = async (latlng, propertyName) => {
  const data = {
    X: latlng.lng,
    Y: latlng.lat,
    RANGE: 10,
  };
  const { ssid } = await connectMap();
  return postFetch(`/map/v1/poi/searchPoaXY?ssid=${ssid}`, data).then(
    ({ t_poi_data, t_region_data, t_streetname_data, t_poi_nomark_data }) => {
      if (t_poi_data) {
        const { poi_title, poi_code3_name } = t_poi_data;
        return poi_title + ' (' + poi_code3_name + ')';
      }
      if (t_poi_nomark_data) {
        const { address, name } = t_poi_nomark_data;
        return getText({ address, name });
      }
      if (t_region_data) {
        const { sum, horoo_bag, street, number, build_name } = t_region_data;
        return getText({ sum, horoo_bag, street, number, build_name });
      }
      if (t_streetname_data) {
        return t_streetname_data.name;
      }
      return '';
    }
  );
};

const searchAdress = async (search) => {
  const data = {
    LLX: 107.631427,
    LLY: 47.597303,
    URX: 106.344962,
    URY: 48.261013,
    NAME: search,
    CODE: '000000000000',
  };
  const { ssid } = await connectMap();

  return postFetch(`/map/v1/poi/searchPoaName2?ssid=${ssid}`, data).then(
    ({ t_poi_data, t_poi_nomark_data, t_region_data, t_streetname_data, info, stat }) => {
      let results = [];
      var i = 0;
      if (t_poi_data)
        t_poi_data.forEach(({ poi_title, poi_code3_name, poi_lat, poi_lon }) => {
          const label = poi_title + ' (' + poi_code3_name + ')';
          results.push({
            value: JSON.stringify({ latlng: { lat: poi_lat, lng: poi_lon }, value: label }),
            label: label,
            id: ++i,
            action: stat,
            message: info,
          });
        });
      if (t_poi_nomark_data)
        t_poi_nomark_data.forEach(({ address, name, lat, lon }) => {
          const label = getText({ address, name });
          results.push({
            value: JSON.stringify({ latlng: { lat: lat, lng: lon }, value: label }),
            label: label,
            id: ++i,
            action: stat,
            message: info,
          });
        });
      if (t_region_data)
        t_region_data.forEach(({ sum, horoo_bag, street, number, build_name, lat, lon }) => {
          const label = getText({ sum, horoo_bag, street, build_name, number });
          results.push({
            value: JSON.stringify({ latlng: { lat: lat, lng: lon }, value: label }),
            label: label,
            id: ++i,
            action: stat,
            message: info,
          });
        });
      if (t_streetname_data)
        t_streetname_data.forEach(({ name, lat, lon }) => {
          results.push({
            value: JSON.stringify({ latlng: { lat: lat, lng: lon }, value: name }),
            label: name,
            id: ++i,
            action: stat,
            message: info,
          });
        });
      return results;
    }
  );
};

const getRouting = async (data) => postFetch(`/map01/route/search`, data);
const apiList = {
  userGet: 'user/get',
  userSearch: 'user/search/',
  userGetRoles: 'user/get/roles',
};

export {
  postMethod,
  getMethod,
  //   getMethodApp,
  deleteMethod,
  //   switchMethod,
  putMethod,
  postMethodChangePassword,
  apiList,
  getMethodNoToken,
  getAddress,
  connectMap,
  getRouting,
  searchAdress,
};
