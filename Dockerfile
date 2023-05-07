FROM node:18-alpine3.16

WORKDIR /app

COPY package.json package-lock.json ./ 

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install; \
    fi

COPY . ./

ENV PORT 3000 

EXPOSE $PORT
CMD ["npm", "run", "dev"]