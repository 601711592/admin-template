import React from 'react';
import { Transfer } from 'antd';
import { apiHandle, organizationPageOrganization } from '@/services/api';

const TYPE_LIST = {
  company: {
    API: organizationPageOrganization,
    KEY: 'id',
    TITLE: 'companyName',
    PARAM: {
      //接口参数
      current: 1,
      size: 99999
    }
  }
};

function getApi(type) {
  return TYPE_LIST[type].API;
}
function getKey(type) {
  return TYPE_LIST[type].KEY;
}
function getTitle(type) {
  return TYPE_LIST[type].TITLE;
}
function getParam(type) {
  return TYPE_LIST[type].PARAM;
}

class Index extends React.Component {
  state = {
    data: [],
    // targetKeys: [],
    selectedKeys: []
  };

  timeout = '';
  fetch = (data = {}, type, callback) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    const _request = getApi(type);
    const param = getParam(type);
    function fake() {
      _request({ ...param, ...data }).then((response) => {
        if (apiHandle(response, true)) {
          Array.isArray(response.data) ? callback(response.data) : callback(response.data.list || []);
        }
      });
    }

    this.timeout = setTimeout(fake, 300);
  };
  key;
  title;
  componentDidMount = () => {
    const { type } = this.props;
    this.key = getKey(type);
    this.title = getTitle(type);
    this.fetch({}, type, (data) => this.setState({ data }));
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    // this.setState({ targetKeys: nextTargetKeys });

    // console.log('targetKeys: ', nextTargetKeys);
    // console.log('direction: ', direction);
    // console.log('moveKeys: ', moveKeys);

    this.props.onChange(nextTargetKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    // console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    // console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  render() {
    const { selectedKeys, data } = this.state;
    const { value, titles = ['源列表', '目标列表'] } = this.props;
    return (
      <div>
        <Transfer
          showSearch
          dataSource={data}
          targetKeys={value.map((v) => v + '')}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          // onScroll={this.handleScroll}
          render={(item) => item[this.title]}
          titles={titles}
          listStyle={{ width: 227, height: 250 }}
          operations={['加入右侧', '加入左侧']}
          rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

export default Index;
