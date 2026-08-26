// Mark JS as loaded (used by other pages' progressive-enhancement reveal
// pattern; harmless here since login.html doesn't use .reveal, but keeps
// the convention consistent across the site).
document.documentElement.classList.add('js-ready');

/* ============================================
   Show / hide password
   ============================================ */
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');

if (passwordInput && passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', isHidden);
    passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    passwordToggle.textContent = isHidden ? '🙈' : '👁';
  });
}

/* ============================================
   Login form submission
   ============================================
   This talks to a real backend endpoint — POST /api/auth/login — which
   does not exist yet. There is intentionally no list of valid
   registration numbers/passwords anywhere in this file: credential
   checking belongs entirely to the server (Express + MySQL per the
   project plan), never the browser.

   Until that endpoint exists, submitting this form will fail with a
   network/fetch error, which is expected — this is wired for the real
   API from day one rather than faked with a client-side credential list.
*/
const loginForm = document.getElementById('loginForm');
const loginSubmit = document.getElementById('loginSubmit');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

const LOGIN_ENDPOINT = '/api/auth/login';
const DASHBOARD_URL = 'portal/dashboard.html';

function hideMessages() {
  loginError.classList.remove('show');
  loginSuccess.classList.remove('show');
}

function showError(message) {
  hideMessages();
  loginError.textContent = message;
  loginError.classList.add('show');
}

function showSuccess(message) {
  hideMessages();
  loginSuccess.textContent = message;
  loginSuccess.classList.add('show');
}

function setLoadingState(isLoading) {
  loginSubmit.disabled = isLoading;
  loginSubmit.textContent = isLoading ? 'Logging in...' : 'Login';
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const regNumber = document.getElementById('regNumber').value.trim();
    const password = passwordInput.value;

    if (!regNumber || !password) {
      showError('Please enter your registration number and password.');
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNumber, password })
      });

      if (!response.ok) {
        // Deliberately generic — never reveal whether the registration
        // number exists or the password was the part that was wrong.
        showError('Invalid registration number or password.');
        setLoadingState(false);
        return;
      }

      const data = await response.json();

      if (data && data.success) {
        showSuccess('Login successful. Redirecting...');
        window.location.href = DASHBOARD_URL;
      } else {
        showError('Invalid registration number or password.');
        setLoadingState(false);
      }
    } catch (err) {
      // Network error, endpoint not built yet, server down, etc.
      showError('Unable to reach the server right now. Please try again shortly.');
      setLoadingState(false);
    }
  });
}