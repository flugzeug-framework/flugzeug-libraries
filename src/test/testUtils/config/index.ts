import path from "path";
import { Dialect } from "sequelize/types";

export const config = {
  root: path.normalize(`${__dirname}/..`),
  
  env: process.env.NODE_ENV || "development",

  db: {
    database: process.env.DB_NAME || "generator-flugzeug",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    dialect: (process.env.DB_TYPE || "postgres") as Dialect,
    logging: false,
    storage: process.env.DB_STORAGE || "db.sqlite",
    timezone: "utc", // IMPORTANT For correct timezone management with DB.
  },
};