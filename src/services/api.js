import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

//评价中心
export async function getEvaluationTable(params) {
  return request('/qz-feed/matter/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getTemplateList() {
  return request('/qz-feed/template/search');
}

export async function getSourceAndArea() {
  return request('/qz-feed/matter/conditions');
}

export async function getEvaluationDetailTable(params) {
  return request('/qz-feed/matter/eval/details', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getSourceTable(params) {
  return request('/qz-feed/source/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function SourceUpdate(params) {
  return request('/qz-feed/source/updatestate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function SourceAdd(params) {
  return request('/qz-feed/source/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getSourceInfo(params) {
  return request('/qz-feed/source/find', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function SourceInfoUpdate(params) {
  return request('/qz-feed/source/updateinfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getLabelRelationTable(params) {
  return request('/qz-feed/tag/relation/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getLabelDisorderData(params) {
  return request('/qz-feed/tag/relation/searchtags', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getLabelSettingTable(params) {
  return request('/qz-feed/tag/relation/find', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function labelOrderResult(params) {
  return request('/qz-feed/tag/relation/order', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function labelRelationUpdate(params) {
  return request('/qz-feed/tag/relation/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getLabelTable(params) {
  return request('/qz-feed/tag/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function labelStateUpdate(params) {
  return request('/qz-feed/tag/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function labelAdd(params) {
  return request('/qz-feed/tag/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//系统管理
export async function login(params) {
  return request('/qz-admin-app/sso/login', {
    method: 'POST',
    body: params,
  });
}

export async function getUserTable(params) {
  return request('/qz-admin-app/manage/user/getUsers', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function userDisable(params) {
  return request('/qz-admin-app/manage/user/disableUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function userOpen(params) {
  return request('/qz-admin-app/manage/user/enableUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function userEdit(params) {
  return request('/qz-admin-app/manage/user/setUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function userAdd(params) {
  return request('/qz-admin-app/manage/user/addUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}