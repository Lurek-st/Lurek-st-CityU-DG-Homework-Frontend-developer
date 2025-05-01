// Reservation Form Management Class
class ReservationForm {
  constructor() {
    // Use Map to store form elements
    this.elements = new Map();
    this.initializeForm();
    this.setupEventListeners();
  }

  initializeForm() {
    // Get base elements
    this.form = document.querySelector('.visit-form');
    this.errorDiv = this.createErrorDiv();

    // Create visitor count input field
    this.createVisitorInput();

    // Store form fields
    this.elements.set('date', document.getElementById('date'));
    this.elements.set('time', document.getElementById('time'));
    this.elements.set('visitors', document.getElementById('visitors'));
  }

  createErrorDiv() {
    const errorDiv = document.createElement('div');
    Object.assign(errorDiv.style, {
      color: 'red',
      textAlign: 'center',
      marginBottom: '10px',
      display: 'none'
    });
    this.form.insertBefore(errorDiv, this.form.firstChild);
    return errorDiv;
  }

  createVisitorInput() {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    formGroup.innerHTML = `
            <label for="visitors">Number of Visitors:</label>
            <input type="number" id="visitors" name="visitors" required>
        `;
    const submitButton = this.form.querySelector('.submit-button');
    submitButton.parentNode.insertBefore(formGroup, submitButton);
  }

  setupEventListeners() {
    // Add event using HTML method (Method 1)
    this.form.querySelector('.reset-button').setAttribute('onclick', 'handleFormReset()');

    // Add event using JavaScript method (Method 2)
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  clearError() {
    this.errorDiv.style.display = 'none';
    this.errorDiv.textContent = '';
  }

  showError(message) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.display = 'block';
  }

  validateForm() {
    // Use Set to store validation results
    const errors = new Set();

    // Validate all fields are filled
    this.elements.forEach((element, key) => {
      if (!element.value.trim()) {
        errors.add('empty');
      }
    });

    if (errors.has('empty')) {
      this.showError('Data not completed; please re-enter');
      return false;
    }

    // Validate visitor count
    const visitorNum = parseInt(this.elements.get('visitors').value);
    if (isNaN(visitorNum) || visitorNum < 1 || visitorNum !== Number(this.elements.get('visitors').value)) {
      this.showError('Please enter a valid number of people!');
      return false;
    }

    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.clearError();

    if (!this.validateForm()) {
      return;
    }

    try {
      const result = reserve(
        this.elements.get('date').value,
        this.elements.get('time').value,
        parseInt(this.elements.get('visitors').value)
      );

      if (result) {
        alert('Your reservation is successful!');
      } else {
        alert('Sorry, the reservation is full!');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      this.showError('An error occurred while processing your reservation');
    }
  }

  handleReset() {
    this.clearError();
    this.form.reset();
  }
}

// Use ES6 Class to manage the entire page
class VisitPageManager {
  constructor() {
    this.reservationForm = null;
  }

  initialize() {
    this.reservationForm = new ReservationForm();

    // Provide global function for HTML onclick event
    window.handleFormReset = () => {
      this.reservationForm.handleReset();
    };
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const pageManager = new VisitPageManager();
  pageManager.initialize();
});