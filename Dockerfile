FROM node:18.16.0-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache tzdata
RUN npm install
COPY . ./
ENV PORT 8080
ENV TZ=Asia/Jakarta
EXPOSE 8080
CMD [ "npm", "run", "start"]