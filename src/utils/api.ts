const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/apf-cohort-202',
  headers: {
    authorization: 'eccb4406-7405-4ce1-8103-d8b98ce54e5f',
    'Content-Type': 'application/json'
  }
};

export interface IUserData {
  name: string;
  about: string;
  avatar: string;
  _id: string;
  cohort?: string;
}

export interface ICardData {
  _id: string;
  name: string;
  link: string;
  likes: { _id: string }[];
  owner: { _id: string };
  createdAt: string;
}

const getResponseData = <T>(res: Response): Promise<T> => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = (): Promise<IUserData> => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(res => getResponseData<IUserData>(res));
};

export const setUserInfo = (name: string, about: string): Promise<IUserData> => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  }).then(res => getResponseData<IUserData>(res));
};

export const setUserAvatar = (avatarUrl: string): Promise<IUserData> => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  }).then(res => getResponseData<IUserData>(res));
};

export const getCardList = (): Promise<ICardData[]> => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(res => getResponseData<ICardData[]>(res));
};

export const addNewCard = (name: string, link: string): Promise<ICardData> => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(res => getResponseData<ICardData>(res));
};

export const deleteCard = (cardId: string): Promise<void> => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(res => getResponseData<void>(res));
};

export const putLike = (cardId: string): Promise<ICardData> => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(res => getResponseData<ICardData>(res));
};

export const deleteLike = (cardId: string): Promise<ICardData> => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(res => getResponseData<ICardData>(res));
};