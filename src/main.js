
import './style.css';
import { supabase } from './supabase.js';
import { mountNewsletter } from './newsletter.js';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="/">
      <img src="/psm.png" alt="Paragraf Satu Minggu">
    </a>

    <nav class="main-nav">
      <a href="/#artikel">Tulisan</a>
      <a href="/#tentang">Mengenal</a>
      <a href="/#catatan">Ruang Catatan</a>
    </nav>

    <a class="header-link" href="/#artikel">Jelajahi tulisan ↗</a>
  </header>

  <main>
    <section class="hero">
      <p class="eyebrow">RUANG UNTUK BERPIKIR DAN BERTUMBUH</p>
      <h1>Berhenti sejenak.<br>Mulai <em>memahami.</em></h1>
      <p class="hero-copy">
        Kumpulan cerita, pemikiran, dan hal-hal kecil yang
        mungkin layak kamu renungkan hari ini.
      </p>
      <a class="button button-dark" href="#artikel">
        Baca tulisan <span>↘</span>
      </a>
      <div class="hero-bottom">
        <span>PARAGRAF SATU MINGGU</span>
        <span>CATATAN, BUKAN PERLOMBAAN.</span>
      </div>
        </section>

    <section class="featured-section" id="unggulan">
      <div class="featured-heading">
        <p class="eyebrow">PILIHAN MINGGU INI</p>
        <span>SEBUAH TULISAN UNTUKMU</span>
      </div>

      <div id="featured-article">
        <p class="loading-message">Menyiapkan tulisan pilihan...</p>
      </div>
    </section>

    <section class="articles-section" id="artikel">
      <div class="section-top">
        <div>
          <p class="eyebrow">DARI MEJA PENULIS</p>
          <h2>Menemukan makna<span>.</span></h2>
        </div>
        <p class="section-note">
          Paragraf satu minggu.
        </p>
      </div>

      <div class="search-box">
        <span aria-hidden="true">⌕</span>
        <input id="search-input" type="search"
          placeholder="Cari judul atau isi tulisan..."
          aria-label="Cari artikel">
        <button id="clear-search" type="button" hidden>Hapus</button>
      </div>

      <div id="category-list" class="category-list"></div>

      <div class="results-heading">
        <span id="results-label">TULISAN TERBARU</span>
        <span id="results-count"></span>
      </div>

      <div id="article-list" class="article-grid">
        <p class="loading-message">Memuat tulisan...</p>
      </div>
    </section>


    <section class="about-section" id="tentang">
      <div class="about-visual">
        <div class="about-paper">
          <span class="about-number">01 / 03</span>
          <span class="about-word">paragraf satu minggu.</span>
          <span class="about-line"></span>
          <p>Setiap cerita punya ruang untuk tumbuh.</p>
        </div>
        <div class="about-stamp">RUANG<br>UNTUK<br>KONSISTEN</div>
      </div>

      <div class="about-content">
        <p class="eyebrow">TENTANG RUANG INI</p>
        <h2>Mengenal <em>Paragraf Satu Minggu</em></h2>

        <p>
          Paragraf Satu Minggu adalah blog mingguan yang berisi satu paragraf refleksi, cerita, atau ide singkat setiap minggunya. Sebuah ruang sederhana untuk berhenti sejenak, menulis, dan berbagi.
        </p>

        <p>
          Paragraf Satu Minggu lahir dari keyakinan bahwa menulis tidak selalu harus panjang, cukup satu paragraf setiap minggu sudah bisa jadi catatan perjalanan.
        </p>

        <p>
          Kalau kamu suka membaca hal-hal ringan tapi bermakna, atau ingin ikut merayakan konsistensi kecil dalam hidup, semoga blog ini bisa jadi teman mingguanmu..
        </p>

        <a class="text-link" href="#catatan">Ikut menjadi bagian ↗</a>
      </div>
    </section>



    <section class="visitor-notes-section" id="catatan">
  <div class="visitor-notes-heading">
    <div>
      <p class="eyebrow">CATATAN KECIL</p>
      <h2>Ada yang ingin<br><em>kamu ceritakan?</em></h2>
    </div>
    <p>
      Tinggalkan sesuatu yang sedang kamu pikirkan,
      rasakan, atau pelajari.
    </p>
  </div>

  <div class="visitor-notes-layout">
    <form id="visitor-note-form" class="visitor-note-form">
      <label for="visitor-name">Nama pena</label>
      <input
        id="visitor-name"
        name="pen_name"
        type="text"
        maxlength="40"
        placeholder="Boleh menggunakan nama samaran"
        required
      >

      <label for="visitor-title">Judul catatan</label>
      <input
        id="visitor-title"
        name="title"
        type="text"
        maxlength="100"
        placeholder="Berikan judul untuk ceritamu"
        required
      >

      <label for="visitor-content">Apa yang ingin kamu sampaikan?</label>
      <textarea
        id="visitor-content"
        name="content"
        rows="7"
        maxlength="2000"
        placeholder="Tuliskan ceritamu di sini..."
        required
      ></textarea>

      <div class="visitor-form-bottom">
        <span>Maksimal 2.000 karakter</span>
        <button class="button button-dark" type="submit" id="visitor-submit">
          Kirim catatan ↗
        </button>
      </div>

      <p id="visitor-form-message" class="visitor-form-message" aria-live="polite"></p>
      <p class="visitor-privacy">
        Catatan akan diperiksa terlebih dahulu sebelum ditampilkan.
      </p>
    </form>

    <div class="visitor-notes-display">
      <div class="visitor-list-heading">
        <div>
          <p class="eyebrow">DARI PARA PEMBACA</p>
          <h3>Catatan yang dibagikan</h3>
        </div>
        <span id="visitor-notes-count">0 CATATAN</span>
      </div>

      <div id="visitor-notes-list" class="visitor-notes-list">
        <p class="loading-message">Memuat catatan...</p>
      </div>
    </div>
  </div>
