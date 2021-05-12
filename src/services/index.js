import request from '@/utils/request';
import { message } from 'antd';
import { apiPrefix } from '../utils/config';
import api from './api';

const gen = (params) => {
  let url = apiPrefix + params;
  let method = 'GET';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    method = paramsArray[0];
    url = apiPrefix + paramsArray[1];
  }

  return function (data) {
    return request({
      url,
      data,
      method,
    });
  };
};

const APIFunction = {};
for (const key in api) {
  APIFunction[key] = gen(api[key]);
}

export default APIFunction;

/**
 *
 * @param {object} reponse
 * @param {boolean} isHideMessage 是否隐藏提示框
 */
export const apiHandle = (reponse, isHideMessage = false) => {
  if (!reponse) {
    return false;
  }
  const { status, msg: note } = reponse;
  if (status === 200) {
    isHideMessage || message.success(note || '操作成功');
    return true;
  }
  isHideMessage || message.error(note || '操作失败');
  return false;
};

//分页数据统一化处理
export function getPageData(response) {
  const {
    data: { data, total, per_page, current_page },
  } = response;

  return {
    data: {
      list: data,
      page: {
        page: current_page,
        pageSize: parseInt(per_page),
        total,
      },
    },
    isEmpty: current_page > 1 && data.length === 0,
    resetPage: 1,
  };
}
