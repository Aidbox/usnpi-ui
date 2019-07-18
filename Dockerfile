FROM nginx
EXPOSE 80

COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /app

COPY index.js /app
COPY package.json /app
COPY package-lock.json /app
COPY start.sh /

RUN apt-get update && apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs && cd /app && npm install --production

CMD ["/start.sh"]
