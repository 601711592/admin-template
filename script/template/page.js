import { Fragment, Component } from 'react';
import { Card, Divider, Popconfirm } from 'antd';
import SearchHeader from 'components/SearchHeader';
import { AddButton } from 'components/Button';
import Table from 'components/Table';
import Operating from './Operating';
import { connect } from 'dva';
import { timeToStr } from '@/utils';

@connect(({ _modelName_, loading }) => ({
  _modelName_,
  loading: loading.models._modelName_,
}))
class Index extends Component {
  state = {
    operatingModal: {
      visible: false,
      record: {},
    },
  };

  componentDidMount = () => {
    this.props.dispatch({ type: '_modelName_/fetchPage' });
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
          type: '_modelName_/delete',
          data: record,
        });
        break;
      case 'save':
        dispatch({
          type: '_modelName_/save',
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
    },
    {
      title: '操作',
      width: 160,
      render: _record => (
        <Fragment>
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
    const { _modelName_, loading, dispatch } = this.props;
    const { columns } = this;

    const SearchHeaderProps = {
      modelName: '_modelName_',
      defaultValues: _modelName_.search,
      dispatch,
    };

    const tableProps = {
      columns,
      loading,
      page: _modelName_.page,
      dataSource: _modelName_.list,
      action: '_modelName_/fetchPage',
    };

    const operatingProps = {
      ...this.state.operatingModal,
      onCancel: () => this.operatingModal({ visible: false }),
      onSubmit: (values, callback) => this.operatingAction('save', values, callback),
    };

    return (
      <div>
        <Operating {...operatingProps} />
        <Card bordered={false}>
          <SearchHeader {...SearchHeaderProps}>
            {/* <SearchHeader.SelectSearch label="类型" name="type" type="dictListType" placeholder="请输入" /> */}
            <SearchHeader.Input label="名称" name="name" />
          </SearchHeader>
          <AddButton onClick={() => this.operatingModal({ visible: true })} />
          <Table {...tableProps} />
        </Card>
      </div>
    );
  }
}

export default Index;
