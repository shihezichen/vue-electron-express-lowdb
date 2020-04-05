### 前言:

本文讲述 Vue 3.0 + Electron + Express + Lowdb 框架搭建过程, 以及少量示例代码; 

重点讲解框架部分如何衔接和配合形成一个整体:

顺序:

1. 先保证让Vue的Web形式能正常运行
2. 通过Electron给Vue套一层App外壳, 变为App程序
3. 部署Express充当Vue+Electron的Web Restful Api后端, 并通过Lowdb记录一些App的系统设置信息到文件中, 以便于下一次启动时仍能访问(不同于Browser端保存)。
4. 让Vue+Electron+Express三者共同协作, 看起来是某一个云上服务的App形式的Client端。



### 准备部分:

- 安装node.js

  ```shell
  官网下载安装
  https://nodejs.org/zh-cn/
  
  安装完毕查看版本号:
  node -v
  ```

- 安装 vue-cli3:

  ``` shell
  # 卸载1.x或2.x旧版本
  npm uninstall vue-cli-g
  # 安装@vue/cli ( 即 vue-cli3 )
  npm install -g @vue/cli
  # 查看vue-cli版本
  vue -V
  ```

  

### 前端部分(Vue3.0)

- 创建项目

  ```powershell
  vue create vue-node-db
  # 创建过程中 勾选特性: babel, Router,  Vuex, CSS Pre-processors
  # 使用 "history router"
  # CSS 预处理器使用 SCSS/SASS
  ```

- 测试项目

  ```shell
  npm  run serve
  ```

  访问 localhost:8080 出现web界面, 即为OK

- 增加 ElementUI支持

  ```shell
  npm install -S element-ui
  ```

- 增加 axios 支持, 用于前端发起ajax请求

  ```shell
  npm install -S axios
  ```

- 增加normalize.css 支持, 用户前端页面整体的规整化

  ```shell
  npm install -S normalize.css
  ```

- 增加 pug/jade 的HTML模板语法支持:

  ```shell
  npm install -D pug pug-html-loader pug-plain-loader
  ```

- 增加 sass/scss 的CSS模板语法支持支持:

  ```shell
  npm install -D node-sass sass-loader
  ```

- 生成 src/styles/main.scss 和  src/styles/config.css,  作为预装载全局css定义

  main.scss:  内容暂时为空，仅仅引入 config.scss, 后续根据业务需要添加

  ```scss
  // 全局CSS常量定义
  @import "./config.scss";
  // 所有修改element-ui的样式, 以避免单页面scoped中修改权限不够的问题
  //@import "./elementui.scss"
  ```

  config.scss:  内容暂时为空， 后续根据需要业务添加

  ```scss
  // 定义全局CSS常亮, 便于在各CSS中统一共享
  ```

- 增加 Vue 3.0  @vue/composition-api 支持

  ```shell
  npm install -S @vue/composition-api
  ```

- 修改 src/main.js,  其中的 行首 + 表示为新增行, - 表示删除行, M 表示修改行( 下同, 不赘述)

  ```javascript
  import Vue from "vue";
  import App from "./App.vue";
  import router from "./router";
  import store from "./store";
  
  + import "normalize.css";
  + import ElementUI from 'element-ui';
  + import 'element-ui/lib/theme-chalk/index.css';
  + import VueCompositionApi from "@vue/composition-api";
  
  + Vue.use(ElementUI);
  + Vue.use(VueCompositionApi);
  
  Vue.config.productionTip = false;
  
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
  ```

- 运行查看结果:

  ```shell
  npm run serve
  ```
  
  访问浏览器地址展示默认Vue Web 界面
  
