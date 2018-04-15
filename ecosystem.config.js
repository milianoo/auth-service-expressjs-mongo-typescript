module.exports = {
  apps : [
    {
      name      : 'VSMA-API',
      script    : 'NODE_ENV=production node ./dist/bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
