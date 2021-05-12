export default {
  outputPath: './test_dist',
  define: {
    'process.env.domain': 'http://sg_swim.test/',
    'process.env.apiUrl': 'http://sg_swim.test/api/v1',
  },
  proxy: {
    '/api': {
      target: 'https://sgswim.o1001.com',
      changeOrigin: true,
    },
  },
};
