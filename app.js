const KEYS = {
    foods: 'ns_foods',
    logs: 'ns_logs',
    water: 'ns_water',
    goals: 'ns_goals',
    timer: 'ns_timer',
    theme: 'ns_theme'
};

function getData(key, def = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; }
    catch { return def; }
}
function setData(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function escHtml(str) {
    if (!str) return '';
    return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function toDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// vizu geral
let foods = getData(KEYS.foods, []);
let logs = getData(KEYS.logs, []);
let waterLogs = getData(KEYS.water, {});
let goals = getData(KEYS.goals, { kcal: 2000, prot: 150, carb: 200, fat: 60, water: 2.5 });


const DEFAULT_ICONS = ['🥩', '🍗', '🐟', '🥚', '🥛', '🧀', '🥗', '🥦', '🥑', '🍎', '🍌', '🍚', '🍞', '🍝', '🍕', '🍔', '🍟', '🍫', '🍦', '☕', '🥤'];

const FOOD_CATEGORIES = ['Todos', 'Proteína', 'Carboidrato', 'Gordura', 'Verduras', 'Frutas', 'Laticínios', 'Extras'];

const SEED_FOODS = [
    { name: 'Frango grelhado', cat: 'Proteína', icon: '🍗', refAmount: 100, kcal: 165, prot: 31, carb: 0, fat: 3.6 },
    { name: 'Carne bovina (patinho)', cat: 'Proteína', icon: '🥩', refAmount: 100, kcal: 148, prot: 26, carb: 0, fat: 4.5 },
    { name: 'Peito de peru', cat: 'Proteína', icon: '🥩', refAmount: 100, kcal: 104, prot: 21, carb: 0, fat: 1.5 },
    { name: 'Ovo inteiro', cat: 'Proteína', icon: '🥚', refAmount: 100, kcal: 155, prot: 13, carb: 1, fat: 11 },
    { name: 'Clara de ovo', cat: 'Proteína', icon: '🥚', refAmount: 100, kcal: 52, prot: 11, carb: 1, fat: 0.2 },
    { name: 'Atum (enlatado)', cat: 'Proteína', icon: '🐟', refAmount: 100, kcal: 116, prot: 26, carb: 0, fat: 1 },
    { name: 'Salmão', cat: 'Proteína', icon: '🐟', refAmount: 100, kcal: 208, prot: 20, carb: 0, fat: 13 },
    { name: 'Sardinha', cat: 'Proteína', icon: '🐟', refAmount: 100, kcal: 208, prot: 25, carb: 0, fat: 11 },
    { name: 'Tilápia', cat: 'Proteína', icon: '🐟', refAmount: 100, kcal: 96, prot: 20, carb: 0, fat: 2 },
    { name: 'Carne moída', cat: 'Proteína', icon: '🥩', refAmount: 100, kcal: 215, prot: 22, carb: 0, fat: 13 },
    { name: 'Whey protein', cat: 'Proteína', icon: '🥛', refAmount: 30, kcal: 120, prot: 24, carb: 3, fat: 2 },
    { name: 'Arroz branco', cat: 'Carboidrato', icon: '🍚', refAmount: 100, kcal: 130, prot: 2.5, carb: 28, fat: 0.3 },
    { name: 'Arroz integral', cat: 'Carboidrato', icon: '🍚', refAmount: 100, kcal: 123, prot: 2.7, carb: 25, fat: 1 },
    { name: 'Feijão', cat: 'Carboidrato', icon: '🍲', refAmount: 100, kcal: 132, prot: 9, carb: 24, fat: 0.5 },
    { name: 'Macarrão', cat: 'Carboidrato', icon: '🍝', refAmount: 100, kcal: 371, prot: 13, carb: 74, fat: 1.5 },
    { name: 'Pão francês', cat: 'Carboidrato', icon: '🍞', refAmount: 50, kcal: 136, prot: 4, carb: 27, fat: 1 },
    { name: 'Pão integral', cat: 'Carboidrato', icon: '🍞', refAmount: 50, kcal: 120, prot: 5, carb: 22, fat: 2 },
    { name: 'Batata inglesa', cat: 'Carboidrato', icon: '🥔', refAmount: 100, kcal: 77, prot: 2, carb: 17, fat: 0.1 },
    { name: 'Batata doce', cat: 'Carboidrato', icon: '🍠', refAmount: 100, kcal: 86, prot: 1.6, carb: 20, fat: 0.1 },
    { name: 'Mandioca', cat: 'Carboidrato', icon: '🍠', refAmount: 100, kcal: 125, prot: 1, carb: 30, fat: 0.3 },
    { name: 'Tapioca', cat: 'Carboidrato', icon: '🫓', refAmount: 100, kcal: 335, prot: 0.5, carb: 83, fat: 0.3 },
    { name: 'Aveia', cat: 'Carboidrato', icon: '🌾', refAmount: 100, kcal: 389, prot: 17, carb: 66, fat: 7 },
    { name: 'Abacate', cat: 'Gordura', icon: '🥑', refAmount: 100, kcal: 160, prot: 2, carb: 9, fat: 15 },
    { name: 'Azeite de oliva', cat: 'Gordura', icon: '🫒', refAmount: 15, kcal: 132, prot: 0, carb: 0, fat: 15 },
    { name: 'Castanha de caju', cat: 'Gordura', icon: '🥜', refAmount: 30, kcal: 163, prot: 4.3, carb: 9, fat: 13 },
    { name: 'Castanha do pará', cat: 'Gordura', icon: '🥜', refAmount: 30, kcal: 196, prot: 4.3, carb: 3.5, fat: 20 },
    { name: 'Amendoim', cat: 'Gordura', icon: '🥜', refAmount: 30, kcal: 176, prot: 7, carb: 5, fat: 15 },
    { name: 'Pasta de amendoim', cat: 'Gordura', icon: '🥜', refAmount: 30, kcal: 188, prot: 7, carb: 6, fat: 16 },
    { name: 'Nozes', cat: 'Gordura', icon: '🥜', refAmount: 30, kcal: 196, prot: 4.3, carb: 4, fat: 19 },
    { name: 'Alface', cat: 'Verduras', icon: '🥗', refAmount: 100, kcal: 15, prot: 1.4, carb: 2.9, fat: 0.2 },
    { name: 'Tomate', cat: 'Verduras', icon: '🍅', refAmount: 100, kcal: 18, prot: 0.9, carb: 3.9, fat: 0.2 },
    { name: 'Cenoura', cat: 'Verduras', icon: '🥕', refAmount: 100, kcal: 41, prot: 0.9, carb: 10, fat: 0.2 },
    { name: 'Brócolis', cat: 'Verduras', icon: '🥦', refAmount: 100, kcal: 34, prot: 2.8, carb: 7, fat: 0.4 },
    { name: 'Couve', cat: 'Verduras', icon: '🥦', refAmount: 100, kcal: 35, prot: 3, carb: 7, fat: 0.7 },
    { name: 'Espinafre', cat: 'Verduras', icon: '🥬', refAmount: 100, kcal: 23, prot: 2.9, carb: 3.6, fat: 0.4 },
    { name: 'Pepino', cat: 'Verduras', icon: '🥒', refAmount: 100, kcal: 16, prot: 0.7, carb: 3.6, fat: 0.1 },
    { name: 'Abobrinha', cat: 'Verduras', icon: '🥒', refAmount: 100, kcal: 17, prot: 1, carb: 3.1, fat: 0.3 },
    { name: 'Berinjela', cat: 'Verduras', icon: '🍆', refAmount: 100, kcal: 25, prot: 1, carb: 6, fat: 0.2 },
    { name: 'Beterraba', cat: 'Verduras', icon: '🫚', refAmount: 100, kcal: 43, prot: 1.6, carb: 10, fat: 0.2 },
    { name: 'Banana', cat: 'Frutas', icon: '🍌', refAmount: 100, kcal: 89, prot: 1.1, carb: 23, fat: 0.3 },
    { name: 'Maçã', cat: 'Frutas', icon: '🍎', refAmount: 100, kcal: 52, prot: 0.3, carb: 14, fat: 0.2 },
    { name: 'Laranja', cat: 'Frutas', icon: '🍊', refAmount: 100, kcal: 47, prot: 0.9, carb: 12, fat: 0.1 },
    { name: 'Mamão', cat: 'Frutas', icon: '🍈', refAmount: 100, kcal: 43, prot: 0.5, carb: 11, fat: 0.3 },
    { name: 'Melancia', cat: 'Frutas', icon: '🍉', refAmount: 100, kcal: 30, prot: 0.6, carb: 8, fat: 0.2 },
    { name: 'Abacaxi', cat: 'Frutas', icon: '🍍', refAmount: 100, kcal: 50, prot: 0.5, carb: 13, fat: 0.1 },
    { name: 'Manga', cat: 'Frutas', icon: '🥭', refAmount: 100, kcal: 60, prot: 0.8, carb: 15, fat: 0.4 },
    { name: 'Uva', cat: 'Frutas', icon: '🍇', refAmount: 100, kcal: 69, prot: 0.7, carb: 18, fat: 0.2 },
    { name: 'Morango', cat: 'Frutas', icon: '🍓', refAmount: 100, kcal: 32, prot: 0.7, carb: 8, fat: 0.3 },
    { name: 'Pera', cat: 'Frutas', icon: '🍐', refAmount: 100, kcal: 57, prot: 0.4, carb: 15, fat: 0.1 },
    { name: 'Leite integral', cat: 'Laticínios', icon: '🥛', refAmount: 200, kcal: 122, prot: 6, carb: 10, fat: 7 },
    { name: 'Leite desnatado', cat: 'Laticínios', icon: '🥛', refAmount: 200, kcal: 70, prot: 6.6, carb: 10, fat: 0.2 },
    { name: 'Iogurte natural', cat: 'Laticínios', icon: '🥛', refAmount: 100, kcal: 61, prot: 3.5, carb: 4.7, fat: 3.3 },
    { name: 'Iogurte grego', cat: 'Laticínios', icon: '🥛', refAmount: 100, kcal: 97, prot: 9, carb: 4, fat: 5 },
    { name: 'Queijo muçarela', cat: 'Laticínios', icon: '🧀', refAmount: 30, kcal: 85, prot: 5.5, carb: 0.6, fat: 6.5 },
    { name: 'Queijo minas', cat: 'Laticínios', icon: '🧀', refAmount: 30, kcal: 70, prot: 5, carb: 0.4, fat: 5.5 },
    { name: 'Requeijão', cat: 'Laticínios', icon: '🧀', refAmount: 30, kcal: 66, prot: 2.5, carb: 1.5, fat: 5.5 },
    { name: 'Hambúrguer', cat: 'Extras', icon: '🍔', refAmount: 150, kcal: 390, prot: 20, carb: 30, fat: 20 },
    { name: 'Pizza (fatia)', cat: 'Extras', icon: '🍕', refAmount: 100, kcal: 266, prot: 11, carb: 33, fat: 10 },
    { name: 'Refrigerante', cat: 'Extras', icon: '🥤', refAmount: 350, kcal: 140, prot: 0, carb: 37, fat: 0 },
    { name: 'Suco industrializado', cat: 'Extras', icon: '🧃', refAmount: 200, kcal: 90, prot: 0, carb: 22, fat: 0 },
    { name: 'Chocolate ao leite', cat: 'Extras', icon: '🍫', refAmount: 30, kcal: 160, prot: 2, carb: 18, fat: 9 },
    { name: 'Biscoito recheado', cat: 'Extras', icon: '🍪', refAmount: 30, kcal: 147, prot: 1.5, carb: 21, fat: 6.5 },
    { name: 'Batata frita', cat: 'Extras', icon: '🍟', refAmount: 100, kcal: 312, prot: 3.4, carb: 41, fat: 15 },
    { name: 'Nuggets', cat: 'Extras', icon: '🍗', refAmount: 100, kcal: 249, prot: 15, carb: 16, fat: 14 },
];

// se tiver vazio vai preencher
if (!foods.length) {
    foods = SEED_FOODS.map(f => ({ id: uid(), ...f }));
    setData(KEYS.foods, foods);
}

(function initTheme() {
    const saved = localStorage.getItem(KEYS.theme) || 'light';
    applyTheme(saved);
})();

//so mudar linha 113 para dark para iniciar no modo escuro
function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon) icon.textContent = t === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = t === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    localStorage.setItem(KEYS.theme, t);
}
function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
    if (currentPage === 'stats') renderStats();
}

