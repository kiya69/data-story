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

// Rough.js helper function to add hand-drawn borders
function addRoughBorder(element, options = {}) {
    if (!window.rough) return; // Check if Rough.js is loaded

    // Skip if already has rough border
    if (element.querySelector('.rough-border')) return;

    const padding = options.padding || 0;

    // Create SVG overlay
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'rough-border');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    svg.style.overflow = 'visible';

    // Make parent relative if not already
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(svg);

    // Function to update border based on element size
    const updateBorder = () => {
        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        // Clear previous content
        svg.innerHTML = '';

        // Use Rough.js to draw border
        const rc = rough.svg(svg);
        const strokeColor = options.stroke || getComputedStyle(element).getPropertyValue('--primary-color') || '#a8c5a0';
        const strokeWidth = options.strokeWidth || 2;

        const roughOptions = {
            roughness: options.roughness || 1.5,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: 'none',
            bowing: options.bowing || 3,
            ...options.roughOptions
        };

        const node = rc.rectangle(padding, padding, width - (padding * 2), height - (padding * 2), roughOptions);
        svg.appendChild(node);
    };

    // Initial draw
    updateBorder();

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
        updateBorder();
    });
    resizeObserver.observe(element);

    return svg;
}

// Apply rough.js styling to multiple elements
function applyRoughStyling() {
    if (!window.rough) {
        console.warn('Rough.js not loaded');
        return;
    }

    // Persona cards
    document.querySelectorAll('.persona-card').forEach(card => {
        if (!card.querySelector('.rough-border')) {
            const color = card.classList.contains('jamie-card') ? '#7fb3b0' :
                card.classList.contains('cathy-card') ? '#d4a5a5' :
                    card.classList.contains('christina-card') ? '#c9a882' : '#a8c5a0';
            addRoughBorder(card, {
                padding: 2,
                stroke: color,
                strokeWidth: 2.5,
                roughness: 1.8,
                bowing: 4
            });
        }
    });

    // Problem items
    document.querySelectorAll('.problem-item').forEach(item => {
        if (!item.querySelector('.rough-border')) {
            addRoughBorder(item, {
                padding: 1,
                stroke: '#a8c5a0',
                strokeWidth: 2,
                roughness: 2,
                bowing: 3
            });
        }
    });

    // Point items
    document.querySelectorAll('.point-item').forEach(item => {
        if (!item.querySelector('.rough-border')) {
            addRoughBorder(item, {
                padding: 3,
                stroke: '#a8c5a0',
                strokeWidth: 3,
                roughness: 2.5,
                bowing: 5
            });
        }
    });

    // Background graph containers
    document.querySelectorAll('.background-graph-container').forEach(container => {
        if (!container.querySelector('.rough-border')) {
            addRoughBorder(container, {
                padding: 1,
                stroke: 'rgba(168, 197, 160, 0.5)',
                strokeWidth: 2,
                roughness: 1.5,
                bowing: 3
            });
        }
    });

    // Metric cards
    document.querySelectorAll('.metric-card').forEach(card => {
        if (!card.querySelector('.rough-border')) {
            addRoughBorder(card, {
                padding: 1,
                stroke: '#a8c5a0',
                strokeWidth: 2,
                roughness: 1.8,
                bowing: 3
            });
        }
    });

    // Timeline content
    document.querySelectorAll('.timeline-content').forEach(content => {
        if (!content.querySelector('.rough-border')) {
            addRoughBorder(content, {
                padding: 1,
                stroke: '#a8c5a0',
                strokeWidth: 1.5,
                roughness: 1.5,
                bowing: 2
            });
        }
    });

    // Conclusion points
    document.querySelectorAll('.conclusion-point').forEach(point => {
        if (!point.querySelector('.rough-border')) {
            addRoughBorder(point, {
                padding: 1,
                stroke: '#a8c5a0',
                strokeWidth: 2,
                roughness: 2,
                bowing: 3
            });
        }
    });

    // Background text content
    const textContent = document.querySelector('#background .text-content');
    if (textContent && !textContent.querySelector('.rough-border')) {
        addRoughBorder(textContent, {
            padding: 1,
            stroke: 'rgba(168, 197, 160, 0.4)',
            strokeWidth: 2,
            roughness: 1.5,
            bowing: 2
        });
    }

    // Data visualization containers
    document.querySelectorAll('.data-visualization').forEach(container => {
        if (!container.querySelector('.rough-border')) {
            addRoughBorder(container, {
                padding: 1,
                stroke: '#a8c5a0',
                strokeWidth: 1.5,
                roughness: 1.5,
                bowing: 2
            });
        }
    });

    // Comparison content
    document.querySelectorAll('.comparison-content').forEach(content => {
        if (!content.querySelector('.rough-border')) {
            addRoughBorder(content, {
                padding: 1,
                stroke: '#d4a5a5',
                strokeWidth: 2,
                roughness: 1.8,
                bowing: 3
            });
        }
    });
}

