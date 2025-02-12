# Use Node.js 18 as base image
FROM node:18-bullseye

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install TeX Live and required dependencies
RUN apt-get update && \
    apt-get install -y \
    texlive-full \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN useradd -m texuser && \
    mkdir -p /app && \
    chown -R texuser:texuser /app

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Switch to non-root user
USER texuser

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"] 