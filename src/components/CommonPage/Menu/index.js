import { Component } from 'react';
import { AddButton } from 'components/Button';
import { Tree, Card, Icon, Popconfirm, Table, Badge, Divider, Spin } from 'antd';
import Operating from './Operating';
import { connect } from 'dva';


@connect(({ menu, loading, platform }) => ({
    menu,
    loading: loading.models.menu,
    funcConfList: platform.funcConfList
}))
class Index extends Component {
    state = {
        operatingModal: {
            visible: false,
            record: {}
        }
    }

    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch({ type: "menu/fetchTree", payload: { type: this.props.type } });
        dispatch({ type: "platform/getFuncConfList" });
    }

    operatingAction = (type, record, callback) => {
        const { dispatch } = this.props;
        switch (type) {
            case "edit":
                dispatch({
                    type: "menu/get",
                    data: record,
                    callback: (record) => {
                        this.operatingModal({ visible: true, record });
                    }
                })
                break;
            case "delete":
                dispatch({
                    type: "menu/delete",
                    data: record
                });
                break;
            case "save":
                dispatch({
                    type: "role/save",
                    data: record,
                    callback
                })
                break;
        }
    }

    operatingModal = ({ visible, record = {} }) => {
        this.setState(({ operatingModal }) => {
            operatingModal.visible = visible;
            operatingModal.record = record;
            return operatingModal
        })
    }

    render() {
        const { menu: { tree, expandedRowKeys }, dispatch, loading, funcConfList, type } = this.props;


        const columns = [{
            title: '名称',
            dataIndex: 'name',
            render: (text, record) => (<a>{record.icon && <Icon type={record.icon} style={{ marginRight: 5 }} />}{text}</a>),
        }, {
            title: 'URL',
            dataIndex: 'url',
        }, {
            title: '权限标识',
            dataIndex: 'permissions',
        }, {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
        }, {
            title: '显示',
            dataIndex: 'visible',
            width: 50,
            render: (text) => (
                text == 1 && <Badge status="success" text="是" /> ||
                <Badge status="error" text="否" />
            )
        }, {
            title: '类型',
            dataIndex: 'menuClazz',
            width: 65,
            render: (text) => (
                text == "url" && <Badge status="processing" text="菜单" /> ||
                text == "func" && <Badge status="warning" text="操作" />
            )
        }, {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.operatingAction("edit", _record)}>修改</a>
                    <Divider type="vertical" />
                    <Popconfirm title="操作不可逆，是否确认删除?" onConfirm={() => this.operatingAction("delete", _record)} okText="是" cancelText="否">
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a href="javascript:;"
                        onClick={() => this.operatingModal({
                            visible: true,
                            record: {
                                parentId: _record.id,
                            }
                        })}>添加下级菜单</a>
                </span >
            ),
        }];

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
                    data.push(record.id + "");
                } else {
                    data = data.filter(v => v != record.id)
                }
                dispatch({
                    type: "menu/setExpandedRowKeys",
                    data,
                })
            },
            size: "small",
            rowKey: "id"
        }

        const ModelProps = {
            onCancel: () => this.setState(({ operatingModal }) => { operatingModal.visible = false, operatingModal.record = {}; return operatingModal }),
            ...this.state.operatingModal,
            dispatch: dispatch,
            type,
            funcConfList
        }

        return <Card bordered={false}>
            <AddButton onClick={() => this.setState(({ operatingModal }) => {
                operatingModal.visible = true;
                operatingModal.record = {};
                return operatingModal
            })} />
            <Operating {...ModelProps} />
            <Spin spinning={loading}><Table  {...tableProps} /></Spin>
        </Card>
    }

}


export default Index;