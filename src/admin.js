
import './style.css';
import { supabase } from './supabase.js';

const root = document.querySelector('#admin-app');

let currentUser = null;
let editingId = null;
let articles = [];
let busy = false;

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function showMessage(message, type = 'error') {
  const box = document.querySelector('#admin-message');
  if (!box) return;

  box.textContent = message;
  box.className = `admin-message ${type}`;
}

function slugify(value) {
  return value
    .toLocaleLowerCase('id-ID')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

function validImageUrl(value) {
  if (!value) return true;

  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(date);
}

function renderLogin(message = '') {
  root.innerHTML = `
    <main class="login-panel admin-panel">
      <a class="brand admin-brand" href="/">
        <img src="/psm.png" alt="Paragraf Satu Minggu">
      </a>
      <p class="eyebrow" style="margin-top:28px">AREA PENGELOLA</p>
      <h1>Selamat datang kembali.</h1>
      <p>Masuk menggunakan akun admin yang telah terdaftar.</p>

      <form id="login-form">
        <div class="form-field">
          <label for="login-email">Email</label>
          <input id="login-email" name="email"
            type="email" autocomplete="username" required>
        </div>

        <div class="form-field">
          <label for="login-password">Password</label>
          <input id="login-password" name="password"
            type="password" autocomplete="current-password" required>
        </div>

        <button class="button button-dark" type="submit" id="login-button">
          Masuk ke dashboard ↗
        </button>
      </form>

      <p id="admin-message" class="admin-message error"
        role="status">${escapeHTML(message)}</p>
      <a class="text-link" href="/">← Kembali ke website</a>
    </main>
  `;

  document.querySelector('#login-form')
    .addEventListener('submit', handleLogin);
}

function renderDashboard() {
  root.innerHTML = `
    <div class="admin-shell">
      <header class="admin-topbar">
        <a class="brand admin-brand" href="/">
          <img src="/psm.png" alt="Paragraf Satu Minggu">
        </a>
        <div>
          <span style="font-size:11px;color:#777;margin-right:12px">
            ${escapeHTML(currentUser?.email || '')}
          </span>
          <button class="button button-light" id="logout-button" type="button">
            Keluar
          </button>
        </div>
      </header>

      <main class="admin-layout">
        <section class="admin-panel">
          <p class="eyebrow">RUANG REDAKSI</p>
          <h1 id="form-heading">Tulis artikel baru.</h1>
          <p style="color:#777;font-size:12px;line-height:1.8">
            Artikel draft hanya tersedia bagi admin. Artikel terbit
            dapat dibaca oleh pengunjung.
          </p>

          <form id="article-form">
            <div class="form-field">
              <label for="article-title">Judul artikel *</label>
              <input id="article-title" name="title"
                maxlength="180" required>
            </div>

            <div class="form-field">
              <label for="article-slug">Slug URL *</label>
              <input id="article-slug" name="slug"
                maxlength="120" pattern="[a-z0-9]+(-[a-z0-9]+)*"
                required>
              <p class="form-hint">
                Contoh: belajar-menikmati-proses
              </p>
            </div>

            <div class="form-field">
              <label for="article-category">Kategori *</label>
              <select id="article-category" name="category" required>
                <option value="Catatan">Catatan</option>
                <option value="Kehidupan">Kehidupan</option>
                <option value="Pengalaman">Pengalaman</option>
                <option value="Pembelajaran">Pembelajaran</option>
                <option value="Pemikiran">Pemikiran</option>
                <option value="Teknologi">Teknologi</option>
              </select>
            </div>

            <div class="form-field">
              <label for="article-cover">URL gambar sampul</label>
              <input id="article-cover" name="cover_image"
                type="url" placeholder="https://...">
              <p class="form-hint">
                Gunakan URL gambar HTTPS yang dapat diakses publik.
              </p>
            </div>

            <div class="form-field">
              <label for="article-excerpt">Ringkasan artikel</label>
              <textarea id="article-excerpt" name="excerpt"
                maxlength="500" style="min-height:85px"></textarea>
            </div>

            <div class="form-field">
              <label for="article-content">Isi artikel *</label>
              <textarea id="article-content" name="content"
                minlength="1" required></textarea>
            </div>

            <label class="form-check">
              <input id="article-published" name="published"
                type="checkbox">
              Terbitkan artikel sekarang
            </label>

            <div class="form-actions">
              <button class="button button-dark" type="submit" id="save-button">
                Simpan artikel
              </button>
              <button class="button button-light" type="button" id="reset-button">
                Batal / artikel baru
              </button>
            </div>
          </form>

          <p id="admin-message" class="admin-message" role="status"></p>
        </section>

        <section class="admin-panel">
          <p class="eyebrow">ARSIP TULISAN</p>
          <h2>Semua artikel</h2>
          <p id="article-summary" style="color:#777;font-size:12px">
            Memuat artikel...
          </p>
          <div id="admin-article-list" class="admin-article-list"></div>
        </section>
      </main>
    </div>
  `;

  document.querySelector('#logout-button')
    .addEventListener('click', handleLogout);

  document.querySelector('#article-form')
    .addEventListener('submit', handleSave);

  document.querySelector('#reset-button')
    .addEventListener('click', resetForm);

  document.querySelector('#article-title')
    .addEventListener('input', () => {
      if (!editingId) {
        document.querySelector('#article-slug').value =
          slugify(document.querySelector('#article-title').value);
      }
    });

  document.querySelector('#admin-article-list')
    .addEventListener('click', handleArticleAction);

  loadAdminArticles();
}

async function verifyAdmin() {
  const { data, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('Gagal memeriksa hak admin:', error);
    throw new Error(
      'Tidak dapat memeriksa hak admin. Periksa fungsi is_admin() dan akses Supabase.'
    );
  }

  if (data !== true) {
    throw new Error('Akun ini tidak terdaftar sebagai admin.');
  }

  return true;
}

async function handleLogin(event) {
  event.preventDefault();

  const button = document.querySelector('#login-button');
  button.disabled = true;
  button.textContent = 'Memeriksa akun...';

  const form = new FormData(event.currentTarget);
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    currentUser = data.user;
    await verifyAdmin();
    renderDashboard();
  } catch (error) {
    console.error('Login admin gagal:', error);

    await supabase.auth.signOut();
    currentUser = null;
    renderLogin(
      error.message === 'Invalid login credentials'
        ? 'Email atau password tidak sesuai.'
        : error.message
    );
  }
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showMessage('Gagal keluar: ' + error.message);
    return;
  }

  currentUser = null;
  articles = [];
  renderLogin();
}

