import { message } from 'antd';
import api, { apiHandle, apiHandlePrint } from '@/services';
import { getBase64 } from '@/utils/index';

import { printVisa, printLogisticsSheet } from '@/services/index';

const { printVisaInfo, printVisasInfo, printSFInfo, printSFNoInfo, printVisaTable } = api;

export default {
  state: {},

  effects: {
    *visa({ data }, { call, put }) {
      let response = yield call(printVisaInfo, data);
      if (apiHandle(response)) {
        const { data } = response;
        response = yield call(printVisa, data);
        apiHandlePrint(response);
      }
    },
    *batchVisa({ data }, { call, put }) {
      message.info('开始打印');
      let response = yield call(printVisasInfo, data);
      if (apiHandle(response, true)) {
        const { data } = response;
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          response = yield call(printVisa, item);
          apiHandlePrint(response);
        }
      }
    },
    //通过订单号
    *sf({ data }, { call, put }) {
      message.info('开始打印');
      let response = yield call(printSFInfo, data);
      if (apiHandle(response)) {
        const { data } = response;
        response = yield call(printLogisticsSheet, data);
        apiHandlePrint(response);
      }
    },
    //通过物流单号
    *sfno({ data }, { call, put }) {
      message.info('开始打印');
      let response = yield call(printSFNoInfo, data);
      if (apiHandle(response)) {
        const { data } = response;
        response = yield call(printLogisticsSheet, data);
        apiHandlePrint(response);
      }
    },
    //打印签证表格
    *visaTable({ data }, { call, put }) {
      message.info('开始打印');
      let response = yield call(printVisaTable, data);
      if (apiHandle(response)) {
        const { data } = response;
        // const div = document.createElement('div');
        // const img = document.createElement('img');
        // img.src = data.encoded;
        // img.style.width = '210mm';
        // img.style.height = '297mm';
        // div.appendChild(img);
        const printWindow = window.open(data, null, 'width:210mm;height:297mm;');
        // printWindow.document.write(div.innerHTML);
        // setTimeout(() => {
        //   printWindow.print();
        // }, 500);
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
