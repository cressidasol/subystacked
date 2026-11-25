import assert from 'node:assert/strict';
import { stamp, toCues, toSRT, toVTT, toTXT } from './public/format.js';

assert.equal(stamp(0), '00:00:00,000');
assert.equal(stamp(3661.5), '01:01:01,500');
assert.equal(stamp(59.9996, '.'), '00:01:00.000');

const cues = toCues([
  { timestamp: [0, 2.5], text: ' Hello there.' },
  { timestamp: [2.5, 4], text: '  ' },
  { timestamp: [4, null], text: ' Bye.' },
], 6);
assert.equal(cues.length, 2);
assert.equal(cues[1].end, 6);
assert.equal(toSRT(cues), '1\n00:00:00,000 --> 00:00:02,500\nHello there.\n\n2\n00:00:04,000 --> 00:00:06,000\nBye.\n');
assert.ok(toVTT(cues).startsWith('WEBVTT\n\n00:00:00.000 --> 00:00:02.500\nHello there.\n'));
assert.equal(toTXT(cues), 'Hello there.\nBye.\n');
console.log('format ok');
