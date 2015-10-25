/* Development environment application configuration files */
module.exports = {
  server: {
    path: {
      routes: "app/routes",
      public: false,
      views: false
    },
    request: {
      limit: 50000,
      cors: ['OPTIONS', 'POST', 'GET', 'DELETE'],
      restful: true,
      cookies: false
    },
    views: false
  },
  // MONGO settings
  mongo: {
    debug: false,
    schemas: "app/schemas",
    database: "p2p"
  },
  build: {
    autoWatch: true
  },
  services: {
    myService: {
      location: 'http://testLocation/'
    }
  }
};