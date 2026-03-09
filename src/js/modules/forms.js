/**
 * Form Handler Module
 * Handles form validation, submission, and user feedback
 */

export class FormHandler {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  /**
   * Initialize form handling
   */
  init() {
    if (this.forms.length === 0) {
      console.warn('No forms found on page');
      return;
    }

    this.setupEventListeners();
    console.log(`Form handler initialized for ${this.forms.length} form(s)`);
  }

  /**
   * Set up event listeners for all forms
   */
  setupEventListeners() {
    this.forms.forEach(form => {
      // Handle form submission
      form.addEventListener('submit', (e) => {
        this.handleFormSubmit(e, form);
      });

      // Handle real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    });
  }

  /**
   * Handle form submission
   */
  handleFormSubmit(e, form) {
    e.preventDefault();

    const formId = form.id || 'unknown';
    console.log(`Form submission for: ${formId}`);

    // Validate entire form
    const isValid = this.validateForm(form);

    if (!isValid) {
      this.showFormError(form, 'Please correct the errors above');
      return;
    }

    // Get form data
    const formData = this.getFormData(form);
    console.log('Form data:', formData);

    // Show loading state
    this.setFormLoadingState(form, true);

    // Simulate form submission (replace with actual API call)
    this.submitForm(formData, form)
      .then(() => {
        this.handleFormSuccess(form);
      })
      .catch((error) => {
        this.handleFormError(form, error.message);
      })
      .finally(() => {
        this.setFormLoadingState(form, false);
      });
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearFieldError(input);

    // Required field validation
    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    // Minimum length validation
    else if (input.hasAttribute('minlength')) {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (value && value.length < minLength) {
        isValid = false;
        errorMessage = `Minimum length is ${minLength} characters`;
      }
    }
    // Maximum length validation
    else if (input.hasAttribute('maxlength')) {
      const maxLength = parseInt(input.getAttribute('maxlength'));
      if (value.length > maxLength) {
        isValid = false;
        errorMessage = `Maximum length is ${maxLength} characters`;
      }
    }

    // Show error if invalid
    if (!isValid) {
      this.showFieldError(input, errorMessage);
    }

    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(input, message) {
    input.classList.add('form__input--error');
    
    // Create or update error element
    let errorElement = input.parentNode.querySelector('.form__error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form__error';
      input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  /**
   * Clear field error
   */
  clearFieldError(input) {
    input.classList.remove('form__input--error');
    const errorElement = input.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Show form-level error
   */
  showFormError(form, message) {
    let errorElement = form.querySelector('.form__error--general');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'alert alert--error form__error--general';
      form.insertBefore(errorElement, form.firstChild);
    }
    
    errorElement.innerHTML = `
      <div class="alert__message">${message}</div>
    `;
  }

  /**
   * Clear form-level error
   */
  clearFormError(form) {
    const errorElement = form.querySelector('.form__error--general');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Get form data as object
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  /**
   * Submit form data (simulated)
   */
  async submitForm(data, form) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success/failure for demo purposes
    if (Math.random() > 0.8) {
      throw new Error('Network error occurred. Please try again.');
    }
    
    // In a real application, you would make an actual API call here
    console.log('Form data submitted:', data);
    
    return { success: true, message: 'Form submitted successfully!' };
  }

  /**
   * Handle successful form submission
   */
  handleFormSuccess(form) {
    this.clearFormError(form);
    
    // Show success message
    let successElement = form.querySelector('.form__success--general');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'alert alert--success form__success--general';
      form.insertBefore(successElement, form.firstChild);
    }
    
    successElement.innerHTML = `
      <div class="alert__message">
        Thank you! Your message has been sent successfully.
      </div>
    `;
    
    // Reset form
    form.reset();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      if (successElement.parentNode) {
        successElement.remove();
      }
    }, 5000);
    
    console.log('Form submitted successfully');
  }

  /**
   * Handle form submission error
   */
  handleFormError(form, errorMessage) {
    this.showFormError(form, errorMessage || 'An error occurred. Please try again.');
    console.error('Form submission error:', errorMessage);
  }

  /**
   * Set form loading state
   */
  setFormLoadingState(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select, button');
    
    if (isLoading) {
      // Disable all inputs
      inputs.forEach(input => {
        input.disabled = true;
      });
      
      // Update submit button
      if (submitButton) {
        submitButton.innerHTML = `
          <span class="spinner"></span>
          Sending...
        `;
      }
      
      form.classList.add('form--loading');
    } else {
      // Re-enable all inputs
      inputs.forEach(input => {
        input.disabled = false;
      });
      
      // Restore submit button
      if (submitButton) {
        submitButton.innerHTML = 'Send Message';
      }
      
      form.classList.remove('form--loading');
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}