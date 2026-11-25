import assert from 'node:assert/strict';
import { judge } from './public/credits.js';

assert.deepEqual(judge({ success: false }), { ok: false, left: 0, reason: 'That license key is not valid.' });
assert.equal(judge({}).ok, false);
assert.deepEqual(judge({ success: true, uses: 0, purchase: {} }, 20), { ok: true, left: 20 });
assert.deepEqual(judge({ success: true, uses: 19, purchase: {} }, 20), { ok: true, left: 1 });
assert.equal(judge({ success: true, uses: 20, purchase: {} }, 20).ok, false);
assert.equal(judge({ success: true, uses: 0, purchase: { refunded: true } }, 20).ok, false);
assert.equal(judge({ success: true, uses: 0, purchase: { chargebacked: true } }, 20).ok, false);
console.log('credits ok');
