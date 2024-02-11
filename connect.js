const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./bank.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

db.serialize(() => {
  db.run("BEGIN TRANSACTION"); // Start a transaction
  try {
    // Drop tables if they exist
    db.run(`DROP TABLE IF EXISTS transactions`, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Dropped transactions table");

      db.run(`DROP TABLE IF EXISTS account`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Dropped account table");

        db.run(`DROP TABLE IF EXISTS user`, (err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Dropped user table");

          // Create user table
          db.run(
            `CREATE TABLE IF NOT EXISTS user (
                  id INTEGER PRIMARY KEY,
                  email TEXT,
                  password TEXT
              )`,
            (err) => {
              if (err) {
                return console.error(err.message);
              }
              console.log("Created user table");

              // Delete existing data in the user table (for demonstration purposes)
              db.run(`DELETE FROM user`, (err) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Deleted items in user table");

                // Insert sample user data
                const userInsertSql = `INSERT INTO user (email, password) VALUES (?, ?)`;
                const userValues = ["example@example.com", "password123"];

                db.run(userInsertSql, userValues, function (err) {
                  if (err) {
                    return console.error(err.message);
                  }
                  const userId = this.lastID;
                  console.log(`Added user with id ${userId}`);

                  // Create account table
                  db.run(
                    `CREATE TABLE IF NOT EXISTS account (
                          id INTEGER PRIMARY KEY,
                          type TEXT,
                          balance DECIMAL,
                          user_id INTEGER,
                          FOREIGN KEY(user_id) REFERENCES user(id)
                      )`,
                    (err) => {
                      if (err) {
                        return console.error(err.message);
                      }
                      console.log("Created account table");

                      // Delete existing data in the account table (for demonstration purposes)
                      db.run(`DELETE FROM account`, (err) => {
                        if (err) {
                          return console.error(err.message);
                        }
                        console.log("Deleted items in account table");

                        // Insert accounts for this user
                        const accountInsertSql = `INSERT INTO account (type, user_id) VALUES (?, ?)`;
                        const accountValues1 = ["saving", userId];
                        const accountValues2 = ["checking", userId];

                        db.run(accountInsertSql, accountValues1, function (err) {
                          if (err) {
                            return console.error(err.message);
                          }
                          const accountId1 = this.lastID;
                          console.log(`Added account item with id ${accountId1}`);

                          db.run(accountInsertSql, accountValues2, function (err) {
                            if (err) {
                              return console.error(err.message);
                            }
                            const accountId2 = this.lastID;
                            console.log(`Added account item with id ${accountId2}`);

                            // Create transactions table (renamed from transaction)
                            db.run(
                              `CREATE TABLE IF NOT EXISTS transactions (
                                    id INTEGER PRIMARY KEY,
                                    user_id INTEGER,
                                    account_id INTEGER,
                                    type TEXT,
                                    amount DECIMAL,
                                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    FOREIGN KEY(user_id) REFERENCES user(id),
                                    FOREIGN KEY(account_id) REFERENCES account(id)
                                )`,
                              (err) => {
                                if (err) {
                                  return console.error(err.message);
                                }
                                console.log("Created transactions table");

                                // Delete existing data in the transactions table (for demonstration purposes)
                                db.run(`DELETE FROM transactions`, (err) => {
                                  if (err) {
                                    return console.error(err.message);
                                  }
                                  console.log("Deleted items in transactions table");

                                  db.run("COMMIT", (err) => {
                                    if (err) {
                                      return console.error(err.message);
                                    }
                                    console.log("Committed the transaction.");
                                    db.close((err) => {
                                      if (err) {
                                        return console.error(err.message);
                                      }
                                      console.log("Closed the database connection.");
                                    });
                                  });
                                });
                              }
                            );
                          });
                        });
                      });
                    }
                  );
                });
              }
            );
          });
        });
      });
    });
  } catch (error) {
    db.run("ROLLBACK", (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Rolled back the transaction due to an error.");
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Closed the database connection.");
      });
    });
  }
});
