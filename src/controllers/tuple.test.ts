import app from "../app";
import supertest from "supertest";
import { ColorAnimal } from "./tuple";

const api = supertest(app);
const baseUrl = "/tuples";

describe(`GET ${baseUrl}`, () => {
  test("gets all tuples", async () => {
    const response = await api.get(baseUrl);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("defaults to get all if random=false", async () => {
    const response = await api.get(`${baseUrl}?random=false`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("gets a random tuple", async () => {
    const response = await api.get(`${baseUrl}?random=true`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("color");
    expect(response.body).toHaveProperty("animal");
  });
});

describe(`POST ${baseUrl}`, () => {
  test("insert one tuple", async () => {
    const payload: ColorAnimal[] = [{ color: "Brown", animal: "Owl" }];
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(payload.length);
    expect(response.body).toEqual(payload);
  });

  test("insert multiple tuple", async () => {
    const payload: ColorAnimal[] = [
      { color: "Brown", animal: "Owl" },
      { color: "Green", animal: "Snake" },
    ];
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(payload.length);
    expect(response.body).toEqual(payload);
  });

  test("insert tuples excluding missing color/animal", async () => {
    const payload = [
      { color: "Brown", animal: "Owl" },
      { color: "Green", animal: "Snake" },
      { color: "Teal" },
      { animal: "Platypus" },
    ];
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(payload.slice(0, 2));
  });
});
