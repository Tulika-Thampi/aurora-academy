// Global flag to track quiz submission
let isQuizSubmitted = false;

// Carousel Functionality (for campus.html)
function initializeCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const carousel = document.querySelector('.carousel');
    let currentIndex = 0;
    const totalItems = items.length;

    if (!carousel || totalItems === 0) {
        console.error('Carousel initialization failed: No carousel or items found');
        return;
    }

    console.log(`Carousel initialized with ${totalItems} items`);

    function showItem(index) {
        console.log(`Showing carousel item at index: ${index}`);
        carousel.style.transform = `translateX(-${index * 20}%)`; // 100/5 = 20% per item
    }

    function moveCarousel(direction) {
        console.log(`Moving carousel: direction ${direction}, currentIndex ${currentIndex}`);
        currentIndex = (currentIndex + direction + totalItems) % totalItems;
        showItem(currentIndex);
    }

    // Expose moveCarousel globally for button onclick
    window.moveCarousel = moveCarousel;

    // Auto-rotate every 10 seconds
    const autoRotate = setInterval(() => {
        console.log('Auto-rotating carousel');
        moveCarousel(1);
    }, 10000);

    // Initial display
    showItem(currentIndex);
}

// Fetch Weather Data (for campus.html)
async function fetchWeather() {
    const weatherInfo = document.getElementById('weatherInfo');
    if (!weatherInfo) {
        console.error('Weather section not found');
        return;
    }

    weatherInfo.style.opacity = '0';
    try {
        const apiKey = '9ade32b2e86ec8eda9c44e3432e94b80'; // Replace with your OpenWeatherMap API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai,IN&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        weatherInfo.innerHTML = `
            <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
            <p><strong>Condition:</strong> ${data.weather[0].main}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        `;
        weatherInfo.style.opacity = '1';
        console.log('Weather data fetched successfully');
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = '<p>Unable to fetch weather details. Please check your API key or try again later.</p>';
        weatherInfo.style.opacity = '1';
    }
}

// Tab Toggling (for quiz.html)
function toggleTab(tabId) {
    console.log(`Toggling to tab: ${tabId}`);
    const tabs = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('nav a');
    const quizSection = document.querySelector('.quiz-section');
    const quizResult = document.getElementById('quizResult');
    const header = document.querySelector('header');

    if (!quizSection || !quizResult || !header) {
        console.error('Elements missing: quizSection:', !!quizSection, 'quizResult:', !!quizResult, 'header:', !!header);
        return;
    }

    quizSection.style.display = 'block';
    header.style.display = 'flex';

    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    navLinks.forEach(link => link.classList.remove('active'));

    if (tabId === 'quiz' && isQuizSubmitted) {
        quizResult.innerHTML = '<h2>Submission Complete</h2><p>Your results will be updated soon.</p>';
        quizResult.classList.add('active');
        quizResult.style.display = 'block';
        quizSection.style.display = 'none';
        console.log('Showing quiz result after submission');
    } else {
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.display = 'block';
            quizResult.style.display = 'none';
            console.log(`Tab ${tabId} activated`);
        } else {
            console.error(`Tab ${tabId} not found`);
        }
    }

    const activeLink = Array.from(navLinks).find(link => link.getAttribute('onclick') === `toggleTab('${tabId}')`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Quiz Submission (for quiz.html)
function submitQuiz() {
    console.log('Attempting to submit quiz');
    try {
        const quizForm = document.getElementById('quizForm');
        const quizResult = document.getElementById('quizResult');
        const quizSection = document.querySelector('.quiz-section');
        const header = document.querySelector('header');

        if (!quizForm || !quizResult || !quizSection || !header) {
            console.error('Quiz elements missing: form:', !!quizForm, 'result:', !!quizResult, 'section:', !!quizSection, 'header:', !!header);
            return;
        }

        console.log('Hiding quiz section and showing result');
        quizSection.style.display = 'none';
        quizResult.innerHTML = '<h2>Submission Complete</h2><p>Your results will be updated soon.</p>';
        quizResult.classList.add('active');
        quizResult.style.display = 'block';
        header.style.display = 'flex';
        isQuizSubmitted = true;
        console.log('Quiz submitted successfully');
    } catch (error) {
        console.error('Error during quiz submission:', error);
        const quizResult = document.getElementById('quizResult');
        if (quizResult) {
            quizResult.innerHTML = '<p>Error submitting quiz. Please try again later.</p>';
            quizResult.classList.add('active');
            quizResult.style.display = 'block';
        }
    }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded:', window.location.pathname);
    if (!window.location.pathname.includes('quiz.html')) {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    if (window.location.pathname.includes('campus.html')) {
        console.log('Initializing carousel');
        initializeCarousel();
        console.log('Fetching weather data');
        fetchWeather();
    } else if (window.location.pathname.includes('quiz.html')) {
        console.log('Initializing quiz page with quiz tab');
        toggleTab('quiz');
    }
});