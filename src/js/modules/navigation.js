/**
 * Navigation Module
 * Handles navigation interactions, mobile menu, and active states
 */

export class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navMenu = document.querySelector('.nav__menu');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navLinks = document.querySelectorAll('.nav__link');
    
    this.isMenuOpen = false;
    this.currentSection = 'home';
    
    this.init();
  }

  /**
   * Initialize navigation functionality
   */
  init() {
    if (!this.nav) {
      console.warn('Navigation element not found');
      return;
    }

    this.setupEventListeners();
    this.handleScroll();
    console.log('Navigation module initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavLinkClick(e, link);
      });
    });

    // Scroll listener for active section detection
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 100));

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
        this.navToggle.focus();
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.navMenu.classList.add('nav__menu--open');
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.navToggle.classList.add('nav__toggle--open');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstLink = this.navMenu.querySelector('.nav__link');
    if (firstLink) {
      firstLink.focus();
    }
    
    console.log('Mobile menu opened');
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('nav__menu--open');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navToggle.classList.remove('nav__toggle--open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Mobile menu closed');
  }

  /**
   * Handle navigation link clicks
   */
  handleNavLinkClick(e, link) {
    const href = link.getAttribute('href');
    
    // Only handle hash links
    if (!href.startsWith('#')) {
      return;
    }
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      // Close mobile menu if open
      if (this.isMenuOpen) {
        this.closeMobileMenu();
      }
      
      // Scroll to section
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active state
      this.setActiveLink(link);
      
      // Update current section
      this.currentSection = targetId;
      
      console.log(`Navigated to section: ${targetId}`);
    }
  }

  /**
   * Handle scroll events to update active navigation
   */
  handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header height
    
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionId = section.id;
      }
    });
    
    // If no section is found, default to first section
    if (!currentSectionId && sections.length > 0) {
      currentSectionId = sections[0].id;
    }
    
    // Update active state if section changed
    if (currentSectionId && currentSectionId !== this.currentSection) {
      this.currentSection = currentSectionId;
      this.updateActiveNavigation();
    }
    
    // Handle header background on scroll
    this.handleHeaderBackground();
  }

  /**
   * Update active navigation based on current section
   */
  updateActiveNavigation() {
    const activeLink = document.querySelector(`.nav__link[href="#${this.currentSection}"]`);
    if (activeLink) {
      this.setActiveLink(activeLink);
    }
  }

  /**
   * Set active link
   */
  setActiveLink(activeLink) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
    });
    
    // Add active class to current link
    activeLink.classList.add('nav__link--active');
  }

  /**
   * Handle header background change on scroll
   */
  handleHeaderBackground() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Throttle function to limit function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}