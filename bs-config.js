module.exports = {
  port: 2222, //process.env.PORT,
  files: ['.src/**/*.{html,htm,css,js}'],
  server: {
    baseDir: ['./src', './dist'],
  },
  ghostMode: false,
};
