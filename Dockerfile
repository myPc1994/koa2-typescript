#制定node镜像的版本 ，，node大小就有1G,建议换成alpine:latest
FROM node:12-alpine
#创建工程目录
RUN mkdir -p /usr/cpc/cpc_koa2
#设置当前路径，也就是下面所有命令的执行都是在这个路径
WORKDIR /usr/cpc/cpc_koa2
#安装淘宝镜像
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# 在前面先拷贝，镜像打包有缓存的，只要不变动，就可以跳过该步骤，这样可以加快打包速度
#全局安装pm2
RUN cnpm install pm2 -g
# 安装pm2日志分割
RUN pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size "100M" && pm2 set pm2-logrotate:retain 7 && pm2 set pm2-logrotate:compress true && pm2 set pm2-logrotate:dateFormat "YYYY-MM-DD" && pm2 set pm2-logrotate:workerInterval 3600 && pm2 set pm2-logrotate:rotateInterval "0 0 * * *" && pm2 set pm2-logrotate:rotateModule true && pm2 set pm2-logrotate:rotateModuleKeep 10
# 拷贝配置包
COPY package*.json ./
#安装依赖
RUN cnpm install
#拷贝当前目录下面的指定文件到目录下
COPY . /usr/cpc/cpc_koa2
#对外暴露的端口
EXPOSE 9999
#程序启动脚本
CMD ["pm2-runtime", "start", "pm2.config.js"]
