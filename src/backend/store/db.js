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

// 初始化
if (
  !db
    .read()
    .has("NSTs")
    .value()
) {
  db.set("NSTs", []).write();
  db.get("NSTs")
    .insert({ label: "差动保护", value: "nst_001" })
    .write();
  db.get("NSTs")
    .insert({ label: "龙门吊", value: "nst_002" })
    .write();
}

if (
  !db
    .read()
    .has("PLMNs")
    .value()
) {
  db.read()
    .set("PLMNs", [])
    .write();
  db.read()
    .get("PLMNs")
    .insert({ label: "中国移动01", value: "960-001" })
    .write();
  db.read()
    .get("PLMNs")
    .insert({ label: "中国联通03", value: "960-003" })
    .write();
  db.read()
    .get("PLMNs")
    .insert({ label: "中国电信07", value: "960-007" })
    .write();
}

// ES6写法: 暴露
export { db as default };
// export default db;
