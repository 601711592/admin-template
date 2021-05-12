import api, { apiHandle, getPageData } from '@/services';

const { dictPage: apiPage, dictAdd: apiAdd, dictUpdate: apiUpdate, dictDel: apiDel } = api;

export default {
  state: {
    list: [],
    page: {
      page: 1,
      pageSize: 10,
    },
    search: {},
  },

  effects: {
    *fetchPage({ payload = {} }, { call, put, select }) {
      const { page, search } = yield select(state => state.dict);
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
    *delete({ data }, { call, put }) {
      const response = yield call(apiDel, data);
      if (apiHandle(response)) {
        yield put({ type: 'fetchPage' });
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
