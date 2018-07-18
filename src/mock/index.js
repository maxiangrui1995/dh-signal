import Mock from 'mockjs';
const Random = Mock.Random;

const isLogin = () => {
    return {
        data: {
            username: 'admin'
        },
        status: "1",
        message: "操作成功"
    }
};

const treeList = () => {
    return Mock.mock({
        data: [{
            id: "1",
            name: "区域1",
            children: [{
                id: "1001",
                name: "区域2",
                children: [{
                    id: "10001",
                    name: "路口1",
                    lng: "119.77495282888412",
                    lat: "36.37174657521467",

                }]
            }]
        }],
        status: "1"
    })
};

const planList = () => {
    return Mock.mock({
        data: {
            list: [{
                id: "1",
                name: "12"
            }],
            total: "1"
        },
        status: "1"
    })
};

const usermanage = () => {
    return Mock.mock({
        data: {
            list: [{
                id: "1",
                username: "12",
                password: "12345",
                permission: "0"
            }, {
                id: "2",
                username: "12",
                password: "12345",
                permission: "666"
            }],
            total: "2"
        },
        status: "1"
    })
}

const waveList = () => {
    return Mock.mock({
        data: {
            list: [{
                id: 1,
                name: 'name'
            }],
            total: "1"
        },
        status: "1"
    })
};

const waveSubList = () => {
    return Mock.mock({
        data: {
            list: [{
                id: 1,
                name: 'name',
                road_distance: "0",
                forward_speed: "60",
                phase_difference: "0",
                positive_phase: "1"
            }],
            total: "1"
        },
        status: "1"
    })
};

const devsList = () => {
    return Mock.mock({
        data: [],
        status: "1"
    })
};

const servicePlanList = () => {
    return Mock.mock({
        data: {
            list: [
                { sch_id: "123", sch_name: "11", boundPlate: "苏A12345", children: [], enabled: 0 },
                { sch_id: "124", sch_name: "12", boundPlate: "苏A12341", children: [], enabled: 1 }
            ],
            total: "1"
        },
        status: "1"
    })
}

const serviceSubPlanList = () => {
    return Mock.mock({
        data: { sch_id: "123", sch_name: "11", boundPlate: "苏A12345", children: [{ name: '1', serial: "1" }], enabled: 0 },
        status: "1"
    })
}

// 登录
Mock.mock("/api/index/d_user/isLogin", /post|get/i, isLogin);
// 区域
Mock.mock("/api/index/d_area/treeList", /post|get/i, treeList);
// 特征参数
Mock.mock("/api/index/d_plan/dataList", /post|get/i, planList);
// 绿波带
Mock.mock("/api/index/d_green_wave/dataList", /post|get/i, waveList);
Mock.mock("/api/index/d_green_wave_sub/dataList", /post|get/i, waveSubList);
// 设备信息
Mock.mock("/api/index/d_crossing/dataView", /post|get/i, devsList);
// 特勤
Mock.mock("/api/index/d_secret_service_plan/planList", /post|get/i, servicePlanList);
Mock.mock("/api/index/d_secret_service_plan/singleList", /post|get/i, serviceSubPlanList);
// 用户管理
Mock.mock("/api/index/d_user_manager/dataList", /post|get/i, usermanage);
