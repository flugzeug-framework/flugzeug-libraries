import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { config } from "./config";
import path from "path";

const dbOptions: SequelizeOptions = {
  ...config.db,
  modelPaths: [path.join(__dirname, "/models")],
  define: {
    freezeTableName: true,
    timestamps: true,
  },
};

export const db = new Sequelize(dbOptions);

// Should be called in server
export function setupDB(): PromiseLike<any> {
  return db.sync();
}

export function setupDBClearData(): PromiseLike<any> {
  return db.sync({
    force: true,
  });
}

export function setupDBAlterSchema(): PromiseLike<any> {
  return db.sync({
    alter: true,
  });
}

export function printDBCreateSQL(): PromiseLike<any> {
  return db.sync({
    logging: data => {
      // Clean output
      data = data.replace("Executing (default): ", "");
      if (data.indexOf("SHOW INDEX FROM") != -1) return;
      console.log(data);
    },
  });
}