import moment from "moment";
import md5 from "md5";
import rp from "request-promise";
import { nlp, HttpClient } from "baidu-aip-sdk";
import config from "../config";
import setSchedule from "./schedule";
import fetch from "./superagent";
import calendar from "./calendar";
const baiduClient = new nlp(config.BAIDUAPPID, config.BAIDUAPIKEY, config.BAIDUSECRETKEY);
// 生成指定长度的字符串
const randomString = length => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
};
const getRes = async params => {
    let res;
    let url = "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat";
    // console.log(params);
    try {
        res = await rp(url, {
            method: "POST",
            form: params,
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Accept: "application/json;charset=UTF-8"
            }
        });
    } catch (e) {
        console.log("出错了", e);
        res = false;
    }
    return res;
};
export const getLanLan = date => {
    let now = moment();
    let old = moment(date, "YYYY/MM/DD");
    // console.log(date);
    // console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
    // console.log(moment(date, "YYYY/MM/DD").format("YYYY-MM-DD HH:mm:ss"));
    // let old = moment(date);
    let diff = Math.floor(now.diff(old, "months", true));
    console.log(diff);
    // return diff;
    let year = 0;
    let month = diff;
    if (diff > 12) {
        year = Math.floor(diff / 12);
        month = diff % 12;
    }
    return {
        year,
        month
    };
    // return year ? `${year}岁${month}个月` : `${month}个月`;
};
export const getDay = date => {
    let now = moment();
    let old = moment(date, "YYYY/MM/DD");
    // console.log(date);
    // console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
    // console.log(moment(date, "YYYY/MM/DD").format("YYYY-MM-DD HH:mm:ss"));
    // let old = moment(date);
    let diff = now.diff(old, "days", true);
    // console.log(diff);
    // return diff;
    return Math.floor(diff);
};
export const getTextChat = async (name, text) => {
    let session = md5(name);
    let question = text;
    let app_id = config.QQAPPID;
    let app_key = config.QQAPPKEY;
    let time_stamp = parseInt(Date.now() / 1000);
    let nonce_str = randomString(16);
    let input = `app_id=${app_id}&nonce_str=${nonce_str}&question=${encodeURI(
        question
    )}&session=${session}&time_stamp=${time_stamp}&app_key=${app_key}`;
    let sign = md5(input).toUpperCase();
    // console.log("getKeyWord", sign);
    let params = {
        app_id,
        text,
        time_stamp,
        nonce_str,
        sign,
        session,
        question
    };
    // console.log("参数", params);
    let res = await getRes(params);
    // console.log(res);
    if (!res) {
        let infoRes = await getReply(text);
        return infoRes;
    }
    if (res && res.data && !res.data.answer) {
        let infoRes = await getReply(text);
        return infoRes;
    }
    return "你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题";
};
export const getKeyWord = async text => {
    // let res = await getRes(params);
    try {
        let baiduRes = await baiduClient.lexer(text);
        console.log("百度分析结果", baiduRes);
        // let { text, items } = baiduRes;
        for (let item of baiduRes.items) {
            console.log(item.pos, item.ne, item.item, item.basic_words);
        }

        return baiduRes;
    } catch (e) {
        console.log("出错了", e);
        return false;
    }
};

export const getReply = async word => {
    // 天行聊天机器人
    let url = config.AIBOTAPI;
    let res = await fetch(url, "GET", { key: config.APIKEY, question: word, mode: 1, datatype: 0 });
    let content = JSON.parse(res.text);
    if (content.code === 200) {
        console.log(content);
        let response = "";
        if (content.datatype === "text") {
            response = content.newslist[0].reply;
        } else if (content.datatype === "view") {
            response =
                "虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>" +
                "《" +
                content.newslist[0].title +
                "》" +
                content.newslist[0].url;
        } else {
            response = "你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题";
        }
        return response;
    } else {
        return "我好像迷失在无边的网络中了，你能找回我么";
    }
};

export { setSchedule, fetch, calendar };
