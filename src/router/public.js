
const region = [
  {
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
const planList = [
  {
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
    children: [
      {
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
          title: "特征参数-phase"
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

export default [
  {
    path: '/',
    name: 'home',
    meta: {
      title: "信号机控制平台"
    },
    component: resolve => require(['@/views/home/Home'], resolve),
    children: [
      ...region, ...planList
    ]
  }
]