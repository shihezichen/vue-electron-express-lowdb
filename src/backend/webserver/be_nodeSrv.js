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
