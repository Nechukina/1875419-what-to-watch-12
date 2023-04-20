import {datatype, random, image, internet, lorem, name, music, date } from 'faker';
import { Films } from '../types/films';
import { Reviews } from '../types/reviews';
import { UserData } from '../types/user-data';


export const makeFakeFilm = () : Films => ({
  id: datatype.number({min: 1, max: 25}),
  name: random.words(2),
  posterImage: image.cats(218, 327),
  previewImage: image.cats(280, 175),
  backgroundColor: internet.color(),
  videoLink: internet.url(),
  previewVideoLink: internet.url(),
  description: lorem.sentences(),
  rating: datatype.number({min: 0, max: 10, precision: 0.1}),
  scoresCount: datatype.number({min: 0, max: 5000}),
  director: name.findName(),
  starring: new Array(2).fill(null).map(() => (name.findName())),
  runTime: datatype.number({min: 30, max: 120}),
  genre: music.genre(),
  released: datatype.number({min: 1995, max: 2022}),
  isFavorite: datatype.boolean()

} as Films);

export const makeFakeReview = (): Reviews => ({
  id: datatype.number({min: 1, max: 25}),
  user: {
    id: datatype.number({min: 1, max: 50}),
    name: name.findName(makeFakeUser.name),
  },
  rating: datatype.number({min: 0, max: 10, precision: 0.1}),
  comment: lorem.sentences(),
  date: date.recent().toISOString(),
} as Reviews);

export const makeFakeUser = (): UserData => ({
  avatarUrl: internet.avatar(),
  email: internet.email(makeFakeUser.name),
  id: datatype.number({min: 1, max: 50}),
  name: internet.userName(),
  token: datatype.string(),
} as UserData);
