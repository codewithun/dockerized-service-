# Dockerized Service Deployment

A simple Node.js service containerized with Docker and deployed to an AWS EC2 Ubuntu server. This project follows the [roadmap.sh Dockerized Service project](https://roadmap.sh/projects/dockerized-service-deployment).

## Project Overview

The goal of this project is to build a Node.js service, package it into a Docker image, deploy it to a remote Linux server, and explore automated deployment using GitHub Actions.

## Tech Stack

- Node.js
- Express.js
- Docker
- AWS EC2
- Ubuntu Linux
- GitHub Actions (planned for CI/CD automation)

## Features

- A public endpoint that returns `Hello, world!`
- A protected `/secret` endpoint using HTTP Basic Authentication
- Environment-based configuration using a `.env` file
- Docker image creation and container deployment
- Port mapping between the EC2 host and the container
- Automatic container restart using Docker's `unless-stopped` policy

## Application Endpoints

| Method | Endpoint  | Description                                                             |
| ------ | --------- | ----------------------------------------------------------------------- |
| GET    | `/`       | Returns `Hello, world!`                                                 |
| GET    | `/secret` | Returns a secret message when valid Basic Auth credentials are provided |

## Environment Variables

Create a `.env` file in the project root:

```env
SECRET_MESSAGE="Your secret message"
USERNAME=admin
PASSWORD=your-strong-password
```

These variables configure the secret response and Basic Authentication credentials.

Do not commit `.env` to version control or include it in the Docker image. Add `.env` to `.gitignore` and `.dockerignore`.

## Run Locally

### 1. Build the Docker Image

```bash
docker build -t dockerized-service:1.0 .
```

### 2. Start the Container

```bash
docker run -d \
  --name dockerized-service \
  --restart unless-stopped \
  -p 3001:3000 \
  --env-file .env \
  dockerized-service:1.0
```

### 3. Test the Application

Test the public endpoint:

```bash
curl -i http://localhost:3001/
```

Test the protected endpoint:

```bash
curl -i -u admin http://localhost:3001/secret
```

Curl prompts for the password when it is omitted from the command.

Test authentication without credentials:

```bash
curl -i http://localhost:3001/secret
```

The expected responses are `200 OK` for valid credentials and `401 Unauthorized` for missing or invalid credentials.

## AWS EC2 Deployment

The Dockerized service was deployed to an Ubuntu server on AWS EC2.

### Deployment Configuration

| Setting          | Value                    |
| ---------------- | ------------------------ |
| Cloud Provider   | AWS                      |
| Compute Service  | Amazon EC2               |
| Operating System | Ubuntu Linux             |
| Docker Image     | `dockerized-service:1.0` |
| Container Port   | `3000`                   |
| Host Port        | `3001`                   |
| Restart Policy   | `unless-stopped`         |

### Security Group Configuration

Configure an inbound rule in the EC2 security group:

- **Type:** Custom TCP
- **Port:** `3001`
- **Source:** My IP

Use the instance's public IPv4 address to access the service:

```text
http://<EC2_PUBLIC_IP>:3001/
```

The root endpoint should return:

```text
Hello, world!
```

To test the protected endpoint remotely:

```bash
curl -i -u admin http://<EC2_PUBLIC_IP>:3001/secret
```

Use HTTPS before sending authentication credentials over an untrusted network. Basic Authentication over plain HTTP does not encrypt credentials.

## Deployment Workflow

The application has been built into a Docker image and deployed to AWS EC2 using Docker commands.

The next stage is to automate the deployment process with GitHub Actions:

1. Trigger a workflow when changes are pushed to the repository.
2. Build the Docker image.
3. Push the image to a container registry.
4. Connect to the EC2 server securely.
5. Pull the updated image and restart the container.
6. Store deployment credentials in GitHub Actions Secrets.

This CI/CD workflow is not considered complete until it has been implemented and tested successfully.

## Security Considerations

- Keep `.env` and other secrets out of Git.
- Use strong, unique authentication credentials.
- Restrict inbound traffic through the EC2 security group.
- Use GitHub Actions Secrets for CI/CD credentials.
- Avoid exposing authenticated endpoints over plain HTTP on untrusted networks.

## References

- [roadmap.sh — Dockerized Service Deployment](https://roadmap.sh/projects/dockerized-service-deployment)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/)

---

**Project:** Dockerized Service Deployment  
**Status:** Docker deployment completed; CI/CD automation pending.
