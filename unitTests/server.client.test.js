const client = require('../rsci/server.client.js');

test('client.add', done => {
  const c = new client();
  const data = c.add({ ip: '192.168.0.1'});

  expect(data).toContainEqual({ ip: '192.168.0.1'});
  done();
});