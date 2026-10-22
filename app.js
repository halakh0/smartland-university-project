const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل');
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeId = entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`));
  });
}, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const videoButton = document.querySelector('#video-button');
videoButton?.addEventListener('click', () => {
  videoButton.classList.toggle('is-playing');
  videoButton.setAttribute('aria-label', videoButton.classList.contains('is-playing') ? 'إيقاف الفيديو التعريفي' : 'تشغيل الفيديو التعريفي');
});

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = 'تم استلام الطلب <span class="arrow">✓</span>';
  formStatus.textContent = 'شكرًا — سنتواصل معك قريبًا.';
  formStatus.style.color = '#169d87';
});

const year = document.querySelector('.footer-bottom span');
if (year) year.textContent = `© ${new Date().getFullYear()} Smart Land. جميع الحقوق محفوظة.`;

const languageSwitch = document.querySelector('#language-switch');
const applyGoogleLanguage = (language, attempts = 0) => {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = language === 'en' ? 'en' : '';
    combo.dispatchEvent(new Event('change'));
    document.documentElement.lang = language === 'en' ? 'en' : 'ar';
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    if (languageSwitch) {
      languageSwitch.dataset.language = language === 'en' ? 'ar' : 'en';
      languageSwitch.textContent = language === 'en' ? 'العربية' : 'English';
      languageSwitch.setAttribute('aria-label', language === 'en' ? 'العودة إلى العربية' : 'Switch to English');
      setIntroVideoLanguage(language);
    }
    return;
  }
  if (attempts < 20) window.setTimeout(() => applyGoogleLanguage(language, attempts + 1), 250);
};
languageSwitch?.addEventListener('click', () => applyGoogleLanguage(languageSwitch.dataset.language || 'en'));
const introVideos = {
  ar: document.querySelector('#intro-video-ar'),
  en: document.querySelector('#intro-video-en')
};
const setIntroVideoLanguage = (language) => {
  const english = language === 'en';
  Object.entries(introVideos).forEach(([key, video]) => {
    if (!video) return;
    const active = english ? key === 'en' : key === 'ar';
    video.classList.toggle('is-active', active);
    video.hidden = !active;
    if (!active) video.pause();
  });
};
setIntroVideoLanguage('ar');