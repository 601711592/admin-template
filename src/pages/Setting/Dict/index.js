import { Fragment, Component } from 'react';
import styles from './index.less';
import { Card, Button, Divider, Popconfirm, Drawer } from 'antd';
import SearchHeader from 'components/SearchHeader';
import { AddButton } from 'components/Button';
import Table from 'components/Table';
import Operating from './Operating';
import { connect } from 'dva';
import { timeToStr } from '@/utils';

@connect(({ dict, loading }) => ({
  dict,
  loading: loading.models.dict,
}))
class Index extends Component {
  state = {
    operatingModal: {
      visible: false,
      record: {},
    },
  };

  componentDidMount = () => {
    this.props.dispatch({ type: 'dict/setSearch', payload: {} });
    this.props.dispatch({ type: 'dict/fetchPage' });
  };

  operatingAction = (type, record, callback) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'edit':
        this.operatingModal({ visible: true, record });
        break;
      case 'copy':
        this.operatingModal({
          visible: true,
          record: {
            ...record,
            id: undefined,
          },
        });
        break;
      case 'delete':
        dispatch({
          type: 'dict/delete',
          data: record,
        });
        break;
      case 'save':
        dispatch({
          type: 'dict/save',
          data: record,
          callback,
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
      title: '标签名',
      dataIndex: 'label',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '键值',
      dataIndex: 'value',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '最近修改时间',
      dataIndex: 'updated_at',
      render: time => timeToStr(time, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 160,
      render: _record => (
        <Fragment>
          <a onClick={() => this.operatingAction('copy', _record)}>复制</a>
          <Divider type="vertical" />
          <a onClick={() => this.operatingAction('edit', _record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title={'是否确认删除，删除后将不能恢复。'}
            onConfirm={() => this.operatingAction('delete', _record)}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  render() {
    const { dict, loading, dispatch, type } = this.props;
    const { columns } = this;

    const SearchHeaderProps = {
      modelName: 'dict',
      defaultValues: dict.search,
      dispatch,
    };

    const tableProps = {
      columns,
      loading,
      page: dict.page,
      dataSource: dict.list,
      action: 'dict/fetchPage',
    };

    const operatingProps = {
      ...this.state.operatingModal,
      onCancel: () => this.operatingModal({ visible: false }),
      onSubmit: (values, callback) => this.operatingAction('save', values, callback),
      type,
    };

    return (
      <div>
        <Operating {...operatingProps} />
        <Card bordered={false}>
          <SearchHeader {...SearchHeaderProps}>
            <SearchHeader.SelectSearch label="类型" name="type" type="dictListType" placeholder="请输入" />
            <SearchHeader.Input label="标签名称" name="label" />
          </SearchHeader>
          <AddButton onClick={() => this.operatingModal({ visible: true })} />
          <Table {...tableProps} />
        </Card>
      </div>
    );
  }
}

export default Index;
