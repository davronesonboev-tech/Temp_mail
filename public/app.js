// API Configuration
const API_BASE = window.location.origin + '/api';

// State
let currentEmail = null;
let emailCheckInterval = null;
let currentEmailData = null;

// DOM Elements
const elements = {
    currentEmail: document.getElementById('currentEmail'),
    emailsList: document.getElementById('emailsList'),
    emailCount: document.getElementById('emailCount'),
    inboxCount: document.getElementById('inboxCount'),
    generateBtn: document.getElementById('generateBtn'),
    customBtn: document.getElementById('customBtn'),
    copyBtn: document.getElementById('copyBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    refreshEmailsBtn: document.getElementById('refreshEmailsBtn'),
    deleteAllBtn: document.getElementById('deleteAllBtn'),
    customForm: document.getElementById('customForm'),
    customUsername: document.getElementById('customUsername'),
    domainSelect: document.getElementById('domainSelect'),
    createCustomBtn: document.getElementById('createCustomBtn'),
    cancelCustomBtn: document.getElementById('cancelCustomBtn'),
    emailModal: document.getElementById('emailModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    deleteEmailBtn: document.getElementById('deleteEmailBtn'),
    modalSubject: document.getElementById('modalSubject'),
    modalFrom: document.getElementById('modalFrom'),
    modalTo: document.getElementById('modalTo'),
    modalDate: document.getElementById('modalDate'),
    htmlFrame: document.getElementById('htmlFrame'),
    textContent: document.getElementById('textContent'),
    toastContainer: document.getElementById('toastContainer')
};

// Initialize
async function init() {
    await loadDomains();
    setupEventListeners();
    
    // Загружаем email из localStorage если есть
    const savedEmail = localStorage.getItem('tempEmail');
    if (savedEmail) {
        currentEmail = savedEmail;
        displayEmail(savedEmail);
        await loadEmails();
        startEmailCheck();
    }
}

// Load available domains
async function loadDomains() {
    try {
        const response = await fetch(`${API_BASE}/domains`);
        const data = await response.json();
        
        if (data.success) {
            elements.domainSelect.innerHTML = '<option value="">Выберите домен...</option>';
            data.domains.forEach(domain => {
                const option = document.createElement('option');
                option.value = domain;
                option.textContent = `@${domain}`;
                elements.domainSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading domains:', error);
        showToast('Ошибка загрузки доменов', 'error');
    }
}

// Event Listeners
function setupEventListeners() {
    elements.generateBtn.addEventListener('click', generateRandomEmail);
    elements.customBtn.addEventListener('click', () => {
        elements.customForm.classList.toggle('hidden');
    });
    elements.createCustomBtn.addEventListener('click', createCustomEmail);
    elements.cancelCustomBtn.addEventListener('click', () => {
        elements.customForm.classList.add('hidden');
    });
    elements.copyBtn.addEventListener('click', copyEmail);
    elements.refreshBtn.addEventListener('click', generateRandomEmail);
    elements.refreshEmailsBtn.addEventListener('click', loadEmails);
    elements.deleteAllBtn.addEventListener('click', deleteAllEmails);
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.emailModal.addEventListener('click', (e) => {
        if (e.target === elements.emailModal) {
            closeModal();
        }
    });
    elements.deleteEmailBtn.addEventListener('click', deleteCurrentEmail);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

// Generate random email
async function generateRandomEmail() {
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success) {
            currentEmail = data.email;
            localStorage.setItem('tempEmail', currentEmail);
            displayEmail(currentEmail);
            await loadEmails();
            startEmailCheck();
            showToast('Email адрес создан!', 'success');
        }
    } catch (error) {
        console.error('Error generating email:', error);
        showToast('Ошибка создания адреса', 'error');
    }
}

// Create custom email
async function createCustomEmail() {
    const username = elements.customUsername.value.trim();
    const domain = elements.domainSelect.value;
    
    if (!username) {
        showToast('Введите имя пользователя', 'error');
        return;
    }
    
    if (!domain) {
        showToast('Выберите домен', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ custom: username })
        });
        const data = await response.json();
        
        if (data.success) {
            currentEmail = data.email;
            localStorage.setItem('tempEmail', currentEmail);
            displayEmail(currentEmail);
            elements.customForm.classList.add('hidden');
            elements.customUsername.value = '';
            await loadEmails();
            startEmailCheck();
            showToast('Пользовательский адрес создан!', 'success');
        } else {
            showToast(data.error || 'Ошибка создания адреса', 'error');
        }
    } catch (error) {
        console.error('Error creating custom email:', error);
        showToast('Ошибка создания адреса', 'error');
    }
}

// Display email address
function displayEmail(email) {
    elements.currentEmail.innerHTML = `<span style="color: var(--primary); font-weight: 600;">${email}</span>`;
    elements.copyBtn.disabled = false;
    elements.refreshBtn.disabled = false;
}

// Copy email to clipboard
async function copyEmail() {
    if (!currentEmail) return;
    
    try {
        await navigator.clipboard.writeText(currentEmail);
        showToast('Адрес скопирован!', 'success');
    } catch (error) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = currentEmail;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Адрес скопирован!', 'success');
    }
}

