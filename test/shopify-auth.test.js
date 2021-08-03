const test = require('tape');
const Axios = require('axios').default;
const sandbox = require('@architect/sandbox');

const host = 'http://localhost:3333';

test('sandbox HTTP request', async (t) => {
  t.plan(4);

  await sandbox.start({ quiet: true });
  t.ok(true, `sandbox started on ${host}`);

  const root = await Axios.get(`${host}/`);
  t.ok(root, 'got root');

  try {
    await Axios.get(`${host}/auth`);
  } catch (error) {
    t.ok(error, 'got auth error');
  }

  await sandbox.end();
  t.ok(true, 'sandbox ended');
});
