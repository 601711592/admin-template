import { Modal, Input, Form } from 'antd';

const editPassModal = ({
    form: {
        getFieldDecorator,
        validateFields,
        resetFields,
        getFieldValue,
        setFields,
    },
    visible,
    onCancel,
    onSubmit
}) => {

    const modalProps = {
        title: "修改登录密码",
        width: 400,
        visible,
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
        onCancel
    }

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== getFieldValue('password')) {
            callback('与新密码不一致!');
        } else {
            callback();
        }
    }

    return <Modal {...modalProps}>
        <Form.Item label="当前密码">
            {getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: '请输入当前密码' }],
            })(<Input.Password placeholder="请输入当前密码" />)}
        </Form.Item>
        <Form.Item label="新密码">
            {getFieldDecorator('password', {
                rules: [
                    { required: true, message: '请输入新密码' },
                    { min: 8, message: "密码长度不可小于8位" },
                    { max: 14, message: "密码长度不可大于14位" },
                ],
            })(<Input.Password placeholder="密码长度8~14个字符，支持数字、字母和符号" />)}
        </Form.Item>
        <Form.Item label="确认密码">
            {getFieldDecorator('confirm', {
                rules: [{
                    required: true, message: '请输入确认密码',
                }, {
                    validator: compareToFirstPassword,
                }],
            })(<Input.Password placeholder="请输入确认密码" />)}
        </Form.Item>
    </Modal>
}

export default Form.create()(editPassModal);