// Load emails
async function loadEmails() {
    if (!currentEmail) return;
    
    try {
        const response = await fetch(`${API_BASE}/emails/${encodeURIComponent(currentEmail)}`);
        const data = await response.json();
        
        if (data.success) {
            displayEmails(data.emails);
            elements.emailCount.textContent = data.count;
            elements.inboxCount.textContent = data.count;
        }
    } catch (error) {
        console.error('Error loading emails:', error);
    }
}

// Display emails list
function displayEmails(emails) {
    if (!emails || emails.length === 0) {
        elements.emailsList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <h3>Писем пока нет</h3>
                <p>Используйте сгенерированный email адрес для получения писем</p>
            </div>
        `;
        return;
    }
    
    elements.emailsList.innerHTML = emails.map(email => {
        const date = new Date(email.receivedAt);
        const timeAgo = formatTimeAgo(date);
        const preview = email.text ? email.text.substring(0, 100) : '(Нет текста)';
        
        return `
            <div class="email-item ${!email.read ? 'unread' : ''}" data-email-id="${email.emailId}">
                <div class="email-info">
                    <div class="email-from">
                        ${escapeHtml(email.from)}
                        ${!email.read ? '<span class="email-badge">НОВОЕ</span>' : ''}
                    </div>
                    <div class="email-subject">${escapeHtml(email.subject)}</div>
                    <div class="email-preview">${escapeHtml(preview)}</div>
                </div>
                <div class="email-meta">
                    <div class="email-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners
    document.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', () => {
            openEmail(item.dataset.emailId);
        });
    });
}

// Open email modal
async function openEmail(emailId) {
    try {
        const response = await fetch(`${API_BASE}/email/${emailId}`);
        const data = await response.json();
        
        if (data.success) {
            currentEmailData = data.email;
            displayEmailModal(data.email);
            await loadEmails(); // Refresh list to update read status
        }
    } catch (error) {
        console.error('Error loading email:', error);
        showToast('Ошибка загрузки письма', 'error');
    }
}

// Display email in modal
function displayEmailModal(email) {
    elements.modalSubject.textContent = email.subject;
    elements.modalFrom.textContent = email.from;
    elements.modalTo.textContent = email.to;
    elements.modalDate.textContent = new Date(email.receivedAt).toLocaleString('ru-RU');
    
    // Load HTML content
    if (email.html) {
        elements.htmlFrame.srcdoc = email.html;
    } else {
        elements.htmlFrame.srcdoc = '<div style="padding: 20px; font-family: sans-serif;">Нет HTML версии</div>';
    }
    
    // Load text content
    elements.textContent.textContent = email.text || 'Нет текстовой версии';
    
    elements.emailModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    elements.emailModal.classList.add('hidden');
    currentEmailData = null;
}

// Switch tab in email modal
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    if (tab === 'html') {
        elements.htmlFrame.classList.remove('hidden');
        elements.textContent.classList.add('hidden');
    } else {
        elements.htmlFrame.classList.add('hidden');
        elements.textContent.classList.remove('hidden');
    }
}

// Delete current email
async function deleteCurrentEmail() {
    if (!currentEmailData) return;
    
    if (!confirm('Удалить это письмо?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/email/${currentEmailData.emailId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Письмо удалено', 'success');
            closeModal();
            await loadEmails();
        }
    } catch (error) {
        console.error('Error deleting email:', error);
        showToast('Ошибка удаления письма', 'error');
    }
}

// Delete all emails
async function deleteAllEmails() {
    if (!currentEmail) return;
    
    if (!confirm('Удалить все письма?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/emails/${encodeURIComponent(currentEmail)}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            showToast(`Удалено писем: ${data.deletedCount}`, 'success');
            await loadEmails();
        }
    } catch (error) {
        console.error('Error deleting emails:', error);
        showToast('Ошибка удаления писем', 'error');
    }
}

// Start email checking
function startEmailCheck() {
    if (emailCheckInterval) {
        clearInterval(emailCheckInterval);
    }
    
    emailCheckInterval = setInterval(() => {
        loadEmails();
    }, 10000); // Check every 10 seconds
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Utility functions
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Только что';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
    
    return date.toLocaleDateString('ru-RU');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app
init();

