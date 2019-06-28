import cheerio from "cheerio";
import puppeteer from "puppeteer";
import rp from "request-promise";
import calendar from "./calendar";
import fetch from "./superagent";
import config from "../config";
import path from "path";

const getRes = async params => {
    let res;
    let url = params.url;
    console.log(params);
    try {
        res = await rp(url, {
            method: "POST",
            form: params,
            json: true,
            referer: url,
            proxy: false,
            headers: {
                method: "POST",
                referer: url,
                "Cache-Control": `max-age=${60 * 60 * 24}`,
                "Content-Type": "application/json;charset=UTF-8",
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.23 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
            }
        });
    } catch (e) {
        res = false;
    }
    return res;
};
// 获取one的每日说
export const getOne = async () => {
    let res = await fetch(config.ONE);
    let $ = cheerio.load(res.text);
    let oneImg = $("#carousel-one .carousel-inner .item .fp-one-imagen").attr("src");
    // console.log(oneImg);
    let todayOneList = $("#carousel-one .carousel-inner .item");
    let todayOne = $(todayOneList[0])
        .find(".fp-one-cita")
        .text()
        .replace(/(^\s*)|(\s*$)/g, "");
    return { todayOne, oneImg };
};

export const getWeather = async () => {
    //获取墨迹天气
    let url = config.MOJI_HOST + config.CITY + "/" + config.LOCATION;
    let res = await fetch(url, "GET");
    let $ = cheerio.load(res.text);
    let imgUrl = $(".wea_weather span img").attr("src");
    console.log(imgUrl);
    let weatherTips = $(".wea_tips em").text();
    let nowTemp = $(".wea_weather em").text() + "°";
    let nowWeather = $(".wea_weather b").text();
    const today = $(".forecast .days")
        .first()
        .find("li");
    let todayInfo = {
        Day: $(today[0])
            .text()
            .replace(/(^\s*)|(\s*$)/g, ""),
        WeatherText: $(today[1])
            .text()
            .replace(/(^\s*)|(\s*$)/g, ""),
        Temp: $(today[2])
            .text()
            .replace(/(^\s*)|(\s*$)/g, ""),
        Wind: $(today[3])
            .find("em")
            .text()
            .replace(/(^\s*)|(\s*$)/g, ""),
        WindLevel: $(today[3])
            .find("b")
            .text()
            .replace(/(^\s*)|(\s*$)/g, ""),
        PollutionLevel: $(today[4])
            .find("strong")
            .text()
            .replace(/(^\s*)|(\s*$)/g, "")
    };
    let {
        cYear,
        cMonth,
        cDay,
        ncWeek,
        gzYear,
        gzMonth,
        gzDay,
        astro,
        Animal,
        IMonthCn,
        IDayCn
    } = calendar.solar2lunar();
    console.log(new Date().toDateString().split(" ")[1]);
    const dayInfo = `今天: ${cYear}-${cMonth}-${cDay} (${ncWeek}) <br>农历: ${IMonthCn}${IDayCn},  ${gzYear}年${gzMonth}月${gzDay}日 (${Animal}年) <br>`;
    let obj = {
        weatherTips: weatherTips,
        toDayTime: {
            cYear,
            cMonth: new Date().toDateString().split(" ")[1],
            cDay,
            ncWeek
        },
        toDayLunar: `${Animal}年: ${IMonthCn}${IDayCn},  ${gzYear}年${gzMonth}月${gzDay}日`,
        weaImg: imgUrl,
        todayInfo,
        dayInfo,
        // weaTemp: todayInfo.Temp,
        // weaWind: todayInfo.Wind + todayInfo.WindLevel,
        // weaPm: todayInfo.PollutionLevel,
        todayWeather:
            "<br>" +
            "当前气温: " +
            nowTemp +
            "(" +
            nowWeather +
            ")" +
            "<br>" +
            "今日天气: " +
            todayInfo.WeatherText +
            "<br>" +
            "今日气温: " +
            todayInfo.Temp +
            " ," +
            todayInfo.Wind +
            todayInfo.WindLevel +
            "<br>" +
            "PM2.5: \t" +
            todayInfo.PollutionLevel +
            "<br>"
    };
    return obj;
};

export const getTemplate = async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 375,
            height: 667
        }
    });
    const page = await browser.newPage();
    await page.goto(config.TEP_HOST);
    // 截屏
    await page.screenshot({ path: path.join(config.TEP_PIC_NAME) });
    await browser.close();
};
