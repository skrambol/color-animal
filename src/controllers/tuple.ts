import express, { Router, Request, Response } from "express";

interface ColorAnimal {
  color: string;
  animal: string;
}

const router: Router = express.Router();
const data: ColorAnimal[] = [
  {
    color: "Red",
    animal: "Fox",
  },
  {
    color: "Blue",
    animal: "Bird",
  },
];

router.get("/", (request: Request, response: Response) => {
  const isRandom: boolean = request.query.random === "true";

  if (isRandom) {
    const rand: number = Math.floor(Math.random() * data.length);
    return response.json(data[rand]);
  }

  response.json(data);
});

export default router;
