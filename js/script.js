// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50
    });

    // Get guest name from URL parameter
    initGuestName();

    // Setup event listeners
    setupCoverButton();
    setupMusicToggle();
    setupCountdown();
    setupGalleryLightbox();
    setupRSVPForm();
    setupCopyButtons();
    createFloatingHearts();
});


// ==================== GUEST NAME FROM URL ====================
function initGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameEl = document.getElementById('guestName');

    if (guestName && guestNameEl) {
        guestNameEl.textContent = decodeURIComponent(guestName);
    }

    // Also pre-fill the RSVP form name
    const namaInput = document.getElementById('namaTamu');
    if (guestName && namaInput) {
        namaInput.value = decodeURIComponent(guestName);
    }
}

// ==================== COVER / OPEN INVITATION ====================
function setupCoverButton() {
    const openBtn = document.getElementById('openInvitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');

    if (openBtn) {
        openBtn.addEventListener('click', function () {
            // Hide cover with animation
            cover.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            cover.style.opacity = '0';
            cover.style.transform = 'scale(1.05)';

            setTimeout(function () {
                cover.style.display = 'none';
                mainContent.classList.remove('hidden');

                // Start background music
                if (bgMusic) {
                    bgMusic.volume = 0.5;
                    bgMusic.play().then(function () {
                        musicBtn.classList.add('playing');
                    }).catch(function (err) {
                        console.log('Autoplay prevented:', err);
                    });
                }

                // Smooth scroll to top of main content
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Re-initialize AOS after content is visible
                setTimeout(function () {
                    AOS.refresh();
                }, 100);
            }, 800);
        });
    }
}

// ==================== MUSIC TOGGLE ====================
function setupMusicToggle() {
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', function () {
            if (bgMusic.paused) {
                bgMusic.play().then(function () {
                    musicBtn.classList.add('playing');
                    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
                }).catch(function (err) {
                    console.log('Play failed:', err);
                });
            } else {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });
    }
}


// ==================== COUNTDOWN TIMER ====================
function setupCountdown() {
    // Set wedding date - 15 Juli 2026 08:00 WIB (UTC+7)
    const weddingDate = new Date('2026-07-15T08:00:00+07:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==================== GALLERY LIGHTBOX ====================
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(function (img) {
        img.addEventListener('click', function () {
            lightboxImg.src = this.src.replace('w=400', 'w=1200');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}


// ==================== RSVP FORM ====================
function setupRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nama = document.getElementById('namaTamu').value.trim();
            const kehadiran = document.getElementById('kehadiran').value;
            const ucapan = document.getElementById('ucapan').value.trim();

            if (!nama || !kehadiran || !ucapan) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }

            // Create wish element
            const wishItem = document.createElement('div');
            wishItem.className = 'wish-item';
            wishItem.style.opacity = '0';
            wishItem.style.transform = 'translateX(-10px)';

            const badgeClass = kehadiran === 'hadir' ? 'hadir' : kehadiran === 'tidak' ? 'tidak' : 'ragu';
            const badgeText = kehadiran === 'hadir' ? 'Hadir' : kehadiran === 'tidak' ? 'Tidak Hadir' : 'Masih Ragu';

            wishItem.innerHTML = `
                <div class="wish-header">
                    <strong>${escapeHtml(nama)}</strong>
                    <span class="wish-badge ${badgeClass}">${badgeText}</span>
                </div>
                <p>${escapeHtml(ucapan)}</p>
            `;

            // Insert at the top of the list
            wishesList.insertBefore(wishItem, wishesList.firstChild);

            // Animate in
            setTimeout(function () {
                wishItem.style.transition = 'all 0.3s ease';
                wishItem.style.opacity = '1';
                wishItem.style.transform = 'translateX(0)';
            }, 50);

            // Save to localStorage
            saveWish({ nama, kehadiran, ucapan, timestamp: Date.now() });

            // Reset form
            form.reset();
            showNotification('Terima kasih atas ucapan dan doa Anda!', 'success');

            // Scroll to the wishes list
            wishesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Load saved wishes from localStorage
    loadSavedWishes();
}

function saveWish(wish) {
    let wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    wishes.unshift(wish);
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
}

function loadSavedWishes() {
    const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    const wishesList = document.getElementById('wishesList');

    if (wishes.length > 0 && wishesList) {
        wishes.forEach(function (wish) {
            const wishItem = document.createElement('div');
            wishItem.className = 'wish-item';

            const badgeClass = wish.kehadiran === 'hadir' ? 'hadir' : wish.kehadiran === 'tidak' ? 'tidak' : 'ragu';
            const badgeText = wish.kehadiran === 'hadir' ? 'Hadir' : wish.kehadiran === 'tidak' ? 'Tidak Hadir' : 'Masih Ragu';

            wishItem.innerHTML = `
                <div class="wish-header">
                    <strong>${escapeHtml(wish.nama)}</strong>
                    <span class="wish-badge ${badgeClass}">${badgeText}</span>
                </div>
                <p>${escapeHtml(wish.ucapan)}</p>
            `;

            wishesList.insertBefore(wishItem, wishesList.children[0]);
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ==================== COPY BUTTONS ====================
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const textToCopy = this.getAttribute('data-copy');
            const button = this;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(function () {
                    button.classList.add('copied');
                    button.innerHTML = '<i class="fas fa-check"></i> Tersalin!';

                    setTimeout(function () {
                        button.classList.remove('copied');
                        button.innerHTML = '<i class="far fa-copy"></i> Salin';
                    }, 2000);
                }).catch(function () {
                    fallbackCopy(textToCopy, button);
                });
            } else {
                fallbackCopy(textToCopy, button);
            }
        });
    });
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        button.classList.add('copied');
        button.innerHTML = '<i class="fas fa-check"></i> Tersalin!';

        setTimeout(function () {
            button.classList.remove('copied');
            button.innerHTML = '<i class="far fa-copy"></i> Salin';
        }, 2000);
    } catch (err) {
        showNotification('Gagal menyalin. Silakan salin manual.', 'error');
    }

    document.body.removeChild(textarea);
}

// ==================== NOTIFICATION ====================
function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        padding: 15px 30px;
        border-radius: 50px;
        color: white;
        font-size: 0.9rem;
        font-family: 'Poppins', sans-serif;
        z-index: 99999;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        text-align: center;
        max-width: 90%;
    `;

    notification.style.background = type === 'success'
        ? 'linear-gradient(135deg, #28a745, #20c997)'
        : 'linear-gradient(135deg, #dc3545, #e74c3c)';

    notification.textContent = message;
    document.body.appendChild(notification);

    // Show
    setTimeout(function () {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    // Hide after 3 seconds
    setTimeout(function () {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(function () {
            notification.remove();
        }, 300);
    }, 3000);
}


// ==================== FLOATING HEARTS ====================
function createFloatingHearts() {
    const mainContent = document.getElementById('mainContent');

    // Create hearts container
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    document.body.appendChild(heartsContainer);

    function createHeart() {
        if (mainContent.classList.contains('hidden')) return;

        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.innerHTML = ['&#10084;', '&#10085;', '&#9829;'][Math.floor(Math.random() * 3)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';

        heartsContainer.appendChild(heart);

        // Remove heart after animation
        setTimeout(function () {
            heart.remove();
        }, 10000);
    }

    // Create hearts periodically
    setInterval(createHeart, 3000);
}

// ==================== SMOOTH SCROLL FOR NAV LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== SCROLL REVEAL (BACKUP for AOS) ====================
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(function (el) {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleScrollReveal);