let currentPage = 'dashboard';
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
    currentPage = page;
    closeSidebar();

    if (page === 'dashboard') renderDashboard();
    if (page === 'diario') renderDiario();
    if (page === 'alimentos') renderFoods();
    if (page === 'timer') renderTimerPage();
    if (page === 'metas') renderGoals();
    if (page === 'stats') renderStats();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mobileOverlay').classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
}

let toastTimeout;
function showToast(msg, icon = '✅') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function openModal(id) {
    if (id === 'modalLog') {
        foods = getData(KEYS.foods, []);
        const sel = document.getElementById('logFoodIn');
        sel.innerHTML = '<option value="">Selecionar alimento...</option>' +
            foods.map(f => `<option value="${f.id}">${f.icon} ${escHtml(f.name)}</option>`).join('');
        const now = new Date();
        document.getElementById('logDateIn').value = toDateStr(now);
        document.getElementById('logTimeIn').value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    document.getElementById(id).classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
});

function calcMacros(logsArray) {
    let kcal = 0, prot = 0, carb = 0, fat = 0;
    logsArray.forEach(l => {
        const f = foods.find(x => x.id === l.foodId);
        if (f) {
            const ratio = l.amount / (f.refAmount || 100);
            kcal += (f.kcal || 0) * ratio;
            prot += (f.prot || 0) * ratio;
            carb += (f.carb || 0) * ratio;
            fat += (f.fat || 0) * ratio;
        }
    });
    return { kcal: Math.round(kcal), prot: Math.round(prot), carb: Math.round(carb), fat: Math.round(fat) };
}

