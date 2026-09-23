const request = require('supertest');
const app = require('../src/app');

describe('Helpdesk Contact Page', () => {
  describe('GET /helpdesk', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
    });

    it('should render complete HTML document', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('<html');
      expect(response.text).toContain('</html>');
    });

    it('should have proper page title', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('<title>Helpdesk Contact - Pakistan Single Window</title>');
    });

    it('should display PSW header with navigation', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('PAKISTAN SINGLE WINDOW');
      expect(response.text).toContain('Home');
      expect(response.text).toContain('About PSW');
      expect(response.text).toContain('Services');
      expect(response.text).toContain('Help &amp; Support');
    });
  });

  describe('Contact Details Section', () => {
    it('should have contact details section with heading', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="contact-details"');
      expect(response.text).toContain('<h2>Contact Details</h2>');
    });

    it('should display telephone number with tel: link', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('href="tel:');
      expect(response.text).toMatch(/<a href="tel:\+\d+">/);
    });

    it('should display email address with mailto: link', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('href="mailto:helpdesk@psw.gov.pk"');
      expect(response.text).toContain('helpdesk@psw.gov.pk');
    });

    it('should display WhatsApp contact with wa.me link', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('href="https://wa.me/');
      expect(response.text).toContain('Chat with us on WhatsApp');
    });

    it('should display office hours with public holiday note', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('Office Hours');
      expect(response.text).toContain('Monday to Friday');
      expect(response.text).toContain('public holidays');
    });

    it('should display response commitment text', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('Written requests answered within one working day');
    });
  });

  describe('Support Request Form', () => {
    it('should have support form section with heading', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="support-form-section"');
      expect(response.text).toContain('<h2>Submit a Support Request</h2>');
    });

    it('should have form with correct action and method', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="support-form"');
      expect(response.text).toContain('method="POST"');
      expect(response.text).toContain('action="/api/support-requests"');
    });

    it('should have name input with required attributes', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="name"');
      expect(response.text).toContain('name="name"');
      expect(response.text).toContain('aria-describedby="name-error"');
      expect(response.text).toMatch(/<input[^>]*id="name"[^>]*required[^>]*>/);
    });

    it('should have email input with required attributes', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="email"');
      expect(response.text).toContain('name="email"');
      expect(response.text).toContain('type="email"');
      expect(response.text).toContain('aria-describedby="email-error"');
      expect(response.text).toMatch(/<input[^>]*id="email"[^>]*required[^>]*>/);
    });

    it('should have subject input without required attribute', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="subject"');
      expect(response.text).toContain('name="subject"');
      expect(response.text).toContain('aria-describedby="subject-error"');
      expect(response.text).toContain('optional');
      // Subject should NOT have required attribute
      const subjectInput = response.text.match(/<input[^>]*id="subject"[^>]*>/)?.[0] || '';
      expect(subjectInput).not.toContain('required');
    });

    it('should have message textarea with required attributes', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="message"');
      expect(response.text).toContain('name="message"');
      expect(response.text).toContain('aria-describedby="message-error"');
      expect(response.text).toMatch(/<textarea[^>]*id="message"[^>]*required[^>]*>/);
    });

    it('should have proper labels for all form fields', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('<label for="name">');
      expect(response.text).toContain('<label for="email">');
      expect(response.text).toContain('<label for="subject">');
      expect(response.text).toContain('<label for="message">');
    });

    it('should have hidden error spans for all form fields', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('id="name-error"');
      expect(response.text).toContain('id="email-error"');
      expect(response.text).toContain('id="subject-error"');
      expect(response.text).toContain('id="message-error"');
      expect(response.text).toMatch(/<span id="name-error"[^>]*hidden[^>]*>/); 
      expect(response.text).toMatch(/<span id="email-error"[^>]*hidden[^>]*>/);
      expect(response.text).toMatch(/<span id="subject-error"[^>]*hidden[^>]*>/);
      expect(response.text).toMatch(/<span id="message-error"[^>]*hidden[^>]*>/);
    });

    it('should have submit button with aria-label', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('type="submit"');
      expect(response.text).toContain('aria-label="Submit support request"');
      expect(response.text).toContain('Submit Request');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper semantic HTML5 structure', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('<header>');
      expect(response.text).toContain('<main>');
      expect(response.text).toContain('<section');
      expect(response.text).toContain('<footer>');
    });

    it('should have proper heading hierarchy', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('<h1>');
      expect(response.text).toContain('<h2>');
    });

    it('should have lang attribute on html element', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toMatch(/<html[^>]*lang="en"[^>]*>/);
    });

    it('should have viewport meta tag for responsive design', async () => {
      const response = await request(app).get('/helpdesk');
      expect(response.text).toContain('name="viewport"');
      expect(response.text).toContain('width=device-width');
    });
  });
});