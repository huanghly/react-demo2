import { message } from 'antd';
import { SourceUpdate, SourceAdd, getTemplateList, getSourceInfo, SourceInfoUpdate } from '@/services/api';
import { errorHandle } from '@/utils/utils';
import router from 'umi/router';

export default {
  namespace: 'sourceOther',

  state: {
    templateList: {},
    sourceInfo: {},
  },

  effects: {
    *templateList({ payload }, { call, put }) {
      const response = yield call(getTemplateList, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(SourceUpdate, payload);
      if(errorHandle(response)){
        callback();
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(SourceAdd, payload);
      if(errorHandle(response)) {
        message.success('操作成功');
        setTimeout(function(){ router.push('/evaluation-center/source-config-list'); }, 1500);
      }
    },
    *getSourceInfo({ payload }, { call, put }) {
      const response = yield call(getSourceInfo, payload);
      if(errorHandle(response)) {
        yield put({
          type: 'saveSourceInfo',
          payload: response,
        });
      }
    },
    *updateInfo({ payload }, { call, put }) {
      const response = yield call(SourceInfoUpdate, payload);
      if(errorHandle(response)) {
        message.success('操作成功');
        setTimeout(function(){ router.push('/evaluation-center/source-config-list'); }, 1500);
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        templateList: action.payload,
      };
    },
    saveSourceInfo(state, action) {
      return {
        ...state,
        sourceInfo: action.payload,
      };
    },
  },
};
