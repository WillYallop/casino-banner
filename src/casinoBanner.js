export default class CasinoBanner {
    constructor(config) {
        this.defaults = {
            fps: 24,
            classes: {
                slider: 'slider',
                wrapper: 'slider-wrapper',
                slide: 'slide'
            }
        };
        this.config = {...this.defaults, ...config };

        this.translateY = 0;
        this.speed = 1;
        this.skip = true;

        // Start
        this.initiateHandler();
    }
    async initiateHandler() {
        try {
            await verifyConfig(this.config);
            // Verified
            this.bannerElement = document.getElementById(this.config.id);
            if(!this.bannerElement) throw `Element with ID: ${this.config.id}, cannot be found!`;
            // Set elements
            this.sliderElement = this.bannerElement.getElementsByClassName(this.config.classes.slider)[0];
            this.sliderWrapper = this.sliderElement.getElementsByClassName(this.config.classes.wrapper)[0];
            this.slideElements = this.sliderElement.getElementsByClassName(this.config.classes.slide);
            this.videoElement = document.getElementById(this.config.videoId);

            this.sliderElement.style.position = 'relative';
            this.sliderWrapper.style.position = 'absolute';
            this.sliderWrapper.style.top = 0;
            this.sliderWrapper.style.left = 0;
            this.sliderWrapper.style.right = 0;
            this.sliderWrapper.style.bottom = 0;
            
            this.totalSlides = this.slideElements.length;
           
            this.activeSlideIndex = Math.ceil(this.totalSlides / 2);
            this.activeSlideIndex++;
            
            this.oddEvenSlides = oddOrEven(this.config.slidesPerView);
            if(this.oddEvenSlides === 'even') this.activeSlideIndex++;

            this.initiateSlider();
            this.events();
            this.onResize();
        }
        catch(err) {
            console.error(err);
        }
    }
    // Slider
    initiateSlider() {
        // Handle slideHeight and default vals
        this.skip = true;
        this.setSlideDefaults();
        // Slider Loop
        this.loop = setInterval(() => {
            this.translateY += this.speed;
            this.sliderWrapper.style.transform = `translateY(${this.translateY}px)`;
            let interval = Math.round(this.slideHeight / 2);
            if(this.translateY % interval === 0) {
                // When slide is half off screen
                if(this.skip) {
                    // Move active slide up one
                    // console.log('slide is half off screen!');
                    if(this.oddEvenSlides === 'odd') this.updateActiveSlide('inc');
                    this.skip = false;
                } 
                // When slide is fully off screen
                else {
                    // Take one off bottom and add to top
                    // console.log('slide has gone off screen!');
                    this.sliderWrapper.prepend(this.slideElements[this.totalSlides - 1]);
                    this.translateY -= this.slideHeight;
                    this.sliderWrapper.style.transform = `translateY(${this.translateY}px)`;
                    if(this.oddEvenSlides === 'even') this.updateActiveSlide('dec');
                    this.skip = true;
                }
            }
        }, 1000 / this.config.fps);
    }

    setSlideDefaults() {
        // set height of each so they fit the amount specified in config
        this.slideHeight = Math.floor(this.sliderElement.offsetHeight / this.config.slidesPerView);
        this.sliderElement.style.overflowY = 'hidden';
        this.sliderWrapper.style.height = `${this.sliderElement.offsetHeight}px`;
        // For children in slider element
        for(let i = 0; i < this.slideElements.length; i++) {
            let child = this.slideElements[i];
            child.style.height = `${this.slideHeight}px`;
        }

        this.translateY = -Math.abs(this.totalSlides / 2 * this.slideHeight - this.slideHeight);

        // Set begining translateY at half the slider height - half a slide height
        // this.translateY = -Math.abs((this.sliderElement.offsetHeight / 2) - (this.slideHeight / 2));
        // Set active slide to middle
        this.slideElements[this.activeSlideIndex - 2].classList.add('twoOff');
        this.slideElements[this.activeSlideIndex - 1].classList.add('oneOff');
        this.slideElements[this.activeSlideIndex].classList.add('active');
        this.slideElements[this.activeSlideIndex + 1].classList.add('oneOff');
        this.slideElements[this.activeSlideIndex + 2].classList.add('twoOff');
    }
    updateActiveSlide(action) {
        // Reset all classes
        resetSlideClasses(this.slideElements);
        // Set
        this.slideElements[this.activeSlideIndex - 2].classList.add('twoOff');
        this.slideElements[this.activeSlideIndex - 1].classList.add('oneOff');
        this.slideElements[this.activeSlideIndex].classList.add('active');
        this.slideElements[this.activeSlideIndex + 1].classList.add('oneOff');
        this.slideElements[this.activeSlideIndex + 2].classList.add('twoOff');
    }
    events() {
        // Hover
        for(let i = 0; i < this.slideElements.length; i++) {
            this.slideElements[i].setAttribute('video-active', 'false');
            this.slideElements[i].addEventListener('mouseover', (e) => {
                var target = e.currentTarget;
                let videoSrc = target.attributes['video-url'].value;
                if(target.attributes['video-active'].value === 'false') {
                    target.setAttribute('video-active', 'true'); 
                    this.videoElement.src = videoSrc;
                    for(let n = 0; n < this.slideElements.length; n++) {
                        if(target != this.slideElements[n]) this.slideElements[n].setAttribute('video-active', 'false');
                    }
                }
            }, true);
        }
    }
    onResize() {
        window.addEventListener('resize', (e) => {
            clearInterval(this.loop);
            this.initiateSlider();
            this.slideElements[this.activeSlideIndex - 2].classList.add('twoOff');
            this.slideElements[this.activeSlideIndex - 1].classList.add('oneOff');
            this.slideElements[this.activeSlideIndex].classList.add('active');
            this.slideElements[this.activeSlideIndex + 1].classList.add('oneOff');
            this.slideElements[this.activeSlideIndex + 2].classList.add('twoOff');
        }, true);
    }
}

// Verify config
function verifyConfig(config) {
    return new Promise((resolve, reject) => {
        if(typeof config.id != 'string') reject('"id" in config should be a string'); // id
        else if(typeof config.videoId != 'string') reject('"videoId" in config should be a string'); // video id
        else if(typeof config.slidesPerView != 'number') reject('"slidesPerView" in config should be a number'); // slidesPerView
        else if(config.fps != undefined) if(typeof config.fps != 'number') reject('"fps" in config should be a number');
        // Classes Object
        else if(config.classes != undefined) if(typeof config.classes != 'object') reject('"classes" in config should be an object');
        else if(config.classes.slider != undefined) if(typeof config.classes.slider != 'string') reject('classes "slider" in config should be a string'); // slider
        else if(config.classes.wrapper != undefined) if(typeof config.classes.wrapper != 'string') reject('classes "wrapper" in config should be a string'); // slider
        else if(config.classes.slide != undefined) if(typeof config.classes.slide != 'string') reject('classes "slide" in config should be a string'); // slide

        resolve();
    })
}

function oddOrEven(num){
    if(num % 2 == 0) return "even";
    return "odd";
}

function resetSlideClasses(slideElements) {
    for(let i = 0; i < slideElements.length; i++) {
        let child = slideElements[i];
        child.classList.remove('active');
        child.classList.remove('oneOff');
        child.classList.remove('twoOff');
    }
}