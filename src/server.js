const express = require("express");
const app = express();
const helmet = require("helmet");
const {verifyJwt} = require('./middleware/verifyJWT');
const morgan = require("morgan");
const {connectDB} = require("./db.js");
const PORT = 8080 || process.env.PORT;
// const webpush = require("web-push");
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { userRouter } = require("./routes/userRoutes");
const { eventsRouter } = require("./routes/eventsRoutes.js") 
const { runFunc } = require("./services/debugService.js");
const { networkRouter } = require("./routes/networkRoutes.js");
const { attachmentRouter } = require("./routes/attachmentRoutes.js");
const { formRouter } = require("./routes/formRoutes.js");
// const { postRoutes } = require("./routes/postRoutes");
app.use(cors());
app.use(helmet());
// app.use(verifyJwt);
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// store name, rollNumber, year, sem, divison branch in jwtToken
// Routes :
app.use("/auth/user",  authRouter);
app.use("/api/user", userRouter);
app.use("/api/events", eventsRouter);
app.use("/api/network", networkRouter);
app.use("/api/attachment", attachmentRouter);
app.use("/api/forms", formRouter);
app.get("/", async(req, res) => {
    await runFunc();
    res.send("working");
});


app.listen(PORT, () => console.log("server startd"));