const source_profile = 'source $HOME/.profile && '

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'pinyin-messenger',
      script    : 'index.js',
      env: {
        PORT: 3000
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : 'celsian.pepebecker.com',
      ref  : 'origin/master',
      repo : 'https://github.com/pepebecker/pinyin-messenger.git',
      path : '/root/apps/production/pinyin-messenger',
      'post-deploy' : source_profile + 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'root',
      host : 'celsian.pepebecker.com',
      ref  : 'origin/master',
      repo : 'https://github.com/pepebecker/pinyin-messenger.git',
      path : '/root/apps/development/pinyin-messenger',
      'post-deploy': source_profile + 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
