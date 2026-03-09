/**
 * Main Application Entry Point
 * emptyRepositoryTest10
 */

import { Navigation } from './modules/navigation.js';
import { FormHandler } from './modules/forms.js';
import { SmoothScroll } from './modules/smooth-scroll.js';
import { ThemeManager } from './modules/theme.js';
import { Utils } from './utils/helpers.js';

class App {
  constructor() {
    this.navigation = null;
    this.formHandler = null;
    this.smoothScroll = null;
    this.themeManager = null;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeModules();
      });
    } else {
      this.initializeModules();
    }
  }

  /**
   * Initialize all application modules
   */
  initializeModules() {
    try {
      console.log('Initializing emptyRepositoryTest10...');

      // Initialize theme manager first
      this.themeManager = new ThemeManager();

      // Initialize navigation
      this.navigation = new Navigation();

      // Initialize form handling
      this.formHandler = new FormHandler();

      // Initialize smooth scrolling
      this.smoothScroll = new SmoothScroll();

      // Set up event listeners
      this.setupEventListeners();

      // Initialize hero section interactions
      this.initHeroSection();

      console.log('Application initialized successfully!');
      this.displayWelcomeMessage();
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', Utils.debounce(() => {
      this.handleResize();
    }, 250));

    // Handle window load
    window.addEventListener('load', () => {
      this.handleWindowLoad();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Initialize hero section interactions
   */
  initHeroSection() {
    const ctaButton = document.getElementById('cta-button');
    const learnMoreButton = document.getElementById('learn-more');

    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCtaClick();
      });
    }

    if (learnMoreButton) {
      learnMoreButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLearnMoreClick();
      });
    }
  }

  /**
   * Handle CTA button click
   */
  handleCtaClick() {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Add some visual feedback
    this.showNotification('Let\'s get started! 🚀', 'success');
  }

  /**
   * Handle Learn More button click
   */
  handleLearnMoreClick() {
    // Scroll to about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Trigger resize event for modules that need it
    if (this.navigation) {
      this.navigation.handleResize();
    }

    console.log('Window resized:', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  /**
   * Handle window load
   */
  handleWindowLoad() {
    console.log('Window fully loaded');
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');

    // Trigger any load-dependent functionality
    this.handleInitialAnimations();
  }

  /**
   * Handle visibility change (tab switching)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('Page hidden');
    } else {
      console.log('Page visible');
    }
  }

  /**
   * Handle initial page animations
   */
  handleInitialAnimations() {
    // Add fade-in animation to hero content
    const heroElements = document.querySelectorAll('.hero > *');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }, index * 200);
    });
  }

  /**
   * Display welcome message
   */
  displayWelcomeMessage() {
    const message = `
      🎉 Welcome to emptyRepositoryTest10!
      
      This application is built with:
      • HTML5 semantic markup
      • Modern CSS3 with custom properties
      • ES6+ JavaScript modules
      • Responsive design principles
      
      Check the console for more details!
    `;
    
    console.log(message);
  }

  /**
   * Show notification to user
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert--${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease';
    
    notification.innerHTML = `
      <div class="alert__message">${message}</div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize the application
const app = new App();

// Export for potential external access
window.App = app;

// Add fadeOut keyframe animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);