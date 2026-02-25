test("PUT to /api/v1/migrations should return 405", async () => {
  const respose = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });
  expect(respose.status).toBe(405);
});
