/**
 * Theme Manager Module
 * Handles theme switching, dark mode, and user preferences
 */

export class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        name: 'light',
        label: 'Light Theme'
      },
      dark: {
        name: 'dark',
        label: 'Dark Theme'
      },
      auto: {
        name: 'auto',
        label: 'Auto (System)'
      }
    };
    
    this.currentTheme = 'auto';
    this.mediaQuery = null;
    
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    // Set up media query for system preference
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme preference
    this.loadThemePreference();
    
    // Apply initial theme
    this.applyTheme();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Add theme toggle button
    this.addThemeToggle();
    
    console.log('Theme manager initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for system theme changes
    if (this.mediaQuery) {
      this.mediaQuery.addListener(() => {
        if (this.currentTheme === 'auto') {
          this.applyTheme();
        }
      });
    }

    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme-preference') {
        this.currentTheme = e.newValue || 'auto';
        this.applyTheme();
        this.updateThemeToggle();
      }
    });
  }

  /**
   * Load theme preference from localStorage
   */
  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && this.themes[savedTheme]) {
      this.currentTheme = savedTheme;
    }
  }

  /**
   * Save theme preference to localStorage
   */
  saveThemePreference() {
    localStorage.setItem('theme-preference', this.currentTheme);
  }

  /**
   * Get effective theme (resolves 'auto' to actual theme)
   */
  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      return this.mediaQuery && this.mediaQuery.matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  /**
   * Apply theme to document
   */
  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${effectiveTheme}`);
    
    // Update meta theme color for mobile browsers
    this.updateThemeColor(effectiveTheme);
    
    console.log(`Applied theme: ${effectiveTheme}`);
  }

  /**
   * Update meta theme color
   */
  updateThemeColor(theme) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    const colors = {
      light: '#ffffff',
      dark: '#1f2937'
    };
    
    themeColorMeta.content = colors[theme] || colors.light;
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    if (!this.themes[theme]) {
      console.warn(`Unknown theme: ${theme}`);
      return;
    }
    
    this.currentTheme = theme;
    this.saveThemePreference();
    this.applyTheme();
    this.updateThemeToggle();
    
    // Dispatch custom event
    const event = new CustomEvent('themechange', {
      detail: { theme, effectiveTheme: this.getEffectiveTheme() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Toggle between themes
   */
  toggleTheme() {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.setTheme(nextTheme);
  }

  /**
   * Add theme toggle button
   */
  addThemeToggle() {
    // Check if toggle already exists
    if (document.getElementById('theme-toggle')) {
      return;
    }

    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = this.getThemeIcon();
    
    // Style the toggle button
    toggle.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      border: 2px solid var(--color-gray-300);
      background: var(--color-white);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: var(--shadow-md);
    `;
    
    // Handle click
    toggle.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Handle hover
    toggle.addEventListener('mouseenter', () => {
      toggle.style.transform = 'scale(1.1)';
    });
    
    toggle.addEventListener('mouseleave', () => {
      toggle.style.transform = 'scale(1)';
    });
    
    // Add to DOM
    document.body.appendChild(toggle);
    
    console.log('Theme toggle button added');
  }

  /**
   * Update theme toggle button
   */
  updateThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = this.getThemeIcon();
      toggle.setAttribute('aria-label', `Current theme: ${this.themes[this.currentTheme].label}`);
    }
  }

  /**
   * Get appropriate icon for current theme
   */
  getThemeIcon() {
    const icons = {
      light: '🌞',
      dark: '🌙',
      auto: '🌓'
    };
    
    return icons[this.currentTheme] || icons.auto;
  }

  /**
   * Get current theme info
   */
  getThemeInfo() {
    return {
      current: this.currentTheme,
      effective: this.getEffectiveTheme(),
      available: Object.keys(this.themes)
    };
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode() {
    return this.getEffectiveTheme() === 'dark';
  }

  /**
   * Check if light mode is active
   */
  isLightMode() {
    return this.getEffectiveTheme() === 'light';
  }
}

// Add dark theme CSS variables
const darkThemeStyles = `
  .theme-dark {
    --color-white: #1f2937;
    --color-black: #f9fafb;
    --color-gray-50: #374151;
    --color-gray-100: #4b5563;
    --color-gray-200: #6b7280;
    --color-gray-300: #9ca3af;
    --color-gray-400: #d1d5db;
    --color-gray-500: #e5e7eb;
    --color-gray-600: #f3f4f6;
    --color-gray-700: #f9fafb;
    --color-gray-800: #ffffff;
    --color-gray-900: #ffffff;
  }
  
  .theme-dark .header {
    background-color: rgba(31, 41, 55, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .theme-dark .section--alt {
    background-color: #374151;
  }
  
  .theme-dark .card {
    background-color: #374151;
    border-color: #4b5563;
  }
  
  .theme-dark .form__input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .theme-dark .form__input:focus {
    border-color: var(--color-primary);
    background-color: #4b5563;
  }
  
  .theme-dark .theme-toggle {
    background: #374151 !important;
    border-color: #4b5563 !important;
    color: #f9fafb !important;
  }
  
  @media (max-width: 768px) {
    .theme-dark .nav__menu {
      background-color: #1f2937;
    }
  }
`;

// Inject dark theme styles
const themeStyleSheet = document.createElement('style');
themeStyleSheet.textContent = darkThemeStyles;
document.head.appendChild(themeStyleSheet);