// 评价中心
let EvaluationTableList = [];
for (let i = 0; i < 10; i += 1) {
  EvaluationTableList.push({
		"matterId": i,
		"matterName": "权利事项"+i,
		"areaName": "衢州市"+i,
		"orgName": "市公安局"+i,
		"evaluationNumber": "10.5万"+i,
		"sourceList": "掌上办事评价、窗口评价"+i,
		"averageScore": i%5
  });
}
const EvaluationTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 101,
	"currentPage": 2,
	"count": 10,
  "data": EvaluationTableList
}

let EvaluationDetailTableList = [];
for (let i = 0; i < 10; i += 1) {
  EvaluationDetailTableList.push({
    "userId": i,
		"tags": "界面美观、操作简单"+i,
		"content": "很好用的事项"+i,
		"score": i%5,
		"source": "窗口评价"+i,
		"gmtCreate": 1539053482000
  });
}
const EvaluationDetailTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 101,
	"currentPage": 2,
  "count": 10,
  "data": {
		"matterId": 23456,
		"matterName": "权利事项",
		"areaName": "衢州市",
		"orgName": "市公安局",
		"evaluationNumber": "10.5万",
		"averageScore": "2.4",
		"evaluationList": EvaluationDetailTableList
	}
}

let SourceTableList = [];
for (let i = 0; i < 10; i += 1) {
  SourceTableList.push({
		"sourceName": "PC端评价"+i,
		"sourceId": i,
		"templateName": "模板"+i,
		"idCode": "idCode"+i,
		"state": 4,
		"gmtModify": 1452346784143
  });
}
const SourceTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 100,
	"currentPage": 2,
	"count": 10,
  "data": SourceTableList
}

let LabelRelationTableList = [];
for (let i = 0; i < 10; i += 1) {
  LabelRelationTableList.push({
		"sourceId": i,
		"sourceName": "窗口评价"+i,
		"relativeTags": "方便使用、操作简单"+i,
  });
}
const LabelRelationTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 100,
	"currentPage": 2,
	"count": 10,
	"data": LabelRelationTableList
}

let LabelSettingTableList = [];
for (let i = 1; i < 36; i += 1) {
  LabelSettingTableList.push({
		"tagId": i,
		"tagName": "界面美观"+i,
		"isSelected": i%3==0?true:false
  });
}

const LabelSettingTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": {
		"sourceId": 10,
		"sourceName": "掌上办事评价",
		"selectedTags": [
			{
				"tagId": 2,
				"tagName": "界面美观"
			},
			{
				"tagId": 4,
				"tagName": "界面美观"
			},
			{
				"tagId": 6,
				"tagName": "界面美观"
			}
		],
		"allTags": LabelSettingTableList
	}
}

let LabelTableList = [];
for (let i = 1; i < 99; i += 1) {
  LabelTableList.push({
		"id": i,
		"name": "界面美观"+i,
		"score": "1,2,4",
		"state": 4,
		"gmtCreate": 1423762346973,
	});
}

const LabelTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 100,
	"currentPage": 2,
	"count": 10,
	"data": LabelTableList
}

// 系统管理
let UserTableList = [];
for (let i = 0; i < 10; i += 1) {
  UserTableList.push({
		"id":i,
		"username":"test00"+i,
		"mobile":"13735571923",
		"email":"7882334@qq.com",
		"userType":"1",
		"status":i,
		"createTime":"2018-05-02 16:56:41",
		"updateTime":"2018-05-02 16:56:41", 
		"roles":[
			{
			"id":"1001",
			"name":"高级管理员",
			"code":"highmanage",
			"description":"高级管理员"
			},
			{
			"id":"1002",
			"name":"质检员",
			"code":"checkmanage",
			"description":"质检员"
			}
		]
	});
}
const UserTable = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 100,
	"currentPage": 2,
	"count": 10,
	"data": UserTableList
}


export default {
	// 评价中心
  'POST /matter/search': EvaluationTable,
  'POST /matter/eval/details': EvaluationDetailTable,
	'POST /source/search': SourceTable,
	'POST /tag/relation/search': LabelRelationTable,
	'POST /tag/relation/find': LabelSettingTable,
	'POST /tag/search': LabelTable,
	// 系统管理
	'POST /manage/user/getUsers': UserTable,
};
