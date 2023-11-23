import express, { Router, Request, Response } from "express";

export interface ColorAnimal {
  color: string;
  animal: string;
}

const router: Router = express.Router();
let data: ColorAnimal[] = [
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

router.post("/", (request: Request, response: Response) => {
  const tuples: ColorAnimal[] = request.body.tuples;

  const cleanedTuples = tuples.filter((tuple) => tuple.color && tuple.animal);
  data = data.concat(cleanedTuples);

  response.status(201).json(cleanedTuples);
});

router.put("/:color/:animal", (request: Request, response: Response) => {
  const { color, animal } = request.params;
  const { color: newColor, animal: newAnimal } = request.body.tuple;

  const tuple = data.find((t) => t.color === color && t.animal === animal);
  if (!tuple) {
    return response
      .status(404)
      .json({ error: `(${color}, ${animal}) not found.` });
  }

  tuple.color = newColor || tuple.color;
  tuple.animal = newAnimal || tuple.animal;

  response.json(tuple);
});

export default router;
