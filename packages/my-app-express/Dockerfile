FROM node:25.8.2-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/my-app-common/package.json ./packages/my-app-common/
COPY packages/my-app-backend/package.json ./packages/my-app-backend/
COPY packages/my-app-express/package.json ./packages/my-app-express/
RUN npm install
COPY packages/my-app-common ./packages/my-app-common
COPY packages/my-app-backend ./packages/my-app-backend
COPY packages/my-app-express ./packages/my-app-express
RUN npm run build --workspace=@my-app/common
RUN npm run build --workspace=@my-app/backend
RUN npm run build --workspace=@my-app/express

FROM node:25.8.2-alpine
WORKDIR /app
COPY --from=builder /app/packages/my-app-common/dist ./packages/my-app-common/dist
COPY --from=builder /app/packages/my-app-common/package.json ./packages/my-app-common/
COPY --from=builder /app/packages/my-app-backend/dist ./packages/my-app-backend/dist
COPY --from=builder /app/packages/my-app-backend/package.json ./packages/my-app-backend/
COPY --from=builder /app/packages/my-app-express/dist ./packages/my-app-express/dist
COPY --from=builder /app/packages/my-app-express/package.json ./packages/my-app-express/
COPY --from=builder /app/package.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "packages/my-app-express/dist/index.js"]
