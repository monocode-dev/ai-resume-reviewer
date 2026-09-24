import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv"
import pool from "./database/database";

//Routers
import authRouter from './routes/authRouter'
import reviewRouter from "./routes/reviewRouter"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);

app.set('trust proxy', 1);
app.use(express.json());
app.use(
  session({
    store: new PgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "none",
    },
  })
);

app.use("/auth", authRouter)
app.use("/api", reviewRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})