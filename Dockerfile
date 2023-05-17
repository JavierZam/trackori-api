FROM node:18.16.0-alpine
WORKDIR /app
ENV PORT 8000
COPY . ./
COPY package*.json ./
RUN npm install
EXPOSE 8000
CMD [ "npm", "run", "start"]