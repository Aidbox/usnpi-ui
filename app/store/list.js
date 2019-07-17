import { site_url } from '../config';

const list = store => {
  store.on('@init', () => ({ loading: false, list: [] }));
  store.on('list/get', async () => {
    store.dispatch('list/loading');
    const { token } = store.get();
    const res = await fetch(`${site_url}/AppQuestionnaire?_sort=-.start_date`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    const list = await res.json();
    if (res.status === 200) {
      store.dispatch('list/set', list.entry.map(v => v.resource));
    }
  });
  store.on('list/loading', () => ({ loading: true }));
  store.on('list/set', (store, list) => ({ loading: false, list }));
};

export default list;
