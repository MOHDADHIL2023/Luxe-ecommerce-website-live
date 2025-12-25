// Wait until the DOM is fully loaded
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

    // --- Newsletter Subscription Handler ---
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
    }

    // --- Carousel Logic ---

    let currentSlideIndex = 0;
    let cardWidth = 0;
    let slidesPerView = 1;
    let totalCards = 0;

    function updateCarouselMetrics() {
        const track = document.getElementById('slider-track');
        if (!track) return;
        
        const cardWrap = track.querySelector('.article-card-wrap');
        if (!cardWrap) return;

        const screenWidth = window.innerWidth;
        totalCards = track.children.length;

        // Determine slidesPerView based on screen width
        if (screenWidth >= 1024) {
            slidesPerView = 3;
        } else if (screenWidth >= 640) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }

        // Calculate card width
        cardWidth = cardWrap.offsetWidth;
        
        // Re-render pagination dots
        renderPaginationDots();
    }

    window.scrollSlider = function(direction) {
        const track = document.getElementById('slider-track');
        if (!track) return;
        
        // Calculate maximum index
        const maxSlides = Math.ceil(totalCards / slidesPerView);
        
        let newIndex = currentSlideIndex + direction;

        // Keep index within bounds
        if (newIndex < 0) {
            newIndex = 0; 
        } else if (newIndex >= maxSlides) {
            newIndex = maxSlides - 1;
        }
        
        currentSlideIndex = newIndex;
        
        // Calculate scroll position
        const scrollPosition = currentSlideIndex * cardWidth * slidesPerView;

        // Scroll to position
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        updatePaginationUI();
    }

    window.goToSlide = function(index) {
        const track = document.getElementById('slider-track');
        if (!track) return;
        
        // Calculate maximum index
        const maxIndex = Math.ceil(totalCards / slidesPerView) - 1;
        
        // Keep index within bounds
        if (index > maxIndex) index = maxIndex;
        if (index < 0) index = 0;
        
        currentSlideIndex = index;
        
        // Calculate scroll position
        const scrollPosition = currentSlideIndex * cardWidth * slidesPerView;
        
        // Scroll to position
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updatePaginationUI();
    }

    function renderPaginationDots() {
        const dotsContainer = document.getElementById('carousel-pagination');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        // Calculate number of pagination dots needed
        const numSlides = Math.ceil(totalCards / slidesPerView);
        
        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            dot.setAttribute('onclick', `goToSlide(${i})`);
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
            dotsContainer.appendChild(dot);
        }
    }

    function updatePaginationUI() {
        const dots = document.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Handle manual scrolling with mouse/touch
    const track = document.getElementById('slider-track');
    if (track) {
        let isScrolling;
        track.addEventListener('scroll', () => {
            // Clear timeout if scrolling
            window.clearTimeout(isScrolling);
            
            // Set timeout to run after scrolling ends
            isScrolling = setTimeout(() => {
                // Calculate which slide we're on based on scroll position
                const scrollLeft = track.scrollLeft;
                const newIndex = Math.round(scrollLeft / (cardWidth * slidesPerView));
                
                if (newIndex !== currentSlideIndex) {
                    currentSlideIndex = newIndex;
                    updatePaginationUI();
                }
            }, 100);
        });
    }

    // --- Initialization ---
    updateCarouselMetrics();
    
    // Update on window resize
    window.addEventListener('resize', () => {
        updateCarouselMetrics();
        // Re-position to current slide after resize
        if (track) {
            const scrollPosition = currentSlideIndex * cardWidth * slidesPerView;
            track.scrollTo({
                left: scrollPosition,
                behavior: 'auto'
            });
        }
    });

});

// Frontend/js/script4.js

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. UTILITY: MESSAGE BOX
    // ==========================================
    // Check if function exists globally first (from script.js), else define it locally
    const showMessage = window.displayMessageBox || function(message) {
        alert(message); // Fallback
    };

    // ==========================================
    // 2. NEWSLETTER LOGIC
    // ==========================================
    window.handleNewsletterSubscription = function(event) {
        event.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && emailInput.value.trim() !== "") {
            showMessage(`Subscribed! We'll send updates to ${emailInput.value}`);
            emailInput.value = "";
        } else {
            showMessage("Please enter a valid email address.");
        }
    };

    // ==========================================
    // 3. CAROUSEL LOGIC (RESPONSIVE)
    // ==========================================
    const track = document.getElementById('slider-track');
    const paginationContainer = document.getElementById('carousel-pagination');
    
    if (!track) return; // Guard clause

    let currentIndex = 0;
    let slidesPerView = 1;
    let totalSlides = 0;
    let cardWidthPercent = 100; // Default 100%

    // Initialize Metrics based on Window Width
    function updateMetrics() {
        const width = window.innerWidth;
        const cards = track.querySelectorAll('.article-card-wrap');
        totalSlides = cards.length;

        // Match CSS Media Queries
        if (width >= 1024) {
            slidesPerView = 3;
            cardWidthPercent = 33.333;
        } else if (width >= 640) {
            slidesPerView = 2;
            cardWidthPercent = 50;
        } else {
            slidesPerView = 1;
            cardWidthPercent = 100;
        }

        // Cap current index if window resized
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        updatePosition();
        renderDots();
    }

    // Move Slider
    function updatePosition() {
        // Translate X based on percentage
        const translateValue = -(currentIndex * 100); 
        // Note: Logic changes slightly here. 
        // We slide by 'pages' (groups of cards) or single cards?
        // Let's slide by 'viewport width' (100% of track visible area).
        
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
    
    // Init
    updateMetrics();
});