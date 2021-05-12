import { Modal, Form, Button, Col, Row, Input, Select, Upload, Icon } from 'antd';

export default ({
    visible,
    onCancel,
    image
}) => {

    return <Modal visible={visible} footer={null} onCancel={onCancel}>
        {image && <img alt="image" style={{ width: '100%' }} src={image} />}
    </Modal>
}