import { userDisable, userOpen, userEdit, userAdd } from '@/services/api';
import { errorHandle } from '@/utils/utils';

export default {
  namespace: 'userother',

  state: {

  },

  effects: {
    *disable({ payload, callback }, { call, put }) {
      const response = yield call(userDisable, payload);
      if(errorHandle(response)) {
        callback();
      }
    },
    *open({ payload, callback }, { call, put }) {
      const response = yield call(userOpen, payload);
      if(errorHandle(response)) {
        callback();
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(userEdit, payload);
      if(errorHandle(response)) {
        callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(userAdd, payload);
      if(errorHandle(response)) {
        callback();
      }
    },
  },
};
