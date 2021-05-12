import api, { apiHandle } from '@/services';
import router from 'umi/router';
import { message } from 'antd';

const { login, logout } = api;

const USERNAME = 'username';
const PASSWORD = 'password';
const REMEMBER_PASSWORD = 'rememberPassword';
const USER_ID = 'userId';
const TOKEN_ID = 'tokenId';

export default {
  state: {},

  effects: {
    *login({ payload, values }, { call }) {
      const response = yield call(login, payload);
      if (apiHandle(response, true)) {
        if (values[REMEMBER_PASSWORD] === true) {
          localStorage.setItem(USERNAME, values[USERNAME]);
          localStorage.setItem(PASSWORD, values[PASSWORD]);
          localStorage.setItem(REMEMBER_PASSWORD, values[REMEMBER_PASSWORD]);
        } else {
          localStorage.removeItem(USERNAME);
          localStorage.removeItem(PASSWORD);
          localStorage.removeItem(REMEMBER_PASSWORD);
        }

        const {
          data: { access_token },
        } = response;
        sessionStorage.setItem(TOKEN_ID, `Bearer ${access_token}`);

        router.push('/');

        message.success('登录成功');
      }
    },
    *logout(_, { call }) {
      const response = yield call(logout);
      if (apiHandle(response, true)) {
        sessionStorage.removeItem(USER_ID);
        sessionStorage.removeItem(USERNAME);
        sessionStorage.removeItem(TOKEN_ID);
        router.push('/login');
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
