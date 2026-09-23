const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

describe('Helpdesk Page Routes', () => {
  describe('GET /helpdesk', () => {
    it('should return 200 and serve HTML page', async () => {
      const res = await request(app)
        .get('/helpdesk')
        .expect('Content-Type', /html/)
        .expect(200);
      
      expect(res.text).toContain('<!DOCTYPE html>');
      expect(res.text).toContain('<html lang="en">');
    });

    it('should contain main heading HELP & SUPPORT', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('HELP &amp; SUPPORT');
    });

    it('should contain Helpdesk Contact subheading', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('Helpdesk Contact');
    });

    it('should contain all required contact method sections', async () => {
      const res = await request(app).get('/helpdesk');
      
      expect(res.text).toContain('Telephone');
      expect(res.text).toContain('Email');
      expect(res.text).toContain('WhatsApp');
      expect(res.text).toContain('Office Hours');
      expect(res.text).toContain('Response Time');
    });

    it('should have telephone link with tel: protocol (US-001)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toMatch(/href="tel:\+\d+"/);
    });

    it('should have email link with mailto: protocol to helpdesk@psw.gov.pk (US-002)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('href="mailto:helpdesk@psw.gov.pk"');
    });

    it('should have WhatsApp link with wa.me format and proper label (US-004)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toMatch(/href="https:\/\/wa\.me\/\d+"/);
      expect(res.text).toContain('Chat with us on WhatsApp');
    });

    it('should display office hours with day/time ranges and holiday exclusions (US-003)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('Monday to Friday');
      expect(res.text).toContain('9:00 AM');
      expect(res.text).toContain('5:00 PM');
      expect(res.text).toContain('Public Holidays');
    });

    it('should display response commitment text (US-005)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('Written requests are answered within one working day');
    });

    it('should contain PSW navigation menu with all required links (US-006)', async () => {
      const res = await request(app).get('/helpdesk');
      
      expect(res.text).toContain('Home');
      expect(res.text).toContain('About PSW');
      expect(res.text).toContain('Services');
      expect(res.text).toContain('Resources');
      expect(res.text).toContain('Help &amp; Support');
      expect(res.text).toContain('Login');
    });

    it('should contain PSW logo text (US-006)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('PSW');
      expect(res.text).toContain('PAKISTAN SINGLE WINDOW');
    });

    it('should have support request form heading (US-007)', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('Submit a Support Request');
    });

    it('should include form placeholder for future implementation', async () => {
      const res = await request(app).get('/helpdesk');
      expect(res.text).toContain('form-placeholder');
    });
  });

  describe('GET /', () => {
    it('should redirect to /helpdesk', async () => {
      const res = await request(app)
        .get('/')
        .expect(302);
      
      expect(res.headers.location).toBe('/helpdesk');
    });
  });
});

describe('HTML Structure and Accessibility (US-020)', () => {
  const htmlPath = path.join(__dirname, '..', 'views', 'helpdesk.html');
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  });

  it('should have proper DOCTYPE declaration', () => {
    expect(htmlContent).toContain('<!DOCTYPE html>');
  });

  it('should have lang attribute on html element', () => {
    expect(htmlContent).toMatch(/<html\s+lang="en"/);
  });

  it('should have meta charset UTF-8', () => {
    expect(htmlContent).toContain('<meta charset="UTF-8">');
  });

  it('should have viewport meta tag for responsive design', () => {
    expect(htmlContent).toContain('name="viewport"');
    expect(htmlContent).toContain('width=device-width');
  });

  it('should have meta description for SEO', () => {
    expect(htmlContent).toContain('name="description"');
  });

  it('should have meaningful page title', () => {
    expect(htmlContent).toMatch(/<title>.*PSW.*<\/title>/i);
  });

  it('should have skip-to-content link for keyboard navigation', () => {
    expect(htmlContent).toContain('skip-link');
    expect(htmlContent).toContain('Skip to main content');
  });

  it('should have proper ARIA roles (banner, navigation, main)', () => {
    expect(htmlContent).toContain('role="banner"');
    expect(htmlContent).toContain('role="navigation"');
    expect(htmlContent).toContain('role="main"');
  });

  it('should have aria-label on navigation', () => {
    expect(htmlContent).toContain('aria-label="Main navigation"');
  });

  it('should have aria-current on active page link', () => {
    expect(htmlContent).toContain('aria-current="page"');
  });

  it('should have aria-labelledby on sections', () => {
    expect(htmlContent).toContain('aria-labelledby');
  });

  it('should have proper heading hierarchy (h1, h2, h3)', () => {
    expect(htmlContent).toContain('<h1>');
    expect(htmlContent).toContain('<h2');
    expect(htmlContent).toContain('<h3>');
  });

  it('should use semantic HTML elements (header, main, section, nav)', () => {
    expect(htmlContent).toContain('<header');
    expect(htmlContent).toContain('<main');
    expect(htmlContent).toContain('<section');
    expect(htmlContent).toContain('<nav');
  });

  it('should have descriptive aria-label on contact links', () => {
    expect(htmlContent).toContain('aria-label="Call PSW Helpdesk');
    expect(htmlContent).toContain('aria-label="Send email to PSW Helpdesk');
    expect(htmlContent).toContain('aria-label="Chat with PSW Helpdesk');
  });
});