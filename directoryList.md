|-- node
    |-- .dockerignore
    |-- .gitignore
    |-- apidoc.js
    |-- directoryList.md
    |-- docker-compose.yml
    |-- Dockerfile
    |-- nodemon.json
    |-- package.json
    |-- pm2.config.js
    |-- printDir.js
    |-- README.md
    |-- tsconfig.json
    |-- tslint.json
    |-- bin
    |   |-- www
    |-- build
    |   |-- end.js
    |   |-- start.js
    |   |-- util
    |       |-- fileUtil.js
    |-- dist
    |-- env
    |   |-- development.js
    |   |-- index.js
    |   |-- production.js
    |-- src
    |   |-- app.ts
    |   |-- GlobalVariable.ts
    |   |-- core
    |   |   |-- CpcInterface.ts
    |   |-- db
    |   |   |-- BaseDb.ts
    |   |   |-- index.ts
    |   |   |-- mongoseTest.md
    |   |   |-- controller
    |   |       |-- rbac
    |   |           |-- AuthCtrl.ts
    |   |           |-- RoleAuthCtrl.ts
    |   |           |-- RoleCtrl.ts
    |   |           |-- UserCtrl.ts
    |   |           |-- UserRoleCtrl.ts
    |   |-- log
    |   |   |-- ILogUtil.ts
    |   |   |-- LogUtil.ts
    |   |   |-- console
    |   |   |   |-- LogConsole.ts
    |   |   |-- log4js
    |   |   |   |-- log4js.ts
    |   |   |   |-- Log4jsUtil.ts
    |   |   |-- logDB
    |   |       |-- LogDB.ts
    |   |-- routes
    |   |   |-- controller
    |   |   |   |-- IndexCtrl.ts
    |   |   |   |-- RbacCtrl.ts
    |   |   |   |-- UsersCtrl.ts
    |   |   |-- routers
    |   |       |-- index.ts
    |   |       |-- rbac.ts
    |   |       |-- users.ts
    |   |-- utils
    |       |-- CaptchaUtil.ts
    |       |-- CryptoUtil.ts
    |       |-- Excel2dbFormatUtil.ts
    |       |-- FileUtil.ts
    |       |-- JoiUtil.ts
    |       |-- JsUtil.ts
    |       |-- MulterUtil.ts
    |       |-- NetUtil.ts
    |       |-- Pm2FlushUtil.ts
    |       |-- ResponseBeautifier.ts
    |       |-- token
    |           |-- JwtUtil.ts
    |           |-- pem
    |               |-- private_key.pem
    |               |-- public_key.pem
    |-- static
        |-- county.json
        |-- mobileApp.pdman.json