- 手工生成vue.config.js

  ```javascript
  const path = require("path");
  module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === "production" ? "" : "/",
    // 输出文件目录
    outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false, 
    /** vue3.0内置了webpack所有东西，
     * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
     **/
    chainWebpack: config => {
      const svgRule = config.module.rule("svg");
      svgRule.uses.clear();
      svgRule
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({
          symbolId: "icon-[name]",
          include: ["./src/icons" ]
        });
        
        config.module
              .rule("pug")
              .test(/\.pug$/)
              .use("pug-html-loader")
              .loader("pug-html-loader")
              .end();
    },
      
    configureWebpack: config => {
      config.resolve = {
        // 配置解析别名
        extensions: [".js", ".json", ".vue"], // 自动添加文件名后缀
        alias: {
          vue: "vue/dist/vue.js",
          "@": path.resolve(__dirname, "./src"),
          "@c": path.resolve(__dirname, "./src/components")
        }
      };
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
      // 是否使用css分离插件 ExtractTextPlugin
      extract: true,
      // 开启 CSS source maps?
      sourceMap: false,
      // css预设器配置项
      loaderOptions: {
        sass: {
          prependData: `@import "./src/styles/main.scss";`
        }
      },
      // 启用 CSS modules for all css / pre-processor files.
      requireModuleExtension: true, // 是否开启支持‘foo.module.css’样式
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require("os").cpus().length > 1,
    /**
     *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
     */
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
      open: false, // 编译完成是否打开网页
      host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
      port: 8090, // 访问端口
      https: false, // 编译失败时刷新页面
      hot: true, // 开启热加载
      hotOnly: false,
      proxy: {
        // 配置跨域
        "/devApi": {
          //要访问的跨域的api的域名
          target: "http://www.web-jshtml.cn",
          ws: true,
          changOrigin: true,
          pathRewrite: {
            "^/devApi": "/productapi"
          }
        }
      },
      overlay: {
        // 全屏模式下是否显示脚本错误
        warnings: true,
        errors: true
      },
      // before: app => {}
    },
    /**
     * 第三方插件配置
     */
    pluginOptions: {}
  };
  
  ```

- 改造其中的vue为pug格式

  以App.vue为例, 改写后如下:

  ```jade
  <template lang="pug">
      #app
          .nav
              router-link( to="/") Home
              | &nbsp; | &nbsp;
              router-line( to="/about" ) About
          router-view
  
  </template>
  ```

- 

- 添加vue对i18n的支持 ( 待完善 )

- 添加路由和路由动画 ( 待完善 )

- 添加Vuex支持 ( 待完善 )

  

### 前端部分(Electron)

- 安装 electron 支持

  可参考: https://www.jianshu.com/p/d2ab300f8a9a

  ```shell
  npm config set registry http://registry.npm.taobao.org/
  npm install -g electron
  electron -v 
  ```

  注: 如果一直卡在 node install.js, 可以设置%USERPROFILE%/.npmrc文件, 加入一行:

  ```ini
  ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
  ```

- 新增 vue-cli方面的plug支持, 即vue-cli-plugin-electron-builder 支持, 主要作用是修改package.json, 并新增一个electron主程序入口文件 src/background.js

  ```shell
  vue add electron-builder
  ```

  选择Electron Version时, 选择 ^6.0.0;

  修改后的package.json变化如下:

  ```json
    "scripts": {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint",
  +   "electron:build": "vue-cli-service electron:build",
  +   "electron:serve": "vue-cli-service electron:serve",
  +   "postinstall": "electron-builder install-app-deps",
  +   "postuninstall": "electron-builder install-app-deps"
    },
  +  "main": "background.js",
  ...
  
     "devDependencies":{
  ...
         
  +     "vue-cli-plugin-electron-builder": "^1.4.6",
  +     "electron": "^6.0.0",       
     }
  ```

  