/* parte do DASHBOARD */
function renderDashboard() {
    const now = new Date();
    const hours = now.getHours();
    const greeting = hours < 12 ? 'Bom dia' : hours < 18 ? 'Boa tarde' : 'Boa noite';
    document.getElementById('dashGreeting').innerHTML = `${greeting}! <span>Bem-vindo de volta</span>`;

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    document.getElementById('dashDate').textContent = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`;

    const todayStr = toDateStr(now);
    const todayLogs = logs.filter(l => l.date === todayStr);
    const macros = calcMacros(todayLogs);
    const waterToday = waterLogs[todayStr] || 0;

    let metasAtingidas = 0;
    if (macros.kcal >= goals.kcal * 0.9 && macros.kcal <= goals.kcal * 1.1) metasAtingidas++;
    if (macros.prot >= goals.prot * 0.9) metasAtingidas++;
    if (macros.carb <= goals.carb * 1.1) metasAtingidas++;
    if (macros.fat <= goals.fat * 1.1) metasAtingidas++;
    if (waterToday >= goals.water) metasAtingidas++;

    document.getElementById('statCalorias').textContent = macros.kcal;
    document.getElementById('statProteinas').textContent = macros.prot + 'g';
    document.getElementById('statAgua').textContent = waterToday.toFixed(1) + ' L';
    document.getElementById('statMetas').textContent = Math.round((metasAtingidas / 5) * 100) + '%';

    const dashTasks = document.getElementById('dashTasks');
    if (!todayLogs.length) {
        dashTasks.innerHTML = `<div class="empty-state" style="padding:20px 0;"><div class="empty-icon">🍽️</div><p>Nenhuma refeição registrada hoje!</p></div>`;
    } else {
        dashTasks.innerHTML = todayLogs.slice(-5).reverse().map(l => {
            const f = foods.find(x => x.id === l.foodId);
            return `<div class="task-row">
                <div class="stat-icon" style="width:30px;height:30px;font-size:0.9rem;background:var(--bg3);flex-shrink:0">${f ? f.icon : '🍽️'}</div>
                <div class="task-text" style="margin-left:8px;">${f ? escHtml(f.name) : 'Removido'} <span class="text-muted text-sm">- ${l.amount}g</span></div>
                <div class="task-meta">${l.time}</div>
            </div>`;
        }).join('');
    }

    const renderBar = (lbl, val, max, color) => {
        const pct = Math.min((val / max) * 100, 100) || 0;
        return `<div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px">
                <span>${lbl}</span> <span>${Math.round(val)} / ${max}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${color}"></div></div>
        </div>`;
    };

    document.getElementById('dashGoals').innerHTML =
        renderBar('Calorias (Kcal)', macros.kcal, goals.kcal, 'linear-gradient(90deg, #f96060, #ff8c42)') +
        renderBar('Proteínas (g)', macros.prot, goals.prot, '#4aaff5') +
        renderBar('Carboidratos (g)', macros.carb, goals.carb, '#f4c542') +
        renderBar('Gorduras (g)', macros.fat, goals.fat, '#1EB882') +
        renderBar('Água (L)', waterToday, goals.water, '#00bcd4');
}


let currentLogDate = new Date();
let logFilterMeal = 'all';

function changeLogDate(dir) {
    currentLogDate.setDate(currentLogDate.getDate() + dir);
    renderDiario();
}
function filterLogs(f, btn) {
    logFilterMeal = f;
    document.querySelectorAll('#logFilters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderLogList();
}

function renderDiario() {
    const todayStr = toDateStr(new Date());
    const currStr = toDateStr(currentLogDate);
    document.getElementById('logDateDisplay').textContent = currStr === todayStr ? 'Hoje' : currStr.split('-').reverse().join('/');

    const sel = document.getElementById('logFoodIn');
    sel.innerHTML = '<option value="">Selecionar alimento...</option>' +
        foods.map(f => `<option value="${f.id}">${f.icon} ${escHtml(f.name)}</option>`).join('');

    renderLogList();
}

function renderLogList() {
    const currStr = toDateStr(currentLogDate);
    let dayLogs = logs.filter(l => l.date === currStr);
    if (logFilterMeal !== 'all') dayLogs = dayLogs.filter(l => l.meal === logFilterMeal);
    dayLogs.sort((a, b) => a.time.localeCompare(b.time));

    const list = document.getElementById('logList');
    if (!dayLogs.length) {
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">🍽️</div><p>Nenhum consumo registrado neste filtro.</p></div>`;
        return;
    }

    list.innerHTML = dayLogs.map(l => {
        const f = foods.find(x => x.id === l.foodId);
        if (!f) return '';
        const ratio = l.amount / (f.refAmount || 100);
        const k = Math.round((f.kcal || 0) * ratio);

        return `<div class="card" style="margin-bottom:12px; display:flex; gap:16px; align-items:center;">
            <div style="font-size:2rem; background:var(--bg3); border-radius:12px; width:50px; height:50px; display:flex; align-items:center; justify-content:center; flex-shrink:0">${f.icon}</div>
            <div style="flex:1">
                <div style="font-weight:700; font-family:'DM Sans'; font-size:1.1rem">${escHtml(f.name)}</div>
                <div class="text-sm text-muted" style="margin-top:4px">🔥 ${k} Kcal | P: ${Math.round((f.prot || 0) * ratio)}g | C: ${Math.round((f.carb || 0) * ratio)}g | G: ${Math.round((f.fat || 0) * ratio)}g</div>
                <div class="text-sm text-muted mt-4">⏱ ${l.time} • ${l.meal} • ${l.amount}g/ml</div>
            </div>
            <button class="btn-icon btn-sm" onclick="deleteLog('${l.id}')">🗑️</button>
        </div>`;
    }).join('');
}

