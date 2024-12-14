import terser from '@rollup/plugin-terser';

export default [{
	input: 'suid.js',
	output: [{
		file: 'suid.cjs',
		format: 'cjs',
	}, {
		file: 'suid.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}];
