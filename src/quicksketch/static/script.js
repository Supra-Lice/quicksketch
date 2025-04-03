// Variables to track state
let currentSubfolder = '';
let timerDuration = 60;
let timerInterval = null;
let timeRemaining = 0;
let imageHistory = [];
let currentImageIndex = -1;
let preloadedImage = null;
let isPaused = false;
let isGrayscale = false;
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const setupDiv = document.getElementById('setup');
    const practiceDiv = document.getElementById('practice');
    const subfolderSelect = document.getElementById('subfolder');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const stopBtn = document.getElementById('stop-btn');
    const grayscaleBtn = document.getElementById('grayscale-btn');
    const timerDisplay = document.getElementById('timer-display');
    const sketchImage = document.getElementById('sketch-image');
    const currentSubfolderDisplay = document.getElementById('current-subfolder');
    const currentFilenameDisplay = document.getElementById('current-filename');
    
    // Track if we're in practice mode
    let inPracticeMode = false;

    // Start practice session
    startBtn.addEventListener('click', () => {
        currentSubfolder = decodeURIComponent(subfolderSelect.value);
        const minutes = parseInt(timerMinutes.value) || 0;
        const seconds = parseInt(timerSeconds.value) || 0;
        timerDuration = (minutes * 60) + seconds;

        // Set the subfolder header
        currentSubfolderDisplay.textContent = `Category: ${currentSubfolder}`;

        // Reset history
        imageHistory = [];
        currentImageIndex = -1;

        // Switch view
        setupDiv.classList.add('hidden');
        practiceDiv.classList.remove('hidden');
        inPracticeMode = true;

        // Start preloading first, then get first image
        preloadNextImage();
        getNextImage();
        setGrayscale();
        
    });

    // Stop practice and return to setup
    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        setupDiv.classList.remove('hidden');
        practiceDiv.classList.add('hidden');
        inPracticeMode = false;
        isPaused = false;
        pauseBtn.textContent = 'Pause';
    });

    // Get next image
    nextBtn.addEventListener('click', () => {
        getNextImage();
    });

    function setGrayscale() {
        if (isGrayscale) {
            sketchImage.style.filter = 'grayscale(100%)';
        } else {
            sketchImage.style.filter = 'none';
        }
    }

    grayscaleBtn.addEventListener('click', () => {
        isGrayscale = !isGrayscale;
        setGrayscale()
    });

    // Go back to previous image
    backBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            // Pause timer
            clearInterval(timerInterval);

            // Show previous image
            currentImageIndex--;
            sketchImage.src = imageHistory[currentImageIndex].url;
            currentFilenameDisplay.textContent = `Filename: ${imageHistory[currentImageIndex].filename}`;

            // Reset timer but keep it paused
            timeRemaining = timerDuration;
            updateTimerDisplay(timeRemaining);
            
            // Set pause state
            isPaused = true;
            pauseBtn.textContent = 'Resume';
        }
    });
    
    // Pause or resume timer
    pauseBtn.addEventListener('click', () => {
        if (timerDuration <= 0) return; // Don't do anything if timer is unlimited
        
        if (!isPaused) {
            // Pause the timer
            clearInterval(timerInterval);
            pauseBtn.textContent = 'Resume';
        } else {
            // Resume the timer
            startTimerFromCurrentTime();
            pauseBtn.textContent = 'Pause';
        }
        
        isPaused = !isPaused;
    });


    // Preload the next random image
    function preloadNextImage() {
        fetch(`/random/${currentSubfolder}`)
            .then(response => response.json())
            .then(data => {
                preloadedImage = {
                    url: data.image_url,
                    filename: data.filename
                };
                // Create an image object to preload the image in browser cache
                const preloader = new Image();
                preloader.src = preloadedImage.url;
            })
            .catch(error => {
                console.error('Error preloading image:', error);
                preloadedImage = null;
            });
    }

    // Get a new random image
    function getNextImage() {
        // Clear any existing timer
        clearInterval(timerInterval);
        
        // Reset pause state
        isPaused = false;
        pauseBtn.textContent = 'Pause';

        if (preloadedImage) {
            // Use the preloaded image if available
            const imageData = preloadedImage;
            preloadedImage = null;
            
            // Add to history if it's a new image (not going back)
            if (currentImageIndex === imageHistory.length - 1 || imageHistory.length === 0) {
                imageHistory.push(imageData);
                currentImageIndex = imageHistory.length - 1;
            } else {
                // We were viewing history, now moving forward
                currentImageIndex++;
            }

            // Display the image
            sketchImage.src = imageHistory[currentImageIndex].url;
            currentFilenameDisplay.textContent = `Filename: ${imageHistory[currentImageIndex].filename}`;

            // Start timer if not unlimited
            if (timerDuration > 0) {
                startTimer();
            } else {
                updateTimerDisplay(-1); // Show unlimited
            }
            
            // Preload the next image for future use
            preloadNextImage();
        } else {
            // Fall back to fetching directly if no preloaded image is available
            fetch(`/random/${currentSubfolder}`)
                .then(response => response.json())
                .then(data => {
                    const imageData = {
                        url: data.image_url,
                        filename: data.filename
                    };
                    
                    // Add to history if it's a new image (not going back)
                    if (currentImageIndex === imageHistory.length - 1 || imageHistory.length === 0) {
                        imageHistory.push(imageData);
                        currentImageIndex = imageHistory.length - 1;
                    } else {
                        // We were viewing history, now moving forward
                        currentImageIndex++;
                    }

                    // Display the image
                    sketchImage.src = imageHistory[currentImageIndex].url;
                    currentFilenameDisplay.textContent = `Filename: ${imageHistory[currentImageIndex].filename}`;

                    // Start timer if not unlimited
                    if (timerDuration > 0) {
                        startTimer();
                    } else {
                        updateTimerDisplay(-1); // Show unlimited
                    }
                    
                    // Preload the next image for future use
                    preloadNextImage();
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    alert('Error loading image. Please try again.');
                });
        }
    }

    // Start the timer from the beginning
    function startTimer() {
        timeRemaining = timerDuration;
        updateTimerDisplay(timeRemaining);
        startTimerFromCurrentTime();
    }
    
    // Start the timer from current time remaining
    function startTimerFromCurrentTime() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                getNextImage();
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay(seconds) {
        if (seconds < 0) {
            timerDisplay.textContent = 'Unlimited time';
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Prevent default behavior for these keys
        if (['Space', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'KeyA', 'KeyD', 'Tab'].includes(event.code)) {
            event.preventDefault();
        }
        
        // Setup screen shortcuts
        if (!inPracticeMode) {
            if (event.code === 'Enter') {
                startBtn.click();
            }
        } 
        // Practice screen shortcuts
        else {
            switch(event.code) {
                case 'Space':
                    pauseBtn.click();
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    backBtn.click();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    nextBtn.click();
                    break;
                case 'Escape':
                    stopBtn.click();
                    break;
                case 'Tab':
                    grayscaleBtn.click();
                    break;
            }
        }
    });
});
