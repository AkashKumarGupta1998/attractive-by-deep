<!-- Add this in the <body> before closing tag -->
<button id="theme-toggle" class="btn-secondary" style="position: fixed; top: 1rem; right: 1rem; z-index: 1000;">
  Toggle Theme
</button>

<script>
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Check local storage for theme preference
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Save preference
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
</script>