function saveLog() {
    const foodId = document.getElementById('logFoodIn').value;
    const amount = parseInt(document.getElementById('logAmountIn').value);
    const meal = document.getElementById('logMealIn').value;
    let date = document.getElementById('logDateIn').value || toDateStr(new Date());
    let time = document.getElementById('logTimeIn').value || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

    if (!foodId || !amount) { showToast('Preencha alimento e porção!', '⚠️'); return; }

    logs.push({ id: uid(), foodId, amount, meal, date, time });
    setData(KEYS.logs, logs);
    closeModal('modalLog');
    document.getElementById('logAmountIn').value = '100';
    showToast('Consumo adicionado! 🍽️');
    renderDashboard();
    if (currentPage === 'diario') renderDiario();
}

function deleteLog(id) {
    if (!confirm('Excluir este registro?')) return;
    logs = logs.filter(l => l.id !== id);
    setData(KEYS.logs, logs);
    showToast('Registro excluído');
    renderDiario();
}



let selectedFoodIcon = DEFAULT_ICONS[0];

function buildIconPicker() {
    const wrap = document.getElementById('foodIconPicker');
    if (!wrap) return;
    wrap.innerHTML = DEFAULT_ICONS.map(ic =>
        `<div class="color-swatch ${ic === selectedFoodIcon ? 'selected' : ''}" 
        style="background:var(--bg3);font-size:1.1rem;display:flex;align-items:center;justify-content:center;"
        onclick="selectFoodIcon('${ic}')">${ic}</div>`
    ).join('');
}

