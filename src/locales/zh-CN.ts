export const zhCN = {
    common: {
        processing: '处理中',
        brand: 'Stage 1st',
        loading: '加载中...',
        requesting: '请求中...',
        error: '发生错误',
    },
    login: {
        title: '登录',
        subTitle: '使用用户名和密码登录',
        label1: '用户名',
        placeholder1: '请输入用户名',
        label2: '密码',
        placeholder2: '请输入密码',
        login: '登录',
    },
    tabs: {
        home: '首页',
        message: '消息',
        mine: '我的',
    },
    greeting: (params: { name: string }) => `你好，${params.name}`,
    items: (params: { count: number }) => `${params.count}个项目`,
    timeAgo: (params: { time: string; unit: string }) => `${params.time}${params.unit}前`,
    userStatus: (params: { name: string; status: string; count: number }) =>
        `用户${params.name}当前状态为${params.status}，共有${params.count}条未读消息`,
};

export type TranslationType = typeof zhCN;
