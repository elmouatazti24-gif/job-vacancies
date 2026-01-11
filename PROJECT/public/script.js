// ===== State =====
let allVacancies = [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadVacancies();
    setupFormHandlers();
});

// ===== Form Handlers =====
function setupFormHandlers() {
    const vacancyForm = document.getElementById('vacancyForm');
    const editForm = document.getElementById('editForm');

    vacancyForm.addEventListener('submit', handleCreateVacancy);
    editForm.addEventListener('submit', handleUpdateVacancy);
}

async function handleCreateVacancy(e) {
    e.preventDefault();

    const vacancy = {
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value,
        salary: parseInt(document.getElementById('salary').value)
    };

    try {
        const response = await fetch('/api/vacancies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vacancy)
        });

        if (!response.ok) throw new Error('Failed to create vacancy');

        showAlert('✅ Vacancy posted successfully!', 'success');
        document.getElementById('vacancyForm').reset();
        await loadVacancies();
    } catch (error) {
        showAlert('❌ Error posting vacancy: ' + error.message, 'error');
    }
}

async function handleUpdateVacancy(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const vacancy = {
        title: document.getElementById('editTitle').value,
        company: document.getElementById('editCompany').value,
        location: document.getElementById('editLocation').value,
        salary: parseInt(document.getElementById('editSalary').value)
    };

    try {
        const response = await fetch(`/api/vacancies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vacancy)
        });

        if (!response.ok) throw new Error('Failed to update vacancy');

        showAlert('✅ Vacancy updated successfully!', 'success');
        closeEditModal();
        await loadVacancies();
    } catch (error) {
        showAlert('❌ Error updating vacancy: ' + error.message, 'error');
    }
}

// ===== Load Vacancies =====
async function loadVacancies() {
    const searchQuery = document.getElementById('searchInput')?.value?.toLowerCase() || '';

    try {
        const response = await fetch('/api/vacancies');
        if (!response.ok) throw new Error('Failed to load vacancies');

        allVacancies = await response.json();

        // Filter based on search
        let filtered = allVacancies;
        if (searchQuery) {
            filtered = allVacancies.filter(v =>
                v.title.toLowerCase().includes(searchQuery) ||
                v.company.toLowerCase().includes(searchQuery) ||
                v.location.toLowerCase().includes(searchQuery)
            );
        }

        displayVacancies(filtered);
        updateStats(allVacancies);
    } catch (error) {
        showAlert('❌ Error loading vacancies: ' + error.message, 'error');
    }
}

// ===== Display Vacancies =====
function displayVacancies(vacancies) {
    const list = document.getElementById('vacanciesList');

    if (vacancies.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>No vacancies found</h3>
                <p>Post a new vacancy or adjust your search criteria</p>
            </div>
        `;
        return;
    }

    list.innerHTML = vacancies.map(vacancy => `
        <div class="vacancy-card">
            <div class="vacancy-header">
                <div class="vacancy-title">${escapeHtml(vacancy.title)}</div>
                <div class="vacancy-company">🏢 ${escapeHtml(vacancy.company)}</div>
            </div>

            <div class="vacancy-meta">
                <div class="vacancy-meta-item">
                    📍 ${escapeHtml(vacancy.location)}
                </div>
            </div>

            <div class="vacancy-salary">
                💰 $${vacancy.salary.toLocaleString()}/year
            </div>

            <div class="vacancy-date">
                📅 Posted: ${formatDate(vacancy.posted_date)}
            </div>

            <div class="vacancy-actions">
                <button class="btn btn-success" onclick="openEditModal(${vacancy.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteVacancy(${vacancy.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Update Stats =====
function updateStats(vacancies) {
    const totalCount = vacancies.length;
    const avgSalary = vacancies.length > 0
        ? Math.round(vacancies.reduce((sum, v) => sum + v.salary, 0) / vacancies.length)
        : 0;

    document.getElementById('totalVacancies').textContent = totalCount;
    document.getElementById('avgSalary').textContent = `$${avgSalary.toLocaleString()}`;
}

// ===== Modal Functions =====
async function openEditModal(id) {
    const vacancy = allVacancies.find(v => v.id === id);
    if (!vacancy) return;

    document.getElementById('editId').value = vacancy.id;
    document.getElementById('editTitle').value = vacancy.title;
    document.getElementById('editCompany').value = vacancy.company;
    document.getElementById('editLocation').value = vacancy.location;
    document.getElementById('editSalary').value = vacancy.salary;

    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

window.onclick = (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
};

// ===== Delete Vacancy =====
async function deleteVacancy(id) {
    if (!confirm('Are you sure you want to delete this vacancy?')) return;

    try {
        const response = await fetch(`/api/vacancies/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete vacancy');

        showAlert('✅ Vacancy deleted successfully!', 'success');
        await loadVacancies();
    } catch (error) {
        showAlert('❌ Error deleting vacancy: ' + error.message, 'error');
    }
}

// ===== Utility Functions =====
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Add to beginning of main-content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Remove after 5 seconds
    setTimeout(() => alertDiv.remove(), 5000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
