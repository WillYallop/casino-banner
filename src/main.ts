import './main.scss';
import { Slider } from 'functionalities.js';

function updateActiveSlides(lastDirection) {
    let slides = document.querySelectorAll('.heroSliderSlide');
    for(let i = 0; i < slides.length; i++) {
        slides[i].children[0].classList.remove('active');
        slides[i].children[0].classList.remove('oneOff');
        slides[i].children[0].classList.remove('twoOff');
    }
    if(lastDirection === 'rightDown') {
        slides[2].children[0].classList.add('twoOff');
        slides[3].children[0].classList.add('oneOff');
        slides[4].children[0].classList.add('active');
        slides[5].children[0].classList.add('oneOff');
        slides[6].children[0].classList.add('twoOff');
    }
    else {
        slides[1].children[0].classList.add('twoOff');
        slides[2].children[0].classList.add('oneOff');
        slides[3].children[0].classList.add('active');
        slides[4].children[0].classList.add('oneOff');
        slides[5].children[0].classList.add('twoOff');
    }
}

var iframeEle: any = document.getElementById('heroVideoIframe');

const heroSlider = new Slider('heroSlider', {
    perPage: 7,
    autoPlay: false,
    gap: 0,
    slideDirection: 'leftUp',
    type: 'infinite',
    direction: 'vertical',
    classes: {
        slider: 'heroSlider',
        wrapper: 'heroSliderWrapper',
        slide: 'heroSliderSlide'
    },
    controls: {
        wheel: false
    },
    beforeSlide: (data) => {
        // console.log('before', data);
    },
    afterSlide: (data) => {
        updateActiveSlides(data.lastDirection);
        let slide = document.querySelector(`[og-position="${data.currentSlideIndex}"]`);
        let videoUrl = slide.getAttribute('video-url');
        iframeEle.src = videoUrl;
    }
});

updateActiveSlides('leftUp');

document.getElementById('upBtn').addEventListener('click', (e) => {
    heroSlider.triggerSlide('leftUp');
});

document.getElementById('downBtn').addEventListener('click', (e) => {
    heroSlider.triggerSlide('rightDown');
});

// Add click event to navigate to that slide
// Whenever a slide is active, update the video