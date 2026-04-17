import { celebrate, Joi, Segments } from 'celebrate';
import validator from 'validator';
import { URL_REGEX } from '../constants/urlRegex';

const objectId = Joi.string().hex().length(24).required();

const emailSchema = Joi.string()
  .required()
  .custom((value: string, helpers) => {
    if (validator.isEmail(value)) {
      return value;
    }
    return helpers.error('any.invalid');
  }, 'email validation');

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: emailSchema,
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
  }),
});

export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: emailSchema,
    password: Joi.string().required(),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

export const validateUserIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: objectId,
  }),
});

export const validateCardIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: objectId,
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).min(1),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
});
