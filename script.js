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
        card.addEventListener('click', () => {
            const persona = card.getAttribute('data-persona');
            if (!personaSelected) {
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
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When persona section enters viewport, automatically select after a short delay
            if (entry.isIntersecting && !personaSelected && !scrollTriggered) {
                // Clear any existing timeout
                if (autoSelectTimeout) {
                    clearTimeout(autoSelectTimeout);
                }
                
                // Auto-select after user has been viewing the section for 0.8 seconds
                autoSelectTimeout = setTimeout(() => {
                    if (!personaSelected && !scrollTriggered) {
                        scrollTriggered = true;
                        // Randomly select a persona
                        const personas = ['jamie', 'catherine'];
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
                        
                        // Show journey and continue scrolling
                        setTimeout(() => {
                            showPersonaJourney(randomPersona, false);
                        }, 1200);
                    }
                }, 1500);
            } else if (!entry.isIntersecting && !personaSelected && !scrollTriggered) {
                // If user scrolls past without waiting, select immediately
                if (entry.boundingClientRect.top < -50) {
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
    // Show selected persona's journey (but don't hide other sections yet for smooth scroll)
    if (persona === 'jamie') {
        document.getElementById('jamie-journey').style.display = 'flex';
        animateJourneySteps('jamie-journey');
        
        // Scroll smoothly to the journey section
        setTimeout(() => {
            const journeySection = document.getElementById('jamie-journey');
            journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, fromClick ? 100 : 300);
    } else if (persona === 'catherine') {
        document.getElementById('catherine-journey').style.display = 'flex';
        animateJourneySteps('catherine-journey');
        
        // Scroll smoothly to the journey section
        setTimeout(() => {
            const journeySection = document.getElementById('catherine-journey');
            journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, fromClick ? 100 : 300);
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
    setTimeout(() => {
        window.scrollTo({
            top: document.getElementById('conclusion').offsetTop,
            behavior: 'smooth'
        });
    }, 500);
}

function goBackToPersonas() {
    // Reset persona selection state
    personaSelected = false;
    selectedPersona = null;
    scrollTriggered = false;
    
    // Hide all journey sections
    document.getElementById('jamie-journey').style.display = 'none';
    document.getElementById('catherine-journey').style.display = 'none';
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
});

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

