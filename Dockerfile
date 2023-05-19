FROM node:18.16.0-alpine
WORKDIR /app
ENV PORT 8080
COPY . ./
COPY package*.json ./
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]