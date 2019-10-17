const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", async (req, res) => {
  const { role } = req.token;
  if (role === "admin") {
    try {
      const users = await User.find({}).select("_id name role");
      return res.json({
        status: 200,
        msg: "List de utilisateurs récupérée",
        users
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur"
      });
    }
  }
  return res.status(401).json({
    status: 401,
    msg: "Vous n'êtes pas admin"
  });
});

router.get("/:_id", async (req, res) => {
  const {_id} = req.params;
    try {
      const user = await User.findById({ _id }).select("_id name role");
      return res.json({
        status: 200,
        msg: "Voici " + user.name,
        user
      })
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur",
      });
    }
});

router.put("/:_id", async (req, res) => {
  const {role} = req.token;
  const {_id} = req.params;
  const {name, role: newRole} = req.body;
  try {
    const userFound = await User.findOne({ name });
    if (userFound) {
      throw { status: 400, msg: "Veuillez choisir un autre nom" };
    }
  } catch (err) {
    console.log(err);
    const { status, msg } = err;
    if (status === 400) {
      return res.status(400).json({ status, msg });
    }
    return res.status(500).json({
      msg: "Erreur interne du serveur"
    });
  }

  if (role !== "admin") {
    newRole = "member"
  }
  try {
    const updatedUser = await User.findByIdAndUpdate( _id, { $set: {name, role: newRole}}, { new: true } ).select("_id name role")
   
    return res.json({
      status: 200,
      msg: "Voici le nouveau nom " + updatedUser.name,
      updatedUser
    })
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: "Erreur interne du serveur",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  const {_id} = req.params;
    try {
      const deleteUser = await User.findByIdAndDelete({ _id }).select("_id name role");
      return res.json({
        status: 200,
        msg: deleteUser.name + " Supprimé",
        deleteUser
      })
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur",
      });
    }
});

module.exports = router;
