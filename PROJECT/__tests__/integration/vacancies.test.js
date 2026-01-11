const request = require('supertest');
const { app } = require('../../src/index');
const vacancyService = require('../../src/services/vacancyService');

describe('Job Vacancies API Integration Tests', () => {
  beforeEach(() => {
    vacancyService.resetVacancies();
  });

  describe('GET /api/vacancies', () => {
    test('should return all vacancies with status 200', async () => {
      const response = await request(app)
        .get('/api/vacancies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return vacancies with all required fields', async () => {
      const response = await request(app)
        .get('/api/vacancies')
        .expect(200);

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('company');
      expect(response.body[0]).toHaveProperty('salary');
      expect(response.body[0]).toHaveProperty('location');
      expect(response.body[0]).toHaveProperty('posted_date');
    });
  });

  describe('GET /api/vacancies/:id', () => {
    test('should return a specific vacancy by ID', async () => {
      const response = await request(app)
        .get('/api/vacancies/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Senior Developer');
      expect(response.body.company).toBe('Tech Corp');
    });

    test('should return 404 for non-existent vacancy', async () => {
      const response = await request(app)
        .get('/api/vacancies/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Vacancy not found');
    });

    test('should handle different vacancy IDs', async () => {
      const response1 = await request(app).get('/api/vacancies/1').expect(200);
      const response2 = await request(app).get('/api/vacancies/2').expect(200);

      expect(response1.body.id).not.toBe(response2.body.id);
    });
  });

  describe('POST /api/vacancies', () => {
    test('should create a new vacancy with status 201', async () => {
      const newVacancy = {
        title: 'Full Stack Developer',
        company: 'Web Agency',
        salary: 95000,
        location: 'Chicago'
      };

      const response = await request(app)
        .post('/api/vacancies')
        .send(newVacancy)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Full Stack Developer');
      expect(response.body.company).toBe('Web Agency');
      expect(response.body.salary).toBe(95000);
      expect(response.body.posted_date).toBeDefined();
    });

    test('should return 400 for missing required fields', async () => {
      const invalidVacancy = {
        title: 'Developer',
        company: 'Tech Corp'
        // Missing salary and location
      };

      const response = await request(app)
        .post('/api/vacancies')
        .send(invalidVacancy)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    test('should persist created vacancy to database', async () => {
      const newVacancy = {
        title: 'Backend Developer',
        company: 'API Builders',
        salary: 105000,
        location: 'Boston'
      };

      const createResponse = await request(app)
        .post('/api/vacancies')
        .send(newVacancy)
        .expect(201);

      const vacancyId = createResponse.body.id;

      const getResponse = await request(app)
        .get(`/api/vacancies/${vacancyId}`)
        .expect(200);

      expect(getResponse.body.title).toBe('Backend Developer');
    });

    test('should increment ID for each new vacancy', async () => {
      const vacancy1 = {
        title: 'Job1',
        company: 'Co1',
        salary: 50000,
        location: 'City1'
      };

      const vacancy2 = {
        title: 'Job2',
        company: 'Co2',
        salary: 60000,
        location: 'City2'
      };

      const response1 = await request(app)
        .post('/api/vacancies')
        .send(vacancy1)
        .expect(201);

      const response2 = await request(app)
        .post('/api/vacancies')
        .send(vacancy2)
        .expect(201);

      expect(response2.body.id).toBeGreaterThan(response1.body.id);
    });
  });

  describe('PUT /api/vacancies/:id', () => {
    test('should update an existing vacancy', async () => {
      const updates = {
        title: 'Senior Full Stack Developer',
        salary: 140000
      };

      const response = await request(app)
        .put('/api/vacancies/1')
        .send(updates)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Senior Full Stack Developer');
      expect(response.body.salary).toBe(140000);
      expect(response.body.company).toBe('Tech Corp'); // Unchanged
    });

    test('should return 404 when updating non-existent vacancy', async () => {
      const updates = { title: 'New Title' };

      const response = await request(app)
        .put('/api/vacancies/999')
        .send(updates)
        .expect(404);

      expect(response.body.error).toBe('Vacancy not found');
    });

    test('should persist updates to database', async () => {
      const updates = {
        title: 'Principal Engineer',
        location: 'Remote'
      };

      await request(app)
        .put('/api/vacancies/2')
        .send(updates)
        .expect(200);

      const getResponse = await request(app)
        .get('/api/vacancies/2')
        .expect(200);

      expect(getResponse.body.title).toBe('Principal Engineer');
      expect(getResponse.body.location).toBe('Remote');
    });

    test('should not allow changing vacancy ID', async () => {
      const updates = {
        title: 'New Title',
        id: 999
      };

      const response = await request(app)
        .put('/api/vacancies/1')
        .send(updates)
        .expect(200);

      expect(response.body.id).toBe(1);
    });
  });

  describe('DELETE /api/vacancies/:id', () => {
    test('should delete an existing vacancy with status 200', async () => {
      const response = await request(app)
        .delete('/api/vacancies/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted successfully');
      expect(response.body.vacancy.id).toBe(1);
    });

    test('should return 404 when deleting non-existent vacancy', async () => {
      const response = await request(app)
        .delete('/api/vacancies/999')
        .expect(404);

      expect(response.body.error).toBe('Vacancy not found');
    });

    test('should actually remove vacancy from database', async () => {
      await request(app).delete('/api/vacancies/1').expect(200);

      const getResponse = await request(app)
        .get('/api/vacancies/1')
        .expect(404);

      expect(getResponse.body.error).toBe('Vacancy not found');
    });

    test('should reduce vacancy count after deletion', async () => {
      const beforeResponse = await request(app)
        .get('/api/vacancies')
        .expect(200);

      const initialCount = beforeResponse.body.length;

      await request(app).delete('/api/vacancies/1').expect(200);

      const afterResponse = await request(app)
        .get('/api/vacancies')
        .expect(200);

      expect(afterResponse.body.length).toBe(initialCount - 1);
    });
  });

  describe('Other endpoints', () => {
    test('should return 200 for health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });

    test('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/undefined-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CRUD workflow', () => {
    test('should complete full CRUD workflow', async () => {
      // CREATE
      const newVacancy = {
        title: 'Test Developer',
        company: 'Test Company',
        salary: 85000,
        location: 'Test City'
      };

      const createResponse = await request(app)
        .post('/api/vacancies')
        .send(newVacancy)
        .expect(201);

      const vacancyId = createResponse.body.id;

      // READ
      const readResponse = await request(app)
        .get(`/api/vacancies/${vacancyId}`)
        .expect(200);

      expect(readResponse.body.title).toBe('Test Developer');

      // UPDATE
      const updateResponse = await request(app)
        .put(`/api/vacancies/${vacancyId}`)
        .send({ salary: 95000 })
        .expect(200);

      expect(updateResponse.body.salary).toBe(95000);

      // DELETE
      await request(app)
        .delete(`/api/vacancies/${vacancyId}`)
        .expect(200);

      // Verify deletion
      await request(app)
        .get(`/api/vacancies/${vacancyId}`)
        .expect(404);
    });
  });
});
