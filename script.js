// Global variable to store popup data
let popupData = null;

// Load popup data from JSON
async function loadPopupData() {
    try {
        const response = await fetch('assets/data/popups.json');
        popupData = await response.json();
    } catch (error) {
        console.error('Error loading popup data:', error);
        // Fallback to default data if JSON fails to load
        popupData = {
            initial: {
                jamie: "<b>Jamie</b><br>University graduate looking for employment",
                cathy: "<b>Catherine</b><br>Experienced professional navigating career changes",
                christina: "<b>Christina</b><br>Adapting to the changing job market"
            },
            popups: {
                "4": { persona: "jamie", content: "hey, i graduated a year ago but still can't find a job." },
                "5": { persona: "catherine", content: "I know...its really frustrating. i also learned AI thinking it would upskill my resume, but I could only land a pert-time job!" },
                "6": { persona: "christina", content: "i can feel you guys, but I'm glad that AI doesn't have as much affect in my healthcare industry and also I learned how to work with AI which helped me find a job. But it's also hard for me to get a promotion or a high paid job because we also have AI competing with us." },
                "7": { persona: "jamie", content: "Christina, you have a job. It must be easy for you to pay the rent and other expenses, right?" },
                "8": { persona: "christina", content: "I've been trying to take more AI workshops this year… but honestly, it's been tough. Rent keeps going up, and every time I look at a new certification, I feel like I have to choose between paying for professional growth or just maintaining my living situation." }
            }
        };
    }
}

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
document.addEventListener('DOMContentLoaded', async () => {
    // Load popup data first
    await loadPopupData();
    
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        observer.observe(step);
    });

    // Set up background section scroll animations
    setupBackgroundScrollAnimations();

    // Re-apply when new elements are added dynamically
    const mutationObserver = new MutationObserver(() => {
        // Mutation observer for dynamic content
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Background section scroll-triggered animations
// Global access to background animation functions
window.backgroundAnimations = {
    animatedParts: new Set(),
    animatePart: null
};

function setupBackgroundScrollAnimations() {
    const backgroundSection = document.getElementById('background');
    if (!backgroundSection) return;

    // Track which parts have been animated
    const animatedParts = window.backgroundAnimations.animatedParts;

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
        graph3.style.top = randomIntFromInterval(60, 85) + '%'; // 60-85% (below text area)
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
    }
    
    // Expose animatePart globally
    window.backgroundAnimations.animatePart = animatePart;

    // Handle scroll to trigger animations based on scroll position
    const handleScroll = () => {
        const rect = backgroundSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress through the section
        // When top is at 0, progress is 0. When bottom is at windowHeight, progress is 1.
        // The section is taller than viewport (300vh), so we scroll through it.

        // Start animating when the section top reaches the top of viewport
        if (rect.top <= 0) {
            const totalScrollableDistance = rect.height - windowHeight;
            const scrolledDistance = Math.abs(rect.top);
            const progress = Math.min(Math.max(scrolledDistance / totalScrollableDistance, 0), 1);

            // Trigger animations at specific progress points
            if (progress > 0.1) animatePart(1);
            if (progress > 0.35) animatePart(2);
            if (progress > 0.6) animatePart(3);
        } else {
            // Reset if scrolled back up? Optional. For now, let's keep them shown once revealed.
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
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
                // Conversation section removed
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
    
    // Conversation section removed

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

// Conversation section removed - functions no longer needed
function showConversationAfterPersona() {
    // Conversation section removed
}

function showConversationSection() {
    // Conversation section removed
    return false;
}

function showConclusion() {
    const conclusion = document.getElementById('conclusion');
    if (conclusion) {
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
    // Conversation section removed
    document.getElementById('conclusion').style.display = 'none';

    // Show initial sections
    document.getElementById('intro').style.display = 'flex';
    document.getElementById('background').style.display = 'flex';
    document.getElementById('personas').style.display = 'flex';
    
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
    
    // Conversation section removed - no longer needed
    // setupConversationAutoStart();
});

// Scroll-triggered animations for info blocks
function setupScrollAnimations() {
    // Get all elements that need animation, but only those not already animated
    const animatedElements = document.querySelectorAll('.timeline-content:not(.animate-in), .metric-card:not(.animate-in), .conclusion-point:not(.animate-in), .point-item:not(.animate-in), .problem-item:not(.animate-in)');
    
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
                } else if (entry.target.classList.contains('conclusion-point')) {
                    const personaOrder = parseInt(entry.target.getAttribute('data-order')) || (index + 1);
                    delay = (personaOrder - 1) * 350;
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

// Conversation section removed - functions no longer needed
// let conversationHasStarted = false;
// function setupConversationAutoStart() { ... }

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

// Initialize Location Map (Canada -> Oshawa)
let locationMap = null;
let locationMapZoomState = 0; // 0 = Canada (show chart), 1 = Zooming to Oshawa, 2 = Oshawa (show chart)

function initializeLocationMap() {
    const mapContainer = document.getElementById('location-map-container');
    if (!mapContainer || typeof L === 'undefined') return;

    // Start at Canada view
    locationMap = L.map('location-map-container', {
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        touchZoom: false
    }).setView([56.0, -95.0], 4); // Canada center, zoom level 4

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(locationMap);

    locationMapZoomState = 0; // Start at Canada
}

// Function to handle location map zoom on spacebar
function handleLocationMapZoom() {
    if (!locationMap) return;

    if (locationMapZoomState === 0) {
        // First press: Show and slide up chart_canada.jpeg
        const canadaChart = document.getElementById('chart-canada-container');
        if (canadaChart) {
            canadaChart.classList.add('show');
        }
        locationMapZoomState = 1;
    } else if (locationMapZoomState === 1) {
        // Second press: Slide up and fade out chart_canada.jpeg, then zoom to Oshawa
        const canadaChart = document.getElementById('chart-canada-container');
        if (canadaChart) {
            canadaChart.classList.add('fade-out');
        }
        
        // Zoom to Oshawa
        locationMap.flyTo([43.8971, -78.8658], 12, {
            duration: 1,
            easeLinearity: 0.25
        });
        locationMapZoomState = 2;
        
        // After zoom animation completes, show chart_oshawa.jpeg
        setTimeout(() => {
            const oshawaChart = document.getElementById('chart-oshawa-container');
            if (oshawaChart) {
                oshawaChart.classList.add('show');
            }
        }, 500); // Wait for flyTo animation to complete (1.5 seconds)
    }
    // If already at Oshawa, do nothing (spacebar handler will scroll to next section)
}

function updateLocationChartsVisibility() {
    const locationMapSection = document.getElementById('location-map');
    if (!locationMapSection) return;

    const rect = locationMapSection.getBoundingClientRect();
    const isSectionInView = rect.top < window.innerHeight && rect.bottom > 0;

    const canadaChart = document.getElementById('chart-canada-container');
    const oshawaChart = document.getElementById('chart-oshawa-container');

    [canadaChart, oshawaChart].forEach(chart => {
        if (!chart) return;
        if (isSectionInView) {
            chart.classList.remove('hidden-outside');
        } else {
            chart.classList.add('hidden-outside');
        }
    });
}

// Initialize Oshawa Map with Persona Images
function initializeOshawaMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Oshawa, ON coordinates
    const oshawaLat = 43.8971;
    const oshawaLng = -78.8658;

    // Initialize map centered on Oshawa with zoom and scroll disabled
    const map = L.map('map-container', {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false,
        touchZoom: false
    }).setView([oshawaLat, oshawaLng], 12);

    // No tile layer - using background image instead

    // Create custom icon function
    function createPersonaIcon(imagePath, className, popupAnchor) {
        return L.divIcon({
            className: `persona-marker ${className}`,
            html: `<img src="${imagePath}" style="width: 120px; height: 120px; object-fit: contain; cursor: move; cursor: grab;" />`,
            iconSize: [120, 120],
            iconAnchor: [60, 60],
            popupAnchor: popupAnchor || [0, -60]
        });
    }

    // Place markers horizontally side by side
    // Jamie - leftmost, popup above and to the right
    const jamieIcon = createPersonaIcon('assets/images/1jamie.png', 'jamie-marker', [0, -80]);
    const jamieMarker = L.marker([oshawaLat - 0.015, oshawaLng - 0.08], { icon: jamieIcon, draggable: true })
        .addTo(map)
        .bindPopup(popupData ? popupData.initial.jamie : '<b>Jamie</b><br>University graduate looking for employment', {
            className: 'jamie-popup'
        });

    // Cathy (Catherine) - middle, popup above center
    const cathyIcon = createPersonaIcon('assets/images/1cathy.png', 'cathy-marker', [0, -80]);
    const cathyMarker = L.marker([oshawaLat - 0.015, oshawaLng - 0.04], { icon: cathyIcon, draggable: true })
        .addTo(map)
        .bindPopup(popupData ? popupData.initial.cathy : '<b>Catherine</b><br>Experienced professional navigating career changes', {
            className: 'cathy-popup'
        });

    // Christina - rightmost, popup above and to the left (90px left of marker)
    const christinaIcon = createPersonaIcon('assets/images/1chris.png', 'christina-marker', [-10, -80]);
    const christinaMarker = L.marker([oshawaLat - 0.015, oshawaLng], { icon: christinaIcon, draggable: true })
        .addTo(map)
        .bindPopup(popupData ? popupData.initial.christina : '<b>Christina</b><br>Adapting to the changing job market', {
            className: 'christina-popup'
        });

    // Disable click to open popup (we'll open on scroll instead)
    jamieMarker.off('click');
    cathyMarker.off('click');
    christinaMarker.off('click');

    // Store markers for scroll-triggered popups
    window.mapMarkers = {
        jamie: jamieMarker,
        cathy: cathyMarker,
        christina: christinaMarker
    };

    // Setup scroll-triggered popups
    setupMapScrollPopups();
}

// Function to open popups when user scrolls to map section
function setupMapScrollPopups() {
    const mapSection = document.getElementById('map');
    if (!mapSection || !window.mapMarkers) return;

    let nextPopupToOpenForward = 1; // Track which popup to open next when scrolling down (1=jamie, 2=cathy, 3=christina, 4=jamie2, 5=cathy2, 6=christina2, 7=jamie3, 8=christina3)
    let nextPopupToOpenReverse = 8; // Track which popup to open next when scrolling up (8=christina3, 7=jamie3, 6=christina2, 5=cathy2, 4=jamie2, 3=christina, 2=cathy, 1=jamie)
    let isMapInView = false;
    let lastScrollTime = 0;
    let lastScrollY = window.scrollY; // Track last scroll position to detect direction
    const scrollCooldown = 600; // Minimum time between scroll actions (ms)
    let allPopupsShownForward = false; // Track if all 8 popups have been shown when scrolling down
    let allPopupsShownReverse = false; // Track if all 8 popups have been shown when scrolling up

    // Check if top of map section has reached the top of viewport
    const isMap80PercentVisible = () => {
        const rect = mapSection.getBoundingClientRect();
        return rect.top <= 0;
    };

    // Check if a popup is currently open
    // const isPopupOpen = (popupNumber) => {
    //     if (popupNumber === 1) return window.mapMarkers.jamie.isPopupOpen();
    //     if (popupNumber === 2) return window.mapMarkers.cathy.isPopupOpen();
    //     if (popupNumber === 3) return window.mapMarkers.christina.isPopupOpen();
    //     return false;
    // };

    // Use IntersectionObserver to detect when map section is in view
    // Also check if top has reached viewport for better small screen support
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const rect = mapSection.getBoundingClientRect();
            // Map is in view if intersecting OR if top has reached viewport
            isMapInView = entry.isIntersecting || rect.top <= 0;
            // Reset when map leaves view
            if (!entry.isIntersecting) {
                nextPopupToOpenForward = 1;
                nextPopupToOpenReverse = 8;
                allPopupsShownForward = false;
                allPopupsShownReverse = false;
                // Reset popups to original content
                if (window.mapMarkers && window.mapMarkers.jamie && popupData) {
                    window.mapMarkers.jamie.setPopupContent(popupData.initial.jamie);
                }
                if (window.mapMarkers && window.mapMarkers.cathy && popupData) {
                    window.mapMarkers.cathy.setPopupContent(popupData.initial.cathy);
                }
                if (window.mapMarkers && window.mapMarkers.christina && popupData) {
                    window.mapMarkers.christina.setPopupContent(popupData.initial.christina);
                }
                // Hide charts
                const unemploymentChart = document.getElementById('unemployment-chart-container');
                if (unemploymentChart) {
                    unemploymentChart.classList.remove('show');
                }
                const treemapChart = document.getElementById('age-industry-treemap-container');
                if (treemapChart) {
                    treemapChart.classList.remove('show');
                }
                const rentChart = document.getElementById('rent-chart-container');
                if (rentChart) {
                    rentChart.classList.remove('show');
                }
            }
        });
    }, {
        threshold: 0.8, // Trigger when 80% of section is visible
        rootMargin: '0px'
    });

    observer.observe(mapSection);

    // Handle scroll events to open popups in forward or reverse order
    let scrollTimeout = null;
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;

        // Update isMapInView based on current viewport position (more reliable than IntersectionObserver alone)
        const rect = mapSection.getBoundingClientRect();
        isMapInView = rect.top <= window.innerHeight && rect.bottom >= 0;

        // For scrolling down - open popups in forward order (Jamie → Cathy → Christina)
        if (scrollDirection === 'down') {
            // If all popups are shown, close popup 4 when user scrolls down
            if (allPopupsShownForward) {
                const currentTime = Date.now();
                if (currentTime - lastScrollTime > scrollCooldown) {
                    lastScrollTime = currentTime;
                    // Close Jamie's 4th popup
                    if (window.mapMarkers && window.mapMarkers.jamie && window.mapMarkers.jamie.isPopupOpen()) {
                        window.mapMarkers.jamie.closePopup();
                        // Hide unemployment chart
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            unemploymentChart.classList.remove('show');
                        }
                    }
                }
                return;
            }

            // Check if top of map section has reached viewport (works for all screen sizes)
            if (!isMap80PercentVisible()) return;

            const currentTime = Date.now();

            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Use requestAnimationFrame for smoother handling
            scrollTimeout = requestAnimationFrame(() => {
                if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownForward) {
                    lastScrollTime = currentTime;

                    // Open next popup in forward sequence
                    if (nextPopupToOpenForward === 1) {
                        window.mapMarkers.jamie.openPopup();
                        nextPopupToOpenForward = 2;
                        // Reset reverse counter when starting forward
                        nextPopupToOpenReverse = 8;
                        allPopupsShownReverse = false;
                    } else if (nextPopupToOpenForward === 2) {
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 3;
                    } else if (nextPopupToOpenForward === 3) {
                        window.mapMarkers.christina.openPopup();
                        nextPopupToOpenForward = 4;
                    } else if (nextPopupToOpenForward === 4) {
                        // Update Jamie's popup content for the 4th popup
                        if (popupData && popupData.popups['4']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['4'].content);
                        }
                        // Configure popup to not auto-close so it stays open when other popups open
                        const jamiePopup = window.mapMarkers.jamie.getPopup();
                        if (jamiePopup) {
                            jamiePopup.options.autoClose = false;
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Create and show unemployment chart
                        createUnemploymentChart();
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            setTimeout(() => {
                                unemploymentChart.classList.add('show');
                            }, 500);
                        }
                        nextPopupToOpenForward = 5;
                    } else if (nextPopupToOpenForward === 5) {
                        // Update Cathy's popup content for the 5th popup
                        if (popupData && popupData.popups['5']) {
                            window.mapMarkers.cathy.setPopupContent(popupData.popups['5'].content);
                        }
                        // Jamie's popup is configured with autoClose: false, so it will stay open
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 6;
                    } else if (nextPopupToOpenForward === 6) {
                        // Update Christina's popup content for the 6th popup
                        if (popupData && popupData.popups['6']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['6'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Create and show age-industry treemap
                        createAgeIndustryTreemap();
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            setTimeout(() => {
                                treemapChart.classList.add('show');
                            }, 1400);
                        }
                        nextPopupToOpenForward = 7;
                    } else if (nextPopupToOpenForward === 7) {
                        // Update Jamie's popup content for the 7th popup
                        if (popupData && popupData.popups['7']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['7'].content);
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Set higher z-index for this popup to appear above unemployment chart
                        setTimeout(() => {
                            const jamiePopupElement = window.mapMarkers.jamie.getPopup().getElement();
                            if (jamiePopupElement) {
                                jamiePopupElement.style.zIndex = '1001';
                            }
                        }, 0);
                        nextPopupToOpenForward = 8;
                    } else if (nextPopupToOpenForward === 8) {
                        // Update Christina's popup content for the 8th popup
                        if (popupData && popupData.popups['8']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['8'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Set higher z-index for this popup to appear above other elements
                        setTimeout(() => {
                            const christinaPopupElement = window.mapMarkers.christina.getPopup().getElement();
                            if (christinaPopupElement) {
                                christinaPopupElement.style.zIndex = '1002';
                            }
                        }, 0);
                        // Create and show rent chart
                        createRentChart();
                        const rentChart = document.getElementById('rent-chart-container');
                        if (rentChart) {
                            setTimeout(() => {
                                rentChart.classList.add('show');
                            }, 1300);
                        }
                        // All popups opened forward - remove sticky positioning
                        allPopupsShownForward = true;
                        nextPopupToOpenForward = 9; // Prevent further popup opening
                    }
                }
            });
        } 
        // For scrolling up - open popups in reverse order (Christina → Cathy → Jamie)
        else if (scrollDirection === 'up') {
            if (!isMapInView) return;
            if (allPopupsShownReverse) return;

            // Make map sticky when starting to scroll up
            if (mapSection.style.position !== 'sticky') {
                mapSection.style.position = 'sticky';
                mapSection.classList.add('sticky-active');
            }

            const currentTime = Date.now();

            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Use requestAnimationFrame for smoother handling
            scrollTimeout = requestAnimationFrame(() => {
                if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownReverse) {
                    lastScrollTime = currentTime;

                    // Open next popup in reverse sequence
                    if (nextPopupToOpenReverse === 8) {
                        // Update Christina's popup content for the 8th popup
                        if (popupData && popupData.popups['8']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['8'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Set higher z-index for this popup to appear above other elements
                        setTimeout(() => {
                            const christinaPopupElement = window.mapMarkers.christina.getPopup().getElement();
                            if (christinaPopupElement) {
                                christinaPopupElement.style.zIndex = '1002';
                            }
                        }, 0);
                        // Show rent chart
                        const rentChart = document.getElementById('rent-chart-container');
                        if (rentChart) {
                            setTimeout(() => {
                                rentChart.classList.add('show');
                            }, 500);
                        }
                        nextPopupToOpenReverse = 7;
                        // Reset forward counter when starting reverse
                        nextPopupToOpenForward = 1;
                        allPopupsShownForward = false;
                    } else if (nextPopupToOpenReverse === 7) {
                        // Update Jamie's popup content for the 7th popup
                        if (popupData && popupData.popups['7']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['7'].content);
                        }
                        window.mapMarkers.jamie.openPopup();
                        nextPopupToOpenReverse = 6;
                    } else if (nextPopupToOpenReverse === 6) {
                        // Update Christina's popup content for the 6th popup
                        if (popupData && popupData.popups['6']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['6'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Show age-industry treemap
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            setTimeout(() => {
                                treemapChart.classList.add('show');
                            }, 1000);
                        }
                        nextPopupToOpenReverse = 5;
                    } else if (nextPopupToOpenReverse === 5) {
                        // Update Cathy's popup content for the 5th popup
                        if (popupData && popupData.popups['5']) {
                            window.mapMarkers.cathy.setPopupContent(popupData.popups['5'].content);
                        }
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenReverse = 4;
                    } else if (nextPopupToOpenReverse === 4) {
                        // Update Jamie's popup content for the 4th popup
                        if (popupData && popupData.popups['4']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['4'].content);
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Show unemployment chart
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            setTimeout(() => {
                                unemploymentChart.classList.add('show');
                            }, 500);
                        }
                        nextPopupToOpenReverse = 3;
                    } else if (nextPopupToOpenReverse === 3) {
                        // Reset Christina's popup to original content
                        if (popupData) {
                            window.mapMarkers.christina.setPopupContent(popupData.initial.christina);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Hide treemap and rent chart
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            treemapChart.classList.remove('show');
                        }
                        const rentChart = document.getElementById('rent-chart-container');
                        if (rentChart) {
                            rentChart.classList.remove('show');
                        }
                        nextPopupToOpenReverse = 2;
                    } else if (nextPopupToOpenReverse === 2) {
                        // Reset Cathy's popup to original content
                        if (popupData) {
                            window.mapMarkers.cathy.setPopupContent(popupData.initial.cathy);
                        }
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenReverse = 1;
                    } else if (nextPopupToOpenReverse === 1) {
                        // Reset Jamie's popup to original content
                        if (popupData) {
                            window.mapMarkers.jamie.setPopupContent(popupData.initial.jamie);
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Hide unemployment chart
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            unemploymentChart.classList.remove('show');
                        }
                        // All popups opened in reverse - remove sticky positioning
                        allPopupsShownReverse = true;
                        nextPopupToOpenReverse = 0; // Prevent further popup opening
                        // Remove sticky positioning after a short delay
                        setTimeout(() => {
                            mapSection.style.position = 'relative';
                            mapSection.classList.remove('sticky-active');
                        }, 500);
                    }
                }
            });
        }
    };

    // Also handle wheel events for better responsiveness
    const handleWheel = (e) => {
        const scrollDirection = e.deltaY > 0 ? 'down' : 'up';

        // For scrolling down - open popups in forward order (Jamie → Cathy → Christina)
        if (scrollDirection === 'down') {
            // If all popups are shown, close popup 4 when user scrolls down
            if (allPopupsShownForward) {
                const currentTime = Date.now();
                if (currentTime - lastScrollTime > scrollCooldown) {
                    lastScrollTime = currentTime;
                    // Close Jamie's 4th popup
                    if (window.mapMarkers && window.mapMarkers.jamie && window.mapMarkers.jamie.isPopupOpen()) {
                        window.mapMarkers.jamie.closePopup();
                        // Hide unemployment chart
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            unemploymentChart.classList.remove('show');
                        }
                    }
                }
                return;
            }

            // Check if top of map section has reached viewport (works for all screen sizes)
            if (!isMap80PercentVisible()) return;

            const currentTime = Date.now();

            if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownForward) {
                lastScrollTime = currentTime;

                // Open next popup in forward sequence
                if (nextPopupToOpenForward === 1) {
                    window.mapMarkers.jamie.openPopup();
                    nextPopupToOpenForward = 2;
                    // Reset reverse counter when starting forward
                    nextPopupToOpenReverse = 5;
                    allPopupsShownReverse = false;
                } else if (nextPopupToOpenForward === 2) {
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpenForward = 3;
                } else if (nextPopupToOpenForward === 3) {
                        window.mapMarkers.christina.openPopup();
                        nextPopupToOpenForward = 4;
                    } else if (nextPopupToOpenForward === 4) {
                        // Update Jamie's popup content for the 4th popup
                        if (popupData && popupData.popups['4']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['4'].content);
                        }
                        // Configure popup to not auto-close so it stays open when other popups open
                        const jamiePopup = window.mapMarkers.jamie.getPopup();
                        if (jamiePopup) {
                            jamiePopup.options.autoClose = false;
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Create and show unemployment chart
                        createUnemploymentChart();
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            setTimeout(() => {
                                unemploymentChart.classList.add('show');
                            }, 500);
                        }
                        nextPopupToOpenForward = 5;
                    } else if (nextPopupToOpenForward === 5) {
                        // Update Cathy's popup content for the 5th popup
                        if (popupData && popupData.popups['5']) {
                            window.mapMarkers.cathy.setPopupContent(popupData.popups['5'].content);
                        }
                        // Jamie's popup is configured with autoClose: false, so it will stay open
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 6;
                    } else if (nextPopupToOpenForward === 6) {
                        // Update Christina's popup content for the 6th popup
                        if (popupData && popupData.popups['6']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['6'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Create and show age-industry treemap
                        createAgeIndustryTreemap();
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            setTimeout(() => {
                                treemapChart.classList.add('show');
                            }, 1000);
                        }
                        nextPopupToOpenForward = 7;
                    } else if (nextPopupToOpenForward === 7) {
                        // Update Jamie's popup content for the 7th popup
                        if (popupData && popupData.popups['7']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['7'].content);
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Set higher z-index for this popup to appear above unemployment chart
                        setTimeout(() => {
                            const jamiePopupElement = window.mapMarkers.jamie.getPopup().getElement();
                            if (jamiePopupElement) {
                                jamiePopupElement.style.zIndex = '1001';
                            }
                        }, 0);
                        nextPopupToOpenForward = 8;
                    } else if (nextPopupToOpenForward === 8) {
                        // Update Christina's popup content for the 8th popup
                        if (popupData && popupData.popups['8']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['8'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Set higher z-index for this popup to appear above other elements
                        setTimeout(() => {
                            const christinaPopupElement = window.mapMarkers.christina.getPopup().getElement();
                            if (christinaPopupElement) {
                                christinaPopupElement.style.zIndex = '1002';
                            }
                        }, 0);
                        // Create and show rent chart
                        createRentChart();
                        const rentChart = document.getElementById('rent-chart-container');
                        if (rentChart) {
                            setTimeout(() => {
                                rentChart.classList.add('show');
                            }, 500);
                        }
                        // All popups opened forward - remove sticky positioning
                        allPopupsShownForward = true;
                        nextPopupToOpenForward = 9; // Prevent further popup opening
                    }
            }
        }
        // For scrolling up - open popups in reverse order (Cathy2 → Jamie2 → Christina → Cathy → Jamie)
        else if (scrollDirection === 'up') {
            if (!isMapInView) return;
            if (allPopupsShownReverse) return;

            // Make map sticky when starting to scroll up
            if (mapSection.style.position !== 'sticky') {
                mapSection.style.position = 'sticky';
                mapSection.classList.add('sticky-active');
            }

            const currentTime = Date.now();

            if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownReverse) {
                lastScrollTime = currentTime;

                // Open next popup in reverse sequence
                if (nextPopupToOpenReverse === 8) {
                    // Update Christina's popup content for the 8th popup
                    if (popupData && popupData.popups['8']) {
                        window.mapMarkers.christina.setPopupContent(popupData.popups['8'].content);
                    }
                    window.mapMarkers.christina.openPopup();
                    // Set higher z-index for this popup to appear above other elements
                    setTimeout(() => {
                        const christinaPopupElement = window.mapMarkers.christina.getPopup().getElement();
                        if (christinaPopupElement) {
                            christinaPopupElement.style.zIndex = '1002';
                        }
                    }, 0);
                    // Show rent chart
                    const rentChart = document.getElementById('rent-chart-container');
                    if (rentChart) {
                        setTimeout(() => {
                            rentChart.classList.add('show');
                        }, 500);
                    }
                    nextPopupToOpenReverse = 7;
                    // Reset forward counter when starting reverse
                    nextPopupToOpenForward = 1;
                    allPopupsShownForward = false;
                } else if (nextPopupToOpenReverse === 7) {
                    // Update Jamie's popup content for the 7th popup
                    if (popupData && popupData.popups['7']) {
                        window.mapMarkers.jamie.setPopupContent(popupData.popups['7'].content);
                    }
                    window.mapMarkers.jamie.openPopup();
                    nextPopupToOpenReverse = 6;
                } else if (nextPopupToOpenReverse === 6) {
                    // Update Christina's popup content for the 6th popup
                    if (popupData && popupData.popups['6']) {
                        window.mapMarkers.christina.setPopupContent(popupData.popups['6'].content);
                    }
                    window.mapMarkers.christina.openPopup();
                    // Show age-industry treemap
                    const treemapChart = document.getElementById('age-industry-treemap-container');
                    if (treemapChart) {
                        setTimeout(() => {
                            treemapChart.classList.add('show');
                        }, 500);
                    }
                    nextPopupToOpenReverse = 5;
                } else if (nextPopupToOpenReverse === 5) {
                    // Update Cathy's popup content for the 5th popup
                    if (popupData && popupData.popups['5']) {
                        window.mapMarkers.cathy.setPopupContent(popupData.popups['5'].content);
                    }
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpenReverse = 4;
                } else if (nextPopupToOpenReverse === 4) {
                    // Update Jamie's popup content for the 4th popup
                    if (popupData && popupData.popups['4']) {
                        window.mapMarkers.jamie.setPopupContent(popupData.popups['4'].content);
                    }
                    window.mapMarkers.jamie.openPopup();
                    // Show unemployment chart
                    const unemploymentChart = document.getElementById('unemployment-chart-container');
                    if (unemploymentChart) {
                        setTimeout(() => {
                            unemploymentChart.classList.add('show');
                        }, 500);
                    }
                    nextPopupToOpenReverse = 3;
                } else if (nextPopupToOpenReverse === 3) {
                    // Reset Christina's popup to original content
                    if (popupData) {
                        window.mapMarkers.christina.setPopupContent(popupData.initial.christina);
                    }
                    window.mapMarkers.christina.openPopup();
                        // Hide age-industry treemap
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            treemapChart.classList.remove('show');
                        }
                    nextPopupToOpenReverse = 2;
                } else if (nextPopupToOpenReverse === 2) {
                    // Reset Cathy's popup to original content
                    if (popupData) {
                        window.mapMarkers.cathy.setPopupContent(popupData.initial.cathy);
                    }
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpenReverse = 1;
                } else if (nextPopupToOpenReverse === 1) {
                    // Reset Jamie's popup to original content
                    if (popupData) {
                        window.mapMarkers.jamie.setPopupContent(popupData.initial.jamie);
                    }
                    window.mapMarkers.jamie.openPopup();
                    // Hide unemployment chart
                    const unemploymentChart = document.getElementById('unemployment-chart-container');
                    if (unemploymentChart) {
                        unemploymentChart.classList.remove('show');
                    }
                    // All popups opened in reverse - remove sticky positioning
                    allPopupsShownReverse = true;
                    nextPopupToOpenReverse = 0; // Prevent further popup opening
                    // Remove sticky positioning after a short delay
                    setTimeout(() => {
                        mapSection.style.position = 'relative';
                        mapSection.classList.remove('sticky-active');
                    }, 500);
                }
            }
        }
    };

    const cleanupMapSectionAndScrollToConclusion = () => {
        const mapSectionElement = document.getElementById('map');
        const conclusionSection = document.getElementById('conclusion');

        if (mapSectionElement) {
            mapSectionElement.style.position = 'relative';
            mapSectionElement.classList.remove('sticky-active');
        }

        const unemploymentChart = document.getElementById('unemployment-chart-container');
        if (unemploymentChart) {
            unemploymentChart.classList.remove('show');
        }
        const treemapChart = document.getElementById('age-industry-treemap-container');
        if (treemapChart) {
            treemapChart.classList.remove('show');
        }
        const rentChart = document.getElementById('rent-chart-container');
        if (rentChart) {
            rentChart.classList.remove('show');
        }

        if (window.mapMarkers) {
            Object.values(window.mapMarkers).forEach(marker => {
                if (marker && marker.closePopup) {
                    marker.closePopup();
                }
            });
        }

        if (conclusionSection) {
            const conclusionTop = conclusionSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: conclusionTop, behavior: 'smooth' });
        }

        allPopupsShownForward = true;
        nextPopupToOpenForward = 10;
    };

    // Handle spacebar to trigger section effects or scroll to next section
    const handleSpacebar = (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault(); // Always prevent default to control behavior
            
            // Check which section we're in
            const backgroundSection = document.getElementById('background');
            const solutionSection = document.getElementById('solution');
            const mapSection = document.getElementById('map');
            const locationMapSection = document.getElementById('location-map');
            
            const backgroundRect = backgroundSection ? backgroundSection.getBoundingClientRect() : null;
            const solutionRect = solutionSection ? solutionSection.getBoundingClientRect() : null;
            const mapRect = mapSection ? mapSection.getBoundingClientRect() : null;
            const locationMapRect = locationMapSection ? locationMapSection.getBoundingClientRect() : null;
            
            const windowHeight = window.innerHeight;
            const isInBackground = backgroundRect && backgroundRect.top < windowHeight && backgroundRect.bottom > 0;
            const isInSolution = solutionRect && solutionRect.top < windowHeight && solutionRect.bottom > 0;
            const isInMap = mapRect && mapRect.top < windowHeight && mapRect.bottom > 0;
            const isInLocationMap = locationMapRect && locationMapRect.top < windowHeight && locationMapRect.bottom > 0;
            
            // Handle background section - trigger next text part animation
            if (isInBackground && window.backgroundAnimations && window.backgroundAnimations.animatePart) {
                const animatedParts = window.backgroundAnimations.animatedParts;
                if (!animatedParts.has(1)) {
                    window.backgroundAnimations.animatePart(1);
                    return;
                } else if (!animatedParts.has(2)) {
                    window.backgroundAnimations.animatePart(2);
                    return;
                } else if (!animatedParts.has(3)) {
                    window.backgroundAnimations.animatePart(3);
                    return;
                }
            }
            
            // Handle location map section - zoom in on spacebar, or scroll to next section if already at Oshawa
            if (isInLocationMap) {
                // If already zoomed to Oshawa and chart shown, scroll to next section instead
                if (locationMapZoomState === 2) {
                    // Continue to next section (fall through to section scrolling logic)
                } else {
                    handleLocationMapZoom();
                    return;
                }
            }
            
            // Handle solution section - trigger bubble chart transition
            if (isInSolution && window.bubbleChart && window.bubbleChart.transitionToState) {
                if (window.bubbleChart.currentState === 'most') {
                    window.bubbleChart.transitionToState('least');
                    return;
                }
            }
            
            // Check if we're in map section and should trigger popups
            // Allow when not all popups shown, OR when nextPopupToOpenForward === 9 (cleanup phase)
            const shouldTriggerPopup = isMapInView && 
                (!allPopupsShownForward || nextPopupToOpenForward === 9) &&
                (isMap80PercentVisible() || nextPopupToOpenForward === 9);

            if (shouldTriggerPopup) {
                const currentTime = Date.now();
                // Allow execution if not all popups shown, OR if nextPopupToOpenForward === 9 (cleanup phase)
                if (currentTime - lastScrollTime > scrollCooldown && (!allPopupsShownForward || nextPopupToOpenForward === 9)) {
                    lastScrollTime = currentTime;

                    // Open next popup in forward sequence
                    if (nextPopupToOpenForward === 1) {
                        window.mapMarkers.jamie.openPopup();
                        nextPopupToOpenForward = 2;
                        // Reset reverse counter when starting forward
                        nextPopupToOpenReverse = 8;
                        allPopupsShownReverse = false;
                    } else if (nextPopupToOpenForward === 2) {
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 3;
                    } else if (nextPopupToOpenForward === 3) {
                        window.mapMarkers.christina.openPopup();
                        nextPopupToOpenForward = 4;
                    } else if (nextPopupToOpenForward === 4) {
                        // Update Jamie's popup content for the 4th popup
                        if (popupData && popupData.popups['4']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['4'].content);
                        }
                        // Configure popup to not auto-close so it stays open when other popups open
                        const jamiePopup = window.mapMarkers.jamie.getPopup();
                        if (jamiePopup) {
                            jamiePopup.options.autoClose = false;
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Create and show unemployment chart
                        createUnemploymentChart();
                        const unemploymentChart = document.getElementById('unemployment-chart-container');
                        if (unemploymentChart) {
                            setTimeout(() => {
                                unemploymentChart.classList.add('show');
                            }, 500);
                        }
                        nextPopupToOpenForward = 5;
                    } else if (nextPopupToOpenForward === 5) {
                        // Update Cathy's popup content for the 5th popup
                        if (popupData && popupData.popups['5']) {
                            window.mapMarkers.cathy.setPopupContent(popupData.popups['5'].content);
                        }
                        // Jamie's popup is configured with autoClose: false, so it will stay open
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 6;
                    } else if (nextPopupToOpenForward === 6) {
                        // Update Christina's popup content for the 6th popup
                        if (popupData && popupData.popups['6']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['6'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Create and show age-industry treemap
                        createAgeIndustryTreemap();
                        const treemapChart = document.getElementById('age-industry-treemap-container');
                        if (treemapChart) {
                            setTimeout(() => {
                                treemapChart.classList.add('show');
                            }, 1000);
                        }
                        nextPopupToOpenForward = 7;
                    } else if (nextPopupToOpenForward === 7) {
                        // Update Jamie's popup content for the 7th popup
                        if (popupData && popupData.popups['7']) {
                            window.mapMarkers.jamie.setPopupContent(popupData.popups['7'].content);
                        }
                        window.mapMarkers.jamie.openPopup();
                        // Set higher z-index for this popup to appear above unemployment chart
                        setTimeout(() => {
                            const jamiePopupElement = window.mapMarkers.jamie.getPopup().getElement();
                            if (jamiePopupElement) {
                                jamiePopupElement.style.zIndex = '1001';
                            }
                        }, 0);
                        nextPopupToOpenForward = 8;
                    } else if (nextPopupToOpenForward === 8) {
                        // Update Christina's popup content for the 8th popup
                        if (popupData && popupData.popups['8']) {
                            window.mapMarkers.christina.setPopupContent(popupData.popups['8'].content);
                        }
                        window.mapMarkers.christina.openPopup();
                        // Set higher z-index for this popup to appear above other elements
                        setTimeout(() => {
                            const christinaPopupElement = window.mapMarkers.christina.getPopup().getElement();
                            if (christinaPopupElement) {
                                christinaPopupElement.style.zIndex = '1002';
                            }
                        }, 0);
                        // Create and show rent chart
                        createRentChart();
                        const rentChart = document.getElementById('rent-chart-container');
                        if (rentChart) {
                            setTimeout(() => {
                                rentChart.classList.add('show');
                            }, 500);
                        }
                        // All popups opened forward
                        allPopupsShownForward = true;
                        nextPopupToOpenForward = 9; // Prevent further popup opening
                    } else if (nextPopupToOpenForward === 9) {
                        cleanupMapSectionAndScrollToConclusion();
                    }
                }
            } else if (allPopupsShownForward && isInMap) {
                // All popups shown - hide all charts when spacebar is pressed
                const unemploymentChart = document.getElementById('unemployment-chart-container');
                if (unemploymentChart) {
                    unemploymentChart.classList.remove('show');
                }
                const treemapChart = document.getElementById('age-industry-treemap-container');
                if (treemapChart) {
                    treemapChart.classList.remove('show');
                }
                const rentChart = document.getElementById('rent-chart-container');
                if (rentChart) {
                    rentChart.classList.remove('show');
                }
                // Then scroll to next section
                const sections = ['intro', 'background', 'problem-statement', 'location-map', 'solution', 'map', 'conclusion', 'final-message'];
                const currentScrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Find the current section
                let currentSectionIndex = -1;
                for (let i = 0; i < sections.length; i++) {
                    const section = document.getElementById(sections[i]);
                    if (section) {
                        const rect = section.getBoundingClientRect();
                        // Check if section is in viewport (at least 50% visible)
                        if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
                            currentSectionIndex = i;
                            break;
                        }
                    }
                }
                
                // If no section found, find the closest one
                if (currentSectionIndex === -1) {
                    for (let i = 0; i < sections.length; i++) {
                        const section = document.getElementById(sections[i]);
                        if (section) {
                            const rect = section.getBoundingClientRect();
                            if (rect.top >= 0 && rect.top < windowHeight) {
                                currentSectionIndex = i;
                                break;
                            }
                        }
                    }
                }
                
                // Scroll to next section
                if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
                    const nextSection = document.getElementById(sections[currentSectionIndex + 1]);
                    if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else if (currentSectionIndex === -1) {
                    // If we're at the top, scroll to first section
                    const firstSection = document.getElementById(sections[0]);
                    if (firstSection) {
                        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            } else {
                // Scroll to next section
                const sections = ['intro', 'background', 'problem-statement', 'location-map', 'solution', 'map', 'conclusion', 'final-message'];
                const currentScrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Find the current section
                let currentSectionIndex = -1;
                for (let i = 0; i < sections.length; i++) {
                    const section = document.getElementById(sections[i]);
                    if (section) {
                        const rect = section.getBoundingClientRect();
                        // Check if section is in viewport (at least 50% visible)
                        if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
                            currentSectionIndex = i;
                            break;
                        }
                    }
                }
                
                // If no section found, find the closest one
                if (currentSectionIndex === -1) {
                    for (let i = 0; i < sections.length; i++) {
                        const section = document.getElementById(sections[i]);
                        if (section) {
                            const rect = section.getBoundingClientRect();
                            if (rect.top >= 0 && rect.top < windowHeight) {
                                currentSectionIndex = i;
                                break;
                            }
                        }
                    }
                }
                
                // Scroll to next section
                if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
                    const nextSection = document.getElementById(sections[currentSectionIndex + 1]);
                    if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else if (currentSectionIndex === -1) {
                    // If we're at the top, scroll to first section
                    const firstSection = document.getElementById(sections[0]);
                    if (firstSection) {
                        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        }
    };

    const handleEnterKey = (e) => {
        if (e.key !== 'Enter') return;

        const mapSection = document.getElementById('map');
        if (!mapSection) return;

        const mapRect = mapSection.getBoundingClientRect();
        const isInMap = mapRect.top < window.innerHeight && mapRect.bottom > 0;

        if (isInMap) {
            e.preventDefault();
            cleanupMapSectionAndScrollToConclusion();
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleSpacebar);
    window.addEventListener('keydown', handleEnterKey);
}

// Create scroll-triggered bubble chart for Industry data
function createBubbleChart() {
    const container = document.getElementById('bubble-chart-container');
    if (!container || typeof d3 === 'undefined') return;

    // Initialize window.bubbleChart if it doesn't exist
    if (!window.bubbleChart) {
        window.bubbleChart = {
            transitionToState: null,
            currentState: 'most'
        };
    }

    // Clear any existing content
    container.innerHTML = '';

    // Set up dimensions
    const width = Math.min(800, window.innerWidth - 100);
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Create SVG
    const svg = d3.select('#bubble-chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add title text that changes
    const titleText = svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Least Affected Industries');

    let currentState = 'most'; // 'most' or 'least'
    window.bubbleChart.currentState = currentState;
    let allData = [];

    // Load and process data
    d3.csv('assets/csv/Industry.csv').then(data => {
        // Filter out "Grand Total" row
        data = data.filter(d => d.Industry !== 'Grand Total');

        // Convert automation risk to number
        data.forEach(d => {
            d.automationRisk = +d['AVERAGE of Automation Risk (%)'];
        });

        // Sort by automation risk (highest first)
        allData = data.sort((a, b) => b.automationRisk - a.automationRisk);

        // Set up scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.automationRisk))
            .range([margin.left, width - margin.right])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.automationRisk)])
            .range([height - margin.bottom, margin.top])
            .nice();

        // Size scales for most and least affected
        const sizeScaleMost = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.automationRisk))
            .range([80, 20]); // Most affected = larger bubbles

        const sizeScaleLeast = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.automationRisk))
            .range([20, 80]); // Least affected = larger bubbles

        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain(d3.extent(data, d => d.automationRisk));

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', 'currentColor')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Automation Risk (%)');

        // Add Y axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -30)
            .attr('x', -height / 2)
            .attr('fill', 'currentColor')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Automation Risk (%)');

        // Create initial force simulation for bubble positioning
        const createSimulation = (dataToSimulate, sizeScaleFunc) => {
            return d3.forceSimulation(dataToSimulate)
                .force('x', d3.forceX(d => xScale(d.automationRisk)).strength(0.8))
                .force('y', d3.forceY(height / 2).strength(0.2))
                .force('collision', d3.forceCollide().radius(d => sizeScaleFunc(d.automationRisk) + 10))
                .stop();
        };

        // Initial simulation with most affected (larger bubbles)
        let simulation = createSimulation([...allData], sizeScaleMost);
        for (let i = 0; i < 150; ++i) simulation.tick();

        // Create bubbles
        const bubbles = svg.selectAll('.bubble')
            .data(allData)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .attr('transform', d => `translate(${d.x || xScale(d.automationRisk)}, ${d.y || height / 2})`);

        // Add circles
        const circles = bubbles.append('circle')
            .attr('r', d => sizeScaleMost(d.automationRisk))
            .attr('fill', d => colorScale(d.automationRisk))
            .attr('opacity', 0.7)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke-width', 3);
                
                // Show tooltip
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.Industry}</strong><br>Automation Risk: ${d.automationRisk.toFixed(2)}%`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('opacity', 0.7)
                    .attr('stroke-width', 2);
                
                tooltip.style('opacity', 0);
            });

        // Add labels
        const labels = bubbles.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#fff')
            .attr('font-size', d => Math.min(sizeScaleMost(d.automationRisk) / 3, 14))
            .attr('font-weight', 'bold')
            .text(d => d.Industry);

        // Add tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'bubble-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#fff')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('z-index', '1000');

        // Function to transition between states
        const transitionToState = (newState, removeStickyCallback = null) => {
            if (newState === currentState) return;
            currentState = newState;
            if (window.bubbleChart) {
                window.bubbleChart.currentState = currentState;
            }

            const sizeScale = newState === 'most' ? sizeScaleMost : sizeScaleLeast;
            const title = newState === 'most' ? 'Least Affected Industries' : 'Most Affected Industries';

            // Update title
            titleText.text(title);

            // Re-run simulation with new sizes first
            simulation = createSimulation([...allData], sizeScale);
            for (let i = 0; i < 150; ++i) simulation.tick();

            // Track transition completion
            let transitionCount = 0;
            const totalTransitions = 3; // circles, labels, bubbles
            const onTransitionEnd = () => {
                transitionCount++;
                if (transitionCount === totalTransitions) {
                    // All transitions complete
                    if (newState === 'least' && removeStickyCallback) {
                        removeStickyCallback();
                    }
                }
            };

            // Update bubble sizes with animation
            circles.transition()
                .duration(1000)
                .ease(d3.easeCubicInOut)
                .attr('r', d => sizeScale(d.automationRisk))
                .on('end', onTransitionEnd);

            // Update label sizes
            labels.transition()
                .duration(1000)
                .ease(d3.easeCubicInOut)
                .attr('font-size', d => Math.min(sizeScale(d.automationRisk) / 3, 14))
                .on('end', onTransitionEnd);

            // Update positions with animation
            bubbles.transition()
                .duration(1000)
                .ease(d3.easeCubicInOut)
                .attr('transform', d => `translate(${d.x || xScale(d.automationRisk)}, ${d.y || height / 2})`)
                .on('end', onTransitionEnd);
        };
        
        // Expose transitionToState globally
        if (!window.bubbleChart) {
            window.bubbleChart = { currentState: 'most' };
        }
        window.bubbleChart.transitionToState = transitionToState;

        // Set up scroll observer for the solution section
        const solutionSection = document.getElementById('solution');
        if (solutionSection) {
            let hasSeenMost = false; // Track if user has seen the initial state
            let isSticky = false; // Track if section is sticky
            let lastScrollY = window.scrollY;
            let lastTransitionTime = 0;
            const transitionCooldown = 800; // Minimum time between transitions (ms)
            let transitionTriggered = false; // Track if transition has been triggered
            
            // Function to remove sticky state
            const removeSticky = () => {
                if (isSticky) {
                    solutionSection.style.position = 'relative';
                    solutionSection.style.top = 'auto';
                    solutionSection.style.zIndex = 'auto';
                    isSticky = false;
                }
            };
            
            // Check if solution section top has reached the top of viewport
            const isSolutionAtTop = () => {
                const sectionTop = solutionSection.getBoundingClientRect().top;
                // Allow a small tolerance (within 5px) to account for rounding
                return sectionTop <= 5 && sectionTop >= -5;
            };
            
            // Wait a bit before allowing transitions to ensure initial state is visible
            setTimeout(() => {
                hasSeenMost = true;
            }, 2000); // 2 second delay before allowing transition

            // Listen to scroll events
            let scrollTimeout = null;
            window.addEventListener('scroll', () => {
                if (!hasSeenMost) return;
                
                const currentScrollY = window.scrollY;
                const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                lastScrollY = currentScrollY;

                // Check if section top has reached viewport top - make it sticky
                if (isSolutionAtTop() && !isSticky && !transitionTriggered) {
                    solutionSection.style.position = 'sticky';
                    solutionSection.style.top = '0';
                    solutionSection.style.zIndex = '10';
                    isSticky = true;
                }

                // If sticky and scrolling down, trigger transition
                if (isSticky && scrollDirection === 'down' && !transitionTriggered) {
                    if (scrollTimeout) clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        const currentTime = Date.now();
                        if (currentTime - lastTransitionTime > transitionCooldown && currentState === 'most') {
                            // Transition to least affected on scroll down
                            transitionTriggered = true;
                            transitionToState('least', removeSticky);
                            lastTransitionTime = currentTime;
                        }
                    }, 100);
                }

                // Reset if section leaves viewport
                const rect = solutionSection.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    if (isSticky) {
                        removeSticky();
                    }
                    // Reset state when leaving viewport
                    if (currentState === 'least') {
                        transitionToState('most');
                        transitionTriggered = false;
                    }
                }
            }, { passive: true });
        }
        
        // Expose transitionToState globally
        window.bubbleChart.transitionToState = transitionToState;
    }).catch(error => {
        console.error('Error loading Industry.csv:', error);
        container.innerHTML = '<p>Error loading data. Please check the CSV file.</p>';
    });
}

// Create bubble chart for Age_Industry data
function createAgeIndustryBubbleChart() {
    const container = document.getElementById('age-industry-chart-container');
    if (!container || typeof d3 === 'undefined') return;

    // Clear any existing content
    container.innerHTML = '';

    // Set up dimensions
    const width = Math.min(800, window.innerWidth - 100);
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Create SVG
    const svg = d3.select('#age-industry-chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Load and process data
    d3.csv('assets/csv/Age_Industry.csv').then(data => {
        // Convert persons to number
        data.forEach(d => {
            d.persons = +d['Persons in thousands'];
        });

        // Set up scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.persons))
            .range([margin.left, width - margin.right])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.persons)])
            .range([height - margin.bottom, margin.top])
            .nice();

        const sizeScale = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.persons))
            .range([15, 100]);

        const colorScale = d3.scaleSequential(d3.interpolatePlasma)
            .domain(d3.extent(data, d => d.persons));

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', 'currentColor')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Persons (in thousands)');

        // Add Y axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -30)
            .attr('x', -height / 2)
            .attr('fill', 'currentColor')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Persons (in thousands)');

        // Create force simulation for bubble positioning
        const simulation = d3.forceSimulation(data)
            .force('x', d3.forceX(d => xScale(d.persons)).strength(0.8))
            .force('y', d3.forceY(height / 2).strength(0.2))
            .force('collision', d3.forceCollide().radius(d => sizeScale(d.persons) + 10))
            .stop();

        // Run simulation
        for (let i = 0; i < 150; ++i) simulation.tick();

        // Create bubbles
        const bubbles = svg.selectAll('.bubble')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .attr('transform', d => `translate(${d.x || xScale(d.persons)}, ${d.y || height / 2})`);

        // Add circles
        bubbles.append('circle')
            .attr('r', d => sizeScale(d.persons))
            .attr('fill', d => colorScale(d.persons))
            .attr('opacity', 0.7)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke-width', 3);
                
                // Show tooltip
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.Industry}</strong><br>Persons: ${d.persons.toFixed(1)} thousand`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('opacity', 0.7)
                    .attr('stroke-width', 2);
                
                tooltip.style('opacity', 0);
            });

        // Add labels (only for larger bubbles to avoid clutter)
        bubbles.filter(d => sizeScale(d.persons) > 30)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#fff')
            .attr('font-size', d => Math.min(sizeScale(d.persons) / 4, 12))
            .attr('font-weight', 'bold')
            .text(d => d.Industry.length > 20 ? d.Industry.substring(0, 20) + '...' : d.Industry);

        // Add tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'bubble-tooltip age-industry-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#fff')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('z-index', '1000');
    }).catch(error => {
        console.error('Error loading Age_Industry.csv:', error);
        container.innerHTML = '<p>Error loading data. Please check the CSV file.</p>';
    });
}

