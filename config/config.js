import { resolve } from 'path';
import pageRoutes from './router.config';

// ref: https://umijs.org/config/
export default {
  history: 'hash', //hash
  targets: {
    ie: 9,
  },
  publicPath: './',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false, //按需加载
        title: '韶关游管理系统',
        dll: false,
        routes: {
          exclude: [/model\.(j|t)sx?$/, /service\.(j|t)sx?$/, /models\//, /components\//, /services\//],
        },
        hardSource: false,
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
      },
    ],
  ],
  alias: {
    components: resolve(__dirname, '../src/components'),
    utils: resolve(__dirname, '../src/utils'),
    services: resolve(__dirname, '../src/services'),
  },
  //主题
  theme: {
    // 'primary-color': '#1f62e6'
  },
  // 路由配置
  routes: pageRoutes,
  disableRedirectHoist: true,
};
