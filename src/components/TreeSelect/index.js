import React from 'react';
import { TreeSelect, message } from 'antd';
import api, { apiHandle } from '@/services';

const { menuGetTree } = api;

const TreeNode = TreeSelect.TreeNode;

const Config = {
  //菜单树
  menu: {
    api: menuGetTree,
    title: 'name',
    value: 'id',
    key: 'id',
  },
};

class TreeSelectComponent extends React.Component {
  state = {
    data: [],
  };

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    const { type, apiParams = {} } = this.props;
    if (!Object.keys(Config).find(k => k === type)) {
      message.error('树形选择框，类型不存在！');
      return;
    }

    Config[type].api(apiParams).then(response => {
      console.log(response);
      if (apiHandle(response, true)) {
        const { data } = response;
        this.setState({
          data,
        });
      }
    });
  };

  render() {
    const { type } = this.props;

    const { renderValueKey = Config[type].value, renderTitleKey = Config[type].title, renderKey = Config[type].key } = this.props;

    const renderTree = nodeList => {
      return nodeList.map((v, k) => {
        return (
          <TreeNode value={v[renderValueKey] + ''} title={v[renderTitleKey]} key={v[renderKey]}>
            {Array.isArray(v.children) && renderTree(v.children)}
          </TreeNode>
        );
      });
    };

    const {
      placeholder = '根节点',
      style = { width: '100%' },
      dropdownStyle = { maxHeight: 400, overflow: 'auto' },
      filterTreeNode = (val, node) => {
        return (node.props.title + '').indexOf(val) != -1 ? true : false;
      },
    } = this.props;

    const TreeSelectProps = {
      placeholder,
      style,
      dropdownStyle,
      filterTreeNode,
    };

    return (
      <TreeSelect showSearch allowClear treeDefaultExpandAll {...this.props} {...TreeSelectProps}>
        {renderTree(this.state.data || [])}
      </TreeSelect>
    );
  }
}

export default TreeSelectComponent;
