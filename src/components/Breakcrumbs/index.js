import { Component, PureComponent } from 'react';
import NavLink from 'umi/navlink';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { connect } from 'dva';
import { Breadcrumb, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';

// 更多配置请移步 https://github.com/icd2k3/react-router-breadcrumbs-hoc

const routersList = [];
const findChildren = routes => {
  routes.map(v => {
    v.name &&
      v.path &&
      routersList.push({
        name: v.name,
        path: v.path,
      });
    v.routes && findChildren(v.routes);
  });
};

export default props => {
  if (routersList.length === 0) {
    findChildren(window.g_routes);
  }

  const Bread = withBreadcrumbs(props.menuData)(({ breadcrumbs }) => (
    <div style={{ marginBottom: 14 }}>
      <Breadcrumb>
        {breadcrumbs.map((breadcrumb, index) => {
          const router = routersList.find(v => pathToRegexp(v.path).test(`${breadcrumb.key}`));
          if (!props.menuData.find(v => v.path === breadcrumb.key) && !router) {
            return null;
          }
          return <Breadcrumb.Item key={breadcrumb.key}>{router ? router.name : breadcrumb}</Breadcrumb.Item>;
          // const content = (
          //   <Fragment>
          //     {item.icon ? (
          //       <Icon type={item.icon} style={{ marginRight: 4 }} />
          //     ) : null}
          //     {item.name}
          //   </Fragment>
          // )

          // return (
          //   <Breadcrumb.Item key={breadcrumb.key}>
          //     {paths.length - 1 !== key ? (
          //       <Link to={item.route || '#'}>{content}</Link>
          //     ) : (
          //         content
          //       )}
          //   </Breadcrumb.Item>
          // )
        })}
      </Breadcrumb>
    </div>
  ));

  return <Bread />;
};
