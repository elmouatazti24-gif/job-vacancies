# Job Vacancies API

A simple Express.js API for managing job vacancies with comprehensive unit and integration tests.

## Features

- RESTful API for job vacancies management
- CRUD operations (Create, Read, Update, Delete)
- Unit tests for service layer
- Integration tests for API endpoints
- In-memory database

## Project Structure

```
.
├── src/
│   ├── index.js                 # Main application entry
│   ├── routes/
│   │   └── vacancies.js         # API routes
│   └── services/
│       └── vacancyService.js    # Business logic
├── __tests__/
│   ├── unit/
│   │   └── vacancyService.test.js
│   └── integration/
│       └── vacancies.test.js
├── package.json
└── jest.config.js
```

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## API Endpoints

### Get all vacancies
```
GET /api/vacancies
```

### Get vacancy by ID
```
GET /api/vacancies/:id
```

### Create new vacancy
```
POST /api/vacancies
Content-Type: application/json

{
  "title": "Developer",
  "company": "Tech Corp",
  "salary": 100000,
  "location": "New York"
}
```

### Update vacancy
```
PUT /api/vacancies/:id
Content-Type: application/json

{
  "title": "Senior Developer",
  "salary": 120000
}
```

### Delete vacancy
```
DELETE /api/vacancies/:id
```

### Health check
```
GET /health
```

## Example Response

```json
{
  "id": 1,
  "title": "Senior Developer",
  "company": "Tech Corp",
  "salary": 120000,
  "location": "New York",
  "posted_date": "2025-01-01"
}
```

## Testing

### Unit Tests
Tests for the vacancy service layer covering:
- Getting all vacancies
- Getting vacancy by ID
- Creating vacancies with validation
- Updating vacancies
- Deleting vacancies
- ID incrementing logic

### Integration Tests
Tests for the complete API covering:
- All CRUD endpoints
- HTTP status codes
- Response validation
- Error handling
- Database persistence
- Full workflow testing

## Error Handling

- **400 Bad Request**: Missing or invalid required fields
- **404 Not Found**: Vacancy not found
- **500 Internal Server Error**: Server errors

## Technologies

- **Express.js**: Web framework
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library
- **Nodemon**: Development auto-reload

## License

ISC
