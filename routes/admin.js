const { Router } = require("express");

const adminRouter = new Router();

/**
 *            !!! ATTENTION DEVELOPPERS !!!
 *
 * All these routes are for developpement use only and should not
 * be accessible by the end user when the app is deployed.
 */

// TODO init db with Master User
if (process.env.ENV === "development") {
  /**
   * Master user check
   */
  adminRouter.all("/", (req, res, next) => {
    if (req.session.email !== process.env.MASTER_USER_EMAIL)
      return res.redirect("/");
    next();
  });

  /**
   * Return all registered users in a json array.
   */
  adminRouter.get("/", (req, res, next) => {
    const usersCollection = require("../server.js").usersCollection;
    Promise.resolve(usersCollection.find())
      .then((cursor) => cursor.toArray())
      .then((arr) => res.json(arr));
  });

  /**
   * Delete all registered users.
   */
  adminRouter.delete("/", (req, res, next) => {
    const usersCollection = require("../server.js").usersCollection;
    usersCollection.deleteMany({}).then(() => {
      res.redirect("/");
    });
  });

  /**
   * Delete an user using his email.
   */
  adminRouter.delete("/:email", (req, res, next) => {
    const usersCollection = require("../server.js").usersCollection;
    usersCollection.deleteMany({ email: req.params.email }).then(() => {
      console.log(`${deleted.result.n} users deleted`);
      res.send(`${deleted.result.n} users deleted`);
    });
  });
}

module.exports = { adminRouter };
