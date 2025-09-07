
# Expense Tracker Application

A full-stack expense tracking application built with Java Spring Boot backend, React.js frontend, and MySQL database.

## Features

- Track and manage personal expenses
- Categorize expenses
- Filter expenses by category and date range
- Visualize expense data with charts
- Responsive design for desktop and mobile devices

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- RESTful API

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Bootstrap for UI components
- Chart.js for data visualization
- Formik & Yup for form handling and validation

## Project Structure

```
ExpenseTracker/
├── src/                           # Backend source code
│   ├── main/
│   │   ├── java/com/example/expensetracker/
│   │   │   ├── controller/        # REST API controllers
│   │   │   ├── model/             # Entity classes
│   │   │   ├── repository/        # Data repositories
│   │   │   ├── service/           # Business logic
│   │   │   ├── exception/         # Exception handling
│   │   │   └── ExpenseTrackerApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                      # Backend tests
├── frontend/                      # React frontend
│   ├── public/
│   └── src/
│       ├── components/            # React components
│       ├── services/              # API services
│       ├── App.js
│       └── index.js
└── pom.xml                        # Maven configuration
```

## Setup and Installation

### Prerequisites
- Java 17 or higher
- Node.js and npm
- MySQL Server

### Backend Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ExpenseTracker.git
   cd ExpenseTracker
   ```

2. Configure MySQL database
   - Create a MySQL database named `expense_tracker`
   - Update `src/main/resources/application.properties` with your MySQL username and password

3. Build and run the Spring Boot application
   ```
   ./mvnw spring-boot:run
   ```
   The backend server will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the React development server
   ```
   npm start
   ```
   The frontend application will start on http://localhost:3000

## API Endpoints

| Method | URL                                      | Description                                |
|--------|------------------------------------------|--------------------------------------------|  
| GET    | /api/expenses                            | Get all expenses                           |
| GET    | /api/expenses/{id}                       | Get expense by ID                          |
| POST   | /api/expenses                            | Create a new expense                       |
| PUT    | /api/expenses/{id}                       | Update an expense                          |
| DELETE | /api/expenses/{id}                       | Delete an expense                          |
| GET    | /api/expenses/category/{category}        | Get expenses by category                   |
| GET    | /api/expenses/date-range                 | Get expenses by date range                 |
| GET    | /api/expenses/category/{category}/date-range | Get expenses by category and date range |

## Future Enhancements

- User authentication and authorization
- Multiple user support
- Budget planning and tracking
- Expense reports and export functionality
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.#