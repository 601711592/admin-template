import { Fragment, Component } from 'react';
import styles from './index.less';
import { Card, Button, Divider, Popconfirm, Drawer, Badge } from 'antd';
import SearchHeader from 'components/SearchHeader';
import { AddButton } from 'components/Button';
import Table from 'components/Table';
import Operating from './Operating';
import { connect } from 'dva';

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
class Index extends Component {
  state = {
    operatingModal: {
      visible: false,
      record: {},
    },
  };

  componentDidMount = () => {
    // this.props.dispatch({ type: 'account/setSearch', payload: {} });
    this.props.dispatch({ type: 'account/fetchPage' });
  };

  operatingAction = (type, record, callback) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'edit':
        this.operatingModal({ visible: true, record });
        break;
      case 'delete':
        dispatch({
          type: 'account/delete',
          data: {
            id: record.id,
          },
        });
        break;
      case 'save':
        dispatch({
          type: 'account/save',
          data: record,
          callback,
        });
        break;
      case 'lock':
        dispatch({
          type: 'account/save',
          data: {
            id: record.id,
            status: record.status === 0 ? 1 : 0,
          },
        });
        break;
      case 'resetPassword':
        dispatch({
          type: 'account/resetPassword',
          data: {
            id: record.id,
          },
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

  columns = [
    {
      title: '帐号',
      dataIndex: 'email',
    },
    {
      title: '使用者',
      dataIndex: 'name',
    },
    {
      title: '帐号角色',
      dataIndex: 'roles',
      render: roles => roles.map(item => item.name).join(),
    },
    {
      title: '最近修改时间',
      dataIndex: 'updated_at',
    },
    {
      title: '状态',
      dataIndex: 'status_desc',
      render: (v, record) => <Badge status={v.value === '1' ? 'success' : 'error'} text={v.label} />,
    },
    {
      title: '操作',
      width: 160,
      render: _record => (
        <Fragment>
          {/* <Popconfirm
            placement="top"
            title={'是否确认要重置该账号的密码？'}
            onConfirm={() => this.operatingAction('resetPassword', _record)}
          >
            <a>重置密码</a>
          </Popconfirm>
          <Divider type="vertical" /> */}
          <a onClick={() => this.operatingAction('edit', _record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="top"
            title={`是否确认要${_record.status === 1 ? '停用' : '启用'}该账号？`}
            onConfirm={() => this.operatingAction('lock', _record)}
          >
            <a>{_record.status === 1 ? '停用' : '启用'}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm placement="topLeft" title={'是否确认要删除该账号，删除后将不能恢复。'} onConfirm={() => this.operatingAction('delete', _record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  render() {
    const { account, loading, dispatch } = this.props;
    const { columns } = this;

    const SearchHeaderProps = {
      modelName: 'account',
      defaultValues: account.search,
      dispatch,
    };

    const tableProps = {
      columns,
      loading,
      page: account.page,
      dataSource: account.list,
      action: 'account/fetchPage',
      rowKey: record => `${record.id}${record.orgId}${record.roleId}`,
    };

    const operatingProps = {
      ...this.state.operatingModal,
      onCancel: () => this.operatingModal({ visible: false }),
      onSubmit: (values, callback) => this.operatingAction('save', values, callback),
    };

    return (
      <div className={styles.normal}>
        <Operating {...operatingProps} />
        <Card bordered={false}>
          <SearchHeader {...SearchHeaderProps}>
            <SearchHeader.Input label="帐号名" name="email" />
            <SearchHeader.SelectSearch label="帐号角色" name="roleId" type="role" />
            <SearchHeader.SelectSearch type="dict" initParams={{ type: 'user_status' }} label="帐号状态" name="status" />
            <SearchHeader.Input label="使用人" name="name" />
          </SearchHeader>
          <AddButton
            onClick={() =>
              this.setState(({ operatingModal }) => {
                operatingModal.visible = true;
                operatingModal.record = {};
                return operatingModal;
              })
            }
          />
          <Table {...tableProps} />
        </Card>
      </div>
    );
  }
}

export default Index;
