// Scroll progress indicator
window.addEventListener('scroll', () => {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.querySelector('.scroll-progress').style.width = scrollProgress + '%';
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe journey steps
document.addEventListener('DOMContentLoaded', () => {
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        observer.observe(step);
    });
    
    // Set up background section scroll animations
    setupBackgroundScrollAnimations();
});
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
// Background section scroll-triggered animations
function setupBackgroundScrollAnimations() {
    const backgroundSection = document.getElementById('background');
    if (!backgroundSection) return;
    
    // Track which parts have been animated
    const animatedParts = new Set();
    let allPartsShown = false;
    
    // Make section sticky initially
    backgroundSection.classList.add('fixed');
    
    // Position graphs randomly with overlap
    const graph1 = document.querySelector('.background-graph-container[data-graph="1"]');
    const graph2 = document.querySelector('.background-graph-container[data-graph="2"]');
    const graph3 = document.querySelector('.background-graph-container[data-graph="3"]');
    
    // Random positions and rotations for each graph (with overlap)
    // Position graphs in lower portion to avoid text area (text is in upper 40%)
    if (graph1) {
        graph1.style.left = Math.random() * 30 + 12 + '%'; // 10-40%
        graph1.style.top = randomIntFromInterval(50, 75) + '%'; // 50-75% (below text area)
        graph1.style.zIndex = Math.floor(Math.random() * 3) + 1; // Random z-index 1-3
        const rotation1 = (Math.random() - 0.5) * 8; // -4 to +4 degrees
        graph1.style.transform = `translateY(50px) scale(0.9) rotate(${rotation1}deg)`;
        graph1.dataset.rotation = rotation1;
    }
    
    if (graph2) {
        graph2.style.left = Math.random() * 30 + 50 + '%'; // 50-80%
        graph2.style.top = randomIntFromInterval(55, 80) + '%'; // 55-80% (below text area)
        graph2.style.zIndex = Math.floor(Math.random() * 3) + 1;
        const rotation2 = (Math.random() - 0.5) * 8; // -4 to +4 degrees
        graph2.style.transform = `translateY(50px) scale(0.9) rotate(${rotation2}deg)`;
        graph2.dataset.rotation = rotation2;
    }
    
    if (graph3) {
        graph3.style.left = Math.random() * 30 + 30 + '%'; // 30-60%
        graph3.style.top =randomIntFromInterval(60, 85) + '%'; // 60-85% (below text area)
        graph3.style.zIndex = Math.floor(Math.random() * 3) + 1;
        const rotation3 = (Math.random() - 0.5) * 8; // -4 to +4 degrees
        graph3.style.transform = `translateY(50px) scale(0.9) rotate(${rotation3}deg)`;
        graph3.dataset.rotation = rotation3;
    }
    
    // Function to animate a part
    function animatePart(partNumber) {
        if (animatedParts.has(partNumber)) return;
        
        // Animate text part
        const textPart = document.querySelector(`.background-text-part[data-part="${partNumber}"]`);
        if (textPart) {
            textPart.classList.add('animate-up');
        }
        
        // Show and animate graph
        const graphContainer = document.querySelector(`.background-graph-container[data-graph="${partNumber}"]`);
        if (graphContainer) {
            graphContainer.style.display = 'block';
            const rotation = graphContainer.dataset.rotation || 0;
            setTimeout(() => {
                graphContainer.classList.add('show');
                // Apply the stored rotation when showing
                graphContainer.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
            }, 100);
        }
        
        animatedParts.add(partNumber);
        
        // Check if all parts are shown
        if (animatedParts.size === 3 && !allPartsShown) {
            allPartsShown = true;
            allPartsShownTime = Date.now(); // Record when all parts were shown
            // Mark as completed but keep fixed until user scrolls again
            backgroundSection.classList.add('completed');
        }
    }
    
    // Track scroll events - one part per scroll action
    let nextPartToShow = 1; // Track which part should be shown next (1, 2, or 3)
    let isSectionSticky = false;
    let lastWheelTime = 0;
    let allPartsShownTime = 0; // Track when all parts were shown
    const wheelCooldown = 900; // Minimum time between wheel events to count as separate scrolls (ms)
    const completionDelay = 1500; // Delay after all parts shown before allowing fixed removal (ms)
    
    // Track when section becomes sticky
    const checkStickyStatus = () => {
        const rect = backgroundSection.getBoundingClientRect();
        const wasSticky = isSectionSticky;
        isSectionSticky = rect.top <= 0 && rect.top >= -50;
        
        // Reset when section becomes sticky
        if (isSectionSticky && !wasSticky) {
            nextPartToShow = 1;
        }
    };
    
    // Function to smoothly transition to next section
    const transitionToNextSection = () => {
        // Find the next section after background
        const nextSection = backgroundSection.nextElementSibling;
        if (nextSection) {
            // Get current scroll position
            const currentScroll = window.scrollY;
            // Get the background section's position in the document
            const backgroundSectionTop = backgroundSection.offsetTop;
            // Calculate where the next section will be after fixed is removed
            const backgroundSectionHeight = backgroundSection.offsetHeight;
            const nextSectionTarget = backgroundSectionTop + backgroundSectionHeight;
            
            // Remove fixed class
            backgroundSection.classList.remove('fixed');
            
            // Smoothly scroll to next section
            // Use a small delay to let the DOM update
            setTimeout(() => {
                window.scrollTo({
                    top: nextSectionTarget,
                    behavior: 'smooth'
                });
            }, 50);
        } else {
            // If no next section, just remove fixed
            backgroundSection.classList.remove('fixed');
        }
    };
    
    // Handle wheel events (mouse wheel, trackpad) - primary method
    const handleWheel = (e) => {
        // If all parts are shown and user scrolls again (after delay), remove fixed class
        if (allPartsShown && e.deltaY > 0) {
            const timeSinceCompletion = Date.now() - allPartsShownTime;
            // Only remove fixed if enough time has passed since completion
            if (timeSinceCompletion > completionDelay) {
                transitionToNextSection();
                window.removeEventListener('wheel', handleWheel);
                return;
            }
            // If not enough time has passed, ignore this scroll
            return;
        }
        
        if (allPartsShown) {
            return;
        }
        
        checkStickyStatus();
        
        // Only process when section is sticky and user scrolls down
        if (isSectionSticky && e.deltaY > 0) {
            const currentTime = Date.now();
            
            // Debounce to detect distinct scroll actions
            if (currentTime - lastWheelTime > wheelCooldown) {
                lastWheelTime = currentTime;
                
                // Trigger next part in sequence
                if (nextPartToShow === 1 && !animatedParts.has(1)) {
                    animatePart(1);
                    nextPartToShow = 2;
                } else if (nextPartToShow === 2 && !animatedParts.has(2)) {
                    animatePart(2);
                    nextPartToShow = 3;
                } else if (nextPartToShow === 3 && !animatedParts.has(3)) {
                    animatePart(3);
                }
            }
        }
    };
    
    // Also handle scroll events as fallback for touch devices
    let lastScrollY = window.scrollY;
    let scrollDebounceTimer = null;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // If all parts are shown and user scrolls again (after delay), remove fixed class
        if (allPartsShown && scrollDelta > 80) {
            const timeSinceCompletion = Date.now() - allPartsShownTime;
            // Only remove fixed if enough time has passed since completion
            if (timeSinceCompletion > completionDelay) {
                transitionToNextSection();
                window.removeEventListener('scroll', handleScroll);
                return;
            }
            // If not enough time has passed, ignore this scroll
            return;
        }
        
        if (allPartsShown) {
            return;
        }
        
        checkStickyStatus();
        
        // Only process if section is sticky and user scrolled down significantly
        if (isSectionSticky && scrollDelta > 50) {
            // Clear existing timer
            if (scrollDebounceTimer) {
                clearTimeout(scrollDebounceTimer);
            }
            
            // Debounce scroll events
            scrollDebounceTimer = setTimeout(() => {
                const currentTime = Date.now();
                
                if (currentTime - lastWheelTime > wheelCooldown) {
                    lastWheelTime = currentTime;
                    
                    // Trigger next part in sequence
                    if (nextPartToShow === 1 && !animatedParts.has(1)) {
                        animatePart(1);
                        nextPartToShow = 2;
                    } else if (nextPartToShow === 2 && !animatedParts.has(2)) {
                        animatePart(2);
                        nextPartToShow = 3;
                    } else if (nextPartToShow === 3 && !animatedParts.has(3)) {
                        animatePart(3);
                    }
                }
            }, 200);
        }
        
        lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    checkStickyStatus();
}

