// Variables to track state
let currentSubfolder = '';
let timerDuration = 60;
let timerInterval = null;
let timeRemaining = 0;
let imageHistory = [];
let currentImageIndex = -1;
let preloadedImageUrl = null;
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const setupDiv = document.getElementById('setup');
    const practiceDiv = document.getElementById('practice');
    const subfolderSelect = document.getElementById('subfolder');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timerDisplay = document.getElementById('timer-display');
    const sketchImage = document.getElementById('sketch-image');
    const currentSubfolderDisplay = document.getElementById('current-subfolder');

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

        // Start preloading first, then get first image
        preloadNextImage();
        getNextImage();
    });

    // Stop practice and return to setup
    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        setupDiv.classList.remove('hidden');
        practiceDiv.classList.add('hidden');
    });

    // Get next image
    nextBtn.addEventListener('click', () => {
        getNextImage();
    });

    // Go back to previous image
    backBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            // Pause timer
            clearInterval(timerInterval);

            // Show previous image
            currentImageIndex--;
            sketchImage.src = imageHistory[currentImageIndex];

            // Update UI
            updateTimerDisplay(0);
        }
    });


    // Preload the next random image
    function preloadNextImage() {
        fetch(`/random/${currentSubfolder}`)
            .then(response => response.json())
            .then(data => {
                preloadedImageUrl = data.image_url;
                // Create an image object to preload the image in browser cache
                const preloader = new Image();
                preloader.src = preloadedImageUrl;
            })
            .catch(error => {
                console.error('Error preloading image:', error);
                preloadedImageUrl = null;
            });
    }

    // Get a new random image
    function getNextImage() {
        // Clear any existing timer
        clearInterval(timerInterval);

        if (preloadedImageUrl) {
            // Use the preloaded image if available
            const imageUrl = preloadedImageUrl;
            preloadedImageUrl = null;
            
            // Add to history if it's a new image (not going back)
            if (currentImageIndex === imageHistory.length - 1 || imageHistory.length === 0) {
                imageHistory.push(imageUrl);
                currentImageIndex = imageHistory.length - 1;
            } else {
                // We were viewing history, now moving forward
                currentImageIndex++;
            }

            // Display the image
            sketchImage.src = imageHistory[currentImageIndex];

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
                    // Add to history if it's a new image (not going back)
                    if (currentImageIndex === imageHistory.length - 1 || imageHistory.length === 0) {
                        imageHistory.push(data.image_url);
                        currentImageIndex = imageHistory.length - 1;
                    } else {
                        // We were viewing history, now moving forward
                        currentImageIndex++;
                    }

                    // Display the image
                    sketchImage.src = imageHistory[currentImageIndex];

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

    // Start the timer
    function startTimer() {
        timeRemaining = timerDuration;
        updateTimerDisplay(timeRemaining);

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
});
