import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method}not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();

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
    throw error;
    //return response.status(500).json({ error: "Internal error" });
  } finally {
    await dbClient.end();
  }
}
