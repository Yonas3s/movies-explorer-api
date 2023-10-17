const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  addMovie, getMovies, deleteMovie,
} = require('../controllers/movies');
const urlRegex = require('../utils/const');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    year: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
