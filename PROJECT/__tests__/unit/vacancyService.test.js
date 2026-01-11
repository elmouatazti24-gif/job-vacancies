const vacancyService = require('../../src/services/vacancyService');

describe('Vacancy Service Unit Tests', () => {
  beforeEach(() => {
    // Reset to initial state before each test
    vacancyService.resetVacancies();
  });

  describe('getAllVacancies', () => {
    test('should return all vacancies', () => {
      const vacancies = vacancyService.getAllVacancies();
      expect(vacancies).toHaveLength(2);
      expect(vacancies[0]).toHaveProperty('title');
      expect(vacancies[0]).toHaveProperty('company');
    });

    test('should return array of vacancies with correct structure', () => {
      const vacancies = vacancyService.getAllVacancies();
      vacancies.forEach(vacancy => {
        expect(vacancy).toHaveProperty('id');
        expect(vacancy).toHaveProperty('title');
        expect(vacancy).toHaveProperty('company');
        expect(vacancy).toHaveProperty('salary');
        expect(vacancy).toHaveProperty('location');
        expect(vacancy).toHaveProperty('posted_date');
      });
    });
  });

  describe('getVacancyById', () => {
    test('should return vacancy by ID', () => {
      const vacancy = vacancyService.getVacancyById(1);
      expect(vacancy).toBeDefined();
      expect(vacancy.id).toBe(1);
      expect(vacancy.title).toBe('Senior Developer');
    });

    test('should return undefined for non-existent ID', () => {
      const vacancy = vacancyService.getVacancyById(999);
      expect(vacancy).toBeUndefined();
    });

    test('should handle string ID and convert to number', () => {
      const vacancy = vacancyService.getVacancyById('1');
      expect(vacancy).toBeDefined();
      expect(vacancy.id).toBe(1);
    });
  });

  describe('createVacancy', () => {
    test('should create a new vacancy with valid data', () => {
      const newVacancy = {
        title: 'DevOps Engineer',
        company: 'Cloud Solutions',
        salary: 110000,
        location: 'Seattle'
      };

      const result = vacancyService.createVacancy(newVacancy);
      expect(result).toBeDefined();
      expect(result.id).toBe(3);
      expect(result.title).toBe('DevOps Engineer');
      expect(result.posted_date).toBeDefined();
    });

    test('should throw error when missing required fields', () => {
      const invalidVacancy = {
        title: 'Developer',
        company: 'Tech Corp'
        // Missing salary and location
      };

      expect(() => {
        vacancyService.createVacancy(invalidVacancy);
      }).toThrow('Missing required fields');
    });

    test('should add posted_date automatically', () => {
      const newVacancy = {
        title: 'QA Engineer',
        company: 'Test Co',
        salary: 80000,
        location: 'Austin'
      };

      const result = vacancyService.createVacancy(newVacancy);
      expect(result.posted_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should increment ID correctly', () => {
      const vacancy1 = vacancyService.createVacancy({
        title: 'Job1',
        company: 'Co1',
        salary: 50000,
        location: 'City1'
      });

      const vacancy2 = vacancyService.createVacancy({
        title: 'Job2',
        company: 'Co2',
        salary: 60000,
        location: 'City2'
      });

      expect(vacancy1.id).toBe(3);
      expect(vacancy2.id).toBe(4);
    });
  });

  describe('updateVacancy', () => {
    test('should update an existing vacancy', () => {
      const updated = vacancyService.updateVacancy(1, {
        title: 'Lead Developer',
        salary: 150000
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(1);
      expect(updated.title).toBe('Lead Developer');
      expect(updated.salary).toBe(150000);
      expect(updated.company).toBe('Tech Corp'); // Unchanged field
    });

    test('should return null for non-existent vacancy', () => {
      const result = vacancyService.updateVacancy(999, { title: 'New Title' });
      expect(result).toBeNull();
    });

    test('should not change ID during update', () => {
      const updated = vacancyService.updateVacancy(2, {
        title: 'New Title',
        id: 999
      });

      expect(updated.id).toBe(2);
    });

    test('should handle partial updates', () => {
      const updated = vacancyService.updateVacancy(1, { salary: 130000 });
      expect(updated.salary).toBe(130000);
      expect(updated.title).toBe('Senior Developer'); // Original value preserved
      expect(updated.location).toBe('New York');
    });
  });

  describe('deleteVacancy', () => {
    test('should delete an existing vacancy', () => {
      const result = vacancyService.deleteVacancy(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);

      const remaining = vacancyService.getAllVacancies();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(2);
    });

    test('should return null for non-existent vacancy', () => {
      const result = vacancyService.deleteVacancy(999);
      expect(result).toBeNull();
    });

    test('should remove vacancy from list', () => {
      vacancyService.deleteVacancy(1);
      const vacancy = vacancyService.getVacancyById(1);
      expect(vacancy).toBeUndefined();
    });
  });

  describe('resetVacancies', () => {
    test('should reset to initial state', () => {
      vacancyService.createVacancy({
        title: 'New Job',
        company: 'New Co',
        salary: 70000,
        location: 'Boston'
      });

      vacancyService.deleteVacancy(1);

      vacancyService.resetVacancies();

      const vacancies = vacancyService.getAllVacancies();
      expect(vacancies).toHaveLength(2);
      expect(vacancies.find(v => v.id === 1)).toBeDefined();
    });
  });
});
