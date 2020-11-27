const { Party } = require("../models/Party");
const { server } = require("../server");
const { Router } = require("express");
const socketIO = require("socket.io");
const fs = require("fs");

const partyRouter = new Router();
const io = socketIO(server);

partyRouter.get("/:partyCode?", (req, res, next) => {
  if (!req.params.partyCode) return res.redirect("/");
  res.render("party.html", {
    partyCode: req.params.partyCode,
    pseudo: req.session.pseudo,
  });
});

io.on("connection", (socket) => {
  const { partiesCollection } = require("../server.js");
  socket.on("new-user", (partyCode, username) => {
    if (!partyCode || !username) return;

    partiesCollection
      .findOne({ partyCode: partyCode })
      .then((found) => {
        if (found) return Object.assign(new Party(), found);
        else return new Party(partyCode);
      })
      .then((party) => {
        party.connect(socket.id, username, "LesBG"); // TODO change ID
        socket.join(partyCode);
        io.to(party.getAdmin().socketID).emit("you-are-now-admin");
        io.to(partyCode).emit("all-players", party.getPlayers());
        return party;
      })
      .then((party) => updatePartyDB(party))
      .catch((error) => {
        console.error("[ERROR] " + error.stack);
      });
  });

  socket.on("next-game", (partyCode) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => {
        if (party.getAdmin().socketID !== socket.id) {
          socket.emit("you-are-not-admin");
          throw new Error("You are not admin.");
        }

        console.log("[PARTY] (" + partyCode + ") next game.");
        io.to(partyCode).emit("message", "Next game started.");
        fs.readFile("./private/party/game.xml", (error, fileContent) => {
          if (error) throw new Error("Couldn't get next game.");
          io.to(partyCode).emit("game", fileContent.toString());
        });
      })
      .catch((error) => {
        console.error("[ERROR] " + error.stack);
        socket.emit("message", error.message);
      });
  });

  socket.on("disconnect", () => {
    getUserPartiesDB(socket.id)
      .map((party) => Object.assign(new Party(), party))
      .forEach((party) => {
        party.disconnect(socket.id);
        if (party.isEmpty()) return removePartyDB(party);
        io.to(party.getAdmin().socketID).emit("you-are-now-admin");
        io.to(party.partyCode).emit("all-players", party.getPlayers());
        updatePartyDB(party);
      });
  });
});

function updatePartyDB(party) {
  const { partiesCollection } = require("../server.js");
  partiesCollection
    .replaceOne({ partyCode: party.partyCode }, party, {
      upsert: true, // if not found, inserts a new document
    })
    .catch((error) => console.error("[ERROR] " + error.stack));
}

function getPartyDB(partyCode) {
  const { partiesCollection } = require("../server.js");
  return partiesCollection
    .findOne({ partyCode: partyCode })
    .then((party) => {
      if (!party) throw new Error("Party not found.");
      return party;
    })
    .then((party) => Object.assign(new Party(), party));
}

function getUserPartiesDB(socket) {
  const { partiesCollection } = require("../server.js");
  return partiesCollection.find({
    players: { $elemMatch: { socketID: socket } },
  });
}

function removePartyDB(party) {
  const { partiesCollection } = require("../server.js");
  partiesCollection
    .deleteOne({ partyCode: party.partyCode })
    .catch((error) => console.error("[ERROR] " + error.stack));
}

module.exports = {
  partyRouter,
};
