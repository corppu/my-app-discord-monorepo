FROM node:25.8.2-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/my-app-common/package.json ./packages/my-app-common/
COPY packages/my-app-react/package.json ./packages/my-app-react/
COPY packages/my-app-react-web/package.json ./packages/my-app-react-web/
RUN npm install
COPY packages/my-app-common ./packages/my-app-common
COPY packages/my-app-react ./packages/my-app-react
COPY packages/my-app-react-web ./packages/my-app-react-web
RUN npm run build --workspace=@my-app/common
RUN npm run build --workspace=@my-app/react
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build --workspace=@my-app/react-web

FROM nginx:alpine
COPY --from=builder /app/packages/my-app-react-web/dist /usr/share/nginx/html
COPY packages/my-app-react-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
