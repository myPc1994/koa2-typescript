#!/bin/bash

# 构建Docker镜像
docker build -t cpc_koa2 .

# 创建存储数据的文件夹（如果不存在）
mkdir -p /data/cpc/cpc_koa2/public
mkdir -p /data/cpc/cpc_koa2/static
mkdir -p /data/cpc/cpc_koa2/logs

# 运行Docker容器并挂载文件夹
docker run -p 9999:9999 \
 -v /data/cpc/cpc_koa2/public:/usr/cpc/cpc_koa2/public \
 -v /data/cpc/cpc_koa2/static:/usr/cpc/cpc_koa2/static \
 -v /data/cpc/cpc_koa2/logs:/usr/cpc/cpc_koa2/logs  \
 -d cpc_koa2