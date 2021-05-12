import { Component, Fragment } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import Table from '@/components/Table';
import { timeToStr } from '@/utils';

@connect(({ syslog, loading }) => ({
	syslog,
	loading: loading.models.syslog
}))
class Index extends Component {
	state = {
		operatingModal: {
			visible: false,
			record: {}
		}
	};

	componentDidMount = () => {
		this.props.dispatch({ type: 'syslog/fetchPage' });
	};

	operatingAction = (type, record, callback) => {
		const { dispatch } = this.props;
		switch (type) {
			case 'edit':
				this.operatingModal({ visible: true, record });
				break;
			case 'delete':
				dispatch({
					type: 'syslog/delete',
					data: record
				});
				break;
			case 'save':
				dispatch({
					type: 'syslog/save',
					data: record,
					callback
				});
				break;
			default:
		}
	};

	render() {
		const { syslog, loading } = this.props;

		const columns = [
			{
				title: '标题',
				dataIndex: 'logTitle'
			},
			{
				title: '描述',
				dataIndex: 'logTypeDes'
			},
			{
				title: '请求方式',
				dataIndex: 'requestMethod'
			},
			{
				title: '请求接口',
				dataIndex: 'requestUri'
			},
			{
				title: '时间',
				dataIndex: 'createTime',
				render: (time) => timeToStr(time, 'YYYY-MM-DD HH:mm:ss')
			}
			// {
			//     title: '操作',
			//     width: 130,
			//     render: (_record) => (
			//         <Fragment>
			//             <a onClick={() => this.operatingAction("edit", _record)}>修改</a>
			//             <Divider type="vertical" />
			//             <Popconfirm placement="topLeft" title={"是否确认删除，删除后将不能恢复。"} onConfirm={() => this.operatingAction("delete", _record)}>
			//                 <a >删除</a>
			//             </Popconfirm>
			//         </Fragment>
			//     ),
			// }
		];

		const tableProps = {
			columns,
			loading,
			page: syslog.page,
			dataSource: syslog.list,
			action: 'syslog/fetchPage',
			rowKey: ''
		};

		return (
			<Card bordered={false}>
				<Table {...tableProps} />
			</Card>
		);
	}
}

export default Index;
