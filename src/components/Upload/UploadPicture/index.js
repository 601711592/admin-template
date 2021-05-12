import React, { Fragment } from 'react';
import { message, Upload, Icon } from 'antd';
import PreviewModal from './preview.modal';
import { updateImgURL, apiHandle } from '@/services/api';
import { getAuthData } from '@/utils/request';

const uploadButton = (text = '上传图片') => (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">{text}</div>
  </div>
);

class UploadPicture extends React.Component {
  state = {
    loading: false,
    previewModal: {
      visible: false,
      image: ''
    }
  };
  headers;
  componentDidMount = () => {
    this.headers = getAuthData();
  };

  handleChange = (info) => {
    const { autoUpload = false, fileList = [], setFileList } = this.props;
    if (!autoUpload) {
      return;
    }
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({ loading: false });
      const { response } = info.file;
      if (apiHandle(response)) {
        const { data } = response;
        const list = [
          ...fileList.filter((i) => i.uid !== info.file.uid),
          {
            uid: info.file.uid,
            name: info.file.name,
            status: 'done',
            url: data
          }
        ];
        setFileList(list);
      }
    }
  };

  beforeUpload = (file) => {
    const { fileList = [], setFileList, verify = {}, autoUpload = false } = this.props;

    if (!/^image\/+/.test(file.type)) {
      message.error('请选择图片类型的文件!');
      return false;
    }
    if (verify.maxSize > 0 && file.size / 1000 / 1000 > verify.maxSize) {
      message.error(`图片大小不能超过${verify.maxSize}MB`);
      return false;
    }

    const p = new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;

        const img = document.createElement('img');
        img.onload = () => {
          if (verify.width > 0 && verify.height > 0 && verify.width !== img.width && verify.height !== img.height) {
            message.error(`图片只支持尺寸 ${verify.width} * ${verify.height}的图片`);
            reject();
            return;
          }
          resolve();

          setFileList([
            ...fileList,
            {
              uid: file.uid,
              name: file.name,
              status: autoUpload ? 'uploading' : 'done',
              url: data,
              file
            }
          ]);
        };
        img.src = data;
      };
      reader.readAsDataURL(file);
    });

    return p;
  };

  onRemove = (file) => {
    const { fileList = [], setFileList } = this.props;
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  handlePreview = (file) => {
    this.setState(({ previewModal }) => {
      previewModal.visible = true;
      previewModal.image = file.url;
      return previewModal;
    });
  };

  closePreview = () => {
    this.setState(({ previewModal }) => {
      previewModal.visible = false;
      previewModal.image = '';
      return previewModal;
    });
  };

  render() {
    const { fileList = [], number, uploadBottomText, autoUpload = false } = this.props;

    let props = {
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload,
      listType: 'picture-card',
      fileList,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      accept: 'image/*',
      multiple: this.props.multiple || false
    };

    if (autoUpload) {
      props = {
        name: 'images',
        action: updateImgURL,
        headers: this.headers,
        ...props
      };
    }

    const PreviewModalProps = {
      ...this.state.previewModal,
      onCancel: this.closePreview
    };

    return (
      <Fragment>
        <Upload {...props}>{fileList.length >= number ? null : uploadButton(uploadBottomText)}</Upload>
        <PreviewModal {...PreviewModalProps} />
      </Fragment>
    );
  }
}

export default UploadPicture;
