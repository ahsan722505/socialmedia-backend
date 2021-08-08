const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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
                const accessToken = jwt.sign(
                  {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                  },
                  process.env.ACCESS_TOKEN_SECRET
                );
                res.json({
                  ok: true,
                  usernameExist: false,
                  emailExist: false,
                  accessToken: accessToken,
                });
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
exports.login = (req, res, next) => {
  User.findOne({
    password: req.body.password,
    $or: [{ email: req.body.emailOrUser }, { username: req.body.emailOrUser }],
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.json({ ok: false });
      } else {
        // console.log("sending response");
        const accessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        console.log(accessToken);
        res.json({
          ok: true,
          username: user.username,
          accessToken: accessToken,
        });
      }
    })
    .catch((err) => {});
};
exports.auth = (req, res, next) => {
  // console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.json({ authorized: false });
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err || !user) {
      res.json({ authorized: false });
      return;
    }
    req.user = user;
    next();
  });
};
exports.getData = (req, res, next) => {
  Post.find()
    .populate("userId", "username")
    .populate("likes.userId", "username")
    .populate("comments.userId", "username")
    .exec()
    .then((posts) => {
      res.json({ authorized: true, posts: posts, user: req.user });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addPost = (req, res, next) => {
  const post = new Post({
    userId: req.user.id,
    likes: [],
    comments: [],
    content: req.body.content,
  });
  post
    .save()
    .then(() => {
      res.json({ posted: true });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addComment = (req, res, next) => {
  console.log(req.body);
  console.log(req.user);
  Post.findById(req.body.postId)
    .then((post) => {
      post.comments.push({
        comment: req.body.comment,
        userId: req.user.id,
      });
      post
        .save()
        .then(() => {
          res.json({ posted: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addLike = (req, res, next) => {
  Post.findById(req.body.postId)
    .then((post) => {
      post.likes.push({ userId: req.user.id });

      post
        .save()
        .then(() => {
          res.json({ liked: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.removeLike = (req, res, next) => {
  Post.findById(req.body.postId)
    .then((post) => {
      post.likes = post.likes.filter((like) => like.userId != req.user.id);

      post
        .save()
        .then(() => {
          res.json({ unLiked: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
