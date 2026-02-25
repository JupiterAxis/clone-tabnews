import { cleanDatabase } from "tests/utils/cleanDatabase.js";
//import database from "infra/database";

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
  const respose = await fetch("http://localhost:3000/api/v1/migrations");
  expect(respose.status).toBe(200);

  const responseBody = await respose.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
