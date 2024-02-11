// Import the necessary modules for SQLite
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function GET(req, res) {
  const { url } = req;
  if (!db) {
    db = await open({
      filename: "./bank.db",
      driver: sqlite3.Database,
    });
  }

  const transactions = await db.all("SELECT * FROM transactions where user_id = 1");
  const balances = await db.all("SELECT * FROM account where user_id = 1 ");
  return new Response(JSON.stringify({transactions, balances}), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