// Create unemployment line chart
let unemploymentChartCreated = false;
function createUnemploymentChart() {
    const container = document.getElementById('unemployment-chart-container');
    if (!container || typeof d3 === 'undefined') return;
    
    // Only create chart once
    if (unemploymentChartCreated) return;
    unemploymentChartCreated = true;

    // Clear any existing content
    container.innerHTML = '';

    // Set up dimensions (smaller for top-left corner)
    const width = 450;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    // Create SVG
    const svg = d3.select('#unemployment-chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Load and process data
    d3.text('assets/csv/UnemploymentData.csv').then(text => {
        // Parse CSV manually (no headers)
        const data = d3.csvParseRows(text, (row) => {
            const [dateStr, valueStr] = row;
            const [year, month] = dateStr.split('-');
            return {
                date: new Date(year, month - 1),
                unemployment: +valueStr
            };
        });

        // Sort by date
        data.sort((a, b) => a.date - b.date);

        // Set up scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.unemployment) * 1.1])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.unemployment))
            .curve(d3.curveMonotoneX);

        // Add the line path
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4A90E2')
            .attr('stroke-width', 2.5)
            .attr('d', line);

        // Add circles for data points
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.unemployment))
            .attr('r', 4)
            .attr('fill', '#4A90E2')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat('%b %Y'))
                .ticks(6))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)')
            .style('fill', '#fff')
            .style('font-size', '10px');

        // Add y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale)
                .ticks(6)
                .tickFormat(d => d + '%'))
            .selectAll('text')
            .style('fill', '#fff')
            .style('font-size', '10px');

        // Add axis labels
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 12)
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text('Unemployment Rate (%)');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 8)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text('Date');

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 15)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Unemployment Rate Over Time');

        // Add tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'bubble-tooltip unemployment-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#fff')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('z-index', '1000');

        // Add hover interactions
        svg.selectAll('circle')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('r', 6)
                    .attr('fill', '#FFD700');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`${d3.timeFormat('%B %Y')(d.date)}<br/>Unemployment: ${d.unemployment}%`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('r', 4)
                    .attr('fill', '#4A90E2');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

    }).catch(error => {
        console.error('Error loading UnemploymentData.csv:', error);
        container.innerHTML = '<p>Error loading data. Please check the CSV file.</p>';
    });
}

