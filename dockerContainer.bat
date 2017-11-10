# Build the docker container based on the Dockerfile
docker build -t chat-app .

# Run the app in the docker container on port 80
docker run -d -p 80:3001 chat-app
