// In-memory database for job vacancies
let vacancies = [
  {
    id: 1,
    title: 'Senior Developer',
    company: 'Tech Corp',
    salary: 120000,
    location: 'New York',
    posted_date: '2025-01-01'
  },
  {
    id: 2,
    title: 'Junior Developer',
    company: 'StartUp Inc',
    salary: 60000,
    location: 'San Francisco',
    posted_date: '2025-01-05'
  }
];

let nextId = 3;

const getAllVacancies = () => {
  return vacancies;
};

const getVacancyById = (id) => {
  return vacancies.find(v => v.id === parseInt(id));
};

const createVacancy = (data) => {
  if (!data.title || !data.company || !data.salary || !data.location) {
    throw new Error('Missing required fields: title, company, salary, location');
  }

  const newVacancy = {
    id: nextId++,
    ...data,
    posted_date: new Date().toISOString().split('T')[0]
  };

  vacancies.push(newVacancy);
  return newVacancy;
};

const updateVacancy = (id, data) => {
  const index = vacancies.findIndex(v => v.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  vacancies[index] = {
    ...vacancies[index],
    ...data,
    id: vacancies[index].id // Ensure ID doesn't change
  };

  return vacancies[index];
};

const deleteVacancy = (id) => {
  const index = vacancies.findIndex(v => v.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  const deleted = vacancies[index];
  vacancies.splice(index, 1);
  return deleted;
};

const resetVacancies = () => {
  vacancies = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Corp',
      salary: 120000,
      location: 'New York',
      posted_date: '2025-01-01'
    },
    {
      id: 2,
      title: 'Junior Developer',
      company: 'StartUp Inc',
      salary: 60000,
      location: 'San Francisco',
      posted_date: '2025-01-05'
    }
  ];
  nextId = 3;
};

module.exports = {
  getAllVacancies,
  getVacancyById,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  resetVacancies
};
