import { getLabelRelationTable, getLabelSettingTable } from '@/services/api';
import { dataFormater, errorHandle } from '@/utils/utils';

export default {
  namespace: 'labelRelationTable',

  state: {
    labelRelationTable: {},
    LabelSettingData: {
      data: {
        allTags: []
      }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getLabelRelationTable, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: dataFormater(response, response.data),
        });
      }
    },
    *getSettingList({ payload, callback }, { call, put }) {
      const response = yield call(getLabelSettingTable, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveSettingList',
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
        labelRelationTable: action.payload,
      };
    },
    saveSettingList(state, action) {
      return {
        ...state,
        LabelSettingData: action.payload,
      };
    },
  },
};
