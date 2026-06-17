// UI Service
let currentChatId = null;
let lastMessageTime = 0;
const SLOWMODE_DELAY = 1000; // milliseconds

const uiService = {
  showLandingPage: () => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="landing-container">
        <div class="landing-content">
          <div class="nebula-logo">✨</div>
          <h1>Nebula Chat</h1>
          <p>Connect, Chat, and Collaborate</p>
        </div>
        <div class="landing-auth">
          <div class="auth-box">
            <div class="auth-tabs">
              <button class="auth-tab active" onclick="switchAuthTab('login')">Login</button>
              <button class="auth-tab" onclick="switchAuthTab('signup')">Sign Up</button>
            </div>
            
            <form class="auth-form active" id="login-form" onsubmit="handleLogin(event)">
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="login-email" required>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" id="login-password" required>
              </div>
              <button type="submit" class="submit-btn">Login</button>
            </form>

            <form class="auth-form" id="signup-form" onsubmit="handleSignup(event)">
              <div class="form-group">
                <label>Username</label>
                <input type="text" id="signup-username" required>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="signup-email" required>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" id="signup-password" required>
              </div>
              <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="signup-confirm" required>
              </div>
              <button type="submit" class="submit-btn">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  showMainApp: async (user) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="chat-app-container">
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">
              <i class="fas fa-star"></i>
              <span>Nebula</span>
            </div>
            <div class="sidebar-actions">
              <button class="sidebar-btn" onclick="toggleMobileMenu()" title="Menu"><i class="fas fa-bars"></i></button>
            </div>
          </div>
          <div class="sidebar-search">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search chats..." id="search-input" onkeyup="searchChats(event)">
          </div>
          <div class="sidebar-scroll">
            <ul class="chat-list" id="chat-list"></ul>
          </div>
          <div class="sidebar-user">
            <div class="user-profile-mini">
              <div class="user-avatar-mini" style="background-image: url('${user.profilePicture}')"></div>
              <div class="user-info-mini">
                <div class="user-name-mini">${user.username}</div>
                <div class="user-status-mini"><span class="user-status ${user.status}"></span> ${user.status.toUpperCase()}</div>
              </div>
            </div>
            <button class="sidebar-btn" onclick="openSettings()" title="Settings"><i class="fas fa-cog"></i></button>
          </div>
        </div>

        <div class="chat-area">
          <div class="chat-header">
            <div class="chat-header-title">
              <span id="chat-title">Select a chat</span>
            </div>
            <div class="chat-header-actions">
              <button class="header-btn" onclick="openCreateGroupModal()" title="New Group"><i class="fas fa-users"></i></button>
              ${user.role === 'owner' ? `<button class="header-btn" onclick="openAdminPanel()" title="Admin Panel"><i class="fas fa-shield-alt"></i></button>` : ''}
            </div>
          </div>

          <div class="messages-container" id="messages-container">
            <div style="text-align: center; color: #999; margin-top: auto; margin-bottom: auto;">
              <p>Select a chat to start messaging</p>
            </div>
          </div>

          <div class="message-input-area">
            <div class="input-wrapper">
              <div class="input-field">
                <textarea id="message-input" placeholder="Type a message..." onkeypress="handleMessageKeypress(event)" rows="1"></textarea>
                <div class="input-actions">
                  <button class="input-action-btn" onclick="attachFile()" title="Attach File"><i class="fas fa-paperclip"></i></button>
                  <button class="input-action-btn" onclick="addEmoji()" title="Emoji"><i class="fas fa-smile"></i></button>
                </div>
              </div>
            </div>
            <button class="send-btn" onclick="sendMessage()" title="Send"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    `;

    // Load chats
    loadChats();
    
    // Initialize socket
    socketService.init(user.id);
  },
};

// Helper functions
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`${tab}-form`).classList.add('active');
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const result = await authService.login(email, password);
    showToast('Login successful!', 'success');
    uiService.showMainApp(currentUser);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;

  try {
    const result = await authService.signup(username, email, password, confirmPassword);
    showToast('Signup successful! Logging you in...', 'success');
    uiService.showMainApp(currentUser);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadChats() {
  try {
    const data = await apiCall('/chats');
    if (data.success) {
      const chatList = document.getElementById('chat-list');
      chatList.innerHTML = '';
      
      data.chats.forEach(chat => {
        const chatName = chat.isGroup ? chat.name : chat.members.find(m => m._id !== currentUser.id)?.username;
        const li = document.createElement('li');
        li.className = 'chat-item';
        li.innerHTML = `
          <div class="chat-avatar">${chatName.charAt(0).toUpperCase()}</div>
          <div class="chat-info">
            <div class="chat-name">${chatName}</div>
            <div class="chat-preview">Click to view messages</div>
          </div>
        `;
        li.onclick = () => selectChat(chat._id, chatName);
        chatList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error loading chats:', error);
  }
}

async function selectChat(chatId, chatName) {
  currentChatId = chatId;
  document.getElementById('chat-title').textContent = chatName;
  document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.chat-item')?.classList.add('active');
  
  socketService.joinChat(chatId);
  loadMessages(chatId);
}

async function loadMessages(chatId) {
  try {
    const data = await apiCall(`/chats/${chatId}/messages`);
    if (data.success) {
      const container = document.getElementById('messages-container');
      container.innerHTML = '';
      
      data.messages.forEach(msg => {
        displayMessage(msg);
      });
      
      container.scrollTop = container.scrollHeight;
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function displayMessage(msg) {
  const container = document.getElementById('messages-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${msg.sender._id === currentUser.id ? 'own' : ''}`;
  
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.innerHTML = `
    ${msg.sender._id !== currentUser.id ? `<div class="message-avatar" style="background-image: url('${msg.sender.profilePicture}')"></div>` : ''}
    <div class="message-content">
      ${msg.sender._id !== currentUser.id ? `<div class="message-sender">${msg.sender.username}</div>` : ''}
      ${msg.replyTo ? `<div class="message-reply">Replying to message</div>` : ''}
      <div class="message-bubble">${msg.content}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  
  if (!content || !currentChatId) return;
  
  // Slowmode check
  const now = Date.now();
  if (now - lastMessageTime < SLOWMODE_DELAY) {
    showToast('Please wait before sending another message', 'warning');
    return;
  }
  lastMessageTime = now;
  
  try {
    const data = await apiCall(`/chats/${currentChatId}/send-message`, 'POST', {
      content,
      mentions: extractMentions(content),
    });
    
    if (data.success) {
      input.value = '';
      input.style.height = 'auto';
      displayMessage(data.message);
      socketService.sendMessage(currentChatId, content);
    }
  } catch (error) {
    showToast('Error sending message', 'error');
  }
}

function handleMessageKeypress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  } else {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  }
}

function extractMentions(text) {
  const regex = /@(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map(m => m.slice(1)) : [];
}

function showTypingIndicator(data) {
  console.log(`${data.username} is typing...`);
}

function handlePingNotification(data) {
  if (currentUser.status !== 'dnd') {
    showToast(`${data.senderName} pinged you!`, 'info');
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play().catch(e => console.log('Audio play failed'));
  }
}

function openSettings() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <span>Settings</span>
        <button class="modal-close" onclick="this.closest('.modal').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="settings-panel">
        <div class="settings-section">
          <div class="settings-title">Status</div>
          <select class="status-select" onchange="updateStatus(this.value)">
            <option value="online" ${currentUser.status === 'online' ? 'selected' : ''}>Online</option>
            <option value="dnd" ${currentUser.status === 'dnd' ? 'selected' : ''}>Do Not Disturb</option>
            <option value="offline" ${currentUser.status === 'offline' ? 'selected' : ''}>Offline</option>
          </select>
        </div>
        <div class="settings-section">
          <div class="settings-title">Profile</div>
          <div class="settings-item">
            <label class="settings-label">Bio</label>
            <input type="text" id="bio-input" value="${currentUser.bio}" placeholder="Add a bio">
          </div>
          <button class="submit-btn" onclick="updateBio()">Update Bio</button>
        </div>
        <div class="settings-section">
          <div class="settings-title">Account</div>
          <button class="submit-btn" onclick="changePassword()" style="margin-bottom: 10px;">Change Password</button>
          <button class="submit-btn" onclick="logoutAll()" style="background: #ff6b6b;">Logout All Devices</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => e.target === modal && modal.remove();
}

async function updateStatus(status) {
  currentUser.status = status;
  socketService.updateStatus(status);
  showToast(`Status updated to ${status}`, 'success');
}

async function updateBio() {
  const bio = document.getElementById('bio-input').value;
  try {
    const data = await apiCall('/users/profile/update', 'PUT', { bio });
    if (data.success) {
      currentUser.bio = bio;
      showToast('Bio updated!', 'success');
    }
  } catch (error) {
    showToast('Error updating bio', 'error');
  }
}

async function changePassword() {
  const newPassword = prompt('Enter new password:');
  if (newPassword) {
    try {
      const data = await apiCall('/users/password', 'PUT', {
        oldPassword: prompt('Enter old password:'),
        newPassword,
      });
      if (data.success) {
        showToast('Password changed!', 'success');
      }
    } catch (error) {
      showToast('Error changing password', 'error');
    }
  }
}

async function logoutAll() {
  if (confirm('Are you sure you want to logout from all devices?')) {
    await apiCall('/users/logout-all', 'POST');
    authService.logout();
    uiService.showLandingPage();
  }
}

function openCreateGroupModal() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <span>Create Group Chat</span>
        <button class="modal-close" onclick="this.closest('.modal').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group">
        <label>Group Name</label>
        <input type="text" id="group-name" placeholder="Enter group name">
      </div>
      <div class="form-group">
        <label>Select Members</label>
        <div id="members-list"></div>
      </div>
      <button class="submit-btn" onclick="createGroup()">Create Group</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => e.target === modal && modal.remove();
}

async function createGroup() {
  const name = document.getElementById('group-name').value;
  if (!name) {
    showToast('Please enter a group name', 'error');
    return;
  }
  
  try {
    const data = await apiCall('/chats/create-group', 'POST', {
      name,
      memberIds: [],
    });
    if (data.success) {
      showToast('Group created!', 'success');
      loadChats();
      document.querySelector('.modal').remove();
    }
  } catch (error) {
    showToast('Error creating group', 'error');
  }
}

function openAdminPanel() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <div class="modal-header">
        <span>Admin Panel</span>
        <button class="modal-close" onclick="this.closest('.modal').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="admin-panel">
        <div class="admin-section">
          <h3>Ban User</h3>
          <input type="text" id="ban-username" placeholder="Username" class="form-group">
          <textarea id="ban-reason" placeholder="Reason" class="form-group"></textarea>
          <label>Days (0 for permanent)</label>
          <input type="number" id="ban-days" value="7" class="form-group">
          <button class="admin-btn danger" onclick="banUser()">Ban User</button>
        </div>
        <div class="admin-section">
          <h3>Promote Admin</h3>
          <input type="text" id="admin-username" placeholder="Username" class="form-group">
          <button class="admin-btn success" onclick="promoteAdmin()">Make Admin</button>
        </div>
        <div class="admin-section" style="grid-column: 1 / -1;">
          <h3>Site Logs</h3>
          <div id="logs-container" style="max-height: 300px; overflow-y: auto;"></div>
          <button class="admin-btn" onclick="loadAdminLogs()">Load Logs</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => e.target === modal && modal.remove();
  loadAdminLogs();
}

async function loadAdminLogs() {
  try {
    const data = await apiCall('/admin/logs');
    if (data.success) {
      const container = document.getElementById('logs-container');
      container.innerHTML = data.logs.map(log => `
        <div class="admin-item">
          <div>
            <strong>${log.action}</strong><br>
            <small>${new Date(log.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

async function banUser() {
  const username = document.getElementById('ban-username').value;
  const reason = document.getElementById('ban-reason').value;
  const days = parseInt(document.getElementById('ban-days').value);
  
  if (!username || !reason) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  try {
    const data = await apiCall('/admin/ban-user', 'POST', {
      userId: username,
      reason,
      days,
      isPermanent: days === 0,
    });
    if (data.success) {
      showToast('User banned!', 'success');
      loadAdminLogs();
    }
  } catch (error) {
    showToast('Error banning user', 'error');
  }
}

async function promoteAdmin() {
  const username = document.getElementById('admin-username').value;
  if (!username) {
    showToast('Please enter username', 'error');
    return;
  }
  
  try {
    const data = await apiCall('/admin/promote-admin', 'POST', {
      userId: username,
      canDeleteMessages: true,
      canTempBan: true,
    });
    if (data.success) {
      showToast('User promoted to admin!', 'success');
      loadAdminLogs();
    }
  } catch (error) {
    showToast('Error promoting user', 'error');
  }
}

function attachFile() {
  showToast('File attachment coming soon!', 'info');
}

function addEmoji() {
  const emoji = prompt('Enter emoji:');
  if (emoji) {
    document.getElementById('message-input').value += emoji;
  }
}

function searchChats(e) {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.chat-item').forEach(item => {
    const name = item.querySelector('.chat-name').textContent.toLowerCase();
    item.style.display = name.includes(query) ? '' : 'none';
  });
}

function toggleMobileMenu() {
  document.querySelector('.sidebar').classList.toggle('mobile-open');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.addEventListener('load', async () => {
  if (authService.isAuthenticated()) {
    await authService.getMe();
    uiService.showMainApp(currentUser);
  } else {
    uiService.showLandingPage();
  }
});
