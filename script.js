// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== THEME TOGGLE =====
const applyTheme = (theme) => {
    const isLight = theme === 'light';
    body.classList.toggle('light-mode', isLight);
    const icon = themeToggle?.querySelector('i');

    if (icon) {
        icon.classList.toggle('fa-sun', isLight);
        icon.classList.toggle('fa-moon', !isLight);
    }

    localStorage.setItem('theme', theme);
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    applyTheme('light');
} else {
    applyTheme('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.contains('light-mode');
        applyTheme(isLight ? 'dark' : 'light');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat .num');
let animated = false;

const animateStats = () => {
    stats.forEach(stat => {
        const target = Number(stat.dataset.count);
        const isDecimal = !Number.isInteger(target);
        let current = 0;
        const increment = target / 50;

        const update = () => {
            current += increment;
            if (current >= target) {
                stat.textContent = isDecimal ? Number(target).toFixed(1) : target;
                return;
            }
            stat.textContent = isDecimal ? Number(current).toFixed(1) : Math.floor(current);
            requestAnimationFrame(update);
        };

        update();
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            animated = true;
            animateStats();
        }
    });
}, { threshold: 0.3 });

observer.observe(document.getElementById('about'));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

const setFormStatus = (message, type = '') => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status${type ? ` ${type}` : ''}`;
};

const setSubmitButtonState = (isLoading) => {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.innerHTML = isLoading
        ? '<i class="fas fa-paper-plane"></i> Sending...'
        : '<i class="fas fa-paper-plane"></i> Send Message';
};

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = this.querySelector('input[name="name"]').value.trim();
        const email = this.querySelector('input[name="email"]').value.trim();
        const msg = this.querySelector('textarea[name="message"]').value.trim();

        if (!name || !email || !msg) {
            alert('Please fill all fields.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Enter a valid email.');
            return;
        }

        setSubmitButtonState(true);
        setFormStatus('');

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: new FormData(this)
            });

            if (!response.ok) {
                throw new Error('Formspree submission failed');
            }

            setFormStatus('Message sent successfully! Thank you for reaching out.', 'success');
            this.reset();
        } catch (error) {
            setFormStatus('Something went wrong. Please try again.', 'error');
        } finally {
            setSubmitButtonState(false);
        }
    });
}

// ===== RESUME =====
const downloadResume = document.getElementById('downloadResume');
if (downloadResume) {
    downloadResume.addEventListener('click', () => {
        const resumeFile = './Resume.pdf';
        fetch(resumeFile, { method: 'HEAD' })
            .then((response) => {
                if (response.ok) {
                    const link = document.createElement('a');
                    link.href = resumeFile;
                    link.download = 'Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert('Resume file not added yet. Please place Resume.pdf in the project root to enable the Resume button.');
                }
            })
            .catch(() => {
                alert('Resume file not added yet. Please place Resume.pdf in the project root to enable the Resume button.');
            });
    });
}

// ===== NAV SCROLL =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (!nav) return;

    const isLight = body.classList.contains('light-mode');
    nav.style.background = window.scrollY > 80
        ? (isLight ? 'rgba(255,255,255,0.92)' : 'rgba(11,11,18,0.95)')
        : (isLight ? 'rgba(255,255,255,0.8)' : 'rgba(11,11,18,0.9)');
});

// ===== ESC TO CLOSE MENU =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navLinks.classList.remove('active');
});

console.log('🚀 Shiva Sharma Portfolio v2 loaded!');