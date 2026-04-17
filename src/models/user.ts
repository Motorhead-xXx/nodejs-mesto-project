import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import { INVALID_URL } from '../constants/errorMessages';

const DEFAULT_NAME = 'Егор Летов';
const DEFAULT_ABOUT = 'Музыкант';
const DEFAULT_AVATAR = 'https://aif-s3.aif.ru/images/035/590/80cab66729157c7a8f73da0c5ed05b65.jpg';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DEFAULT_NAME,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DEFAULT_ABOUT,
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
    validate: {
      validator: (v: string) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: INVALID_URL,
    },
  },
}, { versionKey: false });

userSchema.set('toJSON', {
  transform(_doc, ret) {
    const plain = { ...ret } as Record<string, unknown>;
    delete plain.password;
    return plain;
  },
});

export default mongoose.model<IUser>('user', userSchema);
