import api, { apiHandle, getPageData } from '@/services';

const { menuGetUserTree, currentUserDetail, dictList } = api;

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

function formatter(data, parentPath = '') {
  return data.map((item) => {
    let { path, menu_clazz } = item;
    if (menu_clazz !== 'url') {
      return null;
    }
    if (!isUrl(path)) {
      path = parentPath + item.url;
    }
    const result = {
      ...item,
      path,
      hideInMenu: !item.visible,
    };
    if (item.children) {
      let list = formatter(item.children, `${parentPath}${item.url}`);
      list = [...new Set(list)].filter((item) => item);
      result.children = list.length === 0 ? null : list;
    } else {
      result.children = null;
    }
    return result;
  });
}

export default {
  state: {
    menuTree: [], //菜单树
    funcList: [], //功能列表
    userInfo: {},
  },

  effects: {
    *fetchMenuTree({ payload = {}, callback }, { call, put, select }) {
      const response = yield call(menuGetUserTree);
      if (apiHandle(response, true)) {
        const { data } = response;
        const tree = Array.isArray(data) ? formatter(data) : [];
        // const func = Array.isArray(children) ? formatter(children) : [];
        yield put({
          type: 'setState',
          payload: {
            menuTree: tree,
          },
        });

        if (callback) callback(tree);
      }
    },
    *fetchCurrentUserDetail(_, { call, put, select }) {
      const response = yield call(currentUserDetail);
      if (apiHandle(response, true)) {
        const { data } = response;
        yield put({
          type: 'setState',
          payload: {
            userInfo: data,
          },
        });
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
