import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import Link from 'umi/link';
import styles from './index.less';
import EditPassModal from './editPass.modal';

import HeaderMenu from '../SiderMenu/HeadeMenu';

export default class GlobalHeader extends PureComponent {
  state = {
    editPassModalVisible: false,
  };
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  logout = () => {
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  };

  render() {
    const { currentUser = {}, collapsed, fetchingNotices, isMobile, logo, onNoticeVisibleChange, onMenuClick, onNoticeClear, menuData, location } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item onClick={() => this.setState({ editPassModalVisible: true })}>
          <Icon type="lock" />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={this.logout}>
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <EditPassModal
          visible={this.state.editPassModalVisible}
          onCancel={() => this.setState({ editPassModalVisible: false })}
          onSubmit={(values, callback) => {
            window.g_app._store.dispatch({
              type: 'user/updatePass',
              data: values,
              callback,
            });
          }}
        />
        {/* <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="50" />
        </Link> */}
        <HeaderMenu menuData={menuData} location={location} />
        <div className={styles.right}>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
