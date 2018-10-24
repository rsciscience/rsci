const api = require('../rsci/api')
const db = require('../rsci/db')
const client = require('../rsci/client.js');

test('client.getState', done => {
  const _db = new db()
  const _api = new api()
  const c = new client(_db, _api);
  function success(data) {

    expect(data).toHaveProperty('experimentSessionsLocal');

    done();
  };

  c.getState(success);
});