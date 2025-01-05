document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('.navbar-links a');
    navbarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            alert(`Anda mengklik menu: ${event.target.textContent}`);
        });
    });
});

let currentSlide = 0;

function moveSlide(step) {
    const slides = document.querySelectorAll('.slider-image');
    const totalSlides = slides.length;
    
    currentSlide += step;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    const newTransformValue = -currentSlide * 100;
    document.querySelector('.slider-images').style.transform = `translateX(${newTransformValue}%)`;
}

setInterval(() => {
    moveSlide(1);
}, 3000);

