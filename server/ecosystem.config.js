module.exports = {
  apps: [
    {
      name: 'lexauthority',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
