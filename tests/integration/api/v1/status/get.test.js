test("GET to /api/v1/status should return 200", async () => {
  const respose = await fetch("http://localhost:3000/api/v1/status");
  expect(respose.status).toBe(200);

  const responseBody = await respose.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.dependencies.database.version).toEqual("16.11 (df20cf9)");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
