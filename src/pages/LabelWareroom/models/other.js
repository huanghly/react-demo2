import { message } from 'antd';
import { labelStateUpdate, labelAdd } from '@/services/api';
import { errorHandle } from '@/utils/utils';

export default {
  namespace: 'labelWareroomOther',

  state: {

  },

  effects: {
    *update({ payload, callback }, { call, put }) {
      const response = yield call(labelStateUpdate, payload);
      if(errorHandle(response)) {
        callback();
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(labelAdd, payload);
      if(errorHandle(response)) {
        message.success('添加成功')
        callback();
      }
    },
  },

};
