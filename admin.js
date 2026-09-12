const ADMIN_PASSWORD = "burmic2026";

const DEFAULT_MEMBERS = [
  { name: 'Tsepang Tank', role: 'President', gender: 'Female', desc: 'Leads the club with vision and strategic direction.', resp: 'overall leadership, vision, external relations, chairing meetings.' },
  { name: 'Teboho Mpholo', role: 'Vice President', gender: 'Male', desc: 'Supports the President and oversees internal operations.', resp: 'deputising the President, coordinating sub-committees, member welfare.' },
  { name: 'Bokang Makhakhe', role: 'Secretary', gender: 'Female', desc: 'Handles governance, minutes, and official club records.', resp: 'meeting minutes, correspondence, membership records, constitution.' },
  { name: 'Relebohile Mokhele', role: 'Vice Secretary', gender: 'Female', desc: 'Assists the Secretary with records and communications.', resp: 'assisting the Secretary, managing attendance, internal comms.' },
  { name: 'Vacant', role: 'Treasurer', gender: '', desc: 'Position currently vacant.', resp: 'financial management, budgeting, fee collection, financial reporting.' },
  { name: 'Tiisetso Moletsane', role: 'HR Director', gender: 'Female', desc: 'Manages member relations, recruitment, and development.', resp: 'member onboarding, welfare, dispute resolution, training.' },
  { name: 'Neo Potiane', role: 'Assistant HR Director', gender: 'Female', desc: 'Supports HR functions and member engagement.', resp: 'assisting HR Director, member engagement, feedback collection.' },
  { name: 'Rorisang David Macheli', role: 'Director of Fundraising and Marketing', gender: 'Male', desc: 'Drives partnerships, sponsorships, and club visibility.', resp: 'fundraising, sponsorships, marketing campaigns, brand management.' },
  { name: 'Sarah Hlomose', role: 'Project Manager', gender: 'Female', desc: 'Oversees club projects, events, and initiatives.', resp: 'project planning, event coordination, timeline management.' },
  { name: 'Mantho Lethole', role: 'Assistant Project Manager', gender: 'Female', desc: 'Supports project execution and event logistics.', resp: 'assisting Project Manager, logistics, event support.' }
];

let currentMembers = [];

function checkLogin() {
  const pw = document.getElementById('admin-password').value;
  const status = document.getElementById('login-status');
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem('burmic_admin', 'true');
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('admin-view').classList.remove('hidden');
    loadAll();
  } else {
    status.className = 'status-msg error';
    status.textContent = 'Incorrect password. Please try again.';
  }
}

function showStatus(id, message, type) {
  const el = document.getElementById(id);
  el.className = 'status-msg ' + type;
  el.textContent = message;
  setTimeout(() => { el.className = 'status-msg'; }, 3000);
}

function getMembers() {
  const data = localStorage.getItem('burmic_members');
  if (data) return JSON.parse(data);
  return DEFAULT_MEMBERS;
}

function renderMembers() {
  const container = document.getElementById('members-container');
  container.innerHTML = '';
  currentMembers.forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'member-row' + (m.name === 'Vacant' ? ' vacant' : '');
    row.innerHTML = `
      <div class="form-group"><label>Name</label><input type="text" value="${m.name}" onchange="updateMember(${i}, 'name', this.value)" /></div>
      <div class="form-group"><label>Position</label><input type="text" value="${m.role}" onchange="updateMember(${i}, 'role', this.value)" /></div>
      <div class="form-group"><label>Gender</label>
        <select onchange="updateMember(${i}, 'gender', this.value)">
          <option value="" ${m.gender === '' ? 'selected' : ''}>Not specified</option>
          <option value="Female" ${m.gender === 'Female' ? 'selected' : ''}>Female</option>
          <option value="Male" ${m.gender === 'Male' ? 'selected' : ''}>Male</option>
        </select>
      </div>
      <div class="form-group"><label>Description</label><input type="text" value="${m.desc}" onchange="updateMember(${i}, 'desc', this.value)" /></div>
      <div class="form-group"><label>Responsibilities</label><input type="text" value="${m.resp}" onchange="updateMember(${i}, 'resp', this.value)" /></div>
      <button class="admin-btn danger" onclick="removeMember(${i})"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(row);
  });
}

function updateMember(index, field, value) {
  currentMembers[index][field] = value;
  if (field === 'name') {
    renderMembers();
  }
}

function addMemberRow() {
  currentMembers.push({ name: 'New Member', role: 'Position', gender: '', desc: 'Short description.', resp: 'Responsibilities.' });
  renderMembers();
}

function removeMember(index) {
  currentMembers.splice(index, 1);
  renderMembers();
}

function saveMembers() {
  localStorage.setItem('burmic_members', JSON.stringify(currentMembers));
  showStatus('members-status', 'Executive committee saved successfully.', 'success');
}

function getAnnouncements() {
  const data = localStorage.getItem('burmic_announcements');
  return data ? JSON.parse(data) : [];
}

function saveAnnouncement() {
  const title = document.getElementById('ann-title').value.trim();
  const body = document.getElementById('ann-body').value.trim();
  const date = document.getElementById('ann-date').value;
  if (!title || !body) {
    showStatus('ann-status', 'Please fill in the title and body.', 'error');
    return;
  }
  const list = getAnnouncements();
  list.unshift({ title, body, date });
  localStorage.setItem('burmic_announcements', JSON.stringify(list));
  document.getElementById('ann-title').value = '';
  document.getElementById('ann-body').value = '';
  document.getElementById('ann-date').value = '';
  renderAnnouncements();
  showStatus('ann-status', 'Announcement saved successfully.', 'success');
}

function renderAnnouncements() {
  const container = document.getElementById('ann-list');
  const list = getAnnouncements();
  if (list.length === 0) {
    container.innerHTML = '<p style="color:#64748b;">No announcements yet.</p>';
    return;
  }
  container.innerHTML = list.map((a, i) => `
    <div class="admin-list-item">
      <strong>${a.title}</strong> <span class="admin-list-date">${a.date || ''}</span>
      <p>${a.body}</p>
      <button class="admin-btn danger admin-list-delete" onclick="deleteAnnouncement(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function deleteAnnouncement(index) {
  const list = getAnnouncements();
  list.splice(index, 1);
  localStorage.setItem('burmic_announcements', JSON.stringify(list));
  renderAnnouncements();
}

