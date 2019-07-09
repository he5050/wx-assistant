
> 自用的微信小助手

### 🏠 [Homepage](app.js)

> 主要是依赖于wechaty 进行了的二次开发处理

![1](https://ws3.sinaimg.cn/large/69abf49bly1g4tegu1orfj20cx0c4gmf.jpg)
![微信图片_20190709105629](https://ws4.sinaimg.cn/large/69abf49bly1g4tehooqryj20bi0kgdsn.jpg)
## Install

```sh
npm install
```

## Run dev
> 开发环境
```sh
npm run dev
```

## Run prod
> 生产环境
```sh
npm run prod // 启动项目
npm run stop // 停用项目
```
## Tips

1. 安装`puppeteer`可能安装上不,安装不了可以使用淘宝镜像处理
   ```sh
   npm config set registry https://registry.npm.taobao.org
   npm config set disturl https://npm.taobao.org/dist
   npm config set puppeteer_download_host https://npm.taobao.org/mirrors
   ```
2. 基本功能完备，但是机器人的数据没有进行处理，可以自己处理
3. 部分内容没有完成开源(私密)
4. 关于提醒的功能,可能采用语义分词然后进行处理,自己使用mongodb做为存放记录，确保每次都提示都能执行(未开源)
5. [blog](https://he5050.github.io/)
