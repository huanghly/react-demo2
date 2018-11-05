import { getSourceTable } from '@/services/api';
import { dataFormater, errorHandle } from '@/utils/utils';

export default {
  namespace: 'sourceTable',

  state: {
    sourceTable: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSourceTable, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: dataFormater(response, response.data),
        });
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        sourceTable: action.payload,
      };
    },
  },
};
