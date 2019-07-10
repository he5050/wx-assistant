const config = {
    // 基础定时发送功能配置项（必填项）
    NAME: "以后请叫我嘿嘿", //备注姓名 以后请叫我嘿嘿 玲子
    NICKNAME: "以后请叫我嘿嘿", //昵称
    TEP_HOST: "http://localhost:4000/temp", // 生成消息图片用的HTML模板页面
    TEP_PIC_NAME: "template.jpeg", // 生成的消息图片名
    TIPSARRAY: ["玲子", "以后请叫我嘿嘿"],
    HELPNAME: "@懒懒小助手",
    ROOMNAME: ["开黑群", "前端"],
    MEMORIAL_DAY: "2014/09/21", //纪念日
    LANLAN_DAY: "2018/08/28",
    CITY: "chongqing", //所在城市
    LOCATION: "chongqing/chongqing", //所在区（可以访问墨迹天气网站后，查询区的英文拼写）
    SENDDATE: "0 0 7 * * *", //定时发送时间 每天7点0分0秒发送
    ONE: "http://wufazhuce.com/", ////ONE的web版网站
    MOJI_HOST: "https://tianqi.moji.com/weather/china/", //中国墨迹天气url

    //高级功能配置项（非必填项）
    AUTOREPLY: true, //自动聊天功能 默认关闭
    AIBOTAPI: "http://api.tianapi.com/txapi/robot/", // 也可以用图灵的，天行机器人API 注册地址https://www.tianapi.com/signup.html?source=474284281
    APIKEY: "c77e32865193f08f804194596e3f3095", //天行机器人apikey,
    QQAPPID: 2117508695,
    QQAPPKEY: "Rhn2vsi6vxEV1kVQ", // 腾讯语义分析
    BAIDUAPPID: 16593007, // 百度语义分析
    BAIDUAPIKEY: "8e7L3xL6qS1P1Yx5fTgeZod5",
    BAIDUSECRETKEY: "XMuqT1iww05qlzAxcLHh4wHdVd2x7md1"
};

export default config;
