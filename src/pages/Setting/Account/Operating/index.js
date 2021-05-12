import { Modal, Button, Form, Select, DatePicker, Row, Col, Input } from 'antd';
import { Fragment } from 'react';
import SelectSearch from '@/components/SelectSearch';

const Option = Select.Option;

function operating({ record = {}, onCancel, visible, form: { getFieldDecorator, validateFields, resetFields }, onSubmit }) {
  const modalProps = {
    title: '新建账号',
    onCancel: () => {
      resetFields();
      onCancel();
    },
    visible,
    width: 500,
    maskClosable: false,
    onOk: () => {
      validateFields((err, values) => {
        if (!err) {
          console.log(values);
          onSubmit({ ...values, roleIds: values.roleIds.join() }, () => {
            resetFields();
            onCancel();
          });
        }
      });
    },
  };

  return (
    <>
      <Modal {...modalProps}>
        <Form layout="vertical">
          <div style={{ display: 'none' }}>{getFieldDecorator('id', { initialValue: record.id })(<Input />)}</div>
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱' }],
              initialValue: record.email,
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          <Form.Item label="使用人">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入该账号使用者的姓名' }],
              initialValue: record.name,
            })(<Input placeholder="请输入该账号使用者的姓名" />)}
          </Form.Item>
          <Form.Item label="登录密码">
            {getFieldDecorator('password', {
              rules: record.id ? [] : [{ required: true, message: '请输入该账号登录密码' }],
              initialValue: record.password,
            })(<Input.Password placeholder="请输入该账号登录密码" />)}
          </Form.Item>
          <Form.Item label="角色">
            {getFieldDecorator('roleIds', {
              rules: [{ required: true, message: '请选择角色' }],
              initialValue: record.roles ? record.roles.map(item => item.id + '') : [],
            })(<SelectSearch type="role" mode="multiple" />)}
          </Form.Item>
          {/* <Form.Item label="店铺">
            {getFieldDecorator('shopIds', {
              initialValue: record.shops ? record.shops.map(item => item.id + '') : [],
            })(<SelectSearch type="shop" mode="multiple" />)}
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
}

export default Form.create()(operating);
