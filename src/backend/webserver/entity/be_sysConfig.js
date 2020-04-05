import db from "@/backend/store/db.js";

let sysConfig = new Object();

sysConfig.setNSMFConfig = (req, res) => {
  console.log("SET: NSMF Config");
  res.send("setNSMFConfig");
};

sysConfig.getNSMFConfig = (req, res) => {
  console.log("GET: NSMF Config");
  res.send("getNSMFConfig");
};

// export default sysConfig;
export { sysConfig as default };