function getEvents() {
  const data = localStorage.getItem('burmic_events');
  return data ? JSON.parse(data) : [];
}

function saveEvent() {
  const title = document.getElementById('event-title').value.trim();
  const desc = document.getElementById('event-desc').value.trim();
  const date = document.getElementById('event-date').value;
  if (!title || !desc) {
    showStatus('event-status', 'Please fill in the title and description.', 'error');
    return;
  }
  const list = getEvents();
  list.unshift({ title, desc, date });
  localStorage.setItem('burmic_events', JSON.stringify(list));
  document.getElementById('event-title').value = '';
  document.getElementById('event-desc').value = '';
  document.getElementById('event-date').value = '';
  renderEvents();
  showStatus('event-status', 'Event saved successfully.', 'success');
}

function renderEvents() {
  const container = document.getElementById('event-list');
  const list = getEvents();
  if (list.length === 0) {
    container.innerHTML = '<p style="color:#64748b;">No events yet.</p>';
    return;
  }
  container.innerHTML = list.map((e, i) => `
    <div class="admin-list-item">
      <strong>${e.title}</strong> <span class="admin-list-date">${e.date || ''}</span>
      <p>${e.desc}</p>
      <button class="admin-btn danger admin-list-delete" onclick="deleteEvent(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function deleteEvent(index) {
  const list = getEvents();
  list.splice(index, 1);
  localStorage.setItem('burmic_events', JSON.stringify(list));
  renderEvents();
}

function saveRisk() {
  const title = document.getElementById('risk-title').value.trim();
  const desc = document.getElementById('risk-desc').value.trim();
  const month = document.getElementById('risk-month').value.trim();
  if (!title || !desc) {
    showStatus('risk-status', 'Please fill in the title and description.', 'error');
    return;
  }
  localStorage.setItem('burmic_risk', JSON.stringify({ title, desc, month }));
  showStatus('risk-status', 'Risk of the Month saved successfully.', 'success');
}

function loadRisk() {
  const data = localStorage.getItem('burmic_risk');
  if (data) {
    const r = JSON.parse(data);
    document.getElementById('risk-title').value = r.title;
    document.getElementById('risk-desc').value = r.desc;
    document.getElementById('risk-month').value = r.month;
  }
}

function exportData() {
  const data = {
    members: getMembers(),
    announcements: getAnnouncements(),
    events: getEvents(),
    risk: JSON.parse(localStorage.getItem('burmic_risk') || 'null')
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'burmic-data.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('data-status', 'Data exported successfully.', 'success');
}

function resetData() {
  if (confirm('Are you sure you want to reset all club data? This will restore the default executive committee and clear all announcements and events.')) {
    localStorage.removeItem('burmic_members');
    localStorage.removeItem('burmic_announcements');
    localStorage.removeItem('burmic_events');
    localStorage.removeItem('burmic_risk');
    currentMembers = getMembers();
    renderMembers();
    renderAnnouncements();
    renderEvents();
    loadRisk();
    showStatus('data-status', 'All data has been reset to defaults.', 'success');
  }
}

function loadAll() {
  currentMembers = getMembers();
  renderMembers();
  renderAnnouncements();
  renderEvents();
  loadRisk();
}

if (sessionStorage.getItem('burmic_admin') === 'true') {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('admin-view').classList.remove('hidden');
  loadAll();
}

document.getElementById('admin-password').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') checkLogin();
});
