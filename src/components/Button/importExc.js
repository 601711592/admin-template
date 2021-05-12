import { Component } from 'react';
import { Button, Icon, Upload, message } from 'antd';
import { getAuthData } from '@/utils/request';
import { apiHandle } from '@/services';

export default class ImportExc extends Component {
  state = {
    loading: false,
  };

  render() {
    const { text = '导入报表', action, success, name = 'file' } = this.props;
    const { loading } = this.state;

    const props = {
      name,
      action,
      headers: {
        ...getAuthData(),
      },
      onChange: info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
          this.setState({ loading: false });
          const { response } = info.file;
          if (apiHandle(response)) {
            success && success(response);
          }
          console.log(response);
        } else if (info.file.status === 'error') {
          this.setState({ loading: false });
          message.error(`导入失败！`);
        }
      },
      accept: '.xls',
      showUploadList: false, //是否展示文件列表
    };

    return (
      <div style={{ display: 'inline-block' }}>
        <Upload {...props}>
          <Button style={{ marginBottom: 24 }} loading={loading}>
            {!loading && <Icon type="import" />}
            {text}
          </Button>
        </Upload>
      </div>
    );
  }
}
