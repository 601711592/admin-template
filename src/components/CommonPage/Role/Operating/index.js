import { Modal, Button, Form, Select, DatePicker, Row, Col, Input, Tree, Table } from 'antd';
import { Fragment, Component } from 'react';


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const roleColumns = [
    {
        title: "权限名称",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "URL",
        dataIndex: "url",
        key: "url",
    }
]



class Operating extends Component {
    state = {

    }

    getParentArr = (id) => {
        let list = [];
        const r = this.props.menuPlane.find(v => v.id == id);
        if (r) {
            list.push(id);
            if (r.parentId) {
                list = list.concat(this.getParentArr(r.parentId));
            }
        }
        return list;
    }

    getChildren = (id) => {
        let list = [];
        const arr = this.props.menuPlane.filter(v => v.parentId == id);
        arr.map(v => {
            list.push(v.id);
            list = list.concat(this.getChildren(v.id))
        });
        return list;
    }

    render() {

        const {
            record = {},
            onCancel,
            visible,
            form: {
                getFieldDecorator,
                validateFields,
                resetFields,
                setFields,
                getFieldValue
            },
            onSubmit,
            menu,
            menuPlane,
            type
        } = this.props;

        const modalProps = {
            title: "新建角色",
            onCancel: () => {
                resetFields();
                onCancel();
            },
            visible,
            width: 600,
            maskClosable: false,
            onOk: () => {
                validateFields((err, values) => {
                    if (!err) {
                        onSubmit(values, () => {
                            resetFields();
                            onCancel();
                        });
                    }
                })
            },
            destroyOnClose: true,
        }

        const rowSelection = {
            selectedRowKeys: getFieldValue("menuIds"),
            onChange: (selectedRowKeys, selectedRows) => {
                setFields({
                    menuIds: {
                        value: selectedRows.map((v) => {
                            return v.id;
                        })
                    },
                });
            },
            onSelect: (records, selected, selectedRows) => {
                const selectedRowIds = selectedRows.map(v => v.id);
                const childrenIds = this.getChildren(records.id);
                let values = [];
                if (selected) {
                    const arr = this.getParentArr(records.parentId);
                    arr.map(v => {
                        if (!selectedRowIds.find(_ => _ == v)) {
                            selectedRowIds.push(v.toString());
                        }
                    })
                    values = selectedRowIds.concat(childrenIds);
                } else {
                    values = selectedRowIds.filter(v => !childrenIds.find(_ => _ == v));
                }
                setFields({
                    menuIds: {
                        value: values
                    },
                });
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

        const tableProps = {
            title: () => "配置权限",
            columns: roleColumns,
            rowSelection,
            dataSource: menu.tree || [],
            bordered: true,
            pagination: false,
            defaultExpandAllRows: true,
            size: "small",
            rowKey: "id"
        }

        return <>
            <Modal {...modalProps}>
                <Form >
                    <div style={{ display: "none" }}>
                        {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
                        {getFieldDecorator('type', { initialValue: type })(<Input />)}
                    </div>
                    <Form.Item label="角色名称" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入角色名称', whitespace: true },
                                { max: 15, message: "名称长度不能超过15个字符" }
                            ],
                            initialValue: record.name
                        })(<Input placeholder="请输入角色名称" />)}
                    </Form.Item>
                    <Form.Item label="排序" {...formItemLayout}>
                        {getFieldDecorator('sort', {
                            initialValue: record.sort ? record.sort.toString() : "50",
                            rules: [
                                { pattern: /^\d+$/, message: "请输入数字" },
                                { max: 4, message: "长度不能超过4位数" }
                            ]
                        })(<Input placeholder="请输入排序" />)}
                    </Form.Item>
                    <Table {...tableProps} />
                    <Form.Item {...formItemLayout} label="">
                        {getFieldDecorator('menuIds', {
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (value.length === 0) {
                                            callback("请配置至少一个权限")
                                        }
                                        callback();
                                    },
                                },
                            ],
                            initialValue: Array.isArray(record.menus) ? record.menus.map(v => v.id) : []
                        })(<Input style={{ display: "none" }} />)}
                    </Form.Item>

                </Form>
            </Modal>
        </>
    }


}


export default Form.create()(Operating)