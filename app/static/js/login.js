// Toggle between login and register forms
document.addEventListener('DOMContentLoaded', () => {
  setupFormToggle();
  setupLoginForm();
  setupRegisterForm();
});

function setupFormToggle() {
  const loginContainer = document.getElementById('login_container');
  const registerContainer = document.getElementById('register_container');
  const switchToRegisterLink = document.getElementById('switch-to-register');
  const switchToLoginLink = document.getElementById('switch-to-login');

  if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', (event) => {
      event.preventDefault();
      loginContainer.style.display = 'none';
      registerContainer.style.display = 'block';
    });
  }

  if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', (event) => {
      event.preventDefault();
      loginContainer.style.display = 'block';
      registerContainer.style.display = 'none';
    });
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const message = document.getElementById('login-message');

      if (email === '' || password === '') {
        message.textContent = 'Both email and password are required!';
        message.style.color = 'red';
        return;
      }

      // Disable the login button to prevent multiple submissions
      const loginButton = loginForm.querySelector('button[type="submit"]');
      loginButton.disabled = true;

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.jwtToken) {
            message.textContent = 'Login successful!';
            message.style.color = 'green';
            document.cookie = `jwtToken=${data.token}; path=/; Secure; SameSite=Strict`;
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          } else {
            message.textContent = data.error || 'Login failed!';
            message.style.color = 'red';
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          message.textContent = 'An error occurred!';
          message.style.color = 'red';
        })
        .finally(() => {
          // Re-enable the login button
          loginButton.disabled = false;
        });
    });
  }
}

function setupRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    console.log('Attaching register form submit event');
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const firstName = document.getElementById('register-first_name').value.trim();
      const lastName = document.getElementById('register-last_name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();
      const message = document.getElementById('register-message');

      if (firstName === '' || lastName === '' || email === '' || password === '') {
        message.textContent = 'All fields are required!';
        message.style.color = 'red';
        return;
      }

      if (!validateEmail(email)) {
        message.textContent = 'Please enter a valid email address!';
        message.style.color = 'red';
        return;
      }

      if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters long!';
        message.style.color = 'red';
        return;
      }

      message.textContent = 'Submitting...';
      message.style.color = '#000'; // Neutral color while waiting for response

      fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.Error) {
            message.textContent = data.Error;
            message.style.color = 'red';
          } else {
            message.textContent = data.Success || 'Registration successful!';
            message.style.color = '#28a745';
            setTimeout(() => {
              window.location.replace('/');
            }, 1000);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          console.log(error)
          message.textContent = 'An error occurred!';
          message.style.color = 'red';
        });
    });
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
