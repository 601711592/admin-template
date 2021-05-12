import { fetch } from 'dva';
import { notification, message } from 'antd';
import { cloneDeep } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import router from 'umi/router';
import hash from 'hash.js';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

export function getAuthData() {
  if (!sessionStorage.getItem('tokenId')) {
    return null;
  }
  return {
    Authorization: sessionStorage.getItem('tokenId'),
  };
}

const a = pathToRegexp.parse('http://baidu.com/:id');
console.log(a);

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(option) {
  let { data, url, method } = option;

  // console.log(typeof data);

  // console.log(typeof data === 'object' && data.constructor.name);

  // let cloneData = typeof data === 'object' && data.constructor.name === 'FormData' ? data : cloneDeep(data);
  // if (data instanceof File) {
  //   const formData = new FormData();
  //   formData.append('file', data);
  //   cloneData = formData;
  // }
  try {
    let domain = '';
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      url = url.slice(domain.length);
    }

    let _data = cloneDeep(data);
    if (typeof data === 'object' && data.constructor.name === 'FormData') {
      _data = {};
      for (var key of data.keys()) {
        _data[key] = data.get(key);
      }
    }

    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(_data);

    // for (const item of match) {
    //   if (item instanceof Object && item.name in cloneData) {
    //     delete cloneData[item.name];
    //   }
    // }
    // let str = '';
    // for (let key in cloneData) {
    //   const value = typeof cloneData[key] !== 'string' ? JSON.stringify(cloneData[key]) : cloneData[key];
    //   str += '&' + key + '=' + value;
    // }
    // if (str.length) {
    //   url += `?${str.substr(1)}`;
    // }

    url = domain + url;
  } catch (e) {
    message.error(e.message);
  }

  if (method === 'GET') {
    // cloneData = undefined;
    data = undefined;
  }

  const options = {
    ...option,
    body: data,
    headers: {
      Accept: 'application/json',
    },
  };

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  if (!newOptions.headers) {
    newOptions.headers = {};
  }

  const authData = getAuthData();

  if (authData) {
    newOptions.headers = {
      ...newOptions.headers,
      ...authData,
    };
  }

  // console.log(url, newOptions);

  return (
    fetch(url, newOptions)
      // .then(checkStatus)
      .then(response => cachedSave(response, hashcode))
      .then(response => {
        // DELETE and 204 do not return data by default
        // using .json will report an error.
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        // const json = response.json();
        // console.log(json);
        return response.json();
      })
      .then(json => {
        if (json.code === 'wvail.NO_LOGIN') {
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
        }
        return json;
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        }
        // environment should not be used
        // if (status === 403) {
        //   router.push('/exception/403');
        //   return;
        // }
        // if (status <= 504 && status >= 500) {
        //   router.push('/exception/500');
        //   return;
        // }
        // if (status >= 404 && status < 422) {
        //   router.push('/exception/404');
        // }
      })
  );
}
