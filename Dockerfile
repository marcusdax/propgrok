# PropertyInsight - Production Docker build
FROM node:22-alpine

WORKDIR /app

# Install all dependencies (needed for dev server)
COPY package.json package-lock.json ./
ENV GROK_ALLOW_INSTALL_SCRIPTS=1
RUN npm ci --no-audit --no-fund

# Copy source and config
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:8080/', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start dev server
CMD ["npm", "run", "dev"]