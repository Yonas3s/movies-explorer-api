const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestStatus = require('../errors/BadRequestStatus');
const NotFoundStatus = require('../errors/NotFoundStatus');
const ForbiddenStatus = require('../errors/ForbiddenStatus');

// module.exports.getMovies = (req, res, next) => {
//   Movie.find({ owner: req.user._id })
//     .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
//     .catch(next);
// };

// module.exports.addMovie = (req, res, next) => {
//   const {
//     country,
//     director,
//     duration,
//     description,
//     year,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     nameRU,
//     nameEN,
//   } = req.body;
//   Movie.create({
//     country,
//     director,
//     duration,
//     description,
//     year,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     nameRU,
//     nameEN,
//     owner: req.user._id,
//   })
//     .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.ValidationError) {
//         next(new BadRequestStatus(err.message));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.deleteMovie = (req, res, next) => {
//   Movie.findById(req.params.movieId)
//     .orFail(new NotFoundStatus('Карточка с указанным _id не найдена.'))
//     .then((card) => {
//       if (!card.owner.equals(req.user._id)) {
//         throw new ForbiddenStatus('Карточка другого пользователя.');
//       }
//       Movie.deleteOne(card)
//         .then(() => {
//           res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена.' });
//         })
//         .catch((err) => {
//           next(err);
//         });
//     })
//     .catch((err) => {
//       if (err instanceof mongoose.Error.CastError) {
//         next(new BadRequestStatus('Некорректный _id карточки.'));
//       } else {
//         next(err);
//       }
//     });
// };
// const movieSchema = require('../models/movie');
// const Forbidden = require('../errors/Forbidden');
// const NotFound = require('../errors/NotFound');
// const BadRequest = require('../errors/BadRequest');

module.exports.getMovies = (req, res, next) => {
  movieSchema
    .find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  movieSchema
    .findById(movieId)
    .orFail(() => {
      throw new NotFound('Cannot be found');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        movieSchema.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new Forbidden('Unable to delete movie');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((movie) => res.status(201)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Incorrect data'));
      }
      return next(err);
    });
};
