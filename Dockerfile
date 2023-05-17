FROM node:18.16.0-alpine
WORKDIR /app
ENV PORT 5000
COPY . ./
COPY package*.json ./
RUN npm install
EXPOSE 5000
CMD [ "npm", "run", "start"]