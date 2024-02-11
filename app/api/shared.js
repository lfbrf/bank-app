import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function handleDeposit(req, accountType) {
  if (!db) {
    db = await open({
      filename: "./bank.db",
      driver: sqlite3.Database,
    });
  }
  await db.run("BEGIN TRANSACTION");
  try {
    const { value } = await req.json();
    const account = await db.all(`SELECT * FROM account where user_id = 1 and type = '${accountType}'`);
    const amount = (account[0]?.balance ? account[0]?.balance : 0) + parseFloat(value.replace(/,/, '.'));
    await db.run(`UPDATE account SET balance = ? WHERE user_id = 1 and type = '${accountType}'`, amount);
    const currentDate = new Date().toISOString();
    await db.run("INSERT INTO transactions (account_id, user_id, type, amount, date) VALUES (?, ?, ?, ?, ?)", [1,1, accountType, amount, currentDate]);
    await db.run("COMMIT");
    return new Response(
      JSON.stringify(
        { message: "success" },
        {
          headers: { "content-type": "application/json" },
          status: 200,
        }
      )
    );
  } catch (error) {
    await db.run("ROLLBACK");
    return new Response(
      JSON.stringify(
        { message: error.message },
        {
          headers: { "content-type": "application/json" },
          status: 500,
        }
      )
    );
  }
}


export async function handleTransfer(req, fromAccountType, toAccountType) {
    if (!db) {
      db = await open({
        filename: "./bank.db",
        driver: sqlite3.Database,
      });
    }
    await db.run("BEGIN TRANSACTION");
    try {
      const { value } = await req.json();
      const account = await db.all("SELECT * FROM account where user_id = 1 ");
      const fromBalance = account.find(acc => acc.type === fromAccountType)?.balance || 0;
      const toBalance = account.find(acc => acc.type === toAccountType)?.balance || 0;
  
      if (fromBalance - value < 0) {
        throw new Error("Not enough funds to transfer");
      }
  
      const newFromBalance = fromBalance - parseFloat(value.replace(/,/, '.'));
      const newToBalance = toBalance + parseFloat(value.replace(/,/, '.'));
  
      await db.run(`UPDATE account SET balance = ? WHERE user_id = 1 and type = ? `, [newFromBalance, fromAccountType]);
      await db.run(`UPDATE account SET balance = ? WHERE user_id = 1 and type = ? `, [newToBalance, toAccountType]);
      
      const currentDate = new Date().toISOString();
      await db.run("INSERT INTO transactions (account_id, user_id, type, amount, date) VALUES (?, ?, ?, ?, ?)", [1, 1, `transferTo${toAccountType.charAt(0).toUpperCase() + toAccountType.slice(1)}`, value, currentDate]);
      
      await db.run("COMMIT");
      return new Response(
        JSON.stringify(
          { message: "success" },
          {
            headers: { "content-type": "application/json" },
            status: 200,
          }
        )
      );
    } catch (error) {
      await db.run("ROLLBACK");
      return new Response(
        JSON.stringify(
          { message: error.message },
          {
            headers: { "content-type": "application/json" },
            status: 500,
          }
        )
      );
    }
  }
