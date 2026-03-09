/**
 * Utility Helper Functions
 * Common utility functions used throughout the application
 */

export class Utils {
  /**
   * Debounce function - limits the rate at which a function can fire
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Trigger on leading edge
   * @returns {Function} Debounced function
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle function - ensures a function is called at most once per specified period
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @param {number} threshold - Percentage of element that must be visible (0-1)
   * @returns {boolean} Whether element is in viewport
   */
  static isInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    if (!vertInView || !horInView) return false;
    
    // Calculate visible percentage
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    
    return (visibleArea / totalArea) >= threshold;
  }

  /**
   * Smooth scroll to element
   * @param {HTMLElement|string} target - Element or selector to scroll to
   * @param {Object} options - Scroll options
   */
  static scrollTo(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) {
      console.warn('Scroll target not found:', target);
      return;
    }

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      offset: 0
    };

    const scrollOptions = { ...defaultOptions, ...options };
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - scrollOptions.offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: scrollOptions.behavior
    });
  }

  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  static formatDate(date, options = {}) {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to formatDate:', date);
      return 'Invalid Date';
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const formatOptions = { ...defaultOptions, ...options };
    return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
  }

  /**
   * Generate unique ID
   * @param {string} prefix - Optional prefix for the ID
   * @returns {string} Unique ID
   */
  static generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep clone an object
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = Utils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Check if device supports touch
   * @returns {boolean} Whether device supports touch
   */
  static isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} Whether user prefers reduced motion
   */
  static prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Get device pixel ratio
   * @returns {number} Device pixel ratio
   */
  static getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  }

  /**
   * Check if element has class
   * @param {HTMLElement} element - Element to check
   * @param {string} className - Class name to check for
   * @returns {boolean} Whether element has class
   */
  static hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
  }

  /**
   * Toggle class on element
   * @param {HTMLElement} element - Element to toggle class on
   * @param {string} className - Class name to toggle
   * @param {boolean} force - Force add (true) or remove (false)
   */
  static toggleClass(element, className, force) {
    if (!element || !element.classList) return;
    
    if (typeof force !== 'undefined') {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  }

  /**
   * Get element's computed style
   * @param {HTMLElement} element - Element to get style for
   * @param {string} property - CSS property name
   * @returns {string} Computed style value
   */
  static getStyle(element, property) {
    if (!element) return null;
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  /**
   * Wait for specified time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after specified time
   */
  static wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Animate element using requestAnimationFrame
   * @param {Object} options - Animation options
   */
  static animate(options) {
    const {
      element,
      duration = 300,
      from = {},
      to = {},
      easing = 'easeInOutQuad',
      onComplete = () => {}
    } = options;

    if (!element) {
      console.warn('No element provided for animation');
      return;
    }

    const startTime = performance.now();
    const easingFunctions = {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };

    const easingFunction = easingFunctions[easing] || easingFunctions.easeInOutQuad;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easingFunction(progress);

      // Apply animations
      Object.keys(to).forEach(property => {
        const fromValue = from[property] || 0;
        const toValue = to[property];
        const currentValue = fromValue + (toValue - fromValue) * easeProgress;
        
        if (property === 'opacity') {
          element.style.opacity = currentValue;
        } else if (property === 'translateX' || property === 'translateY') {
          const transform = element.style.transform || '';
          const newTransform = transform.replace(new RegExp(`${property}\\([^)]*\\)`), '') + ` ${property}(${currentValue}px)`;
          element.style.transform = newTransform.trim();
        } else {
          element.style[property] = currentValue + (typeof toValue === 'number' ? 'px' : '');
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    }

    requestAnimationFrame(animate);
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize HTML string
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Log with timestamp
   * @param {string} message - Message to log
   * @param {string} level - Log level (log, warn, error)
   */
  static log(message, level = 'log') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;
    
    if (console[level]) {
      console[level](formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
}