import '@shgysk8zer0/polyfills';
import { getSUID, parseSUID, BASE64_URL, ALPHABET, SEPARATOR } from './suid.js';
import { describe, test } from 'node:test';
import assert from 'node:assert';

const signal = AbortSignal.timeout(3000);

describe('Test generating and parsing of SUIDs', () => {
	test('Basic IO tests', { signal }, () => {
		const suid = getSUID();
		const { date, randomBits, alphabet, separator } = parseSUID(suid);
		assert.ok(typeof suid === 'string', 'Generated SUID should be a string.');
		assert.ok(date instanceof Date, 'Parsed SUID should return a `Date` object as `date`.');
		assert.ok(randomBits instanceof Uint8Array, 'Parsed SUID should return a `Uint8Array` as `randomBits`.');
		assert.equal(alphabet, ALPHABET, 'Parsed SUIDs should return the correct alphabet.');
		assert.equal(separator, SEPARATOR, 'Parsed SUIDs should return the correct seperator.');
	});

	test('Expected errors are thrown', { signal }, () => {
		assert.throws(() => getSUID({ date: -1 }), { name: 'TypeError' }, 'Invalid dates should throw a TypeError');
		assert.throws(() => getSUID({ randomBits: new Uint8Array() }), { name: 'TypeError' }, 'Invalid randomBits should throw a TypeError');
		assert.throws(() => parseSUID(null), { name: 'TypeError' }, 'Invalid SUID parsing should throw a TypeError');
	});

	test('Deterministic generating of SUIDs given known timestamp & random bits', { signal }, () => {
		const date = 1734076800000; // 2024-12-13T08:00:00.000Z
		const randomBits = new Uint8Array([236, 229, 72, 197, 74, 155, 111, 0, 144, 245, 43, 1]);
		const suid = getSUID({ date, randomBits });

		assert.equal(suid, 'AZO/CBwA' + SEPARATOR + '7OVIxUqb' + SEPARATOR + 'bwCQ9SsB', 'Fixed input should have known output.');
	});

	test('`getSUID()` and `parseSUID()` should be reversable', { signal }, () => {
		const date = Date.now();
		const randomBits = crypto.getRandomValues(new Uint8Array(12));
		const suid = getSUID({ date, randomBits });
		const parsed = parseSUID(suid);

		assert.equal(getSUID(parsed), suid, 'Re-generating from the same data should result in the same SUID.');
		assert.equal(parsed.date.getTime(), date, 'Parsed SUID date should equal the input date.');
		assert.deepStrictEqual(parsed.randomBits, randomBits, 'Parsed random bits should match input.');
	});

	test('`randomBits` as an integer should generate that many random bits', { signal }, () => {
		const len = 8;
		const suid = getSUID({ randomBits: len });
		const parsed = parseSUID(suid);

		assert.equal(len, parsed.randomBits.length, 'Generated SUID should have the expected number of random bits.');
	});

	test('Should also work with URL encoded alphabet', { signal }, () => {
		const suid = getSUID({ alphabet: BASE64_URL });
		const cb = () => parseSUID(suid, { alphabet: BASE64_URL });

		assert.doesNotThrow(cb, 'URL encoded SUIDs should generate and parse correctly');
		assert.equal(getSUID(cb()), suid, 'Re-generating should still return the same SUID.');
	});
});
