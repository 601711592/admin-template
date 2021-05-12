import { Modal, Form, Input } from 'antd';
import { Component } from 'react';
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
      form: { getFieldDecorator, validateFields, resetFields },
      onSubmit,
    } = this.props;

    const modalProps = {
      title: record.id ? '修改_cname_' : '新建_cname_',
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
          <Form.Item label="标签名称" {...formItemLayout}>
            {getFieldDecorator('label', {
              rules: [{ required: true, message: '请输入标签名称', whitespace: true }],
              initialValue: record.label,
            })(<Input placeholder="请输入标签名称" />)}
          </Form.Item>
          <Form.Item label="排序" {...formItemLayout}>
            {getFieldDecorator('sort', {
              initialValue: (record.sort || '50') + '',
              rules: [{ pattern: /^\d+$/, message: '请输入数字' }, { max: 4, message: '长度不能超过4位数' }],
            })(<SelectSearch label="类型" name="type" type="dictListType" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Operating);
