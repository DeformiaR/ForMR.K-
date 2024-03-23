const UserDB = require("../models/customerModel");

const userLogin = async function (req,res, email, password) {
  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await UserDB.getUserByEmail(email);

  if (oldUser) {
    // User already exist and if password is correct
      // >> update session information

    if (oldUser.password === password) {
      // correct password
      req.session.authenticated = true;
      req.session.userId = oldUser.id;
      req.session.email = email;
      req.session.wish = [];
    } else {
      // incorrect password
      req.session.authenticated = false;
      res.json({ msg: "Wrong authentication" });
    }
  } else {
    // new user --> add new user to database
    // note that, normally, a user is not added to a system simply like this.
    const newUser = UserDB.create({ email: email, password: password });

    // create session as defined
    req.session.authenticated = true;
    req.session.userId = newUser.id;
    req.session.email = email;
    req.session.wish = [];
  }

  console.log("session in UserLogin: ", req.sessionID);
  console.log(req.session);

  return req.session;
};

exports.userLogin = userLogin;

module.exports.authentication = async (req, res, next) => {
  const authenicated = await req.session.authenticated;

  console.log("session in authentication: ", req.sessionID);

  if (!authenicated) {
    return res.redirect("/login?q=session-expired");
  }
  try {
    
    let user = await UserDB.findById(req.session.userId);

    console.log("user:" + user.email);

    if (!user) {
      return res.redirect("/login?q=session-expired");
    }
    next();
  } catch (err) {
    console.log(err);
    res.json({ msg: "Server error. Please reload page after sometime" });
  }
};
