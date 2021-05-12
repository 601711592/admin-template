import React, { Fragment } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, Upload, Icon } from 'antd';

const uploadButton = (
    <Button>
        <Icon type="upload" />上传文件
    </Button>
);


class UploadFile extends React.Component {
    state = {

    }

    render() {
        const { fileList = [], setFileList, number } = this.props;

        const props = {
            onRemove: (file) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
            },
            beforeUpload: (file) => {
                setFileList([...fileList, {
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    file
                }]);
                return false;
            },
            fileList,
            accept: ".xlsx,.xls",
            multiple: this.props.multiple || false,
        };


        return <Fragment>
            <Upload {...props}>
                {fileList.length >= number ? null : uploadButton}
            </Upload>
        </Fragment >
    }
}


export default UploadFile;