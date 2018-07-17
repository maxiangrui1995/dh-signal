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

const waveList = () => {
    return Mock.mock({
        data: [],
        status: "1"
    })
};

const devsList = () => {
    return Mock.mock({
        data: [],
        status: "1"
    })
};

// 登录
Mock.mock("/api/index/d_user/isLogin", /post|get/i, isLogin);
// 区域
Mock.mock("/api/index/d_area/treeList", /post|get/i, treeList);
// 特征参数
Mock.mock("/api/index/d_plan/dataList", /post|get/i, planList);
// 绿波带
Mock.mock("/api/index/d_green_wave/dataList", /post|get/i, waveList);
// 设备信息
Mock.mock("/api/index/d_crossing/dataView", /post|get/i, devsList);