// Track if persona was selected
let personaSelected = false;
let selectedPersona = null;
let scrollTriggered = false;

// Global function to check if any details are expanded (for manual toggle tracking)
function areAnyDetailsExpanded() {
    const personas = ['jamie', 'catherine', 'christina'];
    return personas.some(p => {
        const details = document.getElementById(`${p}-details`);
        return details && details.classList.contains('expanded');
    });
}

// Persona selection functionality
document.addEventListener('DOMContentLoaded', () => {
    const personaCards = document.querySelectorAll('.persona-card');
    
    // Add hover functionality for individual cards
    personaCards.forEach(card => {
        const persona = card.getAttribute('data-persona');
        const details = document.getElementById(`${persona}-details`);
        
        if (details) {
            // Expand on hover
            card.addEventListener('mouseenter', () => {
                details.classList.add('expanded');
            });
            
            // Collapse when mouse leaves
            card.addEventListener('mouseleave', () => {
                details.classList.remove('expanded');
            });
        }
        
        // Click to view journey
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const persona = card.getAttribute('data-persona');
            console.log('Persona clicked:', persona); // Debug log
            if (!personaSelected) {
                personaSelected = true;
                selectedPersona = persona;
                scrollTriggered = true;
                showPersonaJourney(persona, true);
            } else {
                // Allow clicking even if already selected (to switch)
                personaSelected = true;
                selectedPersona = persona;
                scrollTriggered = true;
                showPersonaJourney(persona, true);
                // Show conversation section after persona selection
                showConversationAfterPersona();
            }
        });
    });
    
    // Set up observer to automatically select when persona section is visible
    setupPersonaScrollObserver();
});

