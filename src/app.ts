import express, { Express } from "express";
import morgan from "morgan"
import tupleRouter from "./controllers/tuple";

const app: Express = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/tuples", tupleRouter);

export default app;
