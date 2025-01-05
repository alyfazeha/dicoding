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

    document.querySelector('.slider-images').style.transform = `translateX(-${currentSlide * 100}%)`;
}

setInterval(() => {
    moveSlide(1);
}, 3000);
