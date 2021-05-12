import { Button, Icon } from 'antd';

export default function({ onClick, text = '导出报表', loading = false }) {
  return (
    <Button style={{ marginBottom: 24 }} onClick={onClick} loading={loading}>
      {!loading && <Icon type="export" />}
      {text}
    </Button>
  );
}
