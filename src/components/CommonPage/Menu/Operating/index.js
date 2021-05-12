import { Modal, Form, Input, Button, Radio, message, Select } from 'antd';
import TreeSelectComponent from '@/components/TreeSelect';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 }
  }
};

const ModelForm = ({
  record,
  visible,
  onCancel,
  form: { getFieldDecorator, validateFieldsAndScroll, setFields, resetFields },
  submitting,
  dispatch,
  menu,
  type,
  funcConfList
}) => {
  const onOk = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'menu/save',
          data: values,
          callback: () => {
            onCancel();
            resetFields();
          }
        });
      }
    });
  };

  var modalProps = {
    title: record.id ? '修改菜单' : '新增菜单',
    visible,
    onCancel,
    width: 700,
    footer: '',
    maskClosable: false,
    destroyOnClose: true
  };

  return (
    <Modal {...modalProps}>
      <Form onSubmit={onOk}>
        <div style={{ display: 'none' }}>
          {getFieldDecorator('id', { initialValue: record.id })(<Input />)}
          {getFieldDecorator('type', { initialValue: type })(<Input />)}
        </div>
        <FormItem {...formItemLayout} label="父级菜单">
          {getFieldDecorator('parentId', {
            initialValue: record.parentId ? record.parentId.toString() : undefined
          })(<TreeSelectComponent type="menu" apiParams={{ type }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="菜单名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入菜单名称', whitespace: true }, { max: 10, message: '长度不能超过10个字符' }],
            initialValue: record.name || ''
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator('menuClazz', { initialValue: record.menuClazz || 'url' })(
            <Select style={{ width: 120 }}>
              <Option value="url">菜单</Option>
              <Option value="func">操作</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="排序">
          {getFieldDecorator('sort', { initialValue: record.sort || 50 })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="URL">
          {getFieldDecorator('url', {
            initialValue: record.url
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否可见">
          {getFieldDecorator('visible', {
            initialValue: record.visible != undefined ? record.visible.toString() : '1'
          })(
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="图标">
          {getFieldDecorator('icon', { initialValue: record.icon })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="HTML标识">
          {getFieldDecorator('code', {
            initialValue: record.code
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="权限标识">
          {getFieldDecorator('permissions', {
            initialValue: record.permissions
          })(<Input />)}
        </FormItem>
        {type == '1' && (
          <FormItem {...formItemLayout} label="对接模式">
            {getFieldDecorator('funIds', {
              initialValue: record.funIds ? record.funIds.map((v) => v.toString()) : []
            })(
              <Select mode="multiple" placeholder="请选择对接模式">
                {funcConfList.map((v) => (
                  <Option value={v.id} key={v.id}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            保存
          </Button>
          <Button
            onClick={() => {
              onCancel();
              resetFields();
            }}
            style={{ marginLeft: 8 }}
          >
            取消
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(ModelForm);
