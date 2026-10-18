# Dockerized Service on AWS EC2

A simple Node.js and Express web service containerized with Docker and deployed to an AWS EC2 Ubuntu instance. The application demonstrates Docker image creation, container deployment, port mapping, environment configuration, and HTTP Basic Authentication.

## Features

- **Node.js & Express** — lightweight web server.
- **Docker** — containerized application using `node:24-alpine`.
- **AWS EC2** — deployed on an Ubuntu cloud instance.
- **Port Mapping** — maps host port `3001` to container port `3000`.
- **Basic Authentication** — protects the `/secret` endpoint.
- **Environment Variables** — separates configuration from application code.
- **Automatic Restart** — uses Docker's `unless-stopped` restart policy.

## Tech Stack

- Node.js 24
- Express.js
- Docker
- AWS EC2
- Ubuntu Linux
- HTTP Basic Authentication

## Application Endpoints

| Endpoint      | Authentication | Expected Result                       |
| ------------- | -------------- | ------------------------------------- |
| `GET /`       | Not required   | `Hello, world!`                       |
| `GET /secret` | Required       | Returns the configured secret message |

### Authentication Behavior

The `/secret` endpoint uses HTTP Basic Authentication.

- Valid credentials: returns `200 OK`.
- Missing or invalid credentials: returns `401 Unauthorized`.

## Project Structure

```text
dockerized-service/
├── src/
│   └── server.js
├── Dockerfile
├── .dockerignore
├── .env
├── package.json
├── package-lock.json
└── README.md
```

**Note:** The `.env` file contains local configuration and must not be committed to GitHub. Use a sanitized `.env.example` file to document the required variables.

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd dockerized-service
```

Replace `<YOUR_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Configure Environment Variables

Create a `.env` file containing the variables expected by `src/server.js`.

Example:

```env
SECRET_MESSAGE="This is a secret message"
```

Configure the Basic Authentication username and password according to the variable names used by your application.

Use strong credentials and keep `.env` out of version control.

### 3. Build the Docker Image

```bash
docker build -t dockerized-service:1.0 .
```

### 4. Run the Container

```bash
docker run -d \
  --name dockerized-service \
  --restart unless-stopped \
  -p 3001:3000 \
  --env-file .env \
  dockerized-service:1.0
```

### 5. Verify the Container

```bash
docker ps
```

Check the application logs:

```bash
docker logs dockerized-service
```

## Deployment on AWS EC2

The application was deployed to an Ubuntu instance on AWS EC2.

### Deployment Configuration

| Configuration    | Value                    |
| ---------------- | ------------------------ |
| Cloud Provider   | AWS                      |
| Compute Service  | Amazon EC2               |
| Operating System | Ubuntu Linux             |
| Docker Image     | `dockerized-service:1.0` |
| Container Port   | `3000`                   |
| EC2 Host Port    | `3001`                   |
| Restart Policy   | `unless-stopped`         |

### Configure the Security Group

Add an inbound rule to the EC2 security group:

| Setting    | Value      |
| ---------- | ---------- |
| Type       | Custom TCP |
| Port Range | `3001`     |
| Source     | My IP      |

Restricting the source to your IP limits access to your current public IP address. Update the rule if your IP changes.

### Access the Application

Find the instance's **Public IPv4 address** in the AWS EC2 Console.

Open the root endpoint in your browser:

```text
http://<EC2_PUBLIC_IP>:3001/
```

Expected response:

```text
Hello, world!
```

## Testing

### Test the Root Endpoint

```bash
curl -i http://localhost:3001/
```

Expected status: `200 OK`.

For a remote test, replace `localhost` with the EC2 public IP address.

### Test the Protected Endpoint

With valid credentials:

```bash
curl -i -u "$BASIC_AUTH_USER" \
  http://localhost:3001/secret
```

Curl prompts for the password if it is not provided. Use the actual username configured by the application.

Without credentials:

```bash
curl -i http://localhost:3001/secret
```

Expected status: `401 Unauthorized`.

**Note:** If your application uses different environment variable names, adapt the test command accordingly.

## Verification Results

- [x] Docker image built successfully.
- [x] Container started successfully on AWS EC2.
- [x] Port mapping configured from `3001` to `3000`.
- [x] Root endpoint tested successfully.
- [x] Protected endpoint tested with valid credentials.
- [x] Unauthorized access tested.
- [x] Container configured to restart automatically unless manually stopped.

## Security Considerations

- Never commit `.env`, passwords, or other secrets to GitHub.
- Replace demonstration credentials with strong, unique credentials.
- Basic Authentication over plain HTTP does not encrypt credentials in transit. Use HTTPS before exposing authenticated endpoints beyond a controlled test environment.
- Restrict EC2 inbound rules to trusted IP addresses.
- Store production secrets using an appropriate secrets-management mechanism.
- Avoid running containers with unnecessary privileges.

## Future Improvements

- Configure Nginx as a reverse proxy.
- Enable HTTPS with TLS certificates.
- Automate deployment using GitHub Actions.
- Add health checks and structured logging.
- Implement container and dependency vulnerability scanning.

## Learning Outcomes

This project demonstrates practical experience with:

- Containerizing a Node.js application.
- Building and running Docker images.
- Deploying a web service on AWS EC2.
- Configuring network access and Docker port mapping.
- Testing authenticated and unauthenticated API endpoints.
- Applying basic deployment security practices.

---

**Status:** Completed

**Project Type:** Cloud Deployment / Docker / DevOps Fundamentals
