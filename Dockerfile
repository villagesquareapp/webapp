# Use Node.js 20 Alpine as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on the lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code and build it
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV GOOGLE_CLIENT_ID=1076309733425-m53n4od06ojgmfsucj4j8ft6llaskteq.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]