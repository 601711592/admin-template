import React from 'react';
import { Input, Icon, DatePicker, Select } from 'antd';
// import Select from './Select';
import SelectSearch from 'components/SelectSearch';
import TreeSelect from 'components/TreeSelect';
const { MonthPicker, RangePicker } = DatePicker;

const map = {
  Input: {
    component: Input,
    props: {
      placeholder: '请输入关键词',
      style: {
        width: '100%',
      },
    },
  },
  Hide: {
    component: Input,
    props: {},
  },
  Select: {
    component: Select,
    props: {
      style: {
        minWidth: 120,
      },
      placeholder: '请选择',
    },
  },
  Date: {
    component: DatePicker,
    props: {},
  },
  SelectSearch: {
    component: SelectSearch,
    props: {
      style: {
        width: '100%',
      },
      placeholder: '请选择或搜索',
    },
  },
  TreeSelect: {
    component: TreeSelect,
    props: {
      style: {
        width: '100%',
      },
      placeholder: '请选择',
    },
  },
  MonthPicker: {
    component: MonthPicker,
    props: {
      style: {
        width: '100%',
      },
    },
  },
  RangePicker: {
    component: RangePicker,
    props: {
      style: {
        width: '100%',
      },
    },
  },
};

export default map;
