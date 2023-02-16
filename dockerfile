FROM node:19


ADD . /app

WORKDIR /app

RUN npm install --registry=https://registry.npmmirror.com/
RUN npm run build

CMD ["node", "./dist/wx.js"]