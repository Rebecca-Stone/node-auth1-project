const Users = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await Users.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else {
      next({ status: 422, message: "Username taken" });
    }
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const user = await Users.findBy({ username: req.body.username });
    if (!user.length) {
      next({ status: 401, message: "Invalid credentials" });
    } else {
      req.user = user[0];
      next();
    }
  } catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 3) {
    next({ message: "Password must be longer than 3 chars", status: 422 });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
};
