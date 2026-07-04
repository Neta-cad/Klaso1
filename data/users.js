// ===================================================
// Klaso — mock database for user accounts (localStorage)
// This will be replaced by real authentication + a real
// database before launch. Never store real passwords in
// localStorage in production — this is for prototyping only.
// ===================================================

const USERS_KEY = 'klaso_users';
const SESSION_KEY = 'klaso_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(user) {
  const users = getUsers();

  if (users.some(u => u.email === user.email)) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  user.id = 'u' + Date.now();
  user.plan = 'free';
  user.joined = new Date().toISOString().slice(0, 10);
  users.push(user);
  saveUsers(users);

  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, role: user.role, email: user.email }));
  return { success: true, user };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, role: user.role, email: user.email }));
  return { success: true, user };
}

function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}