function setupPersonaScrollObserver() {
    const personasSection = document.getElementById('personas');
    if (!personasSection) return;
    
    let autoSelectTimeout = null;
    let autoExpandTimeout = null;
    let hasScrolled = false;
    let wasInitiallyVisible = false;
    let detailsExpanded = false;
    
    // Function to expand all persona details (auto-expand on scroll)
    function expandAllPersonaDetails() {
        if (areAnyDetailsExpanded()) return;
        const personas = ['jamie', 'catherine', 'christina'];
        personas.forEach(persona => {
            const details = document.getElementById(`${persona}-details`);
            if (details && !details.classList.contains('expanded')) {
                details.classList.add('expanded');
            }
        });
        detailsExpanded = true;
    }
    
    // Function to collapse all persona details
    function collapseAllPersonaDetails() {
        if (!areAnyDetailsExpanded()) return;
        const personas = ['jamie', 'catherine', 'christina'];
        personas.forEach(persona => {
            const details = document.getElementById(`${persona}-details`);
            if (details && details.classList.contains('expanded')) {
                details.classList.remove('expanded');
            }
        });
        detailsExpanded = false;
    }
    
    // Check if section is initially visible on page load
    const checkInitialVisibility = () => {
        const rect = personasSection.getBoundingClientRect();
        wasInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    };
    
    checkInitialVisibility();
    
    // Track if user has scrolled
    let scrollTracked = false;
    const trackScroll = () => {
        if (!scrollTracked && window.scrollY > 0) {
            hasScrolled = true;
            scrollTracked = true;
            window.removeEventListener('scroll', trackScroll);
        }
    };
    window.addEventListener('scroll', trackScroll, { passive: true });
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only trigger if user has scrolled to this section (not on initial load)
            if (entry.isIntersecting && !personaSelected && !scrollTriggered) {
                // If section was initially visible, wait for user to scroll first
                if (wasInitiallyVisible && !hasScrolled) {
                    return;
                }
                
                // Auto-expand details when section comes into view
                if (!areAnyDetailsExpanded()) {
                    if (autoExpandTimeout) {
                        clearTimeout(autoExpandTimeout);
                    }
                    autoExpandTimeout = setTimeout(() => {
                        if (!personaSelected && !scrollTriggered) {
                            expandAllPersonaDetails();
                        }
                    }, 500); // Expand after 0.5 seconds of viewing
                }
                
                // Clear any existing timeout
                if (autoSelectTimeout) {
                    clearTimeout(autoSelectTimeout);
                }
                
                // Auto-select after user has been viewing the section for 0.8 seconds
                autoSelectTimeout = setTimeout(() => {
                    if (!personaSelected && !scrollTriggered) {
                        scrollTriggered = true;
                        // Randomly select a persona
                        const personas = ['jamie', 'cathy', 'christina'];
                        const randomPersona = personas[Math.floor(Math.random() * personas.length)];
                        personaSelected = true;
                        selectedPersona = randomPersona;
                        
                        // Collapse details when persona is selected
                        collapseAllPersonaDetails();
                        
                        // Add visual indicator with animation
                        const selectedCard = document.querySelector(`[data-persona="${randomPersona}"]`);
                        if (selectedCard) {
                            selectedCard.style.transition = 'all 0.5s ease';
                            selectedCard.style.transform = 'scale(1.08)';
                            selectedCard.style.boxShadow = '0 25px 50px rgba(99, 102, 241, 0.6)';
                            selectedCard.style.zIndex = '10';
                            
                            setTimeout(() => {
                                selectedCard.style.transform = 'scale(1.02)';
                                selectedCard.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.4)';
                            }, 800);
                        }
                        
                        // Show journey
                        setTimeout(() => {
                            showPersonaJourney(randomPersona, false);
                            // Show conversation section after persona selection
                            showConversationAfterPersona();
                        }, 1200);
                    }
                }, 800);
            } else if (!entry.isIntersecting && !personaSelected && !scrollTriggered) {
                // Collapse details when scrolling away
                if (areAnyDetailsExpanded()) {
                    collapseAllPersonaDetails();
                }
                
                // If user scrolls past without waiting, select immediately (only if they've scrolled)
                if (entry.boundingClientRect.top < -50 && hasScrolled) {
                    if (autoSelectTimeout) {
                        clearTimeout(autoSelectTimeout);
                    }
                    if (autoExpandTimeout) {
                        clearTimeout(autoExpandTimeout);
                    }
                    scrollTriggered = true;
                    const personas = ['jamie', 'catherine', 'christina'];
                    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
                    personaSelected = true;
                    selectedPersona = randomPersona;
                    collapseAllPersonaDetails();
                    showPersonaJourney(randomPersona, false);
                    // Show conversation section after persona selection
                    showConversationAfterPersona();
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });
    
    scrollObserver.observe(personasSection);
}

