import { getEvaluationTable, getEvaluationDetailTable } from '@/services/api';
import { dataFormater, errorHandle } from '@/utils/utils';

export default {
  namespace: 'evaluationTable',

  state: {
    evaluationTable: {},
    evaluationDetailTable: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getEvaluationTable, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: dataFormater(response, response.data),
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(getEvaluationDetailTable, payload);
      if(errorHandle(response)) {
        if(response.data != null && response.data.evaluationList != null) {
          yield put({
            type: 'saveDetailList',
            payload: dataFormater(response, response.data.evaluationList),
          });
        }
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        evaluationTable: action.payload,
      };
    },
    saveDetailList(state, action) {
      return {
        ...state,
        evaluationDetailTable: action.payload,
      };
    },
  },
};
