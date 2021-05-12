import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';
import map from './map';

const FormItem = Form.Item;
const { Option } = Select;


function generator({ defaultProps, defaultRules, type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        defaultValues: PropTypes.object,
      };
      constructor(props) {
        super(props);
      }
      render() {
        const { getFieldDecorator, setFields, getFieldValue } = this.context.form;
        const { defaultValues } = this.context;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules, name, label, onClick, selectOptions, value, normalize, ...restProps } = this.props;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (type === "Input") {
          options.normalize = (val, r) => {
            if (val == "") {
              return undefined;
            }
            return val ? val.replace(/^\s+|\s$/g, "") : val;
          };
        }
        // if (defaultValue) {
        //   options.initialValue = defaultValue;
        // }
        options.initialValue = defaultValues[name];
        otherProps = restProps || otherProps;
        if (type === "Select") {
          const OptionList = selectOptions && selectOptions.map(v => (
            <Option value={v.value} key={v.value}>{v.name}</Option>
          ));
          return (
            <FormItem label={label} >
              {getFieldDecorator(name, options)(
                <WrappedComponent {...defaultProps} {...otherProps} >
                  {OptionList}
                </WrappedComponent>
              )}
            </FormItem>
          )
        }
        if (type === "Hide") {
          options.initialValue = value;
          return (
            <div style={{ display: "none" }}>
              {getFieldDecorator(name, options)(
                <WrappedComponent {...defaultProps} {...otherProps} />
              )}
            </div>
          )
        }
        if (type === "SelectSearch") {
          return (
            <FormItem label={label}>
              {getFieldDecorator(name, options)(
                <Input style={{ display: "none" }} />
              )}
              <WrappedComponent {...defaultProps} {...otherProps} value={getFieldValue(name)} onChange={(v) => {
                const obj = {};
                obj[name] = {
                  value: v
                };
                setFields(obj);
              }} />
            </FormItem>
          )
        }

        return (
          <FormItem label={label}>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const SearchItem = {};
Object.keys(map).forEach(item => {
  SearchItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default SearchItem;
