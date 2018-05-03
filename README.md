# assets-push

  Vuejs、React CodePush Services

## Function list

+ Log collection
+ Assets Management
+ Assets Diff
+ Front end manager GUI


## Quick Start

---

### 一、Setup

+ 1. CloudStorage Configure `config/app.js`:

```javascript
{
  downloadDir: path.resolve(__dirname, '../tmp'),
  scope: '',//Qiniu Scope
  publicHost: '', //CDN public HostName
  AccessKey: '',//Qiniu CloudStore AccessKey
  SecretKey: ''//Qiniu CloudStore SecretKey
}

```

+ 2. Sails Connections `config/connections.js`


+ 3. Redis Configure `config/session.js`

---

### 二、Startup

+ 1. start server

  >sails lift


+ 2. start frontend dev server

  >npm run dev

+ 3. open browser

  >open http://127.0.0.1:1338

---

## LICENSE

  [MIT](https://mit-license.org/)