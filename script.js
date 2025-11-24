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

function showConclusion() {
    document.getElementById('conclusion').style.display = 'flex';
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
    const animatedElements = document.querySelectorAll('.timeline-content:not(.animate-in), .metric-card:not(.animate-in), .conclusion-point:not(.animate-in), .point-item:not(.animate-in), .problem-item:not(.animate-in)');

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
                } else if (entry.target.classList.contains('problem-item')) {
                    const problemNumber = parseInt(entry.target.getAttribute('data-problem')) || 1;
                    delay = (problemNumber - 1) * 200; // 200ms delay between each problem item
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
        // Re-apply rough.js styling to newly visible elements
        applyRoughStyling();
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

// Initialize Oshawa Map with Persona Images
function initializeOshawaMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Oshawa, ON coordinates
    const oshawaLat = 43.8971;
    const oshawaLng = -78.8658;

    // Initialize map centered on Oshawa
    const map = L.map('map-container').setView([oshawaLat, oshawaLng], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Create custom icon function
    function createPersonaIcon(imagePath, className) {
        return L.divIcon({
            className: `persona-marker ${className}`,
            html: `<img src="${imagePath}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;" />`,
            iconSize: [120, 120],
            iconAnchor: [60, 60],
            popupAnchor: [0, -60]
        });
    }

    // Place markers at different locations around Oshawa
    // Jamie - slightly north
    const jamieIcon = createPersonaIcon('assets/images/1jamie.png', 'jamie-marker');
    const jamieMarker = L.marker([oshawaLat + 0.02, oshawaLng - 0.01], { icon: jamieIcon })
        .addTo(map)
        .bindPopup('<b>Jamie</b><br>University graduate looking for employment');

    // Cathy - slightly south
    const cathyIcon = createPersonaIcon('assets/images/1cathy.png', 'cathy-marker');
    const cathyMarker = L.marker([oshawaLat - 0.02, oshawaLng + 0.01], { icon: cathyIcon })
        .addTo(map)
        .bindPopup('<b>Cathy</b><br>Experienced professional navigating career changes');

    // Christina - slightly east
    const christinaIcon = createPersonaIcon('assets/images/1chris.png', 'christina-marker');
    const christinaMarker = L.marker([oshawaLat, oshawaLng + 0.02], { icon: christinaIcon })
        .addTo(map)
        .bindPopup('<b>Christina</b><br>Adapting to the changing job market');

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

    let nextPopupToOpen = 1; // Track which popup to open next (1=jamie, 2=cathy, 3=christina)
    let isMapInView = false;
    let lastScrollTime = 0;
    const scrollCooldown = 600; // Minimum time between scroll actions (ms)

    // Use IntersectionObserver to detect when map section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isMapInView = entry.isIntersecting;
            // Reset when map leaves view
            if (!entry.isIntersecting) {
                nextPopupToOpen = 1;
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '0px'
    });

    observer.observe(mapSection);

    // Handle scroll events to open popups one at a time
    let scrollTimeout = null;
    const handleScroll = () => {
        if (!isMapInView) return;

        const currentTime = Date.now();

        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Use requestAnimationFrame for smoother handling
        scrollTimeout = requestAnimationFrame(() => {
            if (currentTime - lastScrollTime > scrollCooldown) {
                lastScrollTime = currentTime;

                // Open next popup in sequence
                if (nextPopupToOpen === 1) {
                    window.mapMarkers.jamie.openPopup();
                    nextPopupToOpen = 2;
                } else if (nextPopupToOpen === 2) {
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpen = 3;
                } else if (nextPopupToOpen === 3) {
                    window.mapMarkers.christina.openPopup();
                    // All popups opened, can reset if needed
                }
            }
        });
    };

    // Also handle wheel events for better responsiveness
    const handleWheel = (e) => {
        if (!isMapInView) return;

        // Only process scroll down
        if (e.deltaY > 0) {
            const currentTime = Date.now();

            if (currentTime - lastScrollTime > scrollCooldown) {
                lastScrollTime = currentTime;

                // Open next popup in sequence
                if (nextPopupToOpen === 1) {
                    window.mapMarkers.jamie.openPopup();
                    nextPopupToOpen = 2;
                } else if (nextPopupToOpen === 2) {
                    window.mapMarkers.cathy.openPopup();
                    nextPopupToOpen = 3;
                } else if (nextPopupToOpen === 3) {
                    window.mapMarkers.christina.openPopup();
                }
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
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
});