function showPersonaJourney(persona, fromClick = true) {
    console.log('showPersonaJourney called with:', persona); // Debug log
    
    // Show conversation section when persona journey starts
    showConversationAfterPersona();
    
    // Collapse all persona details when journey starts
    const personas = ['jamie', 'catherine', 'christina'];
    personas.forEach(p => {
        const details = document.getElementById(`${p}-details`);
        if (details && details.classList.contains('expanded')) {
            details.classList.remove('expanded');
        }
    });
    
    // Hide all journey sections first
    document.getElementById('jamie-journey').style.display = 'none';
    document.getElementById('cathy-journey').style.display = 'none';
    document.getElementById('christina-journey').style.display = 'none';
    
    // Show selected persona's journey and scroll to it
    if (persona === 'jamie') {
        const jamieJourney = document.getElementById('jamie-journey');
        jamieJourney.style.display = 'flex';
        animateJourneySteps('jamie-journey');
        console.log('Jamie journey shown');
        
        // Scroll to Jamie's journey
        if (fromClick) {
            setTimeout(() => {
                jamieJourney.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else if (persona === 'cathy' || persona === 'catherine') {
        const cathyJourney = document.getElementById('cathy-journey');
        cathyJourney.style.display = 'flex';
        animateJourneySteps('cathy-journey');
        console.log('Cathy journey shown');
        
        // Scroll to Cathy's journey
        if (fromClick) {
            setTimeout(() => {
                cathyJourney.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else if (persona === 'christina') {
        const christinaJourney = document.getElementById('christina-journey');
        christinaJourney.style.display = 'flex';
        animateJourneySteps('christina-journey');
        console.log('Christina journey shown');
        
        // Scroll to Christina's journey
        if (fromClick) {
            setTimeout(() => {
                christinaJourney.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else {
        console.error('Unknown persona:', persona);
    }
}

function toggleCathyView() {
    const pictureView = document.getElementById('cathy-picture-view');
    const comparisonView = document.getElementById('cathy-comparison-view');
    const toggleButton = document.getElementById('cathy-toggle');
    
    if (pictureView.classList.contains('active')) {
        pictureView.classList.remove('active');
        comparisonView.classList.add('active');
        toggleButton.querySelector('.toggle-label').textContent = 'Show Picture';
    } else {
        pictureView.classList.add('active');
        comparisonView.classList.remove('active');
        toggleButton.querySelector('.toggle-label').textContent = 'Switch View';
    }
}

function animateJourneySteps(journeyId) {
    const journeySection = document.getElementById(journeyId);
    const steps = journeySection.querySelectorAll('.journey-step');
    
    // Reset all steps
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Activate first step
    if (steps.length > 0) {
        steps[0].classList.add('active');
    }
    
    // Re-initialize scroll animations for info blocks in this journey
    reinitializeScrollAnimations();
    
    // Set up scroll-based step activation
    let currentStep = 0;
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepIndex = parseInt(entry.target.getAttribute('data-step')) - 1;
                if (stepIndex > currentStep) {
                    currentStep = stepIndex;
                    // Animate bars when step becomes active
                    if (entry.target.querySelector('.bar-chart')) {
                        animateBars(entry.target);
                    }
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px'
    });
    
    steps.forEach(step => {
        stepObserver.observe(step);
    });
    
    // Check if we've reached the end of the journey
    const lastStep = steps[steps.length - 1];
    const endObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === lastStep) {
                // Show conclusion after a delay
                setTimeout(() => {
                    showConclusion();
                    // Re-initialize animations for conclusion items
                    reinitializeScrollAnimations();
                }, 2000);
            }
        });
    }, {
        threshold: 0.8
    });
    
    endObserver.observe(lastStep);
}

function animateBars(container) {
    const bars = container.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(1)';
            bar.style.opacity = '1';
        }, index * 100);
    });
}

// Text-to-Speech with AI voices
let currentSpeech = null;
const personaVoices = {
    christina: { voice: 'Google UK English Female', pitch: 1.1, rate: 0.95 },
    jamie: { voice: 'Google US English Female', pitch: 1.0, rate: 1.0 },
    catherine: { voice: 'Google US English Female', pitch: 0.95, rate: 1.05 }
};

function getPersonaName(dialog) {
    if (dialog.classList.contains('christina')) return 'christina';
    if (dialog.classList.contains('jamie')) return 'jamie';
    if (dialog.classList.contains('catherine')) return 'catherine';
    return null;
}

async function speakText(text, personaName, bubbleElement) {
    // Initialize voices if not done yet
    initializeVoices();
    
    // Stop any current speech
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }
    
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        // Still show bubble
        if (bubbleElement) {
            bubbleElement.style.opacity = '1';
            bubbleElement.style.transform = 'scale(1)';
        }
        return Promise.resolve();
    }
    
    // Ensure voices are loaded - wait longer if needed
    // Use the pre-loaded promise if available, otherwise wait
    if (voicesReadyPromise) {
        await voicesReadyPromise;
    } else {
        await ensureVoicesLoaded();
    }
    
    // Double check voices are available
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        console.log('No voices available, retrying...');
        // Wait and retry up to 3 times
        for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                console.log('Voices loaded after retry:', voices.length);
                break;
            }
        }
    }
    
    if (voices.length === 0) {
        console.warn('No voices available after retries');
        // Still show bubble even without voice
        if (bubbleElement) {
            bubbleElement.style.opacity = '1';
            bubbleElement.style.transform = 'scale(1)';
        }
        return Promise.resolve();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceConfig = personaVoices[personaName] || personaVoices.jamie;
    
    // Use the voices we already have
    
    // Try to find the preferred voice, fallback to any female voice
    let preferredVoice = voices.find(voice => 
        voice.name.includes(voiceConfig.voice)
    );
    
    if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman')
        );
    }
    
    if (!preferredVoice && voices.length > 0) {
        // Fallback to any available voice
        preferredVoice = voices[0];
    }
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;
    utterance.volume = 0.9;
    utterance.lang = 'en-US';
    
    currentSpeech = utterance;
    
    // Show message bubble when voice starts
    utterance.onstart = () => {
        if (bubbleElement) {
            bubbleElement.style.opacity = '1';
            bubbleElement.style.transform = 'scale(1)';
        }
    };
    
    // Return a promise that resolves when speech finishes
    return new Promise((resolve, reject) => {
        utterance.onend = () => {
            console.log('Voice ended:', text.substring(0, 50) + '...');
            currentSpeech = null;
            resolve(); // Resolve when speech finishes
        };
        
        utterance.onerror = (error) => {
            console.log('Speech error:', error);
            currentSpeech = null;
            // Still show bubble even if speech fails
            if (bubbleElement) {
                bubbleElement.style.opacity = '1';
                bubbleElement.style.transform = 'scale(1)';
            }
            // Resolve anyway so next message can proceed
            resolve();
        };
        
        // Speak the text - try to speak immediately
        try {
            // Cancel any ongoing speech first
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                // Wait a bit before starting new speech
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                    console.log('Speaking:', text.substring(0, 50) + '...', 'Voice:', utterance.voice?.name || 'default');
                }, 200);
            } else {
                // Start speaking immediately
                window.speechSynthesis.speak(utterance);
                console.log('Speaking:', text.substring(0, 50) + '...', 'Voice:', utterance.voice?.name || 'default');
            }
        } catch (error) {
            console.log('Speech synthesis error:', error);
            // Fallback: show bubble even if speech fails
            if (bubbleElement) {
                bubbleElement.style.opacity = '1';
                bubbleElement.style.transform = 'scale(1)';
            }
            resolve(); // Resolve so next message can proceed
        }
    });
}

