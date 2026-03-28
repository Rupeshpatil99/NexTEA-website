# Backend Documentation

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Rupeshpatil99/NexTEA-website.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd NexTEA-website/backend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend directory and set the required environment variables.

5. Start the backend server:
   ```bash
   npm start
   ```

## API Endpoints
- **GET /api/example**
  - Description: Retrieves example data.
  - Response: JSON object with data.

- **POST /api/example**
  - Description: Creates a new example.
  - Request Body: JSON object with data.
  - Response: JSON object with the created example.

## Database Schema
- **Users Table**
  - id: INT, Primary Key
  - username: VARCHAR(255), Unique
  - password: VARCHAR(255)

- **Products Table**
  - id: INT, Primary Key
  - name: VARCHAR(255)
  - price: DECIMAL
