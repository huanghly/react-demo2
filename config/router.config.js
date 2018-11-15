export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user', 'user2'],
    routes: [
      { path: '/', redirect: '/system-management/user-management' },
      {
        path: '/system-management',
        icon: 'dashboard',
        name: 'system-management',
        routes: [
          { 
            path: '/system-management/user-management',
            name: 'user-management',
            icon: 'dashboard',
            component: './UserManagement/ListView',
          },
          { 
            path: '/system-management/user-edit',
            name: 'user-edit',
            hideInMenu: true,
            component: './UserManagement/EditView',
          },
          { 
            path: '/system-management/user-add',
            name: 'user-add',
            hideInMenu: true,
            component: './UserManagement/AddView',
          },
          {
            path: '/system-management/role-management',
            name: 'role-management',
            icon: 'dashboard',
            component: './RoleManagement/ListView',
          },
          { 
            path: '/system-management/permission-management',
            name: 'permission-management',
            icon: 'dashboard',
            component: './PermissionManagement/ListView',
          },
        ],
      },
      {
        path: '/evaluation-center',
        icon: 'dashboard',
        name: 'evaluation-center',
        routes: [
          { 
            path: '/evaluation-center/evaluation-management',
            name: 'evaluation-management',
            icon: 'dashboard',
            component: './EvaluationManagement/ManagementView',
          },
          {
            path: '/evaluation-center/evaluation-details',
            name: 'evaluation-details',
            hideInMenu: true,
            component: './EvaluationManagement/DetailsView',
          },
          { 
            path: '/evaluation-center/source-config-list',
            name: 'source-config-list',
            icon: 'dashboard',
            component: './SourceConfig/ListView',
          },
          {
            path: '/evaluation-center/source-config-add',
            name: 'source-config-add',
            hideInMenu: true,
            component: './SourceConfig/AddView',
          },
          {
            path: '/evaluation-center/source-config-edit',
            name: 'source-config-edit',
            hideInMenu: true,
            component: './SourceConfig/EditView',
          },
          {
            path: '/evaluation-center/label-relation-list',
            name: 'label-relation-list',
            icon: 'dashboard',
            component: './LabelRelation/ListView',
          },
          {
            path: '/evaluation-center/label-relation-setting',
            name: 'label-relation-setting',
            hideInMenu: true,
            component: './LabelRelation/SettingView',
          },
          {
            path: '/evaluation-center/label-wareroom-list',
            name: 'label-wareroom-list',
            icon: 'dashboard',
            component: './LabelWareroom/ListView',
          },
          {
            path: '/evaluation-center/statistics',
            name: 'statistics',
            icon: 'dashboard',
            component: './Statistics/StatisticsView',
          },
        ],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        authority: ['user2'],
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                name: 'stepform',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            hideInMenu: true,
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', hideInMenu: true, component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           hideInMenu: true,
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           hideInMenu: true,
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           hideInMenu: true,
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           hideInMenu: true,
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           hideInMenu: true,
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           hideInMenu: true,
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           hideInMenu: true,
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           hideInMenu: true,
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           hideInMenu: true,
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
