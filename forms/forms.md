# GoDaddy PHP Form Deployment Checklist

**Phase 1: Server-Side & GoDaddy Configuration**

- **1. Create and Configure `.env` File:**

  - [ x] In your GoDaddy web root (e.g., `htdocs`), create a file named `.env`.
  - [ ] Add and correctly populate the following with your actual credentials:
    ```ini
    SMTP_HOST="your_godaddy_smtp_host_or_relay"
    SMTP_PORT="your_smtp_port" ; (e.g., 587, 465, or 25)
    SMTP_USERNAME="your_full_email_address_for_sending"
    SMTP_PASSWORD="your_email_password"
    RECAPTCHA_SECRET_KEY="your_google_recaptcha_v2_SECRET_key"
    ```
  - [ x] **Protect `.env` File:** Add rules to your `.htaccess` file in the web root to deny direct web access to `.env`:
    ```apache
    <Files .env>
      Require all denied
    </Files>
    ```

- **2. PHP Version:**

  - [ ] In your GoDaddy hosting panel, ensure you're using a modern, stable PHP version (PHP 7.4+ is recommended, 8.x is even better).

- **3. File/Directory Permissions:**

  - [ ] `forms/uploads/` (for `volunteer.php`): Set permissions to be writable by the web server (e.g., 755 or 775, depending on GoDaddy's setup).
  - [ ] `uploads/contact/` (for `contact.php`): Set permissions to be writable.
  - [ ] `logs/` (directory one level _above_ your web root, e.g., if web root is `public_html`, then `../logs/`): Ensure it exists and is writable.
  - [ ] `forms/sessions/` (if used by session handler): Ensure it exists and is writable.
  - [ ] The `forms/` directory itself: Ensure it's writable if log files (`form_errors.log`, `newsletter_errors.log`) are created directly within it.

- **4. Composer Dependencies (for `volunteer.php`):**
  - [ ] Upload the `vendor` directory (containing PHPMailer and its dependencies) to your server. It should be located relative to `forms/volunteer.php` such that `require '../vendor/autoload.php';` works (likely in the web root or the directory containing the `forms` directory).

**Phase 2: HTML Form Review & Updates**

- **5. Form `action` Attributes:**

  - [ x] For `contact-us.html`: Ensure `<form ... action="https://mainebreadoflife.org/forms/contact.php" ...>`.
  - [ x] For `volunteer.html`: Ensure `<form ... action="https://mainebreadoflife.org/forms/volunteer.php" ...>`.
  - [ x] For any newsletter forms: Ensure `<form ... action="https://mainebreadoflife.org/forms/newsletter.php" ...>`.

- **6. `php-email-form` Class:**

  - [ x] If using `assets/vendor/php-email-form/validate.js` for AJAX submission/validation:
    - [ x] In `contact-us.html`, ensure the form element has `class="... php-email-form ..."`.
    - [ x] In `volunteer.html`, ensure the form element has `class="... php-email-form ..."`.
    - [ x] In newsletter forms, ensure the form element has `class="... php-email-form ..."`.

- **7. CSRF Token Implementation:**

  - [ x] Verify your frontend JavaScript correctly fetches the CSRF token from `forms/get_csrf_token.php`.
  - [ x] Ensure this token is dynamically added as a hidden input (`<input type="hidden" name="csrf_token" value="THE_FETCHED_TOKEN">`) to _every_ form before submission.

- **8. reCAPTCHA Implementation:**

  - [ x] Ensure the reCAPTCHA widget div is present in your HTML forms:
    `<div class="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_V2_SITE_KEY"></div>`
    (Replace `YOUR_RECAPTCHA_V2_SITE_KEY` with your actual _site_ key from Google).
  - [ x] Ensure the reCAPTCHA JavaScript API is loaded: `<script src="https://www.google.com/recaptcha/api.js" async defer></script>`.

- **9. No HTTP Resources:**
  - [ ] Manually inspect your HTML files (`contact-us.html`, `volunteer.html`, `index.html`, etc.) and ensure all links to CSS, JS, images, fonts, etc., use `https://` or are relative paths (which will inherit `https://` because of SSL and your `<base href="/">`).

**Phase 3: Email & DNS**

- **10. DNS Records for Email Deliverability:**
  - [ ] In your GoDaddy DNS settings for `mainebreadoflife.org`:
    - [ ] Set up a valid SPF record.
    - [ ] Set up DKIM records.
    - (GoDaddy support can often assist with the specifics for their mail servers).

**Phase 4: Testing & Troubleshooting**

- **11. Test Each Form Thoroughly:**

  - [ ] Submit test data to `contact-us.html`.
  - [ ] Submit test data to `volunteer.html` (with and without attachments).
  - [ ] Submit test data to your newsletter form.

- **12. Check Browser Developer Console:**

  - [ ] Open your browser's developer tools (usually F12).
  - [ ] Look for errors in the "Console" tab (JavaScript errors, mixed content warnings, failed AJAX requests).
  - [ ] Check the "Network" tab to see if form submissions are going to the correct PHP scripts and what the server responses are.

- **13. Check PHP Error Logs on Server:**
  - [ ] `logs/error.log` (main PHP error log, path defined in `config.php`).
  - [ ] `forms/form_errors.log` (for contact and volunteer forms).
  - [ ] `forms/newsletter_errors.log`.
  - These logs are crucial for diagnosing backend issues.
