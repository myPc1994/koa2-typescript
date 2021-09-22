# koa2+typeScript+mongose

## Build Setup

``` bash
# 安装依赖关系
    npm install

# 开发环境运行
    npm run dev

# 构建生产环境包
    npm run build

# 构建接口文档
    npm run apidoc
# 
    
```
## 生成环境部署
### windows系统部署
```
    1. npm run build 后生成dist文件夹
    2.拷贝dist文件夹所有内容到windows服务器上
    3.项目根目录下运行 npm install
    4.如果没有安装pm2,安装一下  npm install pm2 -g
    5.pm2方式启动，在根目录下运行 npm run start
```
### docker环境部署---docker-compose
```
    1.npm run build 后生成dist文件夹
    2.拷贝dist文件夹所有内容到linux服务器上
    3.已经配置了docker的服务编排工具，docker-compose
    4.根目录下运行 docker-compose up -d 即可
```
