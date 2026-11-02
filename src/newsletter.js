
import { supabase } from './supabase.js';

export function mountNewsletter() {
  // Mencegah bagian newsletter dibuat berulang kali.
  if (document.querySelector('#newsletter-section')) return;

  const section = document.createElement('section');
  section.id = 'newsletter-section';
  section.className = 'newsletter-section';

  section.innerHTML = `
    <div class="newsletter-content">
      <span class="newsletter-label">NEWSLETTER</span>

      <h2>Satu tulisan baru, satu sudut pandang baru.</h2>

      <p>
        Dapatkan notifikasi melalui email setiap kali tulisan baru
        diterbitkan di Paragraf Satu Minggu.
      </p>
    </div>

    <form id="newsletter-form" class="newsletter-form">
      <label for="newsletter-name">Nama</label>

      <input
        id="newsletter-name"
        name="name"
        type="text"
        placeholder="Nama kamu"
        maxlength="100"
        autocomplete="name"
        required
      />

      <label for="newsletter-email">Alamat email</label>

      <input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="nama@email.com"
        maxlength="254"
        autocomplete="email"
        required
      />

      <div class="newsletter-consent">
        <input
          id="newsletter-consent"
          name="consent"
          type="checkbox"
          required
        />

        <label for="newsletter-consent">
          Saya bersedia menerima notifikasi artikel terbaru melalui email.
        </label>
      </div>

      <div class="newsletter-honeypot" aria-hidden="true">
        <label for="newsletter-website">Website</label>

        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <button type="submit" id="newsletter-submit">
        Berlangganan Gratis
      </button>

      <p
        id="newsletter-message"
        role="status"
        aria-live="polite"
      ></p>
    </form>
  `;

  // Menempatkan newsletter sebelum footer.
  const footer = document.querySelector('footer');
  const app = document.querySelector('#app');

  if (footer) {
    footer.before(section);
  } else if (app) {
    app.appendChild(section);
  } else {
    console.error('Newsletter gagal ditampilkan: elemen #app tidak ditemukan.');
    return;
  }

  const form = section.querySelector('#newsletter-form');
  const button = section.querySelector('#newsletter-submit');
  const message = section.querySelector('#newsletter-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    // Mengabaikan kiriman yang mengisi kolom honeypot.
    if (form.elements.website.value.trim()) return;

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim().toLowerCase();
    const consent = form.elements.consent.checked;

    if (!name || !email || !consent) return;

    button.disabled = true;
    button.textContent = 'Memproses...';
    message.textContent = '';

    try {
      const { data, error } = await supabase.functions.invoke(
        'newsletter-confirm',
        {
          body: {
            action: 'subscribe',
            name,
            email
          }
        }
      );

      if (error) {
        console.error('Newsletter function error:', error);

        message.textContent =
          'Pendaftaran belum berhasil. Silakan coba kembali.';
        return;
      }

      if (data?.error) {
        console.error('Newsletter response error:', data.error);

        message.textContent =
          'Pendaftaran belum berhasil. Silakan coba kembali.';
        return;
      }

      message.textContent =
        data?.message ||
        'Pendaftaran diterima. Silakan periksa email untuk mengonfirmasi langganan.';

      form.reset();
    } catch (error) {
      console.error('Newsletter error:', error);

      message.textContent =
        'Terjadi masalah koneksi. Silakan coba kembali.';
    } finally {
      button.disabled = false;
      button.textContent = 'Berlangganan Gratis';
    }
  });
}
