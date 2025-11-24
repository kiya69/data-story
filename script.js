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
});

// Track if persona was selected
let personaSelected = false;
let selectedPersona = null;
let scrollTriggered = false;

// Persona selection functionality
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Keep click functionality but make it secondary
    const personaCards = document.querySelectorAll('.persona-card');
    
    personaCards.forEach(card => {
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
    let hasScrolled = false;
    let wasInitiallyVisible = false;
    
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
                
                // Clear any existing timeout
                if (autoSelectTimeout) {
                    clearTimeout(autoSelectTimeout);
                }
                
                // Auto-select after user has been viewing the section for 0.8 seconds
                autoSelectTimeout = setTimeout(() => {
                    if (!personaSelected && !scrollTriggered) {
                        scrollTriggered = true;
                        // Randomly select a persona
                        const personas = ['jamie', 'cathy'];
                        const randomPersona = personas[Math.floor(Math.random() * personas.length)];
                        personaSelected = true;
                        selectedPersona = randomPersona;
                        
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
                        }, 1200);
                    }
                }, 800);
            } else if (!entry.isIntersecting && !personaSelected && !scrollTriggered) {
                // If user scrolls past without waiting, select immediately (only if they've scrolled)
                if (entry.boundingClientRect.top < -50 && hasScrolled) {
                    if (autoSelectTimeout) {
                        clearTimeout(autoSelectTimeout);
                    }
                    scrollTriggered = true;
                    const personas = ['jamie', 'catherine'];
                    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
                    personaSelected = true;
                    selectedPersona = randomPersona;
                    showPersonaJourney(randomPersona, false);
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
    
    // Hide all journey sections first
    document.getElementById('jamie-journey').style.display = 'none';
    document.getElementById('cathy-journey').style.display = 'none';
    
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

function showConclusion() {
    document.getElementById('conclusion').style.display = 'flex';
    // User will scroll manually to see the conclusion
}

function goBackToPersonas() {
    // Reset persona selection state
    personaSelected = false;
    selectedPersona = null;
    scrollTriggered = false;
    
    // Hide all journey sections
    document.getElementById('jamie-journey').style.display = 'none';
    document.getElementById('cathy-journey').style.display = 'none';
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
});

// Scroll-triggered animations for info blocks
function setupScrollAnimations() {
    // Get all elements that need animation, but only those not already animated
    const animatedElements = document.querySelectorAll('.timeline-content:not(.animate-in), .metric-card:not(.animate-in), .conclusion-item:not(.animate-in), .point-item:not(.animate-in)');
    
    if (animatedElements.length === 0) return;
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add small delay for staggered effect, especially for metric cards and point items
                let delay = 0;
                if (entry.target.classList.contains('metric-card')) {
                    delay = index * 100;
                } else if (entry.target.classList.contains('point-item')) {
                    const pointNumber = parseInt(entry.target.getAttribute('data-point')) || 1;
                    delay = (pointNumber - 1) * 200; // 200ms delay between each point
                }
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                // Stop observing once animated
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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