async function loadAdminArticles() {
  const list = document.querySelector('#admin-article-list');
  const summary = document.querySelector('#article-summary');

  list.innerHTML = '<p>Memuat artikel...</p>';

  const { data, error } = await supabase
    .from('articles')
    .select('id,title,slug,excerpt,content,published,created_at,updated_at,category,cover_image')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal memuat artikel admin:', error);
    summary.textContent = 'Artikel gagal dimuat.';
    list.innerHTML = `
      <p class="admin-message error">
        ${escapeHTML(error.message)}
      </p>
    `;
    return;
  }

  articles = data || [];
  summary.textContent = `${articles.length} artikel tersimpan`;

  if (!articles.length) {
    list.innerHTML = '<p>Belum ada artikel. Silakan buat tulisan pertama.</p>';
    return;
  }


list.innerHTML = articles.map((article) => `
  <article class="admin-article-item">
    <div class="admin-article-info">
      <div class="admin-article-meta">
        <span class="admin-category">
          ${escapeHTML(article.category || 'Catatan')}
        </span>

        <span class="admin-status ${article.published ? 'published' : 'draft'}">
          ${article.published ? 'Terbit' : 'Draft'}
        </span>
      </div>

      <h3>${escapeHTML(article.title)}</h3>

      <p class="admin-article-date">
        Dibuat ${escapeHTML(formatDate(article.created_at))}
      </p>
    </div>

    <div class="admin-item-actions">
      <button type="button" data-action="edit"
        data-id="${escapeHTML(article.id)}">Edit</button>

      <button type="button" data-action="toggle"
        data-id="${escapeHTML(article.id)}">
        ${article.published ? 'Jadikan draft' : 'Terbitkan'}
      </button>

      <button type="button" data-action="delete"
        data-id="${escapeHTML(article.id)}">Hapus</button>
    </div>
  </article>
`).join('');
}

function resetForm() {
  editingId = null;
  document.querySelector('#article-form').reset();
  document.querySelector('#article-slug').readOnly = false;
  document.querySelector('#form-heading').textContent = 'Tulis artikel baru.';
  document.querySelector('#save-button').textContent = 'Simpan artikel';
  showMessage('');
}

