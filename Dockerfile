### STAGE 1: Build ###
FROM node:22.11.0-alpine AS build

WORKDIR /insightdb-web-v2

# Copy only package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the source files
COPY . .

# Ensure TypeScript is installed globally (if not already in package.json)
RUN yarn global add typescript

# Verify Node and Yarn versions
RUN node -v && yarn -v

# Build the project
RUN yarn build

### STAGE 2: Run ###
FROM nginx:1.23.3

# Copy the Nginx config file
COPY ./deploy/insightdb-web-v2.conf /etc/nginx/nginx.conf

# Copy built assets from the build stage
COPY --from=build /insightdb-web-v2/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 3031

# Start the application
CMD ["nginx", "-g", "daemon off;"]
