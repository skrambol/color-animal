import express, { Router, Request, Response } from "express";

export interface ColorAnimal {
  color: string;
  animal: string;
}

export const data: Record<"tuples", ColorAnimal[]> = {
  tuples: [
    {
      color: "Red",
      animal: "Fox",
    },
    {
      color: "Blue",
      animal: "Bird",
    },
  ],
};
const router: Router = express.Router();

router.get("/", (request: Request, response: Response) => {
  const isRandom: boolean = request.query.random === "true";

  if (isRandom) {
    const rand: number = Math.floor(Math.random() * data.tuples.length);
    return response.json(data.tuples[rand]);
  }

  response.json(data.tuples);
});

router.post("/", (request: Request, response: Response) => {
  const newTuples: ColorAnimal[] = request.body.tuples;

  const cleanedTuples = newTuples.filter(
    (tuple) => tuple.color && tuple.animal,
  );
  data.tuples = data.tuples.concat(cleanedTuples);

  response.status(201).json(cleanedTuples);
});

router.put("/:color/:animal", (request: Request, response: Response) => {
  const { color, animal } = request.params;
  const { color: newColor, animal: newAnimal } = request.body.tuple;
  let updatedTuples: ColorAnimal[] = [];

  data.tuples = data.tuples.map((tuple) => {
    if (tuple.color === color && tuple.animal === animal) {
      // update accordingly if (color, animal) exists
      tuple.color = newColor || tuple.color;
      tuple.animal = newAnimal || tuple.animal;

      updatedTuples = updatedTuples.concat(tuple);
    }

    return tuple;
  });

  if (updatedTuples.length === 0) {
    return response
      .status(404)
      .json({ error: `(${color}, ${animal}) not found.` });
  }

  response.json(updatedTuples);
});

router.delete("/:color/:animal", (request: Request, response: Response) => {
  const { color, animal } = request.params;
  data.tuples = data.tuples.filter(
    (tuple) => JSON.stringify(tuple) !== JSON.stringify({ color, animal }),
  );

  response.status(204).send();
});

export default router;
