import express, { Express } from "express";
import tupleRouter from "./controllers/tuple";

const app: Express = express();

app.use(express.json());

app.use("/tuples", tupleRouter);

export default app;
