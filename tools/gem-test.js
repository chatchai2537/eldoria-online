// ทดสอบระบบเหรียญแฟชั่นฝั่งเซิร์ฟเวอร์ (ไฟล์ชั่วคราว ไม่แตะ Upstash): node tools/gem-test.js
const os = require('os'), path = require('path'), fs = require('fs');
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'gem')); delete process.env.UPSTASH_REDIS_REST_URL;
process.env.GM_IDS = 'gmtest'; process.env.TOPUP_PROMPTPAY = '0812345678'; process.env.TOPUP_NAME = 'ทดสอบ'; process.env.TOPUP_CONTACT = 'LINE: @test';
const A = require('../accounts.js'); let ip = 0; const H = (p, d) => A.handle(p, d, '10.0.0.' + (ip++ % 200));
(async () => {
  const R = {}, fail = [];
  const u = await H('/api/register', { id: 'player1', pw: 'secret1', name: 'P1' }), g = await H('/api/register', { id: 'gmtest', pw: 'secret1', name: 'GM' });
  const me = x => Object.assign({ id: 'player1', token: u.token }, x), gm = x => Object.assign({ id: 'gmtest', token: g.token }, x);
  let b = await H('/api/gem', me({ op: 'bal' })); R.login = b.gem; if (b.gem !== 2) fail.push('login bonus');
  b = await H('/api/gem', me({ op: 'earn', src: 'lboss' })); if (b.gem !== 4) fail.push('lboss');
  b = await H('/api/gem', me({ op: 'earn', src: 'lboss' })); if (b.err !== 'cd') fail.push('lboss cd');
  for (let i = 0; i < 6; i++) b = await H('/api/gem', me({ op: 'earn', src: 'xchg' })); R.afterX = b; if (b.err !== 'xmax' && b.err !== 'cap') fail.push('xchg max');
  b = await H('/api/gem', me({ op: 'earn', src: 'wboss' })); R.cap = b; const bal = await H('/api/gem', me({ op: 'bal' })); if (bal.earn > 10) fail.push('cap');
  b = await H('/api/gem', me({ op: 'buy', key: 'b:th_chaona' })); if (b.err !== 'gem') fail.push('buy without gem');
  b = await H('/api/gem', me({ op: 'list' })); if (b.err !== 'perm') fail.push('non-gm list');
  b = await H('/api/gem', me({ op: 'credit', to: 'player1', n: 999 })); if (b.err !== 'perm') fail.push('non-gm credit');
  const rq = await H('/api/gem', me({ op: 'req', pkg: 'p2' })); R.req = rq.ref; if (!rq.ref) fail.push('req');
  const L = await H('/api/gem', gm({ op: 'list' })); if (!L.list || L.list[0].ref !== rq.ref) fail.push('gm list');
  b = await H('/api/gem', gm({ op: 'ok', ref: rq.ref })); b = await H('/api/gem', gm({ op: 'ok', ref: rq.ref })); if (b.err !== 'noreq') fail.push('double approve');
  b = await H('/api/gem', me({ op: 'bal' })); R.afterTop = b.gem; if (b.gem !== bal.gem + 100) fail.push('topup credit');
  b = await H('/api/gem', me({ op: 'buy', key: 'b:night' })); if (!b.fown || !b.fown.includes('b:night') || b.gem !== bal.gem + 55) fail.push('buy');
  b = await H('/api/gem', me({ op: 'buy', key: 'b:night' })); if (b.gem !== bal.gem + 55) fail.push('rebuy charged');
  b = await H('/api/gem', me({ op: 'buy', key: 'b:fake' })); if (b.err !== 'item') fail.push('fake item');
  b = await H('/api/save', me({ save: 'x', base: 0, lv: 10, cls: 'monk', name: 'P1' })); const ld = await H('/api/gem', me({ op: 'bal' })); if (ld.gem !== bal.gem + 55) fail.push('save wiped gem');
  console.log(JSON.stringify({ fail, R }, null, 1)); process.exit(0);
})();
