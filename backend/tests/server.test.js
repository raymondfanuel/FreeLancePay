// mock stellar-sdk to avoid real network calls or constructors
jest.mock('stellar-sdk', () => {
  class DummyServer {}
  DummyServer.prototype.loadAccount = () => Promise.resolve({ balances: [] });
  const networks = { TESTNET: 'TESTNET', PUBLIC: 'PUBLIC', useTestNetwork: () => {}, usePublicNetwork: () => {} };
  return {
    // original exports that code might access
    Networks: networks,
    Asset: class {},
    Keypair: { random: () => ({ publicKey: () => 'GABC', secret: () => 'SABC' }), fromSecret: () => ({ publicKey: () => 'GABC' }) },
    TransactionBuilder: class {
      constructor(account, opts) { this.acc = account; }
      addOperation() { return this; }
      setTimeout() { return this; }
      build() { return this; }
      sign() {}
    },
    Memo: { text: () => {} },
    Operation: { changeTrust: () => ({}), payment: () => ({}) },
    // ensure Horizon namespace exists with Server property
    Horizon: { Server: DummyServer },
    // also include Server reference if any code still uses it
    Server: DummyServer,
  };
});

const request = require('supertest');
const { app, server } = require('../server');

afterAll(() => {
  server.close();
});

describe('health check', () => {
  it('should return 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
