import { getSourceAndArea } from '@/services/api';
import { errorHandle } from '@/utils/utils';

export default {
  namespace: 'evaluationOther',

  state: {
    SourceAndAreaList: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSourceAndArea, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveSourceAndAreaList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveSourceAndAreaList(state, action) {
      return {
        ...state,
        SourceAndAreaList: action.payload,
      };
    },
  },
};
