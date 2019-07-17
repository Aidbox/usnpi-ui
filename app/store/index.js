import createStore from 'storeon';

import user from './user';
import list from './list';

const store = createStore([
  user,
  list,
  process.env.NODE_ENV !== 'production' && require('storeon/devtools')
]);

export default store;
