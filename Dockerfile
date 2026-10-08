FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci && npx playwright install --with-deps chromium
COPY backend ./backend
COPY dist ./dist
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
