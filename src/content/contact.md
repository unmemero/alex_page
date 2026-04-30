<form id="contact-form-element" class="contact-form">
    <h1>Contact</h1>

    <div class="form-fields">
        <div class="form-group">
            <label for="name">Name</label>
            <input id="name" name="name" required />
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
        </div>
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required rows="6"></textarea>
        </div>
    </div>
    <button type="submit" class="form-submit-button" id="submit-button">
        Send Message
    </button>
</form>