// Observe journey steps
document.addEventListener('DOMContentLoaded', () => {
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach(step => {
        observer.observe(step);
    });

    // Set up background section scroll animations
    setupBackgroundScrollAnimations();

    // Apply rough.js styling after a short delay to ensure elements are rendered
    setTimeout(() => {
        applyRoughStyling();
    }, 100);

    // Re-apply when new elements are added dynamically
    const mutationObserver = new MutationObserver(() => {
        setTimeout(() => {
            applyRoughStyling();
        }, 100);
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
function setupBackgroundScrollAnimations() {
    const backgroundSection = document.getElementById('background');
    if (!backgroundSection) return;

    // Track which parts have been animated
    const animatedParts = new Set();

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
                // Apply rough.js border after graph is shown
                if (window.rough && !graphContainer.querySelector('.rough-border')) {
                    addRoughBorder(graphContainer, {
                        padding: 1,
                        stroke: 'rgba(168, 197, 160, 0.5)',
                        strokeWidth: 2,
                        roughness: 1.5,
                        bowing: 3
                    });
                }
            }, 100);
        }

        animatedParts.add(partNumber);
    }

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
        // Re-apply rough.js styling to newly visible elements
        applyRoughStyling();
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

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

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
    const jamieIcon = createPersonaIcon('assets/images/1jamie.png', 'jamie-marker', [-80, -80]);
    const jamieMarker = L.marker([oshawaLat, oshawaLng - 0.03], { icon: jamieIcon, draggable: true })
        .addTo(map)
        .bindPopup('<b>Jamie</b><br>University graduate looking for employment', {
            className: 'jamie-popup'
        });

    // Cathy (Catherine) - middle, popup above center
    const cathyIcon = createPersonaIcon('assets/images/1cathy.png', 'cathy-marker', [0, -80]);
    const cathyMarker = L.marker([oshawaLat, oshawaLng], { icon: cathyIcon, draggable: true })
        .addTo(map)
        .bindPopup('<b>Cathy</b><br>Experienced professional navigating career changes', {
            className: 'cathy-popup'
        });

    // Christina - rightmost, popup above and to the left (90px left of marker)
    const christinaIcon = createPersonaIcon('assets/images/1chris.png', 'christina-marker', [-10, -80]);
    const christinaMarker = L.marker([oshawaLat, oshawaLng + 0.03], { icon: christinaIcon, draggable: true })
        .addTo(map)
        .bindPopup('<b>Christina</b><br>Adapting to the changing job market', {
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

    let nextPopupToOpenForward = 1; // Track which popup to open next when scrolling down (1=jamie, 2=cathy, 3=christina)
    let nextPopupToOpenReverse = 3; // Track which popup to open next when scrolling up (3=christina, 2=cathy, 1=jamie)
    let isMapInView = false;
    let lastScrollTime = 0;
    let lastScrollY = window.scrollY; // Track last scroll position to detect direction
    const scrollCooldown = 600; // Minimum time between scroll actions (ms)
    let allPopupsShownForward = false; // Track if all 3 popups have been shown when scrolling down
    let allPopupsShownReverse = false; // Track if all 3 popups have been shown when scrolling up

    // Check if map section is 80% visible
    const isMap80PercentVisible = () => {
        const rect = mapSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // Calculate visible area
        const visibleTop = Math.max(0, -rect.top);
        const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleWidth = Math.min(rect.width, windowWidth - Math.max(0, rect.left));
        
        const visibleArea = visibleHeight * visibleWidth;
        const totalArea = rect.height * rect.width;
        
        // Check if 80% or more is visible
        return (visibleArea / totalArea) >= 0.8;
    };

    // Check if a popup is currently open
    const isPopupOpen = (popupNumber) => {
        if (popupNumber === 1) return window.mapMarkers.jamie.isPopupOpen();
        if (popupNumber === 2) return window.mapMarkers.cathy.isPopupOpen();
        if (popupNumber === 3) return window.mapMarkers.christina.isPopupOpen();
        return false;
    };

    // Use IntersectionObserver to detect when map section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isMapInView = entry.isIntersecting;
            // Reset when map leaves view
            if (!entry.isIntersecting) {
                nextPopupToOpenForward = 1;
                nextPopupToOpenReverse = 3;
                allPopupsShownForward = false;
                allPopupsShownReverse = false;
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

        // For scrolling down - open popups in forward order (Jamie → Cathy → Christina)
        if (scrollDirection === 'down') {
            if (allPopupsShownForward) return;

            // For the first popup, only proceed if map section is 80% visible
            if (nextPopupToOpenForward === 1 && !isMap80PercentVisible()) return;
            // For subsequent popups, check if map is in view
            if (nextPopupToOpenForward > 1 && !isMapInView) return;

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
                        nextPopupToOpenReverse = 3;
                        allPopupsShownReverse = false;
                    } else if (nextPopupToOpenForward === 2) {
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenForward = 3;
                    } else if (nextPopupToOpenForward === 3) {
                        window.mapMarkers.christina.openPopup();
                        // All popups opened forward - remove sticky positioning
                        allPopupsShownForward = true;
                        nextPopupToOpenForward = 4; // Prevent further popup opening
                        // Remove sticky positioning after a short delay
                        setTimeout(() => {
                            mapSection.style.position = 'relative';
                            mapSection.classList.remove('sticky-active');
                        }, 500);
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
                    if (nextPopupToOpenReverse === 3) {
                        window.mapMarkers.christina.openPopup();
                        nextPopupToOpenReverse = 2;
                        // Reset forward counter when starting reverse
                        nextPopupToOpenForward = 1;
                        allPopupsShownForward = false;
                    } else if (nextPopupToOpenReverse === 2) {
                        window.mapMarkers.cathy.openPopup();
                        nextPopupToOpenReverse = 1;
                    } else if (nextPopupToOpenReverse === 1) {
                        window.mapMarkers.jamie.openPopup();
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
            if (allPopupsShownForward) return;

            // For the first popup, only proceed if map section is 80% visible
            if (nextPopupToOpenForward === 1 && !isMap80PercentVisible()) return;
            // For subsequent popups, check if map is in view
            if (nextPopupToOpenForward > 1 && !isMapInView) return;

            const currentTime = Date.now();

            if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownForward) {
                lastScrollTime = currentTime;

                // Open next popup in forward sequence
                if (nextPopupToOpenForward === 1) {
                    window.mapMarkers.jamie.openPopup();
                    nextPopupToOpenForward = 2;
                    // Reset reverse counter when starting forward
                    nextPopupToOpenReverse = 3;
                    allPopupsShownReverse = false;
                } else if (nextPopupToOpenForward === 2) {
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpenForward = 3;
                } else if (nextPopupToOpenForward === 3) {
                    window.mapMarkers.christina.openPopup();
                    // All popups opened forward - remove sticky positioning
                    allPopupsShownForward = true;
                    nextPopupToOpenForward = 4; // Prevent further popup opening
                    // Remove sticky positioning after a short delay
                    setTimeout(() => {
                        mapSection.style.position = 'relative';
                        mapSection.classList.remove('sticky-active');
                    }, 500);
                }
            }
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

            if (currentTime - lastScrollTime > scrollCooldown && !allPopupsShownReverse) {
                lastScrollTime = currentTime;

                // Open next popup in reverse sequence
                if (nextPopupToOpenReverse === 3) {
                    window.mapMarkers.christina.openPopup();
                    nextPopupToOpenReverse = 2;
                    // Reset forward counter when starting reverse
                    nextPopupToOpenForward = 1;
                    allPopupsShownForward = false;
                } else if (nextPopupToOpenReverse === 2) {
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpenReverse = 1;
                } else if (nextPopupToOpenReverse === 1) {
                    window.mapMarkers.jamie.openPopup();
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
}

// Create bubble chart for Industry data
function createBubbleChart() {
    const container = document.getElementById('bubble-chart-container');
    if (!container || typeof d3 === 'undefined') return;

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

    // Load and process data
    d3.csv('assets/csv/Industry.csv').then(data => {
        // Filter out "Grand Total" row
        data = data.filter(d => d.Industry !== 'Grand Total');

        // Convert automation risk to number
        data.forEach(d => {
            d.automationRisk = +d['AVERAGE of Automation Risk (%)'];
        });

        // Set up scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.automationRisk))
            .range([margin.left, width - margin.right])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.automationRisk)])
            .range([height - margin.bottom, margin.top])
            .nice();

        const sizeScale = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.automationRisk))
            .range([20, 80]);

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

        // Create force simulation for bubble positioning
        const simulation = d3.forceSimulation(data)
            .force('x', d3.forceX(d => xScale(d.automationRisk)).strength(0.8))
            .force('y', d3.forceY(height / 2).strength(0.2))
            .force('collision', d3.forceCollide().radius(d => sizeScale(d.automationRisk) + 10))
            .stop();

        // Run simulation
        for (let i = 0; i < 150; ++i) simulation.tick();

        // Create bubbles
        const bubbles = svg.selectAll('.bubble')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .attr('transform', d => `translate(${d.x || xScale(d.automationRisk)}, ${d.y || height / 2})`);

        // Add circles
        bubbles.append('circle')
            .attr('r', d => sizeScale(d.automationRisk))
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
        bubbles.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#fff')
            .attr('font-size', d => Math.min(sizeScale(d.automationRisk) / 3, 14))
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
    }).catch(error => {
        console.error('Error loading Industry.csv:', error);
        container.innerHTML = '<p>Error loading data. Please check the CSV file.</p>';
    });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Leaflet to be fully loaded
    if (typeof L !== 'undefined') {
        initializeOshawaMap();
    } else {
        // If Leaflet isn't loaded yet, wait a bit more
        setTimeout(() => {
            if (typeof L !== 'undefined') {
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
});

