const region = [{
    path: '/region',
    name: 'region',
    meta: {
      title: "区域管理"
    },
    component: resolve => require(['@/views/region/Region'], resolve)
  },
  {
    path: '/region/:id1',
    name: 'region1',
    meta: {
      title: "区域管理"
    },
    component: resolve => require(['@/views/region/Region1'], resolve)
  },
  {
    path: '/region/:id1/:id2',
    name: 'region2',
    meta: {
      title: "区域管理"
    },
    component: resolve => require(['@/views/region/Crossing'], resolve)
  },
  {
    path: '/region/:id1/:id2/:id3/map',
    name: 'region-map',
    meta: {
      title: "区域管理"
    },
    component: resolve => require(['@/views/region/Map'], resolve)
  },
  {
    path: '/region/:id1/:id2/:id3/dev',
    name: 'region-dev',
    meta: {
      title: "区域管理"
    },
    component: resolve => require(['@/views/region/Devs'], resolve)
  }
];

const planList = [{
    path: '/planList',
    name: 'planList',
    meta: {
      title: "特征参数"
    },
    component: resolve => require(['@/views/planList/PlanList'], resolve)
  },
  {
    path: '/planList/:id',
    name: 'planList-detail',
    meta: {
      title: "特征参数详情"
    },
    redirect: {
      name: "planList-detail-base"
    },
    component: resolve => require(['@/views/planList/children/Index'], resolve),
    children: [{
        path: '/planList/:id/base',
        name: 'planList-detail-base',
        meta: {
          title: "特征参数-基本"
        },
        component: resolve => require(['@/views/planList/children/Base'], resolve)
      },
      {
        path: '/planList/:id/wayleave',
        name: 'planList-detail-wayleave',
        meta: {
          title: "特征参数-通行权"
        },
        component: resolve => require(['@/views/planList/children/Wayleave'], resolve)
      },
      {
        path: '/planList/:id/lightgroup',
        name: 'planList-detail-lightgroup',
        meta: {
          title: "特征参数-灯组"
        },
        component: resolve => require(['@/views/planList/children/LightGroup'], resolve)
      },
      {
        path: '/planList/:id/phase',
        name: 'planList-detail-相位',
        meta: {
          title: "特征参数-相位"
        },
        component: resolve => require(['@/views/planList/children/Phase'], resolve)
      },
      {
        path: '/planList/:id/plan',
        name: 'planList-detail-plan',
        meta: {
          title: "特征参数-方案"
        },
        component: resolve => require(['@/views/planList/children/Plan'], resolve)
      },
      {
        path: '/planList/:id/datetype',
        name: 'planList-detail-datetype',
        meta: {
          title: "特征参数-日期类型"
        },
        component: resolve => require(['@/views/planList/children/DateType'], resolve)
      },
      {
        path: '/planList/:id/scheduling',
        name: 'planList-detail-scheduling',
        meta: {
          title: "特征参数-时间调度"
        },
        component: resolve => require(['@/views/planList/children/Scheduling'], resolve)
      },
      {
        path: '/planList/:id/vehicleInspection',
        name: 'planList-detail-vehicleInspection',
        meta: {
          title: "特征参数-车检器"
        },
        component: resolve => require(['@/views/planList/children/VehicleInspection'], resolve)
      },
      {
        path: '/planList/:id/adaptive',
        name: 'planList-detail-adaptive',
        meta: {
          title: "特征参数-自适应方案"
        },
        component: resolve => require(['@/views/planList/children/Adaptive'], resolve)
      }
    ]
  }
];

const greenBelt = [{
  path: '/greenBelt',
  name: 'greenBelt',
  meta: {
    title: "绿波带"
  },
  component: resolve => require(['@/views/greenBelt/GreenBelt'], resolve)
}, {
  path: '/greenBelt/:id/:name/:period',
  name: 'greenBelt-details',
  meta: {
    title: "绿波带"
  },
  component: resolve => require(['@/views/greenBelt/Details'], resolve)
}];

const privilege = [{
  path: '/privilege',
  name: 'privilege',
  meta: {
    title: "特勤联动"
  },
  component: resolve => require(['@/views/privilege/Privilege'], resolve)
}, {
  path: '/privilege/:id',
  name: 'privilege-details',
  meta: {
    title: "特勤联动"
  },
  component: resolve => require(['@/views/privilege/Details'], resolve)
}]

const query = [{
  path: '/comprehensiveQuery',
  name: 'comprehensiveQuery',
  meta: {
    title: "综合查询"
  },
  component: resolve => require(['@/views/comprehensiveQuery/Query'], resolve)
}, {
  path: '/comprehensiveQuery/:id',
  name: 'comprehensiveQuery-map',
  meta: {
    title: "综合查询"
  },
  component: resolve => require(['@/views/comprehensiveQuery/Map'], resolve)
}, {
  path: '/comprehensiveQuery/:id/view',
  name: 'comprehensiveQuery-view',
  meta: {
    title: "实时监控"
  },
  component: resolve => require(['@/views/comprehensiveQuery/RealtimeView'], resolve)
}, {
  path: '/comprehensiveQuery/:id/video',
  name: 'comprehensiveQuery-video',
  meta: {
    title: "实时视频"
  },
  component: resolve => require(['@/views/comprehensiveQuery/Video'], resolve)
}]

const login = [{
  path: '/login',
  name: 'login',
  meta: {
    title: "登录-信号机控制平台"
  },
  component: resolve => require(['@/views/login/Login'], resolve)
}]

const test = [{
  path: '/test',
  name: 'test',
  meta: {
    title: "测试代码"
  },
  component: resolve => require(['@/components/Test'], resolve)
}]

const error500 = {
  path: '/500',
  name: '500',
  meta: {
    title: "出错啦"
  },
  component: resolve => require(['@/components/error/500'], resolve)
};
const error404 = {
  path: '/404',
  name: '404',
  meta: {
    title: "页面丢失"
  },
  component: resolve => require(['@/components/error/404'], resolve)
};
const error403 = {
  path: '/403',
  name: '403',
  meta: {
    title: "无权限"
  },
  component: resolve => require(['@/components/error/403'], resolve)
};
const lockScreen = {
  path: '/lock',
  name: 'lock',
  meta: {
    title: "道路交通信号机平台"
  },
  component: resolve => require(['@/components/LockScreen'], resolve)
};

const userSetting = {
  path: '/userSetting',
  name: 'userSetting',
  meta: {
    title: "用户设置"
  },
  component: resolve => require(['@/views/home/UserSetting'], resolve)
}

const userManage = [{
  path: '/userManage',
  name: 'userManage',
  meta: {
    title: "用户管理"
  },
  component: resolve => require(['@/views/userManage/UsetManage'], resolve)
}]

export default [{
    path: '/',
    name: 'home',
    meta: {
      title: "信号机控制平台"
    },
    redirect: {
      name: "comprehensiveQuery"
    },
    component: resolve => require(['@/views/home/Home'], resolve),
    children: [
      ...region,
      ...planList,
      ...greenBelt,
      ...privilege,
      ...test,
      ...query,
      userSetting,
      ...userManage,
      error403
    ]
  },
  ...login,
  lockScreen,
  error500,
  error404,
  {
    path: "*",
    redirect: "/404"
  }
]