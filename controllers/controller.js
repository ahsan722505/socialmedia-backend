const User = require("../models/User");
exports.signup = (req, res, next) => {
  let usernameExist;
  let emailExist;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        emailExist = true;
      } else {
        emailExist = false;
      }
      User.findOne({ username: req.body.username })
        .then((user) => {
          if (user) {
            usernameExist = true;
          } else {
            usernameExist = false;
          }
          if (usernameExist && !emailExist) {
            res.json({ ok: false, usernameExist: true, emailExist: false });
          } else if (emailExist && !usernameExist) {
            res.json({ ok: false, usernameExist: false, emailExist: true });
          } else if (emailExist && usernameExist) {
            res.json({ ok: false, usernameExist: true, emailExist: true });
          } else {
            const user = new User(req.body);
            user
              .save()
              .then(() => {
                res.json({ ok: true, usernameExist: false, emailExist: false });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