- 新生成的src/background.js内容如下,  修改为如下代码, 相比自动生成代码, 多了如下功能:

  修改了App窗口大小, 取消了跨域限制, 取消了菜单栏, 修改了App的窗口Icon:

  ```javascript
  "use strict";
  
  import { app, protocol, BrowserWindow, Menu } from "electron";
  import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
  const isDevelopment = process.env.NODE_ENV !== "production";
  
  let win;
  protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
  ]);
  
  function createWindow() {
    win = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: "./src/assets/logo.png",
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true
      }
    });
    // 取消菜单
    Menu.setApplicationMenu( null );
  
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
      createProtocol("app");
      win.loadURL("app://./index.html");
    }
  
    win.on("closed", () => {
      win = null;
    });
  }
  
  app.on("activate", () => {
    if (win === null) {
      createWindow();
    }
  });
  
  app.on("ready", async () => {
    createWindow();
  });
  
  if (isDevelopment) {
    if (process.platform === "win32") {
      process.on("message", data => {
        if (data === "graceful-exit") {
          app.quit();
        }
      });
    } else {
      process.on("SIGTERM", () => {
        app.quit();
      });
    }
  }
  
  ```

  其中, 修改App窗口大小, 取消跨域限制, 取消菜单栏, 修改App图标 的代码集中在createWindow()中:

  ```javascript
      function createWindow () {
        // Create the browser window.
        win = new BrowserWindow({
  M       width: 1200,
  M       height: 800,
  +       icon: "./src/assets/logo.png",          
          webPreferences: {
  +         webSecurity: false,
            nodeIntegration: true
          }
        })
  ```

  注: 还可以参考 https://www.jianshu.com/p/9e066a57de1a, https://www.jianshu.com/p/f3e69b4f1827, 加入托盘,消息闪烁,全局快捷键等

- 测试electron 运行

  ```shell
  # 运行
  npm run electron:serve
  # 打包
  npm run electron:build
  ```

  此时出现的界面和之前用web浏览器打开的一样, 只是被装在窗口中.



### 后端部分(Express)

- 后端目录准备:

  建立src/backend目录, 作为整个后台(含Electron, lowdb, Express等, 不含Vue)的目录. 后台目录:

  ```shell
  backend
      log    目录: 存放日志文件
      store  目录: 存放数据访问工具文件
         db.js
      webserver   目录: 存放
         entity   目录: 存放数据实体文件
             be_sliceMgt.js    Slice管理
             be_sysConfig.js   系统设置
         routes   目录: 存放 exporess 路由
             be_routes.js    路由定义
         be_nodeSrv.js    express 服务器 
  ```

- 增加 lowdb 支持

  ```shell
  npm install -S lowdb
  # 为字段增加一个唯一标识id
  npm install -S lodash-id
  ```

- 增加 express 支持

  ```shell
npm install -S express
  npm install -D nodemon-
  ```
  
- src/backend/store/db.js:  提供数据对象访问能力

  ```javascript
import Datastore from "lowdb";
  import FileSync from "lowdb/adapters/FileSync";
  import path from "path";
  import fs from "fs-extra";
  import LodashId from "lodash-id";
// 引入remote模块
  import { app, remote } from "electron";

  // 根据process.type来分辨在哪种模式使用哪种模块,
  //  在主进程调用 为 browser, 在渲染进程调用为 renderer
  const APP = process.type === "renderer" ? remote.app : app;
  // 获取用户目录 C:\Users\shihe\AppData\Roaming\vue-node-lowdb
  const STORE_PATH = APP.getPath("userData");
  if (process.type !== "renderer") {
    // 如果不存在路径,创建
    if (!fs.pathExistsSync(STORE_PATH)) {
      fs.mkdirpSync(STORE_PATH);
    }
  }
  
  const adapter = new FileSync(path.join(STORE_PATH, "database.json")); // 初始化lowdb读写的json文件名以及存储路径
  const db = Datastore(adapter); // lowdb接管该文件
  //通过lodash-id这个插件可以很方便地为每个新增的数据自动加上一个唯一标识的id字段
  db._.mixin(LodashId);
  
  // 初始化 ( 示例 )
  if ( !db.read().has("NSTs").value()) {
    db.set("NSTs", []).write();
    db.get("NSTs").insert({ label: "差动保护", value: "nst_001" }).write();
    db.get("NSTs").insert({ label: "龙门吊", value: "nst_002" }).write();
  }
  
  if (!db.read().has("PLMNs").value()) {
    db.read().set("PLMNs", []).write();
    db.read().get("PLMNs").insert({ label: "中国移动01", value: "960-001" }).write();
    db.read().get("PLMNs").insert({ label: "中国联通03", value: "960-003" }).write();
    db.read().get("PLMNs").insert({ label: "中国电信07", value: "960-007" }).write();
  }
  
  // ES6写法: 暴露
  export { db as default };
  ```
  
