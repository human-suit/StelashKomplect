/** PM2: pm2 start deploy/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "stellazh-site",
      cwd: "/var/www/stellazh-komplekt",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "512M",
      error_file: "/var/log/pm2/stellazh-site-error.log",
      out_file: "/var/log/pm2/stellazh-site-out.log",
    },
  ],
};
