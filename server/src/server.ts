import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv"
import pool from "./database/database.js";

import path from 'path';
import { fileURLToPath } from 'url';

//Routers
import authRouter from './routes/authRouter.js'
import reviewRouter from "./routes/reviewRouter.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use("/auth", authRouter)
app.use("/api", reviewRouter)

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})