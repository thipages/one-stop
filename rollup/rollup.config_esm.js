import resolve from '@rollup/plugin-node-resolve';
export default {
    input: './src/index.js',
    output: {
        file: './es.js',
        format: 'esm',
    },
    plugins: [
        resolve()
    ]
};