
export const BASE64 = 'base64';
export const BASE64_URL = 'base64url';
export const ALPHABET = BASE64;
export const SEPARATOR = '.';
export const RANDOM_BITS = 12;

/**
 * Generates a unique identifier (SUID).
 *
 * @param {object} options
 * @param {Date|number} [options.date=Date.now()] The timestamp to use in the SUID. Defaults to current time.
 * @param {Uint8Array} [options.randomBits=crypto.getRandomValues(new Uint8Array(12))] Random data for the SUID. Defaults to 12 bytes of cryptographically secure random data.
 * @param {string} [options.alphabet='base64'] Base64 alphabet to use for encoding. Defaults to 'base64'.
 * @param {string} [options.separator='.'] Separator character between SUID parts. Defaults to '.'.
 * @returns {string} The generated SUID.
 * @throws {TypeError} If the provided `date` is not a Date object or a positive integer.
 * @throws {TypeError} If the provided `randomBits` is not a Uint8Array or has less than 2 elements.
 * @throws {TypeError} If `alphabet` is 'base64url' and `separator` is '-'.
 */
export function getSUID({
	date = Date.now(),
	randomBits = crypto.getRandomValues(new Uint8Array(RANDOM_BITS)),
	alphabet = ALPHABET,
	separator = SEPARATOR,
} = {}) {
	if (date instanceof Date) {
		return getSUID({ date: date.getTime(), randomBits, alphabet, separator });
	} else if (! Number.isSafeInteger(date) || date < 1) {
		throw new TypeError('Timestamp must be a Date or positive integer.');
	} else if (Number.isSafeInteger(randomBits)) {
		return getSUID({ date, randomBits: crypto.getRandomValues(new Uint8Array(randomBits)), alphabet, separator });
	} else if (! (randomBits instanceof Uint8Array) || randomBits.length < 2) {
		throw new TypeError('randomBits must be a non-empty Uint8Array.');
	} else if (alphabet === BASE64_URL && separator === '-') {
		throw new TypeError('"-" is not an allowed separator for base64 URL alphabet.');
	} else {
		const mid = Math.floor(randomBits.length / 2);

		return Uint8Array.fromHex(date.toString(16).padStart(12, '0')).toBase64({ alphabet })
			+ separator + randomBits.subarray(0, mid).toBase64({ alphabet })
			+ separator + randomBits.subarray(mid).toBase64({ alphabet });
	}
}

/**
 * Parses a SUID string into the options/date used to generate it.
 *
 * @param {string} suid The SUID string to parse.
 * @param {object} options
 * @param {string} [options.alphabet='base64'] Base64 alphabet to use for decoding. Defaults to 'base64'.
 * @param {string} [options.separator='.'] Separator character between SUID parts. Defaults to '.'.
 * @returns {{date: Date, randomBits: Uint8Array, alphabet: string, separator: string}} An object containing the options used to generate the SUID.
 * @throws {TypeError} If `suid` is not a non-empty string.
 */
export function parseSUID(suid, {
	alphabet = ALPHABET,
	separator = SEPARATOR,
} = {}) {
	if (typeof suid !== 'string' || suid.length === 0) {
		throw new TypeError('suid must be a non-empty string.');
	} else {
		const [timeBits, bitsA, bitsB] = suid.split(separator).map(sect => Uint8Array.fromBase64(sect, { alphabet }));
		const randomBits = new Uint8Array(bitsA.length + bitsB.length);
		randomBits.set(bitsA, 0);
		randomBits.set(bitsB, bitsA.length);
		const date = new Date(parseInt(timeBits.toHex(), 16));

		return { date, randomBits, alphabet, separator };
	}
}
