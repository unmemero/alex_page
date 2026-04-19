console.log('contact.js module loaded');

function initializeForm() {
    console.log('Attempting to initialize contact form...');
    // The endpoint for our serverless function
    const API_ENDPOINT = '/submit';

    // DOM Elements
    const form = document.getElementById('contact-form-element');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');

    if (!form) {
        console.error('Contact form element not found in the DOM.');
        return;
    }

    console.log('Contact form element found. Attaching event listener.');

    // Sanitize function to strip HTML tags
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Form Submission Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission intercepted.');

        const name = sanitizeHTML(nameInput.value.trim());
        const email = sanitizeHTML(emailInput.value.trim());
        const message = sanitizeHTML(messageInput.value.trim());

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const formData = {
            name: name,
            email: email,
            message: message,
        };

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        console.log('Sending form data:', formData);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Server responded with OK.');
                alert('Thank you for your message. We will get back to you soon.');
                // Reset form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            } else {
                console.error('Server responded with an error:', response.status);
                alert('An error occurred while sending your message. Please try again later.');
            }
        } catch (error) {
            console.error('Error sending contact form:', error);
            alert('An error occurred while sending your message. Please try again later.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
}

// Since content is loaded dynamically, we need to wait for the form to be added to the DOM.
// We can use a MutationObserver to watch for when the #main-content div changes.
const mainContent = document.getElementById('main-content');

if (mainContent) {
    const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const formElement = document.getElementById('contact-form-element');
                if (formElement) {
                    initializeForm();
                    obs.disconnect(); // Stop observing once the form is found and initialized
                    return;
                }
            }
        }
    });

    observer.observe(mainContent, { childList: true, subtree: true });
}
