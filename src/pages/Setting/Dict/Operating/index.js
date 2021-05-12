import { Modal, Button, Form, Select, DatePicker, Row, Col, Input, Tree, Table } from 'antd';
import { Fragment, Component } from 'react';
import SelectSearch from '@/components/SelectSearch';

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

class Operating extends Component {
  state = {};

  render() {
    const {
      record = {},
      onCancel,
      visible,
      form: { getFieldDecorator, validateFields, resetFields, setFields, getFieldValue },
      onSubmit,
    } = this.props;

    const modalProps = {
      title: record.id ? '修改字典' : '新建字典',
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
        });
      },
    };

    return (
      <Modal {...modalProps}>
        <Form>
          <div style={{ display: 'none' }}>{getFieldDecorator('id', { initialValue: record.id })(<Input />)}</div>

          <Form.Item label="名称" {...formItemLayout}>
            {getFieldDecorator('label', {
              rules: [{ required: true, message: '请输入名称', whitespace: true }],
              initialValue: record.label,
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="键值" {...formItemLayout}>
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '请输入键值', whitespace: true }],
              initialValue: record.value,
            })(<Input placeholder="请输入键值" />)}
          </Form.Item>
          <Form.Item label="类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请输入类型', whitespace: true }],
              initialValue: record.type,
            })(<Input placeholder="请输入类型" />)}
          </Form.Item>
          <Form.Item label="描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              initialValue: record.desc,
              ules: [{ required: true, message: '请输入描述', whitespace: true }],
            })(<Input placeholder="请输入描述" />)}
          </Form.Item>
          <Form.Item label="排序" {...formItemLayout}>
            {getFieldDecorator('sort', {
              initialValue: (record.sort || '50') + '',
              rules: [{ pattern: /^\d+$/, message: '请输入数字' }, { max: 4, message: '长度不能超过4位数' }],
            })(<Input placeholder="请输入排序" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Operating);
