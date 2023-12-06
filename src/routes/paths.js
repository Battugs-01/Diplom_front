// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_ADMIN = '/admin';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  // root: ROOTS_DASHBOARD,
  // kanban: path(ROOTS_DASHBOARD, '/kanban'),
  // calendar: path(ROOTS_DASHBOARD, '/calendar'),
  // fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  // permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  // blank: path(ROOTS_DASHBOARD, '/blank'),
  // general: {
  //   app: path(ROOTS_DASHBOARD, '/app'),
  //   ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
  //   analytics: path(ROOTS_DASHBOARD, '/analytics'),
  //   banking: path(ROOTS_DASHBOARD, '/banking'),
  //   booking: path(ROOTS_DASHBOARD, '/booking'),
  //   file: path(ROOTS_DASHBOARD, '/file'),
  // },
  // mail: {
  //   root: path(ROOTS_DASHBOARD, '/mail'),
  //   all: path(ROOTS_DASHBOARD, '/mail/all'),
  // },
  // chat: {
  //   root: path(ROOTS_DASHBOARD, '/chat'),
  //   new: path(ROOTS_DASHBOARD, '/chat/new'),
  //   view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  // },
  // user: {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   new: path(ROOTS_DASHBOARD, '/user/new'),
  //   list: path(ROOTS_DASHBOARD, '/user/list'),
  //   cards: path(ROOTS_DASHBOARD, '/user/cards'),
  //   profile: path(ROOTS_DASHBOARD, '/user/profile'),
  //   account: path(ROOTS_DASHBOARD, '/user/account'),
  //   edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  // },
  // eCommerce: {
  //   root: path(ROOTS_DASHBOARD, '/e-commerce'),
  //   shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
  //   list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
  //   checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
  //   new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
  //   view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
  //   edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  // },
  // invoice: {
  //   root: path(ROOTS_DASHBOARD, '/invoice'),
  //   list: path(ROOTS_DASHBOARD, '/invoice/list'),
  //   new: path(ROOTS_DASHBOARD, '/invoice/new'),
  //   view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  // },
  // blog: {
  //   root: path(ROOTS_DASHBOARD, '/blog'),
  //   posts: path(ROOTS_DASHBOARD, '/blog/posts'),
  //   new: path(ROOTS_DASHBOARD, '/blog/new'),
  //   view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
  //   demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  // },
  root: ROOTS_ADMIN,
  general: {
    app: path(ROOTS_ADMIN, '/app'),
    ecommerce: path(ROOTS_ADMIN, '/ecommerce'),
    analytics: path(ROOTS_ADMIN, '/analytics'),
    banking: path(ROOTS_ADMIN, '/banking'),
    booking: path(ROOTS_ADMIN, '/booking'),
  },
  mail: {
    root: path(ROOTS_ADMIN, '/mail'),
    all: path(ROOTS_ADMIN, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_ADMIN, '/chat'),
    new: path(ROOTS_ADMIN, '/chat/new'),
    view: (name) => path(ROOTS_ADMIN, `/chat/${name}`),
  },
  calendar: path(ROOTS_ADMIN, '/calendar'),
  kanban: path(ROOTS_ADMIN, '/kanban'),
  permissionDenied: path(ROOTS_ADMIN, '/permission-denied'),
  user: {
    root: path(ROOTS_ADMIN, '/user'),
    new: path(ROOTS_ADMIN, '/user/new'),
    list: path(ROOTS_ADMIN, '/user/list'),
    cards: path(ROOTS_ADMIN, '/user/cards'),
    profile: path(ROOTS_ADMIN, '/user/profile'),
    account: path(ROOTS_ADMIN, '/user/account'),
    edit: (name) => path(ROOTS_ADMIN, `/user/${name}/edit`),
    demoEdit: path(ROOTS_ADMIN, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_ADMIN, '/e-commerce'),
    shop: path(ROOTS_ADMIN, '/e-commerce/shop'),
    list: path(ROOTS_ADMIN, '/e-commerce/list'),
    checkout: path(ROOTS_ADMIN, '/e-commerce/checkout'),
    new: path(ROOTS_ADMIN, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_ADMIN, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_ADMIN, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_ADMIN, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_ADMIN, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_ADMIN, '/invoice'),
    list: path(ROOTS_ADMIN, '/invoice/list'),
    new: path(ROOTS_ADMIN, '/invoice/new'),
    view: (id) => path(ROOTS_ADMIN, `/invoice/${id}`),
    edit: (id) => path(ROOTS_ADMIN, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
    demoView1: path(ROOTS_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_ADMIN, '/blog'),
    posts: path(ROOTS_ADMIN, '/blog/posts'),
    new: path(ROOTS_ADMIN, '/blog/new'),
    view: (title) => path(ROOTS_ADMIN, `/blog/post/${title}`),
    demoView: path(ROOTS_ADMIN, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
  driver: {
    root: path(ROOTS_ADMIN, '/driver'),
    list: path(ROOTS_ADMIN, '/driver/list'),
  },
  admin: {
    root: path(ROOTS_ADMIN, '/admin'),
    table: path(ROOTS_ADMIN, '/admin/table'),
  },
  // user: {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   list: path(ROOTS_DASHBOARD, '/user/list'),
  // },
  trip: {
    root: path(ROOTS_ADMIN, '/trip'),
    list: (params) => path(ROOTS_ADMIN, `/trip/${params}`),
    view: (id) => path(ROOTS_ADMIN, `/trip/detail/${id}`),
  },
  delivered: {
    root: path(ROOTS_ADMIN, '/delivered'),
    list: (params) => path(ROOTS_ADMIN, `/delivered/${params}`),
    view: (id) => path(ROOTS_ADMIN, `/delivered/detail/${id}`),
  },
  // booking: {
  //   root: path(ROOTS_ADMIN, '/admin'),
  //   call: path(ROOTS_ADMIN, '/controlpanel/charts'),
  // },
  booking: {
    root: path(ROOTS_ADMIN, '/booking'),
    call: path(ROOTS_ADMIN, '/booking/call'),
  },
  news: {
    root: path(ROOTS_ADMIN, '/news'),
    list: path(ROOTS_ADMIN, '/news/list'),
    view: (id) => path(ROOTS_ADMIN, `/news/detail/${id}`),
  },
  instruction: {
    root: path(ROOTS_ADMIN, '/instruction'),
    list: path(ROOTS_ADMIN, '/instruction/list'),
    view: (id) => path(ROOTS_ADMIN, `/instruction/detail/${id}`),
  },
  controlpanel: {
    root: path(ROOTS_ADMIN, '/controlpanel'),
    charts: path(ROOTS_ADMIN, '/controlpanel/charts'),
  },
  admin: {
    root: path(ROOTS_ADMIN, '/admin'),
    list: path(ROOTS_ADMIN, '/admin/list'),
  },
  driver: {
    root: path(ROOTS_ADMIN, '/driver'),
    list: path(ROOTS_ADMIN, '/driver/list'),
  },
  vehicle: {
    root: path(ROOTS_ADMIN, '/vehicle'),
    list: (params) => path(ROOTS_ADMIN, `/vehicle/${params}`),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
