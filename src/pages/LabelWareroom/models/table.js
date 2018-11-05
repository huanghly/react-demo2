import { getLabelTable } from '@/services/api';
import { dataFormater, errorHandle } from '@/utils/utils';

export default {
  namespace: 'labelWareroomTable',

  state: {
    LabelWareroomTable: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getLabelTable, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: response,
        });
        callback(response);
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        LabelWareroomTable: action.payload,
      };
    },
  },
};
