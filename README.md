<h2>RetinaPhWechat (Not published online)</h2>
The service solution for referral reviewers in the referral audit system makes it easy and convenient for reviewers to query/update/maintain records of referral appointments within their permissions.<br/>
(眼底检查预约转诊解决方案体系中针对转诊审核人的服务解决方案，主旨使审核人可以轻松便捷地查询/更新/维护其权限范畴内可操作的转诊预约)<br/>

## Introduction
Type (类型)：公众号 <br/>
Audiences (受众/服务对象)：审核人（拟定：医生）<br/>
Key Features (主要功能)：<br/>
 1. 筛选搜索（按日历）预约的转诊记录
 2. 更新/维护转诊记录
 3. 查看对应检查及报告

## Prerequisites
-   git (v2.2+)
-   node.js (v10.0+)
-   npm (v6.0+)
-   yarn (v1.22.10+)
-   TypeScript(V3.7.4+)
-   Express(v4.17.1+)
-   Sass
-   Pug(V2.0.4+)

## Initial Evironment
-   One Step: `yarn install`;<br/>
    Install all dependencies;
-   Scripts:
    - "dev": Run the APP with watch mode, will auto restart if change files; // 以监视模式运行APP，如果更改文件，它将自动重启;(运行本地mock数据)
    - "dev-with-backend": "npm run build && npm run watch-b" // 与后端联调(http://retina.voxelcloud.net.cn)
    - "start": "npm run build && npm run nodemon", // 生产环境启动脚本
    - "build": Build the final export files in `./dist`; // 在`./dist`中构建最终的导出文件;
-   Config files:
    - devServer.js: LocaL dev server with express. // 本地开发环境启动配置;
    - tsconfig.json: The compilation configuration of the typescript. // type script的编译配置;
    - copyStaticAssets.ts: Organize the fianl exprot files // 手动整理最终输出文件;
    - mockServer.ts： Simulate the back-end environment // 模拟后端API, 返回本地mock数据

## Structure
   - dist (Final Compilation Folder) // 最终编译目录
   - src (Main Folder) // 主文件目录
     - views (the main viewers of the APP) // 主界面, 页面目录
     - images (image, icon, font) // 图片目录(图片)
     - css (styles) // 样式目录(图标, 字体)
     - controllers (the controller of each viewer, include event handlers, request, animation, etc) // 个界面的控制器目录(包含:事件维护,请求维护,动画效果等等)
     - components (the tempalte, common component) // 通用模板,组件库(将来应共同并入到公司前端组件库)
   - mockData    // mock server data(json)

## Run test tools
   - 微信开发者工具 https://codeload.github.com/onlyhom/mobileSelect.js/zip/master
   ![image text](https://github.com/SujunYao/readme-images/blob/master/images/wechart_tools.png)

## Resource links:
- Sui Mobile (http://m.sui.taobao.org/);
- TypeScript: (https://www.typescriptlang.org/index.html)
- Pug: (https://pugjs.org/api/getting-started.html)
- Sass:(https://sass-lang.com/documentation)
