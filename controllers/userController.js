const { User, Thought } = require("../models");

const userController = {
  //CRUD commands
  // create a user
  // respond with a user by id
  //update the user
  //delete the user
  getUsers(req, res) {
    User.find()
      .select("-_v")
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // get single user by ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-_v")
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create a new User
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },
  //update a User
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },
  //delte a User
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((userData) =>
        !userData
          ? res.status(404).json({ message: "No such user exists" })
          : Thought.findOneAndUpdate(
              { user: req.params.userId },
              { $pull: { user: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "User deleted no thought found" })
          : res.json({ message: "User has been deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  //add a friend
  addFriend(req, res) {
    console.log("You are adding a freind");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((userData) =>
        !userData
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(userData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // remove a freind
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { $in: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((userData) =>
        !userData
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(userData)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
