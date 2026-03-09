/**
 * Smooth Scroll Module
 * Handles smooth scrolling behavior and scroll animations
 */

export class SmoothScroll {
  constructor() {
    this.scrollElements = [];
    this.init();
  }

  /**
   * Initialize smooth scroll functionality
   */
  init() {
    this.setupIntersectionObserver();
    this.handleScrollAnimations();
    console.log('Smooth scroll module initialized');
  }

  /**
   * Set up intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      console.warn('Intersection Observer not supported');
      return;
    }

    // Create observer for fade-in animations
    this.fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          this.fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Create observer for slide-up animations
    this.slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          this.slideObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe elements for animations
    this.observeElements();
  }

  /**
   * Observe elements for scroll animations
   */
  observeElements() {
    // Elements to fade in
    const fadeElements = document.querySelectorAll('.card, .section__title');
    fadeElements.forEach(element => {
      element.classList.add('fade-in-ready');
      this.fadeObserver.observe(element);
    });

    // Elements to slide up
    const slideElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__actions');
    slideElements.forEach((element, index) => {
      element.classList.add('slide-up-ready');
      element.style.animationDelay = `${index * 0.2}s`;
      this.slideObserver.observe(element);
    });
  }

  /**
   * Handle scroll animations and effects
   */
  handleScrollAnimations() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollEffects();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Update scroll-based effects
   */
  updateScrollEffects() {
    const scrollY = window.scrollY;
    
    // Parallax effect for hero section
    this.handleParallaxEffect(scrollY);
    
    // Progress indicator
    this.updateScrollProgress();
  }

  /**
   * Handle parallax effect
   */
  handleParallaxEffect(scrollY) {
    const heroSection = document.querySelector('.section--hero');
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight;
    const scrollPercent = Math.min(scrollY / heroHeight, 1);
    
    // Apply parallax transform to hero content
    const heroContent = heroSection.querySelector('.hero');
    if (heroContent) {
      const translateY = scrollPercent * 50;
      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = 1 - scrollPercent * 0.5;
    }
  }

  /**
   * Update scroll progress indicator
   */
  updateScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = this.createScrollProgressBar();
    }

    // Calculate scroll progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress bar
    progressBar.style.width = scrolled + '%';
  }

  /**
   * Create scroll progress bar
   */
  createScrollProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    progressContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 1001;
      background-color: rgba(59, 130, 246, 0.1);
    `;

    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
      width: 0%;
      transition: width 0.1s ease;
    `;

    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    return progressBar;
  }

  /**
   * Smooth scroll to element
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Add scroll-to-top button
   */
  addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top btn btn--primary';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      font-size: 20px;
      padding: 0;
    `;

    // Show/hide button based on scroll position
    const toggleButton = () => {
      if (window.scrollY > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.visibility = 'visible';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.visibility = 'hidden';
      }
    };

    // Handle button click
    scrollButton.addEventListener('click', () => {
      this.scrollToTop();
    });

    // Handle scroll
    window.addEventListener('scroll', toggleButton, { passive: true });

    // Add to DOM
    document.body.appendChild(scrollButton);

    return scrollButton;
  }
}

// Add CSS for animations
const animationStyles = `
  .fade-in-ready {
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  
  .animate-fade-in {
    opacity: 1 !important;
  }
  
  .slide-up-ready {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-slide-up {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .fade-in-ready,
    .slide-up-ready {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);