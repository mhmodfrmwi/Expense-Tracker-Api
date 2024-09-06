# Expense Management API

This is an Expense Management API built using **Node.js**, **Express**, and **MongoDB**. It provides functionalities for users to register, log in, and manage their expenses (CRUD operations), with role-based access control. The API also allows users to filter expenses by predefined time periods such as **Past Week**, **Past Month**, **Last 3 Months**, or by custom date ranges.

## Features

- **User Authentication & Authorization**:
  - Registration, Login using JWT.
  - Role-based access control (User, Admin, Super Admin).
- **Expense Management**:
  - Create, update, delete, and retrieve individual expenses.
  - Retrieve all expenses with time-based filtering (e.g., Past Week, Past Month, Last 3 Months, Custom Range).
- **Secure Endpoints**:
  - JWT-based token authentication.
  - Middleware checks for user permissions to perform actions.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mhmodfrmwi/Expense-Tracker-Api
   cd Expense-Tracker-Api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables. See the [Environment Variables](#environment-variables) section.

4. Start the server:

   ```bash
   npm start
   ```

   The server will start at `http://localhost:4000`.

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
MONGODB_URL=mongodb://localhost:27017/your-database
JWT_SECRET_KEY=your_secret_key
```

- `MONGODB_URL`: MongoDB connection URL.
- `JWT_SECRET_KEY`: Secret key used for JWT signing.

## API Endpoints

### Authentication

- **Register User**  
  `POST /users/register`

  - Request body:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "yourpassword",
      "role": "USER"
    }
    ```

- **Login User**  
  `POST /users/login`

  - Request body:
    ```json
    {
      "email": "john@example.com",
      "password": "yourpassword"
    }
    ```

- **Get All Users** (Admin & Super Admin only)  
  `GET /users/getAllUsers`

- **Get Single User** (Admin & Super Admin only)  
  `GET /users/getUser`

### Expense Management

- **Add Expense**  
  `POST /expenses`

  - Request body:
    ```json
    {
      "category": "Groceries",
      "amount": 150
    }
    ```

- **Update Expense**  
  `PUT /expenses/:expenseId`

  - Request body:
    ```json
    {
      "category": "Electronics",
      "amount": 200
    }
    ```

- **Delete Expense**  
  `DELETE /expenses/:expenseId`

- **Get Single Expense**  
  `GET /expenses/:expenseId`

- **Get All Expenses with Time Filtering**  
  `GET /expenses?timeFilter=pastWeek`  
  or  
  `GET /expenses?start=YYYY-MM-DD&end=YYYY-MM-DD`

## Usage

### Role-Based Access Control

- **User**: Can manage their own expenses.
- **Admin & Super Admin**: Can view/manage all users and expenses.

### Filtering Expenses

Users can filter their expenses by:

- **Past Week**: `GET /expenses?timeFilter=pastWeek`
- **Past Month**: `GET /expenses?timeFilter=pastMonth`
- **Last 3 Months**: `GET /expenses?timeFilter=last3Months`
- **Custom Range**: `GET /expenses?start=YYYY-MM-DD&end=YYYY-MM-DD`

## Project Source

`https://roadmap.sh/projects/expense-tracker-api`
