const client = require('../rsci/client.js');

test('client.getState', done => {
  const c = new client();
  function success(data) {

    expect(data).toHaveProperty('experimentSessionsLocal');

      done();
    };

    c.getState(success);
});