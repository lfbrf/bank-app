import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { handleDeposit } from "../shared";

let db = null;

export async function POST(req, res) {
  return await handleDeposit(req, 'saving');
}
