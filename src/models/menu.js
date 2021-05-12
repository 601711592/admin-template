import api, { apiHandle } from '@/services';
import { getMenuKeys } from '@/utils/menu';

const { menuGetTree, menuUpdate, menuAdd, menuDel } = api;

export default {
  state: {
    tree: [], //菜单树
    expandedRowKeys: [], //要展开的 key 数组
  },

  effects: {
    *fetchTree({ payload = {} }, { call, put, select }) {
      const response = yield call(menuGetTree);
      if (apiHandle(response, true)) {
        const { data } = response;
        yield put({
          type: 'setTree',
          tree: Array.isArray(data) ? data : [],
        });
      }
    },
    *save({ data, callback }, { call, put }) {
      const response = yield call(data.id ? menuUpdate : menuAdd, data);
      if (apiHandle(response)) {
        yield put({ type: 'fetchTree' });
        if (callback) callback();
      }
    },

    *delete({ data }, { call, put }) {
      const response = yield call(menuDel, data);
      if (apiHandle(response)) {
        yield put({ type: 'fetchTree' });
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
    setTree(state, { tree }) {
      const expandedRowKeys = [];
      getMenuKeys(tree, expandedRowKeys);
      return {
        ...state,
        tree,
        expandedRowKeys,
      };
    },
    setExpandedRowKeys(state, { data }) {
      return {
        ...state,
        expandedRowKeys: data,
      };
    },
  },
};