// Create age-industry treemap
let ageIndustryTreemapCreated = false;
function createAgeIndustryTreemap() {
    const container = document.getElementById('age-industry-treemap-container');
    if (!container || typeof d3 === 'undefined') return;
    
    // Only create chart once
    if (ageIndustryTreemapCreated) return;
    ageIndustryTreemapCreated = true;

    // Clear any existing content
    container.innerHTML = '';

    // Set up dimensions (smaller for top-right corner)
    const width = 500;
    const height = 400;
    const margin = { top: 30, right: 10, bottom: 10, left: 10 };

    // Create SVG
    const svg = d3.select('#age-industry-treemap-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .style('text-anchor', 'middle')
        .style('fill', '#fff')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text('Industries by Number of People (ON)');

    // Load and process data
    d3.csv('assets/csv/Age_Industry.csv').then(data => {
        console.log('Loaded Age_Industry.csv data:', data);
        console.log('Number of rows:', data.length);
        
        if (!data || data.length === 0) {
            console.error('No data loaded from CSV');
            container.innerHTML = '<p>Error: CSV file is empty or could not be parsed.</p>';
            return;
        }
        
        // Handle BOM (Byte Order Mark) in column names - normalize column names
        const normalizeKey = (key) => {
            if (!key) return key;
            // Remove BOM and trim
            return key.replace(/^\ufeff/, '').trim();
        };
        
        // Normalize all keys in the data
        const normalizedData = data.map(d => {
            const normalized = {};
            for (const key in d) {
                const newKey = normalizeKey(key);
                normalized[newKey] = d[key];
            }
            return normalized;
        });
        
        // Filter out empty rows and parse data
        const processedData = normalizedData
            .filter(d => {
                // Check if row has valid data - skip header and empty rows
                const industry = d.Industry || d['\ufeffIndustry'] || '';
                if (!industry || industry.trim() === '' || industry.trim() === 'Industry') return false;
                const personsValue = d['Persons in thousands'];
                const hasPersons = personsValue !== undefined && personsValue !== null && String(personsValue).trim() !== '';
                return hasPersons;
            })
            .map(d => {
                try {
                    // Get industry name (handle BOM)
                    const industryName = (d.Industry || d['\ufeffIndustry'] || '').trim();
                    if (!industryName) return null;
                    
                    // Remove commas and parse numbers
                    const personsStr = String(d['Persons in thousands'] || '').replace(/,/g, '').trim();
                    if (!personsStr) return null;
                    
                    const personsValue = parseFloat(personsStr);
                    if (isNaN(personsValue) || personsValue <= 0) {
                        console.warn('Invalid value for row:', industryName, personsStr);
                        return null;
                    }
                    return {
                        name: industryName,
                        value: personsValue
                    };
                } catch (e) {
                    console.warn('Error parsing row:', d, e);
                    return null;
                }
            })
            .filter(d => d !== null && d.name && !isNaN(d.value) && d.value > 0);

        console.log('Processed data:', processedData);
        console.log('Number of valid rows:', processedData.length);

        // Check if we have valid data
        if (!processedData || processedData.length === 0) {
            console.error('No valid data found in Age_Industry.csv after processing');
            container.innerHTML = '<p>Error: No valid data found in CSV file after processing.</p>';
            return;
        }

        // Create hierarchical data structure for treemap
        const root = d3.hierarchy({ children: processedData })
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        // Create treemap layout
        const treemap = d3.treemap()
            .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
            .padding(2);

        treemap(root);

        // Color scale
        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, d3.max(processedData, d => d.value)]);

        // Create cells
        const cells = svg.selectAll('g')
            .data(root.leaves())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x0 + margin.left},${d.y0 + margin.top})`);

        // Add rectangles
        cells.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', d => colorScale(d.data.value))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

        // Add text labels (only for larger cells)
        cells.filter(d => (d.x1 - d.x0) > 60 && (d.y1 - d.y0) > 20)
            .append('text')
            .attr('x', d => (d.x1 - d.x0) / 2)
            .attr('y', d => (d.y1 - d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', d => Math.min((d.x1 - d.x0) / 10, 11))
            .style('font-weight', 'bold')
            .text(d => {
                const name = d.data.name;
                return name.length > 25 ? name.substring(0, 22) + '...' : name;
            });

        // Add value labels
        cells.filter(d => (d.x1 - d.x0) > 60 && (d.y1 - d.y0) > 30)
            .append('text')
            .attr('x', d => (d.x1 - d.x0) / 2)
            .attr('y', d => (d.y1 - d.y0) / 2 + 15)
            .attr('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', d => Math.min((d.x1 - d.x0) / 12, 10))
            .text(d => d.data.value.toLocaleString() + 'K');

        // Add tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'bubble-tooltip age-industry-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#fff')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('z-index', '1000');

        // Add hover interactions
        cells.select('rect')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke', '#FFD700')
                    .attr('stroke-width', 2);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`${d.data.name}<br/>Persons: ${d.data.value.toLocaleString()}K`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

    }).catch(error => {
        console.error('Error loading Age_Industry.csv:', error);
        console.error('Error details:', error.message, error.stack);
        container.innerHTML = `<p>Error loading data: ${error.message || 'Please check the CSV file.'}</p>`;
    });
}

// Create rent line chart
let rentChartCreated = false;
function createRentChart() {
    const container = document.getElementById('rent-chart-container');
    if (!container || typeof d3 === 'undefined') return;
    
    // Only create chart once
    if (rentChartCreated) return;
    rentChartCreated = true;

    // Clear any existing content
    container.innerHTML = '';

    // Set up dimensions (smaller for top-right corner)
    const width = 450;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    // Create SVG
    const svg = d3.select('#rent-chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Load and process data
    d3.csv('assets/csv/RentDataSet.csv').then(data => {
        // Parse the data
        data.forEach(d => {
            // Parse quarter (format: Q1 2023)
            const [quarter, year] = d.Quarters.split(' ');
            const quarterNum = parseInt(quarter.substring(1));
            d.date = new Date(year, (quarterNum - 1) * 3);
            // Remove commas and parse numbers
            d.oneBedroom = +d['Apartment - 1 bedroom'].replace(/,/g, '');
            d.twoBedroom = +d['Apartment - 2 bedrooms'].replace(/,/g, '');
            d.room = +d.Room;
        });

        // Sort by date
        data.sort((a, b) => a.date - b.date);

        // Set up scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const maxRent = d3.max(data, d => Math.max(d.oneBedroom, d.twoBedroom, d.room));
        const yScale = d3.scaleLinear()
            .domain([0, maxRent * 1.1])
            .range([height - margin.bottom, margin.top]);

        // Create line generators
        const line1 = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.oneBedroom))
            .curve(d3.curveMonotoneX);

        const line2 = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.twoBedroom))
            .curve(d3.curveMonotoneX);

        const line3 = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.room))
            .curve(d3.curveMonotoneX);

        // Add the line paths
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4A90E2')
            .attr('stroke-width', 2)
            .attr('d', line1);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#E24A4A')
            .attr('stroke-width', 2)
            .attr('d', line2);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4AE24A')
            .attr('stroke-width', 2)
            .attr('d', line3);

        // Add x-axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat('%b %Y'))
                .ticks(6))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)')
            .style('fill', '#fff')
            .style('font-size', '10px');

        // Add y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale)
                .ticks(6)
                .tickFormat(d => '$' + d))
            .selectAll('text')
            .style('fill', '#fff')
            .style('font-size', '10px');

        // Add axis labels
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 12)
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text('Rent ($)');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 8)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text('Date');

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 15)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Rent Prices Over Time');

        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 150}, ${margin.top + 20})`);

        const legendData = [
            { label: '1 Bedroom', color: '#4A90E2' },
            { label: '2 Bedrooms', color: '#E24A4A' },
            { label: 'Room', color: '#4AE24A' }
        ];

        legendData.forEach((item, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);

            legendRow.append('line')
                .attr('x1', 0)
                .attr('x2', 15)
                .attr('y1', 0)
                .attr('y2', 0)
                .attr('stroke', item.color)
                .attr('stroke-width', 2);

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 4)
                .style('fill', '#fff')
                .style('font-size', '10px')
                .text(item.label);
        });

    }).catch(error => {
        console.error('Error loading RentDataSet.csv:', error);
        container.innerHTML = '<p>Error loading data. Please check the CSV file.</p>';
    });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Leaflet to be fully loaded
    if (typeof L !== 'undefined') {
        initializeLocationMap();
        initializeOshawaMap();
    } else {
        // If Leaflet isn't loaded yet, wait a bit more
        setTimeout(() => {
            if (typeof L !== 'undefined') {
                initializeLocationMap();
                initializeOshawaMap();
            }
        }, 100);
    }

    // Initialize bubble chart when D3 is ready
    if (typeof d3 !== 'undefined') {
        createBubbleChart();
    } else {
        // Wait for D3 to load
        setTimeout(() => {
            if (typeof d3 !== 'undefined') {
                createBubbleChart();
            }
        }, 100);
    }
    
    updateLocationChartsVisibility();
});

window.addEventListener('scroll', updateLocationChartsVisibility, { passive: true });
window.addEventListener('resize', updateLocationChartsVisibility);

