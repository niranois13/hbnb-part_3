document.addEventListener('DOMContentLoaded', function() {
  updateNavbar();
  setupLogoutListener();
});

function updateNavbar() {
  const loginLink = document.querySelector('nav a[href="/login"]');
  const logoutLink = document.getElementById('logoutLink');

  if (document.cookie.includes('jwtToken=')) {
      if (loginLink) loginLink.parentElement.style.display = 'none';
      if (logoutLink) logoutLink.parentElement.style.display = 'inline-block';
  } else {
      if (loginLink) loginLink.parentElement.style.display = 'inline-block';
      if (logoutLink) logoutLink.parentElement.style.display = 'none';
  }
}

function setupLogoutListener() {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
          e.preventDefault();
          if (confirm('Are you sure you want to logout?')) {
              fetch('/logout', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      updateNavbar();
                      window.location.href = '/';
                  } else {
                      alert('Logout failed. Please try again.');
                  }
              })
              .catch(error => {
                  console.error('Error:', error);
                  alert('An error occurred. Please try again.');
              });
          }
      });
  }
}
