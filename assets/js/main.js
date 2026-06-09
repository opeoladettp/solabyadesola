document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Navigation ---
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  const toggleHeaderBackground = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleHeaderBackground);
  toggleHeaderBackground(); // Run on load to check starting position

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // --- Reveal Animations on Scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once it has animated in, we can stop observing it
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1, // trigger when 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // offset to trigger slightly before/after scroll entry
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // --- Booking Form Handling & Simulation ---
  const bookingForm = document.getElementById('consultation-form');
  const formMessage = document.getElementById('form-message');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const serviceSelect = document.getElementById('booking-service');
      const detailsInput = document.getElementById('booking-details');
      const submitBtn = bookingForm.querySelector('button[type="submit"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !serviceSelect.value) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'SENDING REQUEST...';

      setTimeout(() => {
        // Successful submission mock
        showFormMessage(`Thank you, ${nameInput.value.trim()}! Your consultation request for the ${serviceSelect.value} has been received. Adesola's atelier team will reach out to you at ${emailInput.value.trim()} within 24 hours.`, 'success');
        
        // Reset form fields
        bookingForm.reset();
        
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1500);
    });
  }

  function showFormMessage(message, type) {
    if (!formMessage) return;
    
    formMessage.innerHTML = message;
    formMessage.className = 'form-message'; // Clear existing classes
    
    // Trigger redraw
    void formMessage.offsetWidth;
    
    formMessage.classList.add(type);
    
    // Auto clear error messages after 5 seconds, leave success messages visible
    if (type === 'error') {
      setTimeout(() => {
        formMessage.classList.remove('error');
        formMessage.style.opacity = '0';
        setTimeout(() => {
          formMessage.innerHTML = '';
          formMessage.style.opacity = '';
        }, 500);
      }, 5000);
    }
  }
});
