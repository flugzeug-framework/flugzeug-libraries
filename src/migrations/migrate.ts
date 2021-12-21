import {Sequelize} from "sequelize";

require("dotenv").config();
import winston from "winston";
import path from "path";
import Umzug from "umzug";

export const log = new winston.Logger();

export async function migrate(db: Sequelize) {
  const umzug = new Umzug({
    migrations: {
      path: path.join(__dirname, "./../../migrations"),
      params: [db.getQueryInterface()],
    },
    storage: "sequelize",
    storageOptions: {
      sequelize: db,
    },
  });

  try {
    await umzug.up();
    log.info("MIGRATIONS DONE");
  } catch (err) {
    log.error(err);
    process.exit();
  }
  process.exit();
}

