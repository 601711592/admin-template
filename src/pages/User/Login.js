import { Component, Fragment } from 'react';
import { Input, Form, Layout, Icon, Button, Checkbox } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './index.less';
import { connect } from 'dva';

const FormItem = Form.Item;

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 韶关游
  </Fragment>
);

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  inputPass;
  componentDidMount = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const rememberPassword = localStorage.getItem('rememberPassword');
    if (rememberPassword) {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      setFieldsValue({
        username,
        password,
        rememberPassword: !!rememberPassword,
      });
      this.inputPass.focus();
    }
  };

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/login',
          payload: values,
          values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, validateFields, resetFields },
      loading,
    } = this.props;

    return (
      <div className={styles.layout_bg}>
        <div className={styles.colors}>
          <div className={styles.color_1} />
          <div className={styles.color_2} />
          <div className={styles.color_3} />
          <div className={styles.color_4} />
          <div className={styles.color_5} />
        </div>
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <span className={styles.title}>韶关游管理系统</span>
              </div>
            </div>
            <div className={styles.main}>
              <Form>
                <FormItem label="">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入您的帐号', whitespace: true }, { type: 'email', message: '请输入正确的电子邮箱' }],
                  })(<Input autoComplete="off" placeholder="请输入您的帐号" prefix={<Icon type="user" className={styles.prefixIcon} />} size="large" />)}
                </FormItem>
                <FormItem label="">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码', whitespace: true }],
                  })(
                    <Input
                      placeholder="请输入密码"
                      ref={node => (this.inputPass = node)}
                      prefix={<Icon type="lock" className={styles.prefixIcon} />}
                      type="password"
                      size="large"
                    />
                  )}
                </FormItem>
                <div className={styles.checkbox}>
                  {getFieldDecorator('rememberPassword', {
                    valuePropName: 'checked',
                    initialValue: false,
                  })(<Checkbox>记住密码</Checkbox>)}
                </div>
                {getFieldDecorator('type', {
                  initialValue: 'account',
                })(<Input style={{ display: 'none' }} />)}
                <FormItem className={styles.button}>
                  <Button onClick={this.onSubmit} htmlType="submit" type="primary" size="large" loading={loading} className={styles.submit}>
                    登录
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </div>
    );
  }
}

export default Login;
