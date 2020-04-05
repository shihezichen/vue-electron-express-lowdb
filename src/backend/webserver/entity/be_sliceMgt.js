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
  let data = db.get("NSTs").value();
  res.json(data);
};

sliceMgt.getPLMNs = (req, res) => {
  console.log("GET: PLMN List");
  res.send("getPLMNs");
};

export { sliceMgt as default };
// export default sliceMgt;
