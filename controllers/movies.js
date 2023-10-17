const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestStatus = require('../errors/BadRequestStatus');
const NotFoundStatus = require('../errors/NotFoundStatus');
const ForbiddenStatus = require('../errors/ForbiddenStatus');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestStatus(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(new NotFoundStatus('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenStatus('Карточка другого пользователя.');
      }
      Movie.deleteOne(card)
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена.' });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestStatus('Некорректный _id карточки.'));
      } else {
        next(err);
      }
    });
};
