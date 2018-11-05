import { getUserTable } from '@/services/api';
import { dataFormater, errorHandle } from '@/utils/utils';

export default {
  namespace: 'usertable',

  state: {
    UserTable: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUserTable, payload);
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
        UserTable: action.payload,
      };
    },
  },
};
