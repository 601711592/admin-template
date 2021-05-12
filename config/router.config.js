export default [
  {
    path: '/login',
    component: './User/Login',
  },
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/',
        component: './Home',
      },
      {
        path: '/setting/account',
        component: './Setting/Account',
      },
      {
        path: '/setting/menu',
        component: './Setting/Menu',
      },
      {
        path: '/setting/role',
        component: './Setting/Role',
      },
      {
        path: '/setting/dict',
        component: './Setting/Dict',
      },
      {
        path: '/setting/syslog',
        component: './Setting/SystemLog',
      },
      {
        path: '/exception/403',
        name: 'not-permission',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: 'not-find',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: 'server-error',
        component: './Exception/500',
      },
      {
        component: '404',
      },
    ],
  },
];
