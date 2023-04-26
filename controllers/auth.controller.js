const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const credentialIncorrect = (res) => res.status(401).send({ message: 'Email ou mot de passe inccorect' });

exports.signIn = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    },
    include: db.Organisation
  });
  if(!user) return credentialIncorrect(res);

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if(!passwordIsValid) return credentialIncorrect(res);

  const organisationsId = user.organisations.map(orga => orga.id)

  const token = jwt.sign(
    {userId: user.id, organisations: organisationsId}
    , config.secret);

  delete user.password;
  delete user.organisations;
  return res.status(200).send({accessToken: token, user: user, organisations: organisationsId});

}
