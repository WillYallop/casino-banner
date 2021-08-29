import CasinoBanner from './dist/casinoBanner.js';

const homeCasinoBanner = new CasinoBanner({
    // required
    id: 'bannerExample',
    videoId: 'videoIframe',
    slidesPerView: 7,

    // Optional - defaults
    fps: 24,
    classes: {
        slider: 'slider',
        wrapper: 'slider-wrapper',
        slide: 'slide'
    }
});