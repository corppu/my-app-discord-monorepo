FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/my-app-common/package.json ./packages/my-app-common/
COPY packages/my-app-backend/package.json ./packages/my-app-backend/
COPY packages/my-app-tasks/package.json ./packages/my-app-tasks/
RUN npm install
COPY packages/my-app-common ./packages/my-app-common
COPY packages/my-app-backend ./packages/my-app-backend
COPY packages/my-app-tasks ./packages/my-app-tasks
RUN npm run build --workspace=@my-app/common
RUN npm run build --workspace=@my-app/backend
RUN npm run build --workspace=@my-app/tasks

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/packages/my-app-common/dist ./packages/my-app-common/dist
COPY --from=builder /app/packages/my-app-common/package.json ./packages/my-app-common/
COPY --from=builder /app/packages/my-app-backend/dist ./packages/my-app-backend/dist
COPY --from=builder /app/packages/my-app-backend/package.json ./packages/my-app-backend/
COPY --from=builder /app/packages/my-app-tasks/dist ./packages/my-app-tasks/dist
COPY --from=builder /app/packages/my-app-tasks/package.json ./packages/my-app-tasks/
COPY --from=builder /app/package.json ./
RUN npm install --omit=dev
CMD ["node", "packages/my-app-tasks/dist/index.js"]
