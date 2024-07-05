# Use a base image with Java already installed
FROM openjdk:17-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/SpringBootEmp-0.0.1-SNAPSHOT.jar /app/app.jar

# Create a startup script
COPY start.sh /app/start.sh

# Make the script executable
RUN chmod +x /app/start.sh

# Expose the port your Spring Boot application is running on
EXPOSE 80

# Define the command to run when the container starts
CMD ["/app/start.sh"]
