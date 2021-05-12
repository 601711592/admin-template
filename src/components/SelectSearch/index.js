import React from 'react';
import { Select } from 'antd';
import request from 'utils/request.js';
import api, { apiHandle } from '@/services';

const { dictTypes, dictList, rolePage, supplierPage, areaPage } = api;

const Option = Select.Option;

const TYPE_LIST = {
  supplier: {
    API: supplierPage,
    KEY: 'name',
    ID: 'id',
    LABEL: 'name',
    PARAM: {
      //接口参数
      pageSize: 99999,
    },
  },
  area: {
    API: areaPage,
    KEY: 'name',
    ID: 'id',
    LABEL: 'name',
    PARAM: {
      //接口参数
      pageSize: 99999,
    },
  },
  dict: {
    API: dictList,
    KEY: 'label',
    ID: 'value',
    LABEL: 'label',
    PARAM: {
      //接口参数
      pageSize: 99999,
    },
  },
  role: {
    API: rolePage,
    KEY: 'name',
    LABEL: 'name',
    PARAM: {
      //接口参数
      pageSize: 99999,
    },
  },
  dictListType: {
    API: dictTypes,
    KEY: 'type',
    ID: 'type',
    LABEL: 'type',
  },
};

function getApi(type) {
  return TYPE_LIST[type].API;
}
function getKey(type) {
  return TYPE_LIST[type].KEY;
}
function getLabel(type) {
  return TYPE_LIST[type].LABEL;
}
function getParam(type) {
  return TYPE_LIST[type].PARAM;
}
function getId(type) {
  return TYPE_LIST[type].ID;
}

export default class SearchInput extends React.Component {
  state = {
    data: [],
    value: undefined,
  };

  timeout = '';
  fetch = (data, type, callback) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    const _request = getApi(type);
    const param = getParam(type);
    function fake() {
      _request({ ...param, ...data }).then(response => {
        if (apiHandle(response, true)) {
          Array.isArray(response.data) ? callback(response.data) : callback(response.data.data || []);
        }
      });
    }

    this.timeout = setTimeout(fake, 300);
  };

  handleSearch = value => {
    const data = {};
    data[getKey(this.props.type)] = value || undefined;
    this.fetch(data, this.props.type, data => this.setState({ data }));
  };

  componentDidMount = () => {
    const { initParams, type } = this.props;
    let data = {};
    if (initParams) {
      //判断是否有初始查询值
      data = initParams;
    }
    this.fetch(data, type, data => this.setState({ data }));
  };

  UNSAFE_componentWillReceiveProps = newProps => {
    if (JSON.stringify(this.props.initParams) !== JSON.stringify(newProps.initParams)) {
      this.fetch(newProps.initParams, this.props.type, data => this.setState({ data }));
    }
  };

  handleChange = (value, el) => {
    const { onChange, allOption = false } = this.props;
    value === undefined && this.handleSearch(undefined);
    if (allOption) {
      if (value.findIndex(v => v === '-1') === value.length - 1) {
        value = ['-1'];
      } else {
        const index = value.findIndex(v => v === '-1');
        index >= 0 && value.splice(index, 1);
      }
      onChange(value);
      return;
    }
    let item = null;
    if (el && Array.isArray(el)) {
      item = el[0].props.item;
    } else if (el) {
      item = el.props.item;
    }
    onChange && onChange(value === undefined ? '' : value, item);
  };

  render() {
    let { keyName, type, optionKey, value, notFoundContent, showSearch = true, allowClear = true, mode = '', allOption = false, ...otherProps } = this.props;
    const key = keyName || getId(type) || 'id';
    const label = optionKey || getLabel(type);

    const options =
      this.state.data &&
      this.state.data.map(d => (
        <Option key={d[key] + ''} item={d}>
          {d[label]}
        </Option>
      ));
    if (allOption) {
      options.unshift(<Option key="-1">全部</Option>);
    }
    if (!Array.isArray(value)) {
      value = value ? value + '' : undefined;
    }

    return (
      <Select
        {...otherProps}
        mode={mode}
        allowClear={allowClear}
        showSearch={showSearch} //是否为搜索选择框
        value={value} //值
        placeholder={this.props.placeholder || '请输入关键词搜索或选择'} //默认提示
        // style={this.props.style}//样式
        defaultActiveFirstOption={false} //是否默认高亮第一个选项。
        showArrow={true} //是否显示下拉小箭头
        filterOption={false} //是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
        onSearch={this.handleSearch} //搜索方法
        onChange={this.handleChange} //选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
        notFoundContent={notFoundContent || null} //当下拉列表为空时显示的内容
      >
        {options}
      </Select>
    );
  }
}
