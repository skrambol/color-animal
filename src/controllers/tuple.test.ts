import app from "../app";
import supertest from "supertest";
import { ColorAnimal, data } from "./tuple";

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
  beforeEach(() => {
    data.tuples = [];
  });

  test("insert one tuple", async () => {
    const payload: ColorAnimal[] = [{ color: "Brown", animal: "Owl" }];
    const oldLength = data.tuples.length;
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(payload.length);
    expect(response.body).toEqual(payload);
    expect(data.tuples).toHaveLength(oldLength + payload.length);
  });

  test("insert multiple tuple", async () => {
    const payload: ColorAnimal[] = [
      { color: "Brown", animal: "Owl" },
      { color: "Green", animal: "Snake" },
    ];
    const oldLength = data.tuples.length;
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(payload.length);
    expect(response.body).toEqual(payload);
    expect(data.tuples).toHaveLength(oldLength + payload.length);
  });

  test("insert tuples excluding missing color/animal", async () => {
    const payload = [
      { color: "Brown", animal: "Owl" },
      { color: "Green", animal: "Snake" },
      { color: "Teal" },
      { animal: "Platypus" },
    ];
    const oldLength = data.tuples.length;
    const response = await api.post(baseUrl).send({ tuples: payload });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(payload.slice(0, 2));
    expect(data.tuples).toHaveLength(oldLength + 2);
  });
});

describe(`PUT ${baseUrl}/:color/:animal`, () => {
  beforeEach(() => {
    data.tuples = [
      {
        color: "Red",
        animal: "Fox",
      },
      {
        color: "Brown",
        animal: "Owl",
      },
      {
        color: "Blue",
        animal: "Bird",
      },
      {
        color: "Brown",
        animal: "Owl",
      },
    ];
  });
  test("return 404 when tuple does not exist", async () => {
    const payload = { color: "Red", animal: "Eagle" };
    const response = await api
      .put(`${baseUrl}/White/Eagle`)
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("update an existing tuple", async () => {
    const payload = { color: "White", animal: "Fox" };
    const response = await api
      .put(`${baseUrl}/Red/Fox`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([payload]);
  });

  test("update an existing multiple tuples", async () => {
    const payload = { color: "Gray", animal: "Owl" };
    const response = await api
      .put(`${baseUrl}/Brown/Owl`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([payload, payload]);
  });

  test("update an existing tuple's color if animal is missing", async () => {
    const payload = { color: "White" };
    const response = await api
      .put(`${baseUrl}/Blue/Bird`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([{ color: "White", animal: "Bird" }]);
  });

  test("update an existing tuple's animal if color is missing", async () => {
    const payload = { animal: "Whale" };
    const response = await api
      .put(`${baseUrl}/Blue/Bird`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([{ color: "Blue", animal: "Whale" }]);
  });
});

describe(`DELETE ${baseUrl}/:color/:animal`, () => {
  beforeEach(() => {
    data.tuples = [
      {
        color: "Red",
        animal: "Fox",
      },
      {
        color: "Brown",
        animal: "Owl",
      },
      {
        color: "Blue",
        animal: "Bird",
      },
      {
        color: "Brown",
        animal: "Owl",
      },
    ];
  });

  test("return 204 even if tuple does not exist", async () => {
    const oldLength = data.tuples.length;
    const response = await api.delete(`${baseUrl}/no-color/no-animal`);

    expect(response.status).toBe(204);
    expect(data.tuples).toHaveLength(oldLength);
  });

  test("delete one tuple", async () => {
    const oldLength = data.tuples.length;
    const response = await api.delete(`${baseUrl}/Blue/Bird`);

    expect(response.status).toBe(204);
    expect(data.tuples).toHaveLength(oldLength - 1);
  });

  test("delete multiple tuples if duplicate", async () => {
    const oldLength = data.tuples.length;
    const response = await api.delete(`${baseUrl}/Brown/Owl`);

    expect(response.status).toBe(204);
    expect(data.tuples).toHaveLength(oldLength - 2);
  });
});
