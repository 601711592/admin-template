import { Button, Icon } from 'antd';

export default function({ text, ...props }) {
  return (
    <Button style={{ marginBottom: 24 }} type="primary" {...props}>
      <Icon type="plus" />
      {text || '新增'}
    </Button>
  );
}
