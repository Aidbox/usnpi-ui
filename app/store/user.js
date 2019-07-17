import { site_url } from '../config';

const u = window.localStorage.getItem('user');

const defaultState = {
  token: window.localStorage.getItem('auth_token') || null,
  user: u ? JSON.parse(u) : null
};

const user = store => {
  store.on('@init', () => {
    if (defaultState.token && defaultState.user) {
      const getUser = async () => {
        const res = await fetch(`${site_url}/User/${defaultState.user.id}`, {
          headers: {
            Authorization: `Bearer ${defaultState.token}`,
            'content-type': 'application/json'
          }
        });
        const user = await res.json();
        if (res.status === 200) {
          store.dispatch('user/set-user', user);
        } else {
          store.dispatch('user/set-user-token', { token: null, user: null });
        }
      };
      getUser();
    } else {
      defaultState.token = null;
      defaultState.user = null;
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('user');
    }
    return defaultState;
  });
  store.on('user/set-user-token', (store, { token, user }) => {
    if (token) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
    return { token, user };
  });
  store.on('user/set-token', (store, token) => {
    if (token) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
    return { token };
  });
  store.on('user/set-user', (store, user) => {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
    return { user };
  });
};

export default user;
