const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  editUserInfo, getMeUser,
} = require('../controllers/users');

router.get('/me', getMeUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), editUserInfo);

module.exports = router;
