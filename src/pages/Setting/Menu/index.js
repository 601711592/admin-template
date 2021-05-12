import { Component } from 'react';
import { AddButton } from 'components/Button';
import { Card, Icon, Popconfirm, Table, Badge, Divider, Spin } from 'antd';
import Operating from './Operating';
import { connect } from 'dva';

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class Index extends Component {
  state = {
    operatingModal: {
      visible: false,
      record: {},
    },
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'menu/fetchTree' });
  };

  operatingAction = (type, record, callback) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'edit':
        this.operatingModal({ visible: true, record });
        break;
      case 'delete':
        dispatch({
          type: 'menu/delete',
          data: record,
        });
        break;
      case 'copy':
        const _record = { ...record };
        delete _record['id'];
        dispatch({
          type: 'menu/save',
          data: _record,
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
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => (
        <a>
          {record.icon && <Icon type={record.icon} style={{ marginRight: 5 }} />}
          {text}
        </a>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
    },
    {
      title: '权限标识',
      dataIndex: 'api_permissions',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
    },
    {
      title: '显示',
      dataIndex: 'visible',
      width: 50,
      render: text => (text === 1 && <Badge status="success" text="是" />) || <Badge status="error" text="否" />,
    },
    {
      title: '类型',
      dataIndex: 'menu_clazz',
      width: 65,
      render: text =>
        (text === 'url' && <Badge status="processing" text="菜单" />) ||
        (text === 'func' && <Badge status="warning" text="操作" />),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: _record => (
        <span>
          <a onClick={() => this.operatingAction('edit', _record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            title="操作不可逆，是否确认删除?"
            onConfirm={() => this.operatingAction('delete', _record)}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a
            onClick={() =>
              this.operatingModal({
                visible: true,
                record: {
                  parent_id: _record.id,
                },
              })
            }
          >
            添加下级菜单
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.operatingAction('copy', _record)}>复制</a>
        </span>
      ),
    },
  ];

  render() {
    const {
      menu: { tree, expandedRowKeys },
      dispatch,
      loading,
      type,
    } = this.props;

    const { columns } = this;

    const tableProps = {
      columns,
      dataSource: tree,
      bordered: true,
      pagination: false,
      defaultExpandAllRows: true,
      expandedRowKeys,
      onExpand: (expanded, record) => {
        let data = expandedRowKeys;
        if (expanded) {
          data.push(record.id);
        } else {
          data = data.filter(v => v !== record.id);
        }
        dispatch({
          type: 'menu/setExpandedRowKeys',
          data,
        });
      },
      size: 'small',
      rowKey: 'id',
    };

    const ModelProps = {
      onCancel: () =>
        this.setState(({ operatingModal }) => {
          operatingModal.visible = false;
          operatingModal.record = {};
          return operatingModal;
        }),
      ...this.state.operatingModal,
      dispatch: dispatch,
      type,
    };

    return (
      <Card bordered={false}>
        <AddButton
          onClick={() =>
            this.setState(({ operatingModal }) => {
              operatingModal.visible = true;
              operatingModal.record = {};
              return operatingModal;
            })
          }
        />
        <Operating {...ModelProps} />
        <Spin spinning={loading}>
          <Table {...tableProps} />
        </Spin>
      </Card>
    );
  }
}

export default Index;
