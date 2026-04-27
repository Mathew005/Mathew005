/* ── Config ─────────────────────────────────────────────── */
const HOME = 'about.md';

const PAGES = {
  'about.md': 'About Me',
  'projects.md': 'Work & Projects',
  'project-focus.md': 'Case Study: Focus Reader',
  'contact.md': 'Get in Touch'
};

// Display order in the sidebar main navigation
const PAGE_ORDER = [
  'about.md',
  'projects.md',
  'contact.md'
];

/* ── Marked options ─────────────────────────────────────── */
marked.setOptions({ gfm: true, breaks: false });

/* ── Routing helpers ────────────────────────────────────── */
function hashToFile() {
  const raw = decodeURIComponent(location.hash.slice(1));
  return raw || HOME;
}

/* ── TOC ─────────────────────────────────────────────────── */
function generateTOC(currentFile) {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  tocList.innerHTML = '';

  const seriesHeader = document.createElement('li');
  seriesHeader.className = 'toc-section-header';
  seriesHeader.textContent = 'Navigation';
  tocList.appendChild(seriesHeader);

  PAGE_ORDER.forEach(file => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#' + encodeURIComponent(file);
    a.textContent = PAGES[file] || file;
    a.className = 'toc-page-link' + (file === currentFile ? ' toc-page-active' : '');
    
    a.addEventListener('click', e => {
      e.preventDefault();
      closeSidebar();
      location.hash = encodeURIComponent(file);
    });
    
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

function openSidebar() {
  document.getElementById('toc-sidebar').classList.add('visible');
  document.getElementById('toc-backdrop').classList.add('visible');
}

function closeSidebar() {
  document.getElementById('toc-sidebar').classList.remove('visible');
  document.getElementById('toc-backdrop').classList.remove('visible');
}

function toggleTOC() {
  const sidebar = document.getElementById('toc-sidebar');
  if (sidebar.classList.contains('visible')) closeSidebar();
  else openSidebar();
}

/* ── Page loader ────────────────────────────────────────── */
async function loadPage(file) {
  const content = document.getElementById('content');
  const titleEl = document.getElementById('page-title');

  if (!content) return;

  content.classList.remove('page-enter');

  try {
    const res = await fetch(file);
    if (!res.ok) {
       if (res.status === 404) throw new Error("File not found.");
       throw new Error(`HTTP ${res.status}`);
    }
    let md = await res.text();
    
    let html = marked.parse(md);

    // Give fade-out a tiny moment
    await new Promise(r => setTimeout(r, 100));

    content.innerHTML = html;

    // Update chrome
    const pageTitle = PAGES[file] || file.replace('.md', '');
    document.title = pageTitle + ' | Portfolio';
    if (titleEl) titleEl.textContent = pageTitle;

    generateTOC(file);
    window.scrollTo({ top: 0, behavior: 'instant' });

  } catch (err) {
    if (content) {
      content.innerHTML = `<h2>Page not found</h2>
        <p>Could not load <code>${file}</code>.</p><p>${err.message}</p>
        <p><a href="#${HOME}">Return Home</a></p>`;
    }
  } finally {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (content) content.classList.add('page-enter');
      });
    });
  }
}

/* ── Intercept rendered .md links ───────────────────────── */
document.getElementById('content').addEventListener('click', e => {
  // Check if click was inside a custom project card
  const card = e.target.closest('.project-card');
  const a = card ? card : e.target.closest('a');
  
  if (!a) return;
  const href = a.getAttribute('href');
  
  // If it's a hash routing link to an MD file
  if (href && href.startsWith('#') && href.endsWith('.md')) {
    e.preventDefault();
    location.hash = href.slice(1);
  }
});

/* ── Close sidebar on Escape ────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

/* ── Hash-change router ─────────────────────────────────── */
window.addEventListener('hashchange', () => loadPage(hashToFile()));

/* ── Initial load ───────────────────────────────────────── */
loadPage(hashToFile());

/* ── Form Handler ───────────────────────────────────────── */
// We use event delegation since the form is dynamically loaded
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'headless-form') {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
    }

    try {
      // Execute reCAPTCHA v3
      if (!window.grecaptcha) throw new Error("reCAPTCHA transition not loaded.");
      
      const token = await grecaptcha.execute('6LcXb8wsAAAAALLwckmKEAYzFAudmaSpf0URzffP', {action: 'submit'});
      
      if (submitBtn) submitBtn.textContent = 'Sending...';
      
      const formData = new FormData(form);
      formData.append('g-recaptcha-response', token);
      const params = new URLSearchParams(formData);

      const response = await fetch(form.action, {
        method: 'POST',
        body: params,
        mode: 'no-cors'
      });
      
      // Visual feedback without intrusive alerts
      if (submitBtn) {
        submitBtn.textContent = 'Sent!';
        submitBtn.style.background = 'var(--text-sec)';
      }
      
      form.reset();
      
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Submit';
          submitBtn.style.background = 'var(--text)';
          submitBtn.disabled = false;
        }
      }, 3000);

    } catch (err) {
      if (submitBtn) {
        submitBtn.textContent = 'Error';
        submitBtn.disabled = false;
      }
    }
  }
});
