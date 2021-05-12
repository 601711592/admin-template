import { Table } from 'antd';
import styles from './index.less';
import { connect } from 'dva';

function TableComponent({ dispatch, action, page = {}, rowKey, ...props }) {
  const onChange = (page, pageSize) => {
    dispatch({
      type: action,
      payload: {
        page,
        pageSize,
      },
    });
  };

  const tableProps = {
    ...props,
    rowKey: rowKey || 'id',
    pagination: {
      showTotal: total => <div>共 {total} 条数据</div>,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onShowSizeChange: onChange,
      onChange,
      current: page.page,
      pageSize: page.pageSize,
      total: page.total,
    },
  };

  return (
    <div className={styles.page}>
      <Table {...tableProps}></Table>
    </div>
  );
}

export default connect()(TableComponent);
