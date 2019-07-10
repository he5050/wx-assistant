
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
5. 补充在服务器上发送的截图中文乱码的问题
  1. 安装fontconfig
   > `yum -y install fontconfig`

   这个命令执行完成之后，就可以在/usr/share文件夹里面看到fonts和fontconfig
   使用上面这个命令，安装fontconfig，它可以用来安装字体库。

  2. 添加中文字体库
   1. 从window的C:\Windows\Fonts里面把你需要的字体拷贝出来。比如说我需要宋体，我就选择simsun.ttc

   2. 在CentOS的/usr/share/fonts新建一个叫chinese的文件夹

   3. 然后把刚刚拷贝字体放到CentOS的/usr/share/fonts/chinese里面

   4. 修改chinese目录的权限。chmod -R 775 /usr/share/fonts/chinese

   5. 接下来需要安装ttmkfdir来搜索目录中所有的字体信息，并汇总生成fonts.scale文件，输入命令yum -y install ttmkfdir

   6. 执行ttmkfdir命令， ttmkfdir -e /usr/share/X11/fonts/encodings/encodings.dir

   7. 修改字体配置文件，vi /etc/fonts/fonts.conf
      ```xml
      <!-- Font directory list -->
        <dir>/usr/share/fonts</dir>
        <dir>/usr/share/X11/fonts/Type1</dir>
        <dir>/usr/share/X11/fonts/TTF</dir>
        <dir>/usr/local/share/fonts</dir>
        <dir>/usr/local/share/fonts/chinese</>
        <dir>~/.fonts</dir>
      <!-- -->
      ```
   8. 刷新内存中的字体缓存，`fc-cache`
   9. 看一下现在机器上已经有了刚才添加的字体。fc-list :lang=zh
6. [blog](https://he5050.github.io/)
