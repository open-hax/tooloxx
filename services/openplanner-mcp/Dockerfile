FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy workspace root manifests first for install caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/mcp-foundation/package.json ./packages/mcp-foundation/package.json
COPY services/openplanner-mcp/package.json ./services/openplanner-mcp/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @workspace/openplanner-mcp...

# Copy source
COPY packages/mcp-foundation/ ./packages/mcp-foundation/
COPY services/openplanner-mcp/ ./services/openplanner-mcp/

# Build
RUN pnpm run --filter @workspace/mcp-foundation build && \
    pnpm run --filter @workspace/openplanner-mcp build

# Run as non-root
USER node

EXPOSE 8010

CMD ["node", "services/openplanner-mcp/dist/main.js"]
