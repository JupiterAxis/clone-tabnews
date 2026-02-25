import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).json({});
  }
  let dbClient = await database.getNewClient();
  try {
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingmigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingmigrations);
    }

    if (request.method === "POST") {
      const migratedmigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedmigrations.length > 0) {
        return response.status(201).json(migratedmigrations);
      }
      return response.status(200).json(migratedmigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({});
  } finally {
    await dbClient.end();
  }
}
