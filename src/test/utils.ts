require("dotenv").config();
import { Client } from "pg";
import { config } from "../config";
import { db, setupDBClearData } from "../db";
export function wait(ms) {
  return new Promise((r, _) => setTimeout(r, ms));
}
export async function createDB() {
  const connection = new Client({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
  });

  await connection.connect();

  try {
    await connection.query(`DROP DATABASE IF EXISTS "${config.db.database}"`);
    await connection.query(`CREATE DATABASE "${config.db.database}"`);
  } catch (err) {
    if (err) throw err;
  }

  await connection.end();
}

export async function addExtensions() {
  const connection = new Client({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
  });
  await connection.connect();
  try {
    await connection.query(`DROP EXTENSION IF EXISTS pgcrypto`);
    await connection.query(`CREATE EXTENSION pgcrypto`);
  } catch (err) {
    if (err) throw err;
  }
  await connection.end();
}
export const setUpTestDB = async () => {
  await createDB();
  await addExtensions();
  await setupDBClearData();
};

/*Singleton Class to set up the test database and instance it just once.
  Because the mocha tests run at multiples .test.ts files, this Singleton guarantee to run it by any mocha test that was run at first.
*/
export class TestDB {
  private static instance: TestDB;
  private isAlreadyInit: boolean = false;
  private db;

  constructor() {
    //Set attributes for future modifications here!
  }

  get getDB() {
    return this.db;
  }

  public static getInstance(): TestDB {
    if (!TestDB.instance) {
      TestDB.instance = new TestDB();
    }

    return TestDB.instance;
  }

  //Executed once when code intence it.
  async init() {
    if (!!this.isAlreadyInit) return this.db;

    await createDB();
    await addExtensions();
    this.db = await setupDBClearData();
    this.isAlreadyInit = true;
    return this;
  }
}

const testDB = TestDB.getInstance(); //Singleton creation.
export default testDB;
