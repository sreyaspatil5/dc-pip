# Use an official Java runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file into the container and rename it as app.jar
COPY PipReviewSystem-0.0.1-SNAPSHOT.jar app.jar

# Make the port available to the outside world
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "app.jar"]

