// 评价中心
const SourceAndAreaList = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"totalCount": 101,
	"currentPage": 2,
	"count": 10,
  "data": {
		"areaNameList": [
      {
				"key":"330800",
				"value":"衢州市"
      },
      {
        "key":"330801",
        "value":"杭州市"
      },
      {
				"key":"330802",
				"value":"宁波市"
      }
    ],
		"sourceList": [
      {
				"key":"1",
				"value":"来源一"
      },
      {
				"key":"2",
				"value":"来源二"
      },
      {
				"key":"3",
				"value":"来源三"
      }
    ]
	}
}

const SourceUpdate = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": null
}

const SourceAdd = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": {
		"id": 13
	}
}

const TemplateList = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": [
		{
			"key":"1",
			"value":"模板一"
		},
		{
			"key":"2",
			"value":"模板二"
		},
		{
			"key":"3",
			"value":"模板三"
		}
	]
}

const SourceInfo = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": {
		"sourceId": 3,
		"sourceName": "掌上办事评价",
		"backUrl": "http://xxx.com/zzz.html",
		"idCode": "1c3b4bc45e",
		"selectedTemplateId": 2,
		"templateList": [
			{
				"key":"1",
				"value":"模板一"
			},
			{
				"key":"2",
				"value":"模板二"
			},
			{
				"key":"3",
				"value":"模板三"
			}
		]
	}
}

const UpdateResponse = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": {
		"sourceId": 3,
		"sourceName": "掌上办事评价",
		"backUrl": "http://xxx.com/zzz.html",
		"idCode": "1c3b4bc45e",
		"templateList": [{
			"name": "模板一",
			"id": 2
		}]
	}
}

let LabelDisorderList = [];
for (let i = 0; i < 10; i += 1) {
  LabelDisorderList.push({
		"name": "快速便捷"+i,
		"id": i
  });
}
const LabelDisorderData = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": LabelDisorderList
}

const LabelOrderResult = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": [{
		"name": "快速便捷",
		"id": 2
	}]
}

const LabelRelationUpdate = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": {
		"sourceId": 10,
		"sourceName": "掌上办事评价",
		"selectedTags": ["快速便捷","操作简单"],
		"allTags": [{
			"tagId": 2,
			"tagName": "界面美观"
		}]
	}
}

const LabelStateUpdate = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": null
}

const LabelAdd = {
	"success": true,
	"errorCode": "0",
	"errorMsg": "成功",
	"requestId": "8556e39c007147d48523215b3c689ba4",
	"data": null
}

export default {
  'GET /matter/conditions': SourceAndAreaList,
	'POST /source/updatestate': SourceUpdate,
	'POST /source/add': SourceAdd,
	'GET /template/search': TemplateList,
	'POST /source/find': SourceInfo,
	'POST /source/updateinfo': UpdateResponse,
	'POST /tag/relation/searchtags': LabelDisorderData,
	'POST /tag/relation/order': LabelOrderResult,
	'POST /tag/relation/update': LabelRelationUpdate,
	'POST /tag/update': LabelStateUpdate,
	'POST /tag/add': LabelAdd,
};
