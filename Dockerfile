FROM ubuntu:18.04

#change timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# Install basic tools, Sqlite and Nginx
RUN apt-get update && apt-get install -y software-properties-common
RUN apt-get install -y tar curl net-tools build-essential vim inetutils-ping wget
RUN apt-get install -y supervisor

RUN wget https://npm.taobao.org/mirrors/node/latest-v12.x/node-v12.18.0-linux-x64.tar.gz
RUN tar -xzvf node-v12.18.0-linux-x64.tar.gz
RUN mv node-v12.18.0-linux-x64 /opt/
RUN rm -rf node-v12.18.0-linux-x64.tar.gz
RUN ln -s /opt/node-v12.18.0-linux-x64/bin/node /usr/local/bin/node 
RUN ln -s /opt/node-v12.18.0-linux-x64/bin/npm /usr/local/bin/npm


WORKDIR /usr/src/frontend/wechat
ADD . /usr/src/frontend/wechat

RUN ln -s /usr/src/frontend/wechat/supervisor_frontend.conf /etc/supervisor/conf.d/

# Expose ports
EXPOSE 3000

# Set the default directory
WORKDIR /usr/src/frontend/wechat

# Entry point
CMD ["/usr/bin/supervisord","-n"]