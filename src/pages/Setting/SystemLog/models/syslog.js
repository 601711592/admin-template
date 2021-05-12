import { apiHandle, sysLogPage } from '@/services/api';

export default {
	state: {
		list: [],
		page: {
			current: 1,
			size: 10
		},
		search: {}
	},

	effects: {
		*fetchPage({ payload = {} }, { call, put, select }) {
			const { page, search } = yield select((state) => state.syslog);
			const response = yield call(sysLogPage, { ...page, ...search, ...payload });
			if (apiHandle(response, true)) {
				const { data } = response;
				yield put({
					type: 'setState',
					payload: {
						...data
					}
				});
				if (data.list.length === 0 && data.page.current > 1) {
					const current = Math.ceil(data.page.total / data.page.size) || 1;
					yield put({ type: 'fetchPage', payload: { current } });
				}
			}
		}
	},

	reducers: {
		setState(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
		setSearch(state, { payload }) {
			return {
				...state,
				search: {
					...state.search,
					...payload
				}
			};
		}
	}
};
