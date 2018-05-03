module.exports = {
  "root": true,
  "extends": "standard",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "mocha": true
  },
  "plugins": [
    "html"
  ],
  "globals": {
    "_": true,
    "User": true,    
    "sails": true,
    "VError": true,
    "UserService": true,
    "UtilService": true,
    "ERROR_PAYLOADS": true,    
    "SessionService": true,
    "ERROR_CODES": true,
    "Project": true,
    "ProjectService": true,
    "ApplicationService": true,
    "Application": true, 
    "Statistics": true,   
    "PatchService": true,
    "StatisticsService": true,
    "Patch": true,
    "QiniuService": true,
    "LogService": true
  },
  "rules": {
    "no-useless-return": "off"
  }
};