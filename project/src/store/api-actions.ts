import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import { AppDispatch, State } from '../types/state';
import {Films} from '../types/films';
import { loadFilms, setError, setFilmsDataLoadingStatus, requireAuthorization, getFilmById, getFilmComments, getSimilarFilms } from './action';
import {store} from './';
import { AuthorizationStatus ,TIMEOUT_SHOW_ERROR } from '../const';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { saveToken, dropToken } from '../services/token';
import { Reviews } from '../types/reviews';
import { NewReview } from '../types/reviews';


export const clearErrorAction = createAsyncThunk(
  'clearError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);

export const fetchFilmsAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'films/fetchFilms',
  async (_arg, {dispatch, extra: api}) => {
    dispatch(setFilmsDataLoadingStatus(true));
    const {data} = await api.get<Films[]>('films');
    dispatch(setFilmsDataLoadingStatus(false));
    dispatch(loadFilms(data));
  });

export const fetchChoosedFilmAction = createAsyncThunk<Films, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'films/fetchChoosedFilm',
  async (id, {dispatch, extra: api}) => {

    try {
      const {data} = await api.get<Films>(`films/${id}`);
      dispatch(getFilmById(data));
      return data;
    } catch {
      throw Error;
    }
  });

export const fetchFilmCommentsAction = createAsyncThunk<Reviews[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'films/fetchFilmComments',
  async (id, {dispatch, extra: api}) => {
    const {data} = await api.get<Reviews[]>(`comments/${id}`);
    dispatch(getFilmComments(data));
    return data;
  });

export const fetchSimilarFilmsAction = createAsyncThunk<Films[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'films/fetchFilmComments',
  async (id, {dispatch, extra: api}) => {
    const {data} = await api.get<Films[]>(`films/${id}/similar`);
    dispatch(getSimilarFilms(data));
    return data;
  });

export const addReviewAction = createAsyncThunk<Reviews[], NewReview, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'films/review',
    async ({comment, rating}, {dispatch, getState, extra: api}) => {
      const state = getState();
      const id = state.choosedFilm?.id;
      //eslint-disable-next-line
    debugger;
      const {data} = await api.post<Reviews[]>(`comments/${id as number}`, {comment, rating});
      dispatch(getFilmComments);
      return data;
    },
  );

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    try {
      await api.get('login');
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    //eslint-disable-next-line
    debugger;
    const {data: {token}} = await api.post<UserData>('login', {email, password});
    saveToken(token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, {dispatch, extra: api}) => {
    await api.delete('logout');
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  },
);

