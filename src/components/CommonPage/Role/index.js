import { Fragment, Component } from 'react';
import styles from './index.less';
import { Card, Button, Divider, Popconfirm, Drawer } from 'antd';
import SearchHeader from 'components/SearchHeader';
import { AddButton } from 'components/Button';
import Table from 'components/Table';
import Operating from './Operating';
import { connect } from 'dva';

const menuPlane = (list) => {
  let arr = [];
  list.map((v) => {
    arr.push(v);
    if (v.children) {
      arr = arr.concat(menuPlane(v.children));
    }
  });
  return arr;
};

@connect(({ role, loading, menu }) => ({
  role,
  loading: loading.models.role,
  menu
}))
class Index extends Component {
  state = {
    operatingModal: {
      visible: false,
      record: {}
    }
  };

  componentDidMount = () => {
    const { dispatch, type } = this.props;
    dispatch({ type: 'role/setSearch', payload: { type } });
    dispatch({ type: 'role/fetchPage' });
    dispatch({ type: 'menu/fetchTree', payload: { type } });
  };

  operatingAction = (type, record, callback) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'edit':
        dispatch({
          type: 'role/get',
          data: record,
          callback: (record) => {
            this.operatingModal({ visible: true, record });
          }
        });
        break;
      case 'delete':
        dispatch({
          type: 'role/delete',
          data: record
        });
        break;
      case 'save':
        dispatch({
          type: 'role/save',
          data: record,
          callback
        });
        break;
      default:
    }
  };

  operatingModal = ({ visible, record = {} }) => {
    this.setState(({ operatingModal }) => {
      operatingModal.visible = visible;
      operatingModal.record = record;
      return operatingModal;
    });
  };

  render() {
    const { role, menu, loading, type } = this.props;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '关联账号',
        dataIndex: 'relatedCount'
      },
      {
        title: '最近修改时间',
        dataIndex: 'updateTime'
      },
      {
        title: '操作',
        width: 130,
        render: (_record) => (
          <Fragment>
            <a onClick={() => this.operatingAction('edit', _record)}>配置</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topLeft"
              title={'是否确认删除，删除后将不能恢复。'}
              onConfirm={() => this.operatingAction('delete', _record)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        )
      }
    ];

    const tableProps = {
      columns,
      loading,
      page: role.page,
      dataSource: role.list,
      action: 'role/fetchPage'
    };

    const operatingProps = {
      menu,
      ...this.state.operatingModal,
      menuPlane: menuPlane(menu.tree || []),
      onCancel: () => this.operatingModal({ visible: false }),
      onSubmit: (values, callback) => this.operatingAction('save', values, callback),
      type
    };

    return (
      <div className={styles.normal}>
        <Operating {...operatingProps} />
        <Card bordered={false}>
          <AddButton onClick={() => this.operatingModal({ visible: true })} />
          <Table {...tableProps} />
        </Card>
      </div>
    );
  }
}

export default Index;