function fillForm(article) {
  editingId = article.id;

  document.querySelector('#article-title').value = article.title || '';
  document.querySelector('#article-slug').value = article.slug || '';
  document.querySelector('#article-category').value =
    article.category || 'Catatan';
  document.querySelector('#article-cover').value =
    article.cover_image || '';
  document.querySelector('#article-excerpt').value =
    article.excerpt || '';
  document.querySelector('#article-content').value =
    article.content || '';
  document.querySelector('#article-published').checked =
    article.published === true;

  document.querySelector('#article-slug').readOnly = false;
  document.querySelector('#form-heading').textContent = 'Edit artikel.';
  document.querySelector('#save-button').textContent = 'Simpan perubahan';

  showMessage(`Mengedit: ${article.title}`, 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleSave(event) {
  event.preventDefault();

  if (busy) return;

  busy = true;
  const button = document.querySelector('#save-button');
  button.disabled = true;

  try {
    await verifyAdmin();

    const title = document.querySelector('#article-title').value.trim();
    const slug = slugify(
      document.querySelector('#article-slug').value.trim()
    );
    const category = document.querySelector('#article-category').value;
    const coverImage = document.querySelector('#article-cover').value.trim();
    const excerpt = document.querySelector('#article-excerpt').value.trim();
    const content = document.querySelector('#article-content').value.trim();
    const published = document.querySelector('#article-published').checked;

    if (!title || !slug || !content) {
      throw new Error('Judul, slug, dan isi artikel wajib diisi.');
    }

    if (!validImageUrl(coverImage)) {
      throw new Error('URL gambar harus menggunakan alamat HTTP atau HTTPS yang valid.');
    }

    const payload = {
      title,
      slug,
      category,
      cover_image: coverImage || null,
      excerpt: excerpt || null,
      content,
      published,
      updated_at: new Date().toISOString()
    };

    let result;

    if (editingId !== null) {
      result = await supabase
        .from('articles')
        .update(payload)
        .eq('id', editingId)
        .select('id')
        .maybeSingle();
    } else {
      result = await supabase
        .from('articles')
        .insert(payload)
        .select('id')
        .single();
    }

    if (result.error) throw result.error;
    if (!result.data) {
      throw new Error('Artikel tidak tersimpan. Periksa hak akses admin.');
    }

    resetForm();
    showMessage('Artikel berhasil disimpan.', 'success');
    await loadAdminArticles();
  } catch (error) {
    console.error('Gagal menyimpan artikel:', error);
    showMessage(
      error.code === '23505'
        ? 'Slug sudah digunakan. Gunakan slug yang berbeda.'
        : error.message
    );
  } finally {
    busy = false;

    const button = document.querySelector('#save-button');
    if (button) button.disabled = false;
  }
}

async function handleArticleAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button || busy) return;

  const article = articles.find(
    (item) => String(item.id) === button.dataset.id
  );

  if (!article) return;

  const action = button.dataset.action;

  if (action === 'edit') {
    fillForm(article);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm(
      `Hapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;
  }

  busy = true;
  button.disabled = true;

  try {
    await verifyAdmin();

    let result;

    if (action === 'toggle') {
      result = await supabase
        .from('articles')
        .update({
          published: !article.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)
        .select('id')
        .maybeSingle();
    } else if (action === 'delete') {
      result = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id)
        .select('id')
        .maybeSingle();
    }

    if (result?.error) throw result.error;
    if (!result?.data) {
      throw new Error('Perubahan gagal. Periksa hak akses admin.');
    }

    showMessage(
      action === 'delete'
        ? 'Artikel berhasil dihapus.'
        : 'Status publikasi berhasil diubah.',
      'success'
    );

    await loadAdminArticles();
  } catch (error) {
    console.error('Gagal mengubah artikel:', error);
    showMessage(error.message);
  } finally {
    busy = false;
  }
}

async function init() {
  renderLogin();

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    renderLogin('Gagal memeriksa sesi. Silakan coba lagi.');
    return;
  }

  if (!data.session) return;

  currentUser = data.session.user;

  try {
    await verifyAdmin();
    renderDashboard();
  } catch (error) {
    await supabase.auth.signOut();
    currentUser = null;
    renderLogin(error.message);
  }
}

init();
