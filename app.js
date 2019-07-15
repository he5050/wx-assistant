import { Wechaty } from "wechaty";
import { FileBox } from "file-box";
import express from "express";
import config from "./config";
import { getOne, getWeather, getTemplate } from "./utils/net";
import { setSchedule, getDay, getLanLan, getKeyWord, getTextChat } from "./utils";
import onScan from "./middleware/scan";
import onLogout from "./middleware/logout";
import onFriendShip from "./middleware/friend";

const app = express();
app.use(express.static("views"));
app.set("view engine", "pug");

app.listen(4000, async () => {
    console.log("app listening on port 4000!");
});
app.get("/temp", async (req, res) => {
    let { todayOne, oneImg } = await getOne(); //获取每日一句
    let {
        weatherTips,
        weaImg,
        todayInfo = {},
        dayInfo,
        toDayTime,
        toDayLunar
    } = await getWeather();
    let memorialDay = getDay(config.MEMORIAL_DAY); // 获取纪念日天数
    // const formatedDate = utils.getDate()
    // const days = utils.getDay(config.MEET_DAY)
    // const date = `${formatedDate} | 相遇的第${days}天`
    let lanlanday = getLanLan(config.LANLAN_DAY); // 小宝贝
    todayInfo.tempArr = todayInfo.Temp.split("/");
    res.render("template", {
        toDayTime,
        toDayLunar,
        todayOne,
        oneImg,
        weatherTips,
        weaImg,
        memorialDay,
        todayInfo,
        lanlanday
    });
});
const bot = new Wechaty({ name: "懒懒小助手" });
// 延时函数，防止检测出类似机器人行为操作
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
// 登录事件
const onLogin = async user => {
    console.log(`贴心助理${user}登录了`);
    // sendMsgToUser();
    // 登陆后创建定时任务
    setSchedule(config.SENDDATE, () => {
        console.log("开始任务");
        sendMsgToUser();
    });
};
// 消息监听
const onMessage = async msg => {
    // console.log(msg);
    const contact = msg.from(); // 发消息人
    const content = msg.text(); //消息内容
    const room = msg.room(); //是否是群消息
    // const roomCodeUrl = FileBox.fromUrl(config.ROOMCODEURL); //来自url的文件
    // const roomCodeLocal = FileBox.fromFile(config.ROOMLOCALPATH); //添加本地文件
    const msgName = contact.name(); // 发送消息的人
    if (msg.self()) return;
    if (room) {
        // 如果是群消息
        const roomName = await room.topic();
        console.log(`群名: ${roomName} 发消息人: ${msgName} 内容: ${content}`);
        if (config.ROOMNAME.includes(roomName) && content.includes(config.HELPNAME)) {
            let reply = await getTextChat(msgName, content.replace(config.HELPNAME, ""));
            console.log("获取的返回结果", reply);
            await delay(500);
            const contactCard = await bot.Contact.find({ name: msgName }); // change 'lijiarui' to any of the room member
            await room.say(reply, contactCard);
        }
    } else {
        // 如果非群消息
        console.log(`发消息人: ${msgName} 消息内容: ${content}`);
        // 提醒
        if (config.TIPSARRAY.includes(msgName)) {
            let keywordArray = content.replace(/\s+/g, " ").split(" "); // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
            console.log("分词后效果", keywordArray);
            // if (keywordArray[0] === "提醒") {
            //     let scheduleObj = untils.contentDistinguish(contact, keywordArray);
            //     addSchedule(scheduleObj);
            //     contact.say("小助手已经把你的提醒牢记在小本本上了");
            // } else if (content && content.indexOf("你好") > -1) {
            //     contact.say(
            //         "你好，很高兴成为你的小秘书，来试试我的新功能吧！回复案例：“提醒 我 18:30 下班回家”，创建你的专属提醒，记得关键词之间使用空格分隔开"
            //     );
            // }
            if (content === "天气") {
                sendMsgToUser();
            }
            if (keywordArray[0] === "提醒") {
                let scheduleObj = {};
                if (keywordArray[1] === "我") {
                    scheduleObj.nickName = contact.name(); // contact.name();
                    scheduleObj.content =
                        "亲爱的妈妈" + "到时间了，我们该" + keywordArray[4] + "了";
                } else {
                    scheduleObj.nickName = keywordArray[1];
                    scheduleObj.content =
                        "亲爱的" + "妈妈" + " ，" + "爸爸" + "叫我提醒你，" + keywordArray[4];
                }
                scheduleObj.time = "0 " + keywordArray[3] + " " + keywordArray[2] + " * * *";
                addSchedule(scheduleObj);
                console.log(scheduleObj);
                contact.say("懒懒已经把你的提醒牢记在心上了");
            } else if (keywordArray.includes("帮助")) {
                contact.say(
                    "来试试我的新功能吧！回复案例：“提醒 我(以后请加我嘿嘿) 18 30 下班回家”，创建提醒，记得关键词之间使用空格分隔开"
                );
            }
        }
    }
};

// 自动发消息功能
const sendMsgToUser = async () => {
    let contact =
        (await bot.Contact.find({ name: config.NICKNAME })) ||
        (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    try {
        let contact =
            (await bot.Contact.find({ name: config.NICKNAME })) ||
            (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
        await getTemplate();
        const fileBox = FileBox.fromFile(config.TEP_PIC_NAME);
        console.log(fileBox);
        // await contact.say("ok");
        await contact.say(fileBox);
    } catch (e) {
        setTimeout(() => {
            sendMsgToUser();
        }, 5000);
        console.log("出错了", e);
    }
    // let logMsg;
    // let { todayOne } = await getOne(); //获取每日一句
    // let weather = await getWeather(); //获取天气信息
    // let memorialDay = getDay(config.MEMORIAL_DAY); // 获取纪念日天数
    // let lanlanMonth = getLanLan(config.LANLAN_DAY); // 小宝贝
    // let str =
    //     weather.dayInfo +
    //     "<br>懒懒妈妈，这是我们在一起的第" +
    //     memorialDay +
    //     "天" +
    //     "<br>元气满满的一天开始啦,要开心噢^_^<br>" +
    //     `我们的小懒懒，现在有0岁${lanlanMonth}月了^_^<br>` +
    //     "<br>今日温馨提示: <br>" +
    //     weather.weatherTips +
    //     "<br><br>" +
    //     weather.todayWeather +
    //     "<br>每日一句:<br>" +
    //     todayOne +
    //     "<br><br>" +
    //     "————爱你的懒懒爸爸与小懒懒";
    // try {
    //     logMsg = str;
    //     await contact.say(str); // 发送消息
    // } catch (e) {
    //     logMsg = e.message;
    // }
    // console.log(logMsg);
};
const addSchedule = async obj => {
    // 添加定时提醒
    let nickName = obj.nickName;
    let time = obj.time;
    let content = obj.content;
    let contact = await bot.Contact.find({ name: nickName });
    let j = setSchedule(time, async () => {
        console.log("你的专属提醒开启啦！");
        await contact.say(content);
    });
};

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);
bot.on("friendship", onFriendShip);
bot.start()
    .then(() => {
        console.log("开始登陆微信");
    })
    .catch(e => console.error(e));