// Load voices when available
let voicesReady = false;
const ensureVoicesLoaded = () => {
    return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
            console.log('Speech synthesis not available');
            resolve(false);
            return;
        }
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            voicesReady = true;
            console.log('Voices loaded:', voices.length);
            resolve(true);
            return;
        }
        
        // Wait for voices to load with timeout
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        const checkVoices = () => {
            attempts++;
            const loadedVoices = window.speechSynthesis.getVoices();
            if (loadedVoices.length > 0) {
                voicesReady = true;
                console.log('Voices loaded after wait:', loadedVoices.length);
                resolve(true);
            } else if (attempts < maxAttempts) {
                setTimeout(checkVoices, 100);
            } else {
                console.log('Timeout waiting for voices');
                resolve(false);
            }
        };
        
        window.speechSynthesis.onvoiceschanged = checkVoices;
        setTimeout(checkVoices, 100);
    });
};

// Initialize voices on page load and user interaction
let voicesInitialized = false;
let voicesReadyPromise = null;

const initializeVoices = () => {
    if (voicesInitialized) return;
    voicesInitialized = true;
    
    if ('speechSynthesis' in window) {
        // Pre-load voices immediately
        voicesReadyPromise = ensureVoicesLoaded();
        // Also listen for voice changes
        window.speechSynthesis.onvoiceschanged = () => {
            voicesReadyPromise = ensureVoicesLoaded();
        };
        // Force multiple voice checks
        setTimeout(() => {
            voicesReadyPromise = ensureVoicesLoaded();
        }, 300);
        setTimeout(() => {
            voicesReadyPromise = ensureVoicesLoaded();
        }, 1000);
    }
};

// Initialize on page load
initializeVoices();

// Also initialize on any user interaction (required by some browsers)
const initOnInteraction = () => {
    initializeVoices();
    // Pre-load voices when user interacts
    if (voicesReadyPromise) {
        voicesReadyPromise.then(() => {
            console.log('Voices ready after user interaction');
        });
    }
};

document.addEventListener('click', initOnInteraction, { once: true });
document.addEventListener('scroll', initOnInteraction, { once: true });
document.addEventListener('touchstart', initOnInteraction, { once: true });
document.addEventListener('mousemove', initOnInteraction, { once: true });
document.addEventListener('keydown', initOnInteraction, { once: true });

