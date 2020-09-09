module.exports = {
  apps : [{
    name: "salmon",
    script: 'app.js',
    watch: [
      'routes',
      'services',
      'views',
      'app.js',
    ],
    watch_delay: 1000,
    ignore_watch: [
      "node_modules",
      "sqlite.db",
      "sqlite.db-journal",
      "package-lock.json"
    ],
    env_production: {
      NODE_ENV: "production"
    }
  }],
};
