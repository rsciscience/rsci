const client = require('../rsci/client.js');

test('client.getState', done => {
  function success(data) {

    expect(data).toHaveProperty('experimentSessionsLocal');

      done();
    };

    client.getState(success);
});