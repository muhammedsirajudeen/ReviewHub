FROM node:20.12.2

# Set the working directory
WORKDIR /usr/src/app

# Copy the entire application code
COPY . .

# Navigate to the Backend directory
# WORKDIR /usr/src/app/Backend

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Expose the port your app runs on
EXPOSE 3000
# CMD ["npm","run","dev"]


WORKDIR /usr/src/app/dist


# Set the command to run the application
CMD ["npx", "pm2", "start", "index.js", "--name", "my-app", "--no-daemon"]