</section>
  </main>

<footer class="site-footer">
  <a class="brand" href="#">
    <img src="/psm.png" alt="Paragraf Satu Minggu">
  </a>

  <div class="footer-socials">
  <a href="https://www.linkedin.com/in/adrian-bagas-febbyanto-85ab14354/" aria-label="LinkedIn">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM8 18H5V9h3v9ZM6.5 7.7A1.75 1.75 0 1 1 6.5 4.2a1.75 1.75 0 0 1 0 3.5ZM19 18h-3v-4.4c0-1.05-.02-2.4-1.47-2.4-1.47 0-1.7 1.15-1.7 2.32V18h-3V9h2.88v1.23h.04c.4-.75 1.38-1.53 2.84-1.53 3.03 0 3.59 1.99 3.59 4.57V18Z"/>
    </svg>
    LinkedIn
  </a>

  <a href="https://www.instagram.com/adriannbagas/" aria-label="Instagram">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#E4405F">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/>
    </svg>
    Instagram
  </a>

  <a href="https://open.spotify.com/user/5fpdsg5yi0i6j2eyb615ds9ne?si=2c66f2b64b3d4b13" aria-label="Spotify">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1DB954">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.75.75 0 0 1-1.03.25c-2.83-1.73-6.4-2.12-10.6-1.16a.75.75 0 1 1-.34-1.46c4.6-1.05 8.55-.6 11.72 1.34.36.22.47.68.25 1.03Zm1.47-3.28a.94.94 0 0 1-1.29.31c-3.24-1.99-8.18-2.57-12.01-1.4a.94.94 0 1 1-.55-1.8c4.38-1.33 9.82-.69 13.54 1.6.44.27.58.85.31 1.29Zm.13-3.42c-3.89-2.31-10.31-2.52-14.02-1.39a1.13 1.13 0 1 1-.66-2.16c4.26-1.3 11.35-1.05 15.82 1.6a1.13 1.13 0 0 1-1.14 1.95Z"/>
    </svg>
    Spotify
  </a>
</div>

  <span>© ${new Date().getFullYear()} Paragraf Satu Minggu</span>