function selectFoodIcon(ic) {
    selectedFoodIcon = ic;
    buildIconPicker();
}

let foodCategoryFilter = 'Todos';

function renderFoods() {
    buildIconPicker();
    const bar = document.getElementById('catFilterBar');
    if (bar && !bar.dataset.built) {
        bar.innerHTML = FOOD_CATEGORIES.map(c =>
            `<button class="filter-btn ${c === foodCategoryFilter ? 'active' : ''}" onclick="setCatFilter('${c}', this)">${c}</button>`
        ).join('');
        bar.dataset.built = '1';
    }
    renderFoodGrid();
}

function setCatFilter(cat, btn) {
    foodCategoryFilter = cat;
    document.querySelectorAll('#catFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderFoodGrid();
}

function renderFoodGrid() {
    const q = (document.getElementById('foodSearch')?.value || '').toLowerCase();
    const grid = document.getElementById('foodGrid');
    let filtered = foods;
    if (foodCategoryFilter !== 'Todos') filtered = filtered.filter(f => f.cat === foodCategoryFilter);
    if (q) filtered = filtered.filter(f => f.name.toLowerCase().includes(q));

    if (!filtered.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🥑</div><p>Nenhum alimento encontrado.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(f => `
        <div class="card" style="display:flex; flex-direction:column;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px">
                <div style="font-size:2rem; background:var(--bg3); border-radius:12px; width:50px; height:50px; display:flex; align-items:center; justify-content:center; flex-shrink:0">${f.icon}</div>
                <div>
                    <div style="font-weight:700; font-family:'DM Sans'">${escHtml(f.name)}</div>
                    <div class="text-sm text-muted">Porção ${f.refAmount}g/ml</div>
                </div>
            </div>
            <div class="grid-2" style="font-size:0.8rem; background:var(--bg); border:1px solid var(--border); padding:10px; border-radius:8px; margin-bottom:12px">
                <div>🔥 ${f.kcal} Kcal</div><div>🥩 ${f.prot}g</div><div>🍞 ${f.carb}g</div><div>🥑 ${f.fat}g</div>
            </div>
            <div style="margin-top:auto; display:flex; justify-content:flex-end; gap:8px">
                <button class="btn btn-ghost btn-sm" onclick="editFood('${f.id}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFood('${f.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function saveFood() {
    const id = document.getElementById('foodEditId').value;
    const name = document.getElementById('foodNameIn').value.trim();
    if (!name) { showToast('Informe o nome do alimento!', '⚠️'); return; }

    const data = {
        name,
        refAmount: parseFloat(document.getElementById('foodRefAmountIn').value) || 100,
        kcal: parseFloat(document.getElementById('foodKcalIn').value) || 0,
        prot: parseFloat(document.getElementById('foodProtIn').value) || 0,
        carb: parseFloat(document.getElementById('foodCarbIn').value) || 0,
        fat: parseFloat(document.getElementById('foodFatIn').value) || 0,
        icon: selectedFoodIcon
    };

    if (id) {
        const idx = foods.findIndex(f => f.id === id);
        if (idx !== -1) foods[idx] = { ...foods[idx], ...data };
        showToast('Alimento atualizado!');
    } else {
        foods.push({ id: uid(), ...data });
        showToast('Alimento criado! 🥑');
    }

    setData(KEYS.foods, foods);
    closeModal('modalFood');
    clearFoodForm();
    renderFoodGrid();
}

function editFood(id) {
    const f = foods.find(x => x.id === id);
    if (!f) return;
    document.getElementById('foodEditId').value = f.id;
    document.getElementById('foodNameIn').value = f.name;
    document.getElementById('foodRefAmountIn').value = f.refAmount;
    document.getElementById('foodKcalIn').value = f.kcal;
    document.getElementById('foodProtIn').value = f.prot;
    document.getElementById('foodCarbIn').value = f.carb;
    document.getElementById('foodFatIn').value = f.fat;
    selectedFoodIcon = f.icon || DEFAULT_ICONS[0];
    buildIconPicker();
    document.getElementById('modalFoodTitle').textContent = 'Editar Alimento';
    openModal('modalFood');
}

function deleteFood(id) {
    if (!confirm('Excluir alimento? Registros não serão afetados.')) return;
    foods = foods.filter(f => f.id !== id);
    setData(KEYS.foods, foods);
    showToast('Alimento removido');
    renderFoodGrid();
}

function clearFoodForm() {
    document.getElementById('foodEditId').value = '';
    document.getElementById('foodNameIn').value = '';
    document.getElementById('foodRefAmountIn').value = '100';
    document.getElementById('foodKcalIn').value = '';
    document.getElementById('foodProtIn').value = '0';
    document.getElementById('foodCarbIn').value = '0';
    document.getElementById('foodFatIn').value = '0';
    selectedFoodIcon = DEFAULT_ICONS[0];
    document.getElementById('modalFoodTitle').textContent = 'Novo Alimento';
    buildIconPicker();
}

function renderGoals() {
    document.getElementById('goalKcalIn').value = goals.kcal;
    document.getElementById('goalProtIn').value = goals.prot;
    document.getElementById('goalCarbIn').value = goals.carb;
    document.getElementById('goalFatIn').value = goals.fat;
    document.getElementById('goalWaterIn').value = goals.water;

    const todayStr = toDateStr(new Date());
    const todayLogs = logs.filter(l => l.date === todayStr);
    const macros = calcMacros(todayLogs);
    const water = waterLogs[todayStr] || 0;

    const renderMacro = (lbl, val, max, unit, color) => {
        const pct = Math.min((val / max) * 100, 100) || 0;
        return `<div class="card" style="margin-bottom:12px">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                <span class="fw-600">${lbl}</span><span class="text-sm text-muted">${val} / ${max} ${unit}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${color}"></div></div>
        </div>`;
    };

    document.getElementById('goalsDaily').innerHTML =
        renderMacro('Calorias', macros.kcal, goals.kcal, 'Kcal', '#f96060') +
        renderMacro('Água', water.toFixed(1), goals.water, 'L', '#00bcd4');

    document.getElementById('goalsMacros').innerHTML =
        renderMacro('Proteínas', macros.prot, goals.prot, 'g', '#4aaff5') +
        renderMacro('Carboidratos', macros.carb, goals.carb, 'g', '#f4c542') +
        renderMacro('Gorduras', macros.fat, goals.fat, 'g', '#1EB882');
}

function saveGoalValues() {
    goals = {
        kcal: parseInt(document.getElementById('goalKcalIn').value) || 2000,
        prot: parseInt(document.getElementById('goalProtIn').value) || 150,
        carb: parseInt(document.getElementById('goalCarbIn').value) || 200,
        fat: parseInt(document.getElementById('goalFatIn').value) || 60,
        water: parseFloat(document.getElementById('goalWaterIn').value) || 2.5
    };
    setData(KEYS.goals, goals);
    closeModal('modalGoal');
    showToast('Metas atualizadas!');
    if (currentPage === 'metas') renderGoals();
}

function addWater(liters) {
    const today = toDateStr(new Date());
    waterLogs[today] = (waterLogs[today] || 0) + liters;
    setData(KEYS.water, waterLogs);
    showToast(`+${liters * 1000}ml de Água registrados! 💧`, '💧');
    if (currentPage === 'metas') renderGoals();
}


let timerRunning = false;
let fastingInterval = null;
let timerSession = getData(KEYS.timer, { startTime: null, fastingMode: 'fasting', goalHours: 16, totalSeconds: 0 });
const CIRCUMFERENCE = 2 * Math.PI * 115;
const CIRCUMFERENCE_FS = 2 * Math.PI * 160;

function renderTimerPage() { updateFastingDisplay(); }

function updateFastingGoals() {
    timerSession.goalHours = parseInt(document.getElementById('timerGoalSel').value) || 16;
    setData(KEYS.timer, timerSession);
    updateFastingDisplay();
}

function setTimerMode(mode) {
    timerSession.fastingMode = mode;
    setData(KEYS.timer, timerSession);
    document.querySelectorAll('.timer-tab, .timer-fs-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.timer-tab[onclick*="${mode}"]`)?.classList.add('active');
    document.querySelector(`.timer-fs-tab[onclick*="${mode}"]`)?.classList.add('active');
    document.getElementById('timerModeLabel').textContent = mode === 'fasting' ? 'Tempo de Jejum' : 'Janela Alimentar';
    const fl = document.getElementById('timerModeLabelFs');
    if (fl) fl.textContent = mode === 'fasting' ? 'Tempo de Jejum' : 'Janela Alimentar';
    updateFastingDisplay();
}
function setTimerModeFs(mode) { setTimerMode(mode); }

function toggleTimer() {
    if (timerRunning) {
        clearInterval(fastingInterval);
        timerRunning = false;
        timerSession.startTime = null;
        document.getElementById('timerMainBtn').textContent = '▶';
        const fsB = document.getElementById('timerMainBtnFs');
        if (fsB) fsB.textContent = '▶';
    } else {
        if (!timerSession.startTime) timerSession.startTime = Date.now() - (timerSession.totalSeconds * 1000);
        timerRunning = true;
        document.getElementById('timerMainBtn').textContent = '⏸';
        const fsB = document.getElementById('timerMainBtnFs');
        if (fsB) fsB.textContent = '⏸';

        fastingInterval = setInterval(() => {
            timerSession.totalSeconds = Math.floor((Date.now() - timerSession.startTime) / 1000);
            updateFastingDisplay();
        }, 1000);
    }
}
function toggleTimerFs(e) { e.stopPropagation(); toggleTimer(); }

function resetTimer() {
    timerSession.totalSeconds = 0;
    timerSession.startTime = timerRunning ? Date.now() : null;
    setData(KEYS.timer, timerSession);
    updateFastingDisplay();
}
function resetTimerFs(e) { e.stopPropagation(); resetTimer(); }

function updateFastingDisplay() {
    const s = timerSession.totalSeconds;
    const hrs = Math.floor(s / 3600), mins = Math.floor((s % 3600) / 60), secs = s % 60;
    const tStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    document.getElementById('timerDisplay').textContent = tStr;
    const fsD = document.getElementById('timerDisplayFs');
    if (fsD) fsD.textContent = tStr;

    const goalH = timerSession.fastingMode === 'fasting' ? timerSession.goalHours : (24 - timerSession.goalHours);
    const goalSecs = goalH * 3600;
    let ratio = Math.min(s / goalSecs, 1);

    const ring = document.getElementById('timerRing');
    if (ring) {
        ring.setAttribute('stroke-dasharray', CIRCUMFERENCE);
        ring.setAttribute('stroke-dashoffset', CIRCUMFERENCE * (1 - ratio));
    }
    const ringFs = document.getElementById('timerRingFs');
    if (ringFs) {
        ringFs.setAttribute('stroke-dasharray', CIRCUMFERENCE_FS);
        ringFs.setAttribute('stroke-dashoffset', CIRCUMFERENCE_FS * (1 - ratio));
    }
}

function openFullscreenTimer() { document.getElementById('timerFullscreen').classList.add('open'); updateFastingDisplay(); }
function closeFullscreenTimer(e) { if (e) e.stopPropagation(); document.getElementById('timerFullscreen').classList.remove('open'); }
function handleFullscreenClick(e) { if (e.target.classList.contains('timer-fullscreen')) closeFullscreenTimer(); }

/* parte de stats */
let chartHours, chartSubjects, chartTasks;

function renderStats() {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
    });
    const dsLabels = weekDates.map(d => `${d.getDate()}/${d.getMonth() + 1}`);

    let wKcal = 0, wProt = 0;
    const weekKcalData = [], weekWaterData = [];

    weekDates.forEach(d => {
        const dStr = toDateStr(d);
        const m = calcMacros(logs.filter(l => l.date === dStr));
        wKcal += m.kcal; wProt += m.prot;
        weekKcalData.push(m.kcal);
        weekWaterData.push(waterLogs[dStr] || 0);
    });

    document.getElementById('statsOverview').innerHTML = `
    <div class="stat-card"><div class="stat-header"><div class="stat-icon" style="background:rgba(249,96,96,0.15)">🔥</div></div><div class="stat-value">${Math.round(wKcal / 7)}</div><div class="stat-label">Média Kcal/dia</div></div>
    <div class="stat-card"><div class="stat-header"><div class="stat-icon" style="background:rgba(62,207,142,0.15)">🥩</div></div><div class="stat-value">${Math.round(wProt / 7)}g</div><div class="stat-label">Média Prot/dia</div></div>
    <div class="stat-card"><div class="stat-header"><div class="stat-icon" style="background:rgba(244,197,66,0.15)">🍽️</div></div><div class="stat-value">${logs.length}</div><div class="stat-label">Registros Totais</div></div>
    <div class="stat-card"><div class="stat-header"><div class="stat-icon" style="background:rgba(74,175,245,0.15)">💧</div></div><div class="stat-value">${(waterLogs[toDateStr(new Date())] || 0).toFixed(1)} L</div><div class="stat-label">Água Hoje</div></div>`;

    const txtCol = document.documentElement.getAttribute('data-theme') === 'dark' ? '#8a8b9a' : '#6b6d80';
    const grCol = document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const opts = {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: txtCol } }, y: { grid: { color: grCol }, ticks: { color: txtCol }, beginAtZero: true } }
    };

    if (chartHours) chartHours.destroy();
    chartHours = new Chart(document.getElementById('chartHours').getContext('2d'), { type: 'bar', data: { labels: dsLabels, datasets: [{ data: weekKcalData, backgroundColor: '#f96060', borderRadius: 4 }] }, options: opts });

    if (chartTasks) chartTasks.destroy();
    chartTasks = new Chart(document.getElementById('chartTasks').getContext('2d'), { type: 'line', data: { labels: dsLabels, datasets: [{ data: weekWaterData, borderColor: '#00bcd4', backgroundColor: 'rgba(0,188,212,0.1)', borderWidth: 3, tension: 0.3, fill: true, pointRadius: 4 }] }, options: opts });

    let tP = 0, tC = 0, tF = 0;
    logs.filter(l => weekDates.map(d => toDateStr(d)).includes(l.date)).forEach(l => {
        const f = foods.find(x => x.id === l.foodId);
        if (f) { const r = l.amount / (f.refAmount || 100); tP += (f.prot || 0) * r; tC += (f.carb || 0) * r; tF += (f.fat || 0) * r; }
    });

    if (chartSubjects) chartSubjects.destroy();
    chartSubjects = new Chart(document.getElementById('chartSubjects').getContext('2d'), {
        type: 'doughnut',
        data: { labels: ['Proteínas', 'Carboidratos', 'Gorduras'], datasets: [{ data: [tP, tC, tF], backgroundColor: ['#4aaff5', '#f4c542', '#1EB882'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: txtCol } } }, cutout: '70%' }
    });
}

