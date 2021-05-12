// import { apiPrefix } from '@/utils/config';

export default {
  login: 'POST /login',
  logout: '/logout',

  menuGetUserTree: '/user/menus',
  currentUserDetail: '/user/detail',

  menuGetTree: '/menu/tree',
  menuUpdate: 'POST /menu/update/:id',
  menuAdd: 'POST /menu/add',
  menuDel: '/menu/del/:id',

  rolePage: 'POST /role/page',
  roleAdd: 'POST /role/add',
  roleUpdate: 'POST /role/update/:id',
  roleDel: '/role/del/:id',
  roleGet: '/role/get/:id',

  dictPage: 'POST /dict/page',
  dictList: 'POST /dict/list',
  dictAdd: 'POST /dict/add',
  dictUpdate: 'POST /dict/update/:id',
  dictDel: '/dict/del/:id',
  dictTypes: 'POST /dict/types',

  userPage: 'POST /user/page',
  userAdd: 'POST /user/add',
  userUpdate: 'POST /user/update/:id',
  userDel: '/user/del/:id',
};
