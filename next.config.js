const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    // HOST_API_KEY: 'https://api-dev-minimal-v4.vercel.app',
    // HOST_API_KEY: 'https://time-order.onrender.com',
    HOST_API_KEY: 'https://diplom-back-h5xf.onrender.com/',
    // HOST_API_KEY: 'http://192.168.1.125:5000',
    // HOST_API_KEY: 'http://localhost:5000',
    HOST_API_KEY_PROD: 'https://diplom-back-h5xf.onrender.com/',
    HOST_API_KEY_PROD: 'http://192.168.1.125:5000',
    HOST_FILE_KEY: 'https://time-order.onrender.com',
    HOST_API_KEY_TEST: 'http://43.231.112.191:8070/v1',
    HOST_API_KEY_TEST: 'https://time-order.onrender.com',
    // MAPBOX
    MAPBOX_API: '',
    // FIREBASE
    FIREBASE_API_KEY: '',
    FIREBASE_AUTH_DOMAIN: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_STORAGE_BUCKET: '',
    FIREBASE_MESSAGING_SENDER_ID: '',
    FIREBASE_APPID: '',
    FIREBASE_MEASUREMENT_ID: '',
    // AWS COGNITO
    AWS_COGNITO_USER_POOL_ID: '',
    AWS_COGNITO_CLIENT_ID: '',
    // AUTH0
    AUTH0_DOMAIN: '',
    AUTH0_CLIENT_ID: '',
  },
});