</footer>
`;

const articleList = document.querySelector('#article-list');
const categoryList = document.querySelector('#category-list');
const searchInput = document.querySelector('#search-input');
const clearSearch = document.querySelector('#clear-search');
const resultsLabel = document.querySelector('#results-label');
const resultsCount = document.querySelector('#results-count');

let articles = [];
let selectedCategory = 'Semua';
let searchTerm = '';
let loadingError = false;
let featuredIndex = 0;
let featuredTimer = null;

function renderFeaturedArticle() {
  const container = document.querySelector('#featured-article');

  if (!container) return;

  if (!articles.length) {
    container.innerHTML = `
      <div class="featured-empty">
        <p>Belum ada tulisan yang dipublikasikan.</p>
      </div>
    `;
    return;
  }

  const article = articles[featuredIndex % articles.length];

  container.innerHTML = `
    <article class="featured-article">
      <div class="featured-copy">
        <span class="featured-kicker">TULISAN PILIHAN</span>

        <span class="featured-category">
          ${escapeHTML(article.category || 'Catatan')}
        </span>

        <h2>${escapeHTML(article.title)}</h2>

        <p>
          ${escapeHTML(
            article.excerpt || 'Sebuah tulisan untuk dibaca dan direnungkan.'
          )}
        </p>

        <div class="featured-footer">
          <span>
            ${escapeHTML(formatDate(article.created_at))}
            · ${readingTime(article.content)} menit membaca
          </span>

          <a href="${articleHref(article.slug)}">
            Baca selengkapnya ↗
          </a>
        </div>
      </div>

      <a
        class="featured-visual"
        href="${articleHref(article.slug)}"
        aria-label="Baca ${escapeHTML(article.title)}"
      >
        ${imageMarkup(article, 'featured-image')}
      </a>
    </article>
  `;
}

function startFeaturedRotation() {
  clearInterval(featuredTimer);

  if (articles.length <= 1) return;

  featuredTimer = setInterval(() => {
    featuredIndex = (featuredIndex + 1) % articles.length;
    renderFeaturedArticle();
  }, 7000);
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function safeImageUrl(value) {
  if (!value) return '';

  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol)
      ? url.href
      : '';
  } catch {
    return '';
  }
}

function formatDate(value) {
  if (!value) return 'Catatan';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Catatan';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function readingTime(content = '') {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatArticleContent(content = '') {
  return String(content)
    .trim()
    .split(/\n\s*\n/)
    .filter(paragraph => paragraph.trim())
    .map(paragraph => `
      <p>${escapeHTML(paragraph).replace(/\n/g, '<br>')}</p>
    `)
    .join('');
}

function articleHref(slug) {
  return `/artikel/${encodeURIComponent(slug)}`;
}

function imageMarkup(article, className = 'article-image') {
  const url = safeImageUrl(article.cover_image);

  if (!url) {
    return `
      <div class="${className} image-placeholder">
        <span>PARAGRAF.</span>
      </div>
    `;
  }

  return `
    <img
      class="${className}"
      src="${escapeHTML(url)}"
      alt="Sampul ${escapeHTML(article.title)}"
      loading="lazy"
      onerror="this.replaceWith(Object.assign(document.createElement('div'), {
        className: '${className} image-placeholder',
        textContent: 'PARAGRAF.'
      }))"
    >
  `;
}

function renderCategories() {
  const categories = [
    'Semua',
    ...new Set(
      articles.map((item) => item.category || 'Catatan')
    )
  ];

  categoryList.innerHTML = categories.map((category) => `
    <button
      class="category-chip ${category === selectedCategory ? 'active' : ''}"
      data-category="${escapeHTML(category)}"
      type="button"
    >${escapeHTML(category)}</button>
  `).join('');

  categoryList.querySelectorAll('.category-chip').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category;
      renderCategories();
      renderArticles();
    });
  });
}

function getFilteredArticles() {
  return articles.filter((article) => {
    const category = article.category || 'Catatan';
    const matchesCategory =
      selectedCategory === 'Semua' || category === selectedCategory;

    const searchableText = [
      article.title,
      article.excerpt,
      article.content,
      category
    ].join(' ').toLocaleLowerCase('id-ID');

    return matchesCategory &&
      searchableText.includes(searchTerm.toLocaleLowerCase('id-ID'));
  });
}

function renderArticles() {
  if (loadingError) {
    resultsCount.textContent = '';
    articleList.innerHTML = `
      <div class="empty-state">
        <h3>Tulisan belum dapat dimuat.</h3>
        <p>Periksa koneksi Supabase dan kebijakan akses artikel.</p>
        <button class="button button-dark" id="retry-load" type="button">
          Coba lagi
        </button>
      </div>
    `;
    document.querySelector('#retry-load')
      .addEventListener('click', loadArticles);
    return;
  }

  const filtered = getFilteredArticles();
  resultsCount.textContent = `${filtered.length} tulisan`;

  if (!filtered.length) {
    articleList.innerHTML = `
      <div class="empty-state">
        <h3>Belum menemukan tulisan.</h3>
        <p>Coba kata kunci atau kategori yang berbeda.</p>
      </div>
    `;
    return;
  }

  articleList.innerHTML = filtered.map((article, index) => `
    <article class="article-card">
      <a class="article-cover" href="${articleHref(article.slug)}"
        aria-label="Baca ${escapeHTML(article.title)}">
        ${imageMarkup(article)}
        <span class="cover-index">${String(index + 1).padStart(2, '0')}</span>
      </a>

      <div class="card-meta">
        <span>${escapeHTML(article.category || 'Catatan')}</span>
        <span>${escapeHTML(formatDate(article.created_at))}</span>
      </div>

      <h3>
        <a href="${articleHref(article.slug)}">
          ${escapeHTML(article.title)}
        </a>
      </h3>

      <p class="article-excerpt">
        ${escapeHTML(article.excerpt || 'Sebuah catatan untuk direnungkan.')}
      </p>

      <div class="card-bottom">
        <span>${readingTime(article.content)} menit membaca</span>
        <a class="read-link" href="${articleHref(article.slug)}">
          Baca tulisan ↗
        </a>
      </div>
    </article>
  `).join('');
}

function renderReadingPage(article) {
  const readingPage = document.querySelector('#reading-page');
  const contentPage = document.querySelector('#public-page');

  contentPage.hidden = true;
  readingPage.hidden = false;

  readingPage.innerHTML = `
    <div class="reading-toolbar">
      <a class="text-link" href="/#artikel">← Kembali ke tulisan</a>
      <span class="reading-progress-label">MEMBACA</span>
    </div>

    <article class="reading-article">
      <header class="reading-header">
        <p class="eyebrow">${escapeHTML(article.category || 'Catatan')}</p>
        <h1>${escapeHTML(article.title)}</h1>
        <p class="reading-excerpt">
          ${escapeHTML(article.excerpt || '')}
        </p>
        <div class="reading-meta">
          <span>${escapeHTML(formatDate(article.created_at))}</span>
          <span>${readingTime(article.content)} menit membaca</span>
        </div>
      </header>

      ${article.cover_image
        ? `<div class="reading-cover">${imageMarkup(article, 'reading-image')}</div>`
        : ''}

      <div class="reading-body">${escapeHTML(article.content)}</div>

      <div class="reading-end">
        <span>—</span>
        <p>Terima kasih sudah meluangkan waktu untuk membaca.</p>
        <a class="button button-dark" href="/#artikel">Temukan tulisan lain ↗</a>
      </div>
    </article>
  `;

  window.scrollTo({ top: 0, behavior: 'instant' });
  setupReadingProgress();
}

function setupReadingProgress() {
  const update = () => {
    const body = document.querySelector('.reading-body');
    if (!body) return;

    const rect = body.getBoundingClientRect();
    const total = body.offsetHeight - window.innerHeight;
    const progress = total <= 0
      ? 100
      : Math.min(100, Math.max(0, (-rect.top / total) * 100));

    const label = document.querySelector('.reading-progress-label');
    if (label) label.textContent = `${Math.round(progress)}% DIBACA`;
  };

  window.removeEventListener('scroll', window._readingProgress);
  window._readingProgress = update;
  window.addEventListener('scroll', update, { passive: true });
  update();
}

async function handleRoute() {
  const publicPage = document.querySelector('#public-page');
  const readingPage = document.querySelector('#reading-page');

  const pathMatch = location.pathname.match(/^\/artikel\/([^/]+)\/?$/);
  const hashMatch = location.hash.match(/^#baca\/(.+)$/);
  const match = pathMatch || hashMatch;

  if (!match) {
    readingPage.hidden = true;
    publicPage.hidden = false;
    window.removeEventListener('scroll', window._readingProgress);
    return;
  }

  let slug;

  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    history.replaceState(null, '', '/#artikel');
    return;
  }

  publicPage.hidden = true;
  readingPage.hidden = false;
  readingPage.innerHTML = '<p class="loading-message">Memuat tulisan...</p>';

  let article = articles.find((item) => item.slug === slug);

  if (!article) {
    const { data, error } = await supabase
      .from('articles')
      .select('id,title,slug,excerpt,content,published,created_at,category,cover_image')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      readingPage.innerHTML = `
        <div class="empty-state">
          <h3>Tulisan tidak ditemukan.</h3>
          <a class="text-link" href="/#artikel">Kembali ke daftar tulisan</a>
        </div>
      `;
      return;
    }

    article = data;
  }

  renderReadingPage(article);
}

async function loadArticles() {
  loadingError = false;
  articleList.innerHTML = '<p class="loading-message">Memuat tulisan...</p>';

  const { data, error } = await supabase
    .from('articles')
    .select('id,title,slug,excerpt,content,published,created_at,category,cover_image')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal memuat artikel:', error);
    loadingError = true;
    renderArticles();
    return;
  }

  articles = data || [];

  featuredIndex = 0;

  renderFeaturedArticle();
  startFeaturedRotation();

  renderCategories();
  renderArticles();

  if (
  location.pathname.startsWith('/artikel/') ||
  location.hash.startsWith('#baca/')
) {
  handleRoute();
  }
}

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim();
  clearSearch.hidden = !searchTerm;
  renderArticles();
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchTerm = '';
  clearSearch.hidden = true;
  renderArticles();
  searchInput.focus();
});

window.addEventListener('hashchange', handleRoute);

const publicPage = document.createElement('div');
publicPage.id = 'public-page';
publicPage.innerHTML = '';
const readingPage = document.createElement('div');
readingPage.id = 'reading-page';
readingPage.hidden = true;

const main = document.querySelector('main');
main.appendChild(readingPage);

const originalSections = [...main.children].filter(
  (element) => element !== readingPage
);

const publicWrapper = document.createElement('div');
publicWrapper.id = 'public-page';
originalSections.forEach((element) => publicWrapper.appendChild(element));
main.insertBefore(publicWrapper, readingPage);
// =====================================
// RUANG CATATAN PENGUNJUNG
// =====================================

const visitorNoteForm = document.querySelector('#visitor-note-form');
const visitorNotesList = document.querySelector('#visitor-notes-list');
const visitorNotesCount = document.querySelector('#visitor-notes-count');
const visitorFormMessage = document.querySelector('#visitor-form-message');
const visitorSubmit = document.querySelector('#visitor-submit');

function renderVisitorNotes(notes) {
  visitorNotesCount.textContent = `${notes.length} CATATAN`;

  if (!notes.length) {
    visitorNotesList.innerHTML = `
      <div class="visitor-empty">
        <span>✳</span>
        <h4>Ruang ini masih menunggu cerita.</h4>
        <p>Jadilah salah satu orang pertama yang meninggalkan catatan.</p>
      </div>
    `;
    return;
  }

  visitorNotesList.innerHTML = notes.map((note, index) => `
    <article class="visitor-note-card">
      <div class="visitor-note-top">
        <span>CATATAN ${String(index + 1).padStart(2, '0')}</span>
        <span>${escapeHTML(formatDate(note.created_at))}</span>
      </div>
      <h4>${escapeHTML(note.title)}</h4>
      <p class="visitor-note-content">${escapeHTML(note.content)}</p>
      <span class="visitor-note-author">
        — ${escapeHTML(note.pen_name)}
      </span>
    </article>
  `).join('');
}

async function loadVisitorNotes() {
  visitorNotesList.innerHTML = '<p class="loading-message">Memuat catatan...</p>';

  const { data, error } = await supabase
    .from('visitor_notes')
    .select('id,pen_name,title,content,created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Gagal memuat catatan pengunjung:', error);
    visitorNotesList.innerHTML = `
      <p class="visitor-error">
        Catatan belum dapat dimuat. Silakan coba beberapa saat lagi.
      </p>
    `;
    visitorNotesCount.textContent = '';
    return;
  }

  renderVisitorNotes(data || []);
}

visitorNoteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const penName = document.querySelector('#visitor-name').value.trim();
  const title = document.querySelector('#visitor-title').value.trim();
  const content = document.querySelector('#visitor-content').value.trim();

  if (!penName || !title || !content) {
    visitorFormMessage.textContent = 'Semua bagian perlu diisi terlebih dahulu.';
    return;
  }

  if (penName.length > 40 || title.length > 100 || content.length > 2000) {
    visitorFormMessage.textContent = 'Ada bagian yang melebihi batas karakter.';
    return;
  }

  visitorSubmit.disabled = true;
  visitorSubmit.textContent = 'Mengirim...';
  visitorFormMessage.textContent = '';

  const { error } = await supabase
    .from('visitor_notes')
    .insert({
      pen_name: penName,
      title,
      content,
      status: 'pending'
    });

  visitorSubmit.disabled = false;
  visitorSubmit.textContent = 'Kirim catatan ↗';

  if (error) {
    console.error('Gagal mengirim catatan:', error);
    visitorFormMessage.textContent =
      'Catatan belum berhasil dikirim. Silakan coba kembali.';
    return;
  }

  visitorNoteForm.reset();
  visitorFormMessage.textContent =
    'Terima kasih! Catatanmu sudah diterima dan menunggu pemeriksaan.';
});

loadVisitorNotes();
loadArticles();
mountNewsletter();