(function init() {
    renderDashboard();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(document.querySelector('.modal-overlay.open')?.id); });
    if (timerSession.startTime) { timerSession.startTime = Date.now() - (timerSession.totalSeconds * 1000); toggleTimer(); }
    else updateFastingDisplay();
    initProfile();
})();

/* ===== PERFIL ===== */
function initProfile() {
    const saved = localStorage.getItem('ns_profile_name') || '';
    if (saved) {
        document.getElementById('profileNameIn').value = saved;
        setProfileDisplay(saved);
    }
}
function setProfileDisplay(name) {
    const initial = name ? name.trim()[0].toUpperCase() : 'U';
    document.getElementById('profileInitial').textContent = initial;
    document.getElementById('profileInitialBig').textContent = initial;
    document.getElementById('profileNameDisplay').textContent = name || 'Usuário';
}
function updateProfileName() {
    const name = document.getElementById('profileNameIn').value;
    localStorage.setItem('ns_profile_name', name);
    setProfileDisplay(name);
}
function toggleProfile() {
    document.getElementById('profileDropdown').classList.toggle('open');
    document.getElementById('profileOverlay').classList.toggle('open');
}
function closeProfile() {
    document.getElementById('profileDropdown').classList.remove('open');
    document.getElementById('profileOverlay').classList.remove('open');
}