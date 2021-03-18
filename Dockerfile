FROM nginx:1.19.6

# Install basic tools, Sqlite and Nginx
#RUN sed -i 's/http:\/\/archive\.ubuntu\.com\/ubuntu\//http:\/\/mirrors\.163\.com\/ubuntu\//g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y tar curl net-tools build-essential vim inetutils-ping wget procps psmisc 
#RUN apt-get install -y supervisor


WORKDIR /usr/src/wechat/dist/
COPY ./dist/ /usr/src/wechat/dist/

#RUN ln -s /usr/src/frontend/RetinaWeb/supervisor_frontend.conf /etc/supervisor/conf.d/

RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/
RUN rm -f /var/log/nginx/*
COPY ./nginx_web.conf.template /etc/nginx/templates/

# Expose ports
EXPOSE 3000