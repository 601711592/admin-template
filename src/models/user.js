import {
  apiHandle,
  userUpdatePassword,
} from '@/services/api';

export default {

  state: {
    list: [],
    page: {
      current: 1,
      size: 10
    },
    search: {}
  },

  effects: {
    *updatePass({ data, callback }, { call, put }) {
      const response = yield call(userUpdatePassword, data);
      if (apiHandle(response)) {
        if (callback) callback()
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  }
};
