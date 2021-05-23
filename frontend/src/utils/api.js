class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkPromise(data) {
    if (data.ok) {
      return Promise.resolve(data.json());
    }

    return Promise.reject(`Ошибка: ${data.status}`);
  }

  _getUser(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => this._checkPromise(res))
  }

  _getCardList(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => this._checkPromise(res))
  }

  initialPage(token) {
    const promises = [this._getUser(token), this._getCardList(token)];

    return Promise.all(promises);
  }

  setUserInfo(data, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(res => this._checkPromise(res))
  }

  sendCard(data, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      })
    })
      .then(res => this._checkPromise(res))
  }

  deleteCard(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => this._checkPromise(res));
  }

  changeLikeCardStatus(id, isLiked, token) {
    if (isLiked) {
      return this._removeLike(id, token);
    } else {
      return this._setLike(id, token);
    }
  }

  _setLike(id, token) {
    return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: 'PUT',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => this._checkPromise(res));
  }

  _removeLike(id, token) {
    return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: 'DELETE',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => this._checkPromise(res))
  }

  updateAvatar(data, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
      .then(res => this._checkPromise(res));
  }
}

const api = new Api({
  baseUrl: 'http://mestofull-backend.nomoredomains.club',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
