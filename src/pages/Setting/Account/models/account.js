import api, { apiHandle, getPageData } from '@/services';

const { userPage: apiPage, userAdd: apiAdd, userUpdate: apiUpdate, userDel: appDel } = api;

export default {
  state: {
    list: [],
    page: {
      current: 1,
      size: 10,
    },
    search: {},
  },

  effects: {
    *fetchPage({ payload = {} }, { call, put, select }) {
      const { page, search } = yield select(state => state.account);
      const response = yield call(apiPage, { ...page, ...search, ...payload });
      if (apiHandle(response, true)) {
        const { data, isEmpty, resetPage } = getPageData(response);
        yield put({
          type: 'setState',
          payload: data,
        });
        if (isEmpty) {
          yield put({ type: 'fetchPage', payload: { page: resetPage } });
        }
      }
    },
    *save({ data, callback }, { call, put }) {
      const response = yield call(data.id ? apiUpdate : apiAdd, data);
      if (apiHandle(response)) {
        yield put({ type: 'fetchPage' });
        if (callback) callback();
      }
    },
    // *updateLock({ data, callback }, { call, put }) {
    //   const response = yield call(userUpdateLock, data);
    //   if (apiHandle(response)) {
    //     yield put({ type: 'fetchPage' });
    //     if (callback) callback();
    //   }
    // },
    *delete({ data, callback }, { call, put }) {
      const response = yield call(appDel, data);
      if (apiHandle(response)) {
        yield put({ type: 'fetchPage' });
        if (callback) callback();
      }
    },
    // *resetPassword({ data, callback }, { call, put }) {
    //   const response = yield call(userResetPassword, data);
    //   if (apiHandle(response)) {
    //     yield put({ type: 'fetchPage' });
    //     if (callback) callback();
    //   }
    // },
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setSearch(state, { payload }) {
      return {
        ...state,
        search: {
          ...payload,
        },
      };
    },
  },
};
