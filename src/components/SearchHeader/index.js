import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, DatePicker, Affix, Row, Col } from 'antd';
import SearchItem from './SearchItem';
import moment from 'moment';
import styles from './index.less';
const FormItem = Form.Item;

@Form.create()
class Index extends Component {
  state = {};

  static childContextTypes = {
    form: PropTypes.object,
    defaultValues: PropTypes.object,
  };
  getChildContext() {
    return {
      form: this.props.form,
      defaultValues: this.props.defaultValues || {},
    };
  }
  search = values => {
    // console.log(`${this.props.modelName}/setSearch`)
    Object.keys(values).map(key => {
      const val = values[key];
      let item;
      //查找key对应的react对象
      React.Children.forEach(this.props.children, _item => {
        if (_item && _item.props.name === key) {
          item = _item;
        }
      });
      if (val && val.format) {
        values[key] = val.format(item.props.formatStr || 'YYYY-MM-DD HH:mm:ss');
      }
      if (Array.isArray(val) && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          if (val[i]._isAMomentObject) {
            values[item.props.name.split('|')[i]] = val[i].format(item.props.formatStr || 'YYYY-MM-DD HH:mm:ss');
          }
        }
      }
      // if(Object.prototype.toString.call(values[key]) == "[object String]" && values[key] == ""){
      //     values[key] = undefined;
      // }
    });
    const { dispatch, onSubmit, form } = this.props;

    onSubmit
      ? onSubmit(values, form)
      : dispatch({
          type: `${this.props.modelName}/setSearch`,
          payload: values,
        });
  };

  fetch = () => {
    const { dispatch, onSubmit } = this.props;
    onSubmit ||
      dispatch({
        type: `${this.props.modelName}/fetchPage`,
        payload: { current: 1 }, //搜索时重置当前页数为第一页
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.search(values);
        this.fetch();
      }
    });
  };

  empty = () => {
    this.props.form.resetFields();
    const values = {};
    const arr = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    arr.map(v => {
      const { name, value } = v.props;
      if (value) {
        values[name] = value;
      }
    });
    this.search(values);
    if (!this.props.emptyNotSearch) {
      this.fetch();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      showButton = true,
    } = this.props;

    const footer = (
      <Col align="right" style={{ pointerEvents: 'none', ...(!showButton && { display: 'none' }) }}>
        <Button type="primary" htmlType="submit" ghost style={{ pointerEvents: 'all' }}>
          搜索
        </Button>
        <Button style={{ marginLeft: 10, pointerEvents: 'all' }} onClick={this.empty}>
          清空
        </Button>
      </Col>
    );

    return (
      // <Affix offsetTop={0}>
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Form onSubmit={this.handleSubmit} layout="inline" className={styles.searchListForm}>
          {this.props.children.length % 3 === 0 ? (
            <Fragment>
              <Row gutter={{ md: 48, lg: 24, xl: 48 }}>
                {this.props.children.map((v, k) => (
                  <Col key={k} md={8} sm={24}>
                    {v}
                  </Col>
                ))}
              </Row>
              <Row>{footer}</Row>
            </Fragment>
          ) : (
            <Fragment>
              <Row gutter={{ md: 48, lg: 24, xl: 48 }}>
                {this.props.children.length === undefined ? (
                  <Col md={8} sm={24}>
                    {this.props.children}
                  </Col>
                ) : (
                  this.props.children.map((v, k) => (
                    <Col key={k} md={8} sm={24}>
                      {v}
                    </Col>
                  ))
                )}
                {footer}
              </Row>
            </Fragment>
          )}
        </Form>
      </div>
      // </Affix>
    );
  }
}

Object.keys(SearchItem).forEach(item => {
  Index[item] = SearchItem[item];
});

export default Index;