- Express  Web Restful API 服务器:

  注: 如果是全新项目, 则可以借助如下命令来快速生成应用的骨架, 但这个项目已经存在, 因此只能手工方式把express的 WebServer, routes, 路由响应函数 等添加到项目中:

  ```shell
  npx express-generator
  ```

  

- Web Server 服务器

  代码: src/backend/webserver/be_nodeSrv.js:  

  ```javascript
  import express from "express";
  import router from "./routes/be_routes.js";
  const PORT = 3000;
  
  const webApp = express();
  //webApp.use(logger("./logs"));
  webApp.use(express.json());
  webApp.use(express.urlencoded({ extended: false }));
  webApp.use("/", router);
  
  // catch 404
  webApp.use((req, res, next) => {
    res.status(404).send("Sorry! 404 Error.");
  });
  
  // error handler, 4个参数
  webApp.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
  
  webApp.set("port", PORT);
  webApp.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  
  export { webApp as default };
  ```

- Express的API 路由:

  代码: src/backend/webserver/routes/be_routes.js

  ```javascript
  import express from "express";
  // 导入slice mgt的具体数据操作函数
  import sliceMgt from "../entity/be_sliceMgt.js";
  // 导入system config 的具体数据操作函数
  // let sysConfig = require("../entity/be_sysConfig.js");
  import sysConfig from "../entity/be_sysConfig.js";
  
  // 生成路由对象
  let router = express.Router();
  
  // 设置路由
  router.get("/nsmf/v1/nsts", sliceMgt.getNSTs);
  router.get("/nsmf/v1/plmns", sliceMgt.getPLMNs);
  router.get("/nsmf/v1/nsmfConfig", sysConfig.getNSMFConfig);
  router.put("/nsmf/v1/nsmfConfig", sysConfig.setNSMFConfig);
  
  // ES6写法: 暴露路由
  export { router as default };
  ```

- sliceMgt实体文件:

  代码:  src/backend/webserver/entity/be_sliceMgt.js

  ```javascript
  import db from "@/backend/store/db.js";
  
  let sliceMgt = new Object();
  // wrap函数把不支持promise的库转为支持, 可以支持异步
  // const wrap = fn => (...args) => fn(...args).catch(args[2]);
  // router.get(
  //   "/",
  //   wrap(async (req, res) => {
  //     await console.log("Async call cost long time");
  //     console.log("return get function");
  //     res.send("Hello World!");
  //   })
  // );
  
  sliceMgt.getNSTs = (req, res) => {
    console.log("GET: NST List");
    // 查询数据  
    let data = db.get("NSTs").value();
    res.json(data);
  };
  
  sliceMgt.getPLMNs = (req, res) => {
    console.log("GET: PLMN List");
    res.send("getPLMNs");
  };
  
  export { sliceMgt as default };
  ```

  be_sysConfig.js类似处理

- 准备完毕后, 在 src/background.js 中加入Express Webserver的启动:

  ```javascript
  "use strict";
  
  import { app, protocol, BrowserWindow, Menu } from "electron";
  import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
  + import webApp from "@/backend/webserver/be_nodeSrv.js";
  ...
  ```

  由于 webApp 本身在模块中就会执行, 因此import即可

- 启动 Vue + Electron + Express

  ```shell
  npm  run electron:serve
  ```

  Vue+Electron部分应该保持和之前一样, 是一个带窗口的App, 同时console窗口会打印Express WebServer启动的信息:

  ```shell
  App listening on port 3000 
  ```

  通过浏览器访问 Express 的API接口:

  ```shell
  http://localhost:3000/nsmf/v1/nsts
  ```

  浏览器会展示返回的json结构:

  ```json
  [{"label":"差动保护","value":"nst_001","id":"007b1880-f259-4993-b786-a5d93310b306"},{"label":"龙门吊","value":"nst_002","id":"1ff1f498-b308-4649-a42e-77e7293e42b6"}]
  ```

  

  

  

  

  

  




