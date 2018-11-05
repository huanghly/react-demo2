import { message } from 'antd';
import { getLabelDisorderData, labelOrderResult, labelRelationUpdate } from '@/services/api';
import { errorHandle } from '@/utils/utils';

export default {
  namespace: 'labelRelationOther',

  state: {
    LabelDisorderData: [],
    
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getLabelDisorderData, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: response,
        });
        callback();
      }
    },
    *orderResult({ payload, callback }, { call }) {
      const response = yield call(labelOrderResult, payload);
      if(errorHandle(response)) {
        message.success('排序成功');
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(labelRelationUpdate, payload);
      if(errorHandle(response)) {
        message.success('关联成功');
        callback();
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        LabelDisorderData: action.payload,
      };
    },
  },
};
