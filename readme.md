# Attendance API Project

This project is a Node.js API for an attendance system, using MySQL, Redis, Elasticsearch, and Nodemailer (Mailtrap for development).

## Features

* User clock-in and clock-out.
* Attendance reports for all users.
* Attendance search by user ID and/or date range.
* Clock-in reminders via email.
* JWT authentication.
* Redis caching for performance.
* Attendance report search and filtering using Elasticsearch.
* Swagger UI documentation.

## Technologies Used

* Node.js
* Express.js
* MySQL
* Redis
* Elasticsearch
* Nodemailer (Mailtrap)
* JWT
* Swagger UI
* Docker
* Docker Compose

## Requirements

* Node.js (v22.13.1 or higher)
* NPM
* Docker and Docker Compose (if using Docker)

## Setup

### Without Docker

1.  **Clone the Project:**

    ```bash
    git clone https://github.com/masrudmubarok/attendance-api
    cd attendance-api
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    * Create a `.env` file in the project root.
    * Add the necessary environment variables (see `.env.local`).
    * Adjust the database, Redis, Elasticsearch, and Nodemailer (Mailtrap) configurations.

4.  **Run the Application:**

    ```bash
    npm start
    ```

### With Docker

1.  **Clone the Project:**

    ```bash
    git clone https://github.com/masrudmubarok/attendance-api
    cd attendance-api
    ```

2.  **Configure Environment Variables:**
    * Create a `.env` file in the project root.
    * Add the necessary environment variables (see `.env.local`).
    * Adjust the database, Redis, Elasticsearch, and Nodemailer (Mailtrap) configurations.

3.  **Build and Run Containers:**

    ```bash
    ./rebuild
    ```

## Usage

### API Documentation (Swagger UI)

* Open `http://localhost:3001/` in your browser.
* Swagger UI will display the API documentation and allow you to send API requests directly.

### Example Usage (cURL)

* **Clock-in:**

    ```bash
    curl -X POST http://localhost:3001/attend/clock-in -H "Authorization: Bearer <token>"
    ```

* **Clock-out:**

    ```bash
    curl -X POST http://localhost:3001/attend/clock-out -H "Authorization: Bearer <token>"
    ```

* **Get User Profile:**

    ```bash
    curl -X GET http://localhost:3001/users/profile -H "Authorization: Bearer <token>"
    ```

* **Search Attendance:**

    ```bash
    curl -X GET "http://localhost:3001/attend/search?user_id=123&startDate=2023-01-01&endDate=2023-01-31" -H "Authorization: Bearer <token>"
    ```

* Replace `<token>` with your JWT token.

### Email Testing (Mailtrap)

* When you schedule a clock-in reminder, an email will be sent to your Mailtrap inbox.
* Check your Mailtrap inbox to view the reminder email.

## Notes

* Ensure MySQL, Redis, and Elasticsearch are running before starting the application.
* Adjust the environment variable configurations according to your needs.
* Use Mailtrap for email testing in the development environment.
* For production, replace Mailtrap with a suitable email service.
* Ensure that docker container connections can connect with each other.
* Ensure that the used ports do not collide with other ports.

## Contribution

* Fork this repository.
* Create your feature branch.
* Make your changes.
* Submit a pull request.