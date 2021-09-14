#制定node镜像的版本
FROM node:12

#创建工程目录
RUN mkdir -p /home/mobileApp

#移动当前目录下面的文件到app目录下
COPY . /home/mobileApp

#进入到app目录下面，类似cd，设置当前路径，也就是下面所有命令的执行都是在这个路径
WORKDIR /home/mobileApp

#安装依赖
RUN npm install

#对外暴露的端口
EXPOSE 9999

#程序启动脚本
CMD ["npm", "dev"]
