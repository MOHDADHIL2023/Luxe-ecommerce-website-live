document.addEventListener('DOMContentLoaded', () => {

    // --- Utility Functions ---
    window.displayMessageBox = function(message) {
        const existingBox = document.getElementById('message-box');
        if (existingBox) existingBox.remove();

        const messageBox = document.createElement('div');
        messageBox.id = 'message-box';
        messageBox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        `;
        
        const messageContent = document.createElement('div');
        messageContent.style.cssText = `
            background-color: white;
            color: black;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            margin: 1rem;
            text-align: center;
        `;
        
        const messageText = document.createElement('p');
        messageText.style.cssText = `
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1rem;
        `;
        messageText.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.25rem;
            background-color: #0A0A0A;
            color: white;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#333';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#0A0A0A';
        closeButton.onclick = () => messageBox.remove();
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(closeButton);
        messageBox.appendChild(messageContent);
        document.body.appendChild(messageBox);
        
        // Close on background click
        messageBox.onclick = (e) => {
            if (e.target === messageBox) {
                messageBox.remove();
            }
        }
    }

    // ==========================================
    // 1. UTILITY: MESSAGE BOX
    // ==========================================
    const showMessage = window.displayMessageBox || function(message) {
        alert(message); // Fallback
    };

    // ==========================================
    // 2. NEWSLETTER LOGIC
    // ==========================================
    window.handleNewsletterSubscription = function(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        
        if (email) {
            const message = `Success! Your email (${email}) has been subscribed. Stay updated with LUXE!`;
            displayMessageBox(message);
            emailInput.value = '';
        } else {
            displayMessageBox("Please enter a valid email address to subscribe.");
        }
    };

    // ==========================================
    // 3. CAROUSEL LOGIC (RESPONSIVE)
    // ==========================================
    const track = document.getElementById('slider-track');
    const paginationContainer = document.getElementById('carousel-pagination');
    
    // Guard clause: If carousel doesn't exist on this page, stop here
    if (!track) return; 

    let currentIndex = 0;
    let slidesPerView = 1;
    let totalSlides = 0;

    // Initialize Metrics based on Window Width
    function updateMetrics() {
        const width = window.innerWidth;
        const cards = track.querySelectorAll('.article-card-wrap');
        totalSlides = cards.length;

        // Match CSS Media Queries
        if (width >= 1024) {
            slidesPerView = 3;
        } else if (width >= 640) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }

        // Cap current index if window resized
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        updatePosition();
        renderDots();
    }

    // Move Slider
    function updatePosition() {
        // Translate X based on percentage (100% = 1 full viewport width)
        const translateValue = -(currentIndex * 100); 
        track.style.transform = `translateX(${translateValue}%)`;
        updateDotsUI();
    }

    // Scroll Function (Next/Prev Buttons)
    window.scrollSlider = function(direction) {
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        currentIndex += direction;

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        updatePosition();
    };

    // Dot Navigation
    window.goToSlide = function(index) {
        currentIndex = index;
        updatePosition();
    };

    // Render Dots
    function renderDots() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        
        const numPages = Math.ceil(totalSlides / slidesPerView);
        
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('div');
            dot.className = `pagination-dot ${i === currentIndex ? 'active' : ''}`;
            dot.onclick = () => window.goToSlide(i);
            paginationContainer.appendChild(dot);
        }
    }

    function updateDotsUI() {
        const dots = document.querySelectorAll('.pagination-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }


    // --- Events ---
    window.addEventListener('resize', updateMetrics);
    
    // Init Carousel
    updateMetrics();
});