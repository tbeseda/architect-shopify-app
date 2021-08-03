const Axios = require('axios').default;
const sandbox = require('@architect/sandbox');

const host = 'http://localhost:3333';

describe('Shopify Auth', () => {
  let sandboxResult;

  beforeEach(async () => {
    sandboxResult = await sandbox.start({ quiet: true });
  });

  afterEach(async () => {
    await sandbox.end();
  });

  it('starts a sandbox', async () => {
    expect(sandboxResult).toBe('Sandbox successfully started');
  });

  it('serves an index file at the root', async () => {
    const root = await Axios.get(`${host}/`);
    expect(root).toBeTruthy();
  });

  it('fails authentication without a shop param', async () => {
    try {
      await Axios.get(`${host}/auth`);
      throw new Error('Auth should not succeed');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});
