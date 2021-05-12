import { Component } from 'react';
import { Layout, Icon, message, ConfigProvider } from 'antd';
import SiderMenu from '../components/SiderMenu/SiderMenu';
import { getMenuData, getFlatMenuData } from '../common/menu';
import logo from '../assets/logo_fff.png';
import GlobalHeader from '../components/GlobalHeader';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Breakcrumbs from '../components/Breakcrumbs';
import router from 'umi/router';
import { connect } from 'dva';
import { handleBreadcrumbRouter } from '@/utils/index';

const { Content, Header, Footer } = Layout;

@connect(({ global }) => ({
  global,
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount = () => {
    const tokenId = sessionStorage.getItem('tokenId');
    if (!tokenId) {
      router.push('/login');
    }
    this.props.dispatch({ type: 'global/fetchMenuTree' });
    this.props.dispatch({ type: 'global/fetchCurrentUserDetail' });
  };

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, location, global } = this.props;
    const { collapsed } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <Layout>
          {/* <SiderMenu
            logo={logo}
            collapsed={collapsed}
            menuData={global.menuTree}
            location={location}
            onCollapse={this.handleMenuCollapse}
          /> */}
          <Layout>
            <Header style={{ padding: 0 }}>
              <GlobalHeader
                logo={logo}
                collapsed={collapsed}
                currentUser={{
                  name: global.userInfo.name,
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                  userid: '00000001',
                  notifyCount: 12,
                }}
                onCollapse={this.handleMenuCollapse}
                menuData={global.menuTree}
                location={location}
              />
            </Header>
            <Content style={{ margin: '14px 24px 0', height: '100%' }}>
              <Breakcrumbs menuData={handleBreadcrumbRouter(global.menuTree || [])} />
              {children}
              <br />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default BasicLayout;
