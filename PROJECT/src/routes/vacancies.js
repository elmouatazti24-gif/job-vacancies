const express = require('express');
const vacancyService = require('../services/vacancyService');

const router = express.Router();

// GET all vacancies
router.get('/', (req, res) => {
  try {
    const vacancies = vacancyService.getAllVacancies();
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET vacancy by ID
router.get('/:id', (req, res) => {
  try {
    const vacancy = vacancyService.getVacancyById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }
    res.status(200).json(vacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new vacancy
router.post('/', (req, res) => {
  try {
    const vacancy = vacancyService.createVacancy(req.body);
    res.status(201).json(vacancy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update vacancy
router.put('/:id', (req, res) => {
  try {
    const vacancy = vacancyService.updateVacancy(req.params.id, req.body);
    if (!vacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }
    res.status(200).json(vacancy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE vacancy
router.delete('/:id', (req, res) => {
  try {
    const vacancy = vacancyService.deleteVacancy(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }
    res.status(200).json({ message: 'Vacancy deleted successfully', vacancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