async function animateConversationScene(scene) {
    if (!scene || scene.dataset.animated === 'true') {
        console.log('Scene already animated, skipping:', scene.getAttribute('data-scene'));
        return;
    }
    scene.dataset.animated = 'true';
    console.log('Starting animation for scene:', scene.getAttribute('data-scene'));
    
    // Hide all repeat buttons first
    const allRepeatButtons = document.querySelectorAll('.repeat-conversation-btn');
    allRepeatButtons.forEach(btn => btn.classList.remove('show'));
    
    const dialogs = Array.from(scene.querySelectorAll('.persona-dialog'));
    const chatContainer = scene.querySelector('.chat-container');
    const repeatButton = chatContainer ? chatContainer.querySelector('.repeat-conversation-btn') : scene.querySelector('.repeat-conversation-btn');
    
    // Hide repeat button initially
    if (repeatButton) {
        repeatButton.classList.remove('show');
        repeatButton.style.opacity = '0';
        repeatButton.style.visibility = 'hidden';
        console.log('Repeat button found for scene:', scene.getAttribute('data-scene'));
    } else {
        console.log('Repeat button NOT found for scene:', scene.getAttribute('data-scene'));
    }
    
    // Reset all dialogs
    dialogs.forEach(dialog => {
        dialog.classList.remove('active', 'fade-out');
        dialog.style.maxHeight = '0';
        dialog.style.opacity = '0';
        // Remove typing indicators
        const typingIndicators = dialog.querySelectorAll('.typing-indicator');
        typingIndicators.forEach(indicator => indicator.remove());
        // Reset bubble opacity
        const bubble = dialog.querySelector('.chat-bubble');
        if (bubble) {
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.95)';
        }
    });
    
    // Show messages sequentially with natural delays between conversations
    for (let index = 0; index < dialogs.length; index++) {
        const dialog = dialogs[index];
        const chatMessage = dialog.querySelector('.chat-message');
        const bubble = dialog.querySelector('.chat-bubble');
        
        // Show dialog container
        dialog.classList.remove('fade-out');
        dialog.style.maxHeight = '200px';
        dialog.style.opacity = '1';
        
        // Add typing indicator with "Speaking..." label
        let typingIndicator = chatMessage.querySelector('.typing-indicator');
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            const personaName = getPersonaName(dialog);
            const displayName = personaName === 'christina' ? 'Christina' : 
                               personaName === 'jamie' ? 'Jamie' : 
                               personaName === 'catherine' ? 'Catherine' : 'Someone';
            typingIndicator.innerHTML = `
                <span class="typing-label">${displayName} is speaking...</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            const bubbleWrapper = chatMessage.querySelector('.chat-bubble-wrapper');
            if (bubbleWrapper) {
                bubbleWrapper.insertBefore(typingIndicator, bubbleWrapper.firstChild);
            }
        }
        typingIndicator.classList.add('active');
        
        // Hide bubble initially (keep it hidden)
        if (bubble) {
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.95)';
            bubble.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        }
        
        // Show "Speaking..." indicator first (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Remove typing indicator
        typingIndicator.classList.remove('active');
        await new Promise(resolve => setTimeout(resolve, 300));
        typingIndicator.remove();
        
        // NOW show the message bubble after "speaking..." is done
        dialog.classList.add('active');
        if (bubble) {
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
        }
        
        // Wait a few seconds before showing next message (natural conversation pace)
        const delayBetweenMessages = 3500; // 3.5 seconds between messages
        await new Promise(resolve => setTimeout(resolve, delayBetweenMessages));
        
        // Show repeat button after last message
        if (index === dialogs.length - 1 && repeatButton) {
            setTimeout(() => {
                repeatButton.classList.add('show');
                repeatButton.style.opacity = '1';
                repeatButton.style.visibility = 'visible';
                repeatButton.style.display = 'flex';
                scene.dataset.animationComplete = 'true';
                console.log('Repeat button shown for scene:', scene.getAttribute('data-scene'));
            }, 500);
        }
    }
}

function repeatConversationScene(button) {
    const sceneNumber = button.getAttribute('data-scene');
    const scene = document.querySelector(`.conversation-scene[data-scene="${sceneNumber}"]`);
    
    if (scene) {
        // Reset the scene
        delete scene.dataset.animated;
        delete scene.dataset.animationComplete;
        // Reset the global flag so it can auto-start again if needed
        if (sceneNumber === '1') {
            conversationHasStarted = false;
        }
        
        // Hide repeat button
        button.classList.remove('show');
        
        // Stop any ongoing speech (if any exists, though we're not using it anymore)
        if (currentSpeech && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            currentSpeech = null;
        }
        
        // Reset all dialogs in this scene
        const dialogs = scene.querySelectorAll('.persona-dialog');
        dialogs.forEach(dialog => {
            dialog.classList.remove('active', 'fade-out');
            dialog.style.maxHeight = '0';
            dialog.style.opacity = '0';
            const typingIndicators = dialog.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(indicator => indicator.remove());
            const bubble = dialog.querySelector('.chat-bubble');
            if (bubble) {
                bubble.style.opacity = '0';
                bubble.style.transform = 'scale(0.95)';
            }
        });
        
        // Restart animation
        setTimeout(() => {
            animateConversationScene(scene);
        }, 300);
    }
}

// Show conversation section after persona selection
function showConversationAfterPersona() {
    const conversation = document.getElementById('conversation');
    if (conversation) {
        // Make sure it's visible (it's already in the HTML flow, just ensure display is correct)
        conversation.style.display = 'flex';
        reinitializeScrollAnimations();
        
        // Initialize Scene 1 by default when conversation section is shown
        // Use a longer delay to ensure DOM is ready
        setTimeout(() => {
            const scene1 = document.querySelector('.conversation-scene[data-scene="1"]');
            if (scene1) {
                // Use selectScene to properly initialize Scene 1
                selectScene(1);
            } else {
                console.error('Scene 1 not found when trying to show conversation');
                // Retry after a bit more time
                setTimeout(() => {
                    selectScene(1);
                }, 500);
            }
        }, 400);
    }
}

function showConversationSection() {
    const conversation = document.getElementById('conversation');
    if (conversation && conversation.style.display === 'none') {
        conversation.style.display = 'flex';
        conversation.scrollIntoView({ behavior: 'smooth', block: 'start' });
        reinitializeScrollAnimations();
        
        // Initialize Scene 1 by default when conversation section is shown
        setTimeout(() => {
            const scene1 = document.querySelector('.conversation-scene[data-scene="1"]');
            if (scene1 && !scene1.classList.contains('active')) {
                selectScene(1);
            }
        }, 500);
        
        return true;
    }
    return false;
}

function showConclusion() {
    const conversationJustShown = showConversationSection();
    const conclusion = document.getElementById('conclusion');
    if (conversationJustShown) {
        setTimeout(() => {
            conclusion.style.display = 'flex';
            reinitializeScrollAnimations();
        }, 800);
    } else {
        conclusion.style.display = 'flex';
        reinitializeScrollAnimations();
    }
    // User will scroll manually to see the conclusion
}

function goBackToPersonas() {
    // Reset persona selection state
    personaSelected = false;
    selectedPersona = null;
    scrollTriggered = false;
    
    // Collapse all persona details when going back
    const personas = ['jamie', 'catherine', 'christina'];
    personas.forEach(p => {
        const details = document.getElementById(`${p}-details`);
        if (details && details.classList.contains('expanded')) {
            details.classList.remove('expanded');
        }
    });
    
    // Hide all journey sections
    document.getElementById('jamie-journey').style.display = 'none';
    document.getElementById('cathy-journey').style.display = 'none';
    document.getElementById('christina-journey').style.display = 'none';
    document.getElementById('conversation').style.display = 'none';
    document.getElementById('conclusion').style.display = 'none';
    
    // Show initial sections
    document.getElementById('intro').style.display = 'flex';
    document.getElementById('background').style.display = 'flex';
    document.getElementById('personas').style.display = 'flex';
    
    // Stop any ongoing speech
    if (currentSpeech) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    
    // Stop any ongoing speech
    if (currentSpeech) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    
    // Reset conversation animations
    const conversationScenes = document.querySelectorAll('.conversation-scene');
    conversationScenes.forEach(scene => {
        scene.classList.remove('animate-in');
        delete scene.dataset.animated;
        const dialogs = scene.querySelectorAll('.persona-dialog');
        dialogs.forEach(dialog => {
            dialog.classList.remove('active', 'fade-out', 'speak', 'animate-in');
            dialog.style.maxHeight = '0';
            dialog.style.opacity = '0';
            // Remove typing indicators
            const typingIndicators = dialog.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(indicator => indicator.remove());
            // Reset bubble opacity
            const bubble = dialog.querySelector('.chat-bubble');
            if (bubble) {
                bubble.style.opacity = '1';
            }
        });
    });
    
    // Scroll to personas section
    setTimeout(() => {
        window.scrollTo({
            top: document.getElementById('personas').offsetTop,
            behavior: 'smooth'
        });
    }, 100);
}

function restartStory() {
    goBackToPersonas();
}

// Smooth scroll behavior for journey steps
let isScrolling = false;

window.addEventListener('wheel', (e) => {
    const activeJourney = document.querySelector('.journey-section[style*="display: flex"]');
    if (!activeJourney) return;
    
    const steps = activeJourney.querySelectorAll('.journey-step');
    if (steps.length === 0) return;
    
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const stepHeight = windowHeight;
    
    // Find which step we're currently viewing
    let currentStepIndex = -1;
    steps.forEach((step, index) => {
        const stepTop = step.offsetTop;
        const stepBottom = stepTop + step.offsetHeight;
        if (currentScroll >= stepTop - windowHeight / 2 && currentScroll < stepBottom - windowHeight / 2) {
            currentStepIndex = index;
        }
    });
    
    if (currentStepIndex === -1) return;
    
    // Prevent default scroll if we're between steps
    const currentStep = steps[currentStepIndex];
    const nextStep = steps[currentStepIndex + 1];
    
    if (e.deltaY > 0 && nextStep) {
        // Scrolling down
        const currentStepBottom = currentStep.offsetTop + currentStep.offsetHeight;
        if (currentScroll + windowHeight >= currentStepBottom - 100) {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    } else if (e.deltaY < 0 && currentStepIndex > 0) {
        // Scrolling up
        const currentStepTop = currentStep.offsetTop;
        if (currentScroll <= currentStepTop + 100) {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                steps[currentStepIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    }
}, { passive: false });

// Scene selection functionality
// Make selectScene globally accessible
window.selectScene = function(sceneNumber) {
    // Stop any ongoing speech (if any exists, though we're not using it anymore)
    if (currentSpeech && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    
    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.scene-toggle-btn');
    toggleButtons.forEach(btn => {
        if (btn.getAttribute('data-scene') == sceneNumber) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Hide all scenes
    const allScenes = document.querySelectorAll('.conversation-scene');
    allScenes.forEach(scene => {
        scene.classList.remove('active');
        // Reset scene state
        delete scene.dataset.animated;
        delete scene.dataset.animationComplete;
        
        // Hide repeat buttons
        const repeatBtn = scene.querySelector('.repeat-conversation-btn');
        if (repeatBtn) {
            repeatBtn.classList.remove('show');
            repeatBtn.style.opacity = '0';
            repeatBtn.style.visibility = 'hidden';
        }
        
        // Reset all dialogs in this scene
        const dialogs = scene.querySelectorAll('.persona-dialog');
        dialogs.forEach(dialog => {
            dialog.classList.remove('active', 'fade-out');
            dialog.style.maxHeight = '0';
            dialog.style.opacity = '0';
            const typingIndicators = dialog.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(indicator => indicator.remove());
            const bubble = dialog.querySelector('.chat-bubble');
            if (bubble) {
                bubble.style.opacity = '0';
                bubble.style.transform = 'scale(0.95)';
            }
        });
    });
    
    // Show selected scene
    const selectedScene = document.querySelector(`.conversation-scene[data-scene="${sceneNumber}"]`);
    if (selectedScene) {
        console.log('Selecting scene:', sceneNumber, selectedScene);
        selectedScene.classList.add('active');
        // Force display to ensure it's visible (override CSS)
        selectedScene.style.display = 'block';
        selectedScene.style.visibility = 'visible';
        selectedScene.style.opacity = '1';
        
        // Start animation after a short delay to ensure scene is visible
        setTimeout(async () => {
            // Double check scene is visible before animating
            if (selectedScene.classList.contains('active')) {
                console.log('Starting animation for scene:', sceneNumber);
                await animateConversationScene(selectedScene);
            }
        }, 300);
    } else {
        console.error('Scene not found:', sceneNumber);
    }
};

// Initialize bar animations
document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.transform = 'scaleY(0)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
    });
    
    // Set up scroll animations for info blocks
    setupScrollAnimations();
    
    // Set up auto-start for conversation section when scrolled into view
    setupConversationAutoStart();
});

// Scroll-triggered animations for info blocks
function setupScrollAnimations() {
    // Get all elements that need animation, but only those not already animated
    const animatedElements = document.querySelectorAll('.timeline-content:not(.animate-in), .metric-card:not(.animate-in), .conclusion-point:not(.animate-in), .point-item:not(.animate-in), .problem-item:not(.animate-in), .conversation-scene:not(.animate-in), .persona-dialog:not(.animate-in)');
    
    if (animatedElements.length === 0) return;
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Special handling for conversation scenes - now handled by manual selection buttons
                // Auto-trigger is disabled in favor of manual scene selection via toggle buttons
                if (entry.target.classList.contains('conversation-scene')) {
                    // Only add animate-in class for styling, but don't auto-trigger animation
                    // Animation is now controlled by selectScene() function
                    entry.target.classList.add('animate-in');
                    return; // Skip other processing for conversation scenes
                }
                
                // Add small delay for staggered effect, especially for metric cards and point items
                let delay = 0;
                if (entry.target.classList.contains('metric-card')) {
                    delay = index * 100;
                } else if (entry.target.classList.contains('point-item')) {
                    const pointNumber = parseInt(entry.target.getAttribute('data-point')) || 1;
                    delay = (pointNumber - 1) * 200; // 200ms delay between each point
                } else if (entry.target.classList.contains('problem-item')) {
                    const problemNumber = parseInt(entry.target.getAttribute('data-problem')) || 1;
                    delay = (problemNumber - 1) * 200; // 200ms delay between each problem item
                } else if (entry.target.classList.contains('persona-dialog')) {
                    delay = index * 150;
                }
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                // Stop observing once animated
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: [0, 0.1, 0.3, 0.5],
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Re-initialize animations when journeys are shown (for dynamically loaded content)
function reinitializeScrollAnimations() {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
        setupScrollAnimations();
    }, 100);
}

// Auto-start Scene 1 when conversation section is scrolled into view
let conversationHasStarted = false; // Track if Scene 1 has already started (global to persist across function calls)

function setupConversationAutoStart() {
    const conversationSection = document.getElementById('conversation');
    if (!conversationSection) return;
    
    const conversationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !conversationHasStarted) {
                // When conversation section comes into view, start Scene 1
                const intersectionRatio = entry.intersectionRatio;
                const rect = entry.boundingClientRect;
                const viewportHeight = window.innerHeight;
                
                // Only trigger when section is at least 30% visible and in the viewport
                if (intersectionRatio >= 0.3 && rect.top < viewportHeight * 0.7) {
                    conversationHasStarted = true;
                    console.log('Conversation section scrolled into view, starting Scene 1');
                    
                    // Small delay to ensure smooth transition
                    setTimeout(() => {
                        const scene1 = document.querySelector('.conversation-scene[data-scene="1"]');
                        if (scene1) {
                            // Check if scene is already active and animated
                            if (scene1.classList.contains('active') && scene1.dataset.animated === 'true') {
                                // Already started, do nothing
                                return;
                            }
                            
                            // Initialize Scene 1 if not already active
                            if (!scene1.classList.contains('active')) {
                                selectScene(1);
                            } else if (!scene1.dataset.animated) {
                                // Scene 1 is active but not animated yet, start animation
                                animateConversationScene(scene1);
                            }
                        }
                    }, 300);
                    
                    // Stop observing once started
                    conversationObserver.unobserve(conversationSection);
                }
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Start observing the conversation section
    conversationObserver.observe(conversationSection);
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeJourney = document.querySelector('.journey-section[style*="display: flex"]');
    if (!activeJourney) return;
    
    const steps = Array.from(activeJourney.querySelectorAll('.journey-step'));
    if (steps.length === 0) return;
    
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    
    let currentStepIndex = -1;
    steps.forEach((step, index) => {
        const stepTop = step.offsetTop;
        const stepBottom = stepTop + step.offsetHeight;
        if (currentScroll >= stepTop - windowHeight / 2 && currentScroll < stepBottom - windowHeight / 2) {
            currentStepIndex = index;
        }
    });
    
    if (e.key === 'ArrowDown' && currentStepIndex < steps.length - 1) {
        e.preventDefault();
        steps[currentStepIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'ArrowUp' && currentStepIndex > 0) {
        e.preventDefault();
        steps[currentStepIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

