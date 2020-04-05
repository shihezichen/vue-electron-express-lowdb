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
// export default router;
