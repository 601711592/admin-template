import moment from 'moment';

export function timeToStr(number, str) {
  str = str ? str : 'YYYY-MM-DD HH:mm:ss';
  return number ? moment(new Date(number)).format(str) : '';
}

export function handleBreadcrumbRouter(menuData) {
  const routes = [];

  routes.push({
    path: '/',
    breadcrumb: '首页',
  });
  const f = (list, path = '') => {
    list.map(v => {
      routes.push({
        path: `${path}${v.url}`,
        breadcrumb: v.name,
        icon: v.icon,
      });
      if (Array.isArray(v.children)) {
        f(v.children, `${path}${v.url}`);
      }
      return v;
    });
  };
  f(menuData);

  return routes;
}

export const HtmlUtil = {
  dom: document.createElement('div'),
  decode: function(str) {
    var s = '';

    if (typeof str !== 'string' || str.length === 0) {
      return;
    }
    s = str.replace(/&amp;/g, '&');
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    // s = s.replace(/&nbsp;/g, " /g);
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    return s;
  },
  encode: function(str) {
    if (!str) {
      return '';
    }
    this.dom.innerHTML = str;
    return this.dom.innerText;
  },
};

export function downloadFile(url) {
  var a = document.createElement('a');
  a.href = url;
  a.click();
  a = null;
}

export const apiPrefix = process.env.apiUrl;

export function getBase64(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        //得到一个blob对象
        var blob = this.response;
        // 至关重要
        let oFileReader = new FileReader();
        oFileReader.onloadend = function(e) {
          let base64 = e.target.result;
          resolve(base64);
        };
        oFileReader.readAsDataURL(blob);
      }
    };
    xhr.send();
  });
}
