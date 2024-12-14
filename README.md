# `@shgysk8zer0/suid`

Simple/Sortable Unique IDentifiers

[![CodeQL](https://github.com/shgysk8zer0/suid/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/suid/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/suid/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/suid/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/suid.svg)](https://github.com/shgysk8zer0/suid/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/suid.svg)](https://github.com/shgysk8zer0/suid/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/suid?logo=github)](https://github.com/shgysk8zer0/suid/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/suid)](https://www.npmjs.com/package/@shgysk8zer0/suid)
![node-current](https://img.shields.io/node/v/@shgysk8zer0/suid)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@shgysk8zer0/suid)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/suid?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/suid)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/suid.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/suid.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## What/Why
This library generates simple/sortable, deterministic, and reversible unique identifiers (SUIDs).

- Sortable: SUIDs are designed to be easily sorted chronologically based on their embedded timestamp.
- Deterministic: Given the same input options, the getSUID() function will always generate the same SUID.
- Reversible: The parseSUID() function allows you to recover the original date and random data used to generate a given SUID.
- Customizable: Generating options allow varying entropy in the random bits, and supports base64 or base64 URL encoding.
- Lighweight: After minifying and tree-shaking and gzip compression, can be as small as 460B.
- Standards-based and modern: Uses new `Uint8Array` methods for converting to/from base64 and hexadecimal.

## Installation/importing

### Via npm

```bash
npm i @shgysk8zer0/suid
```

### Via unpkg & [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)

#### `<script type="importmap">`
```html
<script type="importmap">
  {
    "imports": {
      "@shgysk8zer0/suid": "https://unpkg.com/@shgysk8zer0/suid[@:version]/suid.min.js"
    }
  }
</script>
```

## Example Usage

```js
import { getSUID, parseSUID } from '@shgysk8zer0/suid';

const suid = getSUID();
const { date, randomBits, alphabet, separator } = parseSUID(suid);
```

### Advanced Usage

```js
import { getSUID, parseSUID, BASE64_URL } from '@shgysk8zer0/suid';

const suid = getSUID({
  date: 1734076800000, // 2024-12-13T08:00:00.000Z
  randomBits: new Uint8Array([236, 229, 72, 197, 74, 155, 111, 0, 144, 245, 43, 1]),
  alphabet: BASE64_URL, // "base64url"
  separator: ':',
});

console.log(suid); // "AZO_CBwA:7OVIxUqb:bwCQ9SsB"
console.log(parseSUID(suid, { alphabet: BASE64_URL, separator: ':' }));
/* Object {
  date: Date Fri Dec 13 2024 00:00:00 GMT-0800 (Pacific Standard Time),
  randomBits: Uint8Array(12),
  alphabet: "base64url",
  separator: ":"
}*/
```

### SUID Generating Options

| Option Name | Type | Default | Description |
|---|---|---|---|
| `date` | `Date` \| `number` | `Date.now()` | The timestamp to use in the SUID. If a `Date` object is provided, its timestamp will be used. |
| `randomBits` | `Uint8Array` | `crypto.getRandomValues(new Uint8Array(12))` | Random data for the SUID. Must be at least 2 bytes. |
| `alphabet` | `string` | `'base64'` | Base64 alphabet to use for encoding. Allowed values: 'base64', 'base64url'. |
| `separator` | `string` | `'.'` | Separator character between SUID parts. Be careful to not use a char that may be used in the encoding. |

### Requirements

This library requires the [new `Uint8Array` methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64)
for converting to/from base64 & hexadecimal. For the time being, you will probably want a polyfill such as found in [core-js](https://github.com/zloirock/core-js#uint8array-to--from-base64-and-hex).
