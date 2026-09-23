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
  
  it('should have valid HTML file in views directory', () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it('should have proper DOCTYPE declaration', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html).toMatch(/^<!DOCTYPE html>/i);
  });

  it('should have html element with lang attribute', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html).toContain('<html lang="en">');
  });

  it('should have required meta tags', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html).toContain('<meta charset="UTF-8">');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('name="description"');
  });

  it('should have semantic HTML5 elements', async () => {
    const res = await request(app).get('/helpdesk');
    
    expect(res.text).toContain('<header');
    expect(res.text).toContain('<main');
    expect(res.text).toContain('<nav');
    expect(res.text).toContain('<footer');
    expect(res.text).toContain('<section');
  });

  it('should have ARIA landmarks and labels', async () => {
    const res = await request(app).get('/helpdesk');
    
    expect(res.text).toContain('role="banner"');
    expect(res.text).toContain('role="main"');
    expect(res.text).toContain('role="navigation"');
    expect(res.text).toContain('role="contentinfo"');
    expect(res.text).toContain('aria-label');
  });

  it('should have skip-to-content link for keyboard navigation', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('Skip to main content');
    expect(res.text).toContain('href="#main-content"');
  });

  it('should have proper heading hierarchy (single h1, multiple h2/h3)', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const h1Matches = html.match(/<h1>/g);
    const h2Matches = html.match(/<h2/g);
    const h3Matches = html.match(/<h3>/g);
    
    expect(h1Matches).toHaveLength(1);
    expect(h2Matches).not.toBeNull();
    expect(h2Matches.length).toBeGreaterThanOrEqual(2);
    expect(h3Matches).not.toBeNull();
    expect(h3Matches.length).toBeGreaterThanOrEqual(3);
  });

  it('should have aria-current on active navigation item', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('aria-current="page"');
  });

  it('should have descriptive aria-labels on links', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('aria-label="Call PSW Helpdesk');
    expect(res.text).toContain('aria-label="Send email to PSW Helpdesk"');
    expect(res.text).toContain('aria-label="Chat with PSW Helpdesk on WhatsApp"');
  });

  it('should use semantic definition list for office hours', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('<dl>');
    expect(res.text).toContain('<dt>');
    expect(res.text).toContain('<dd>');
  });
});

describe('Page Structure and Semantic Markup', () => {
  it('should have properly nested contact method divs', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('class="contact-method"');
  });

  it('should have sections with proper aria-labelledby attributes', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('aria-labelledby="contact-heading"');
    expect(res.text).toContain('aria-labelledby="form-heading"');
    expect(res.text).toContain('id="contact-heading"');
    expect(res.text).toContain('id="form-heading"');
  });

  it('should have main element with both id and role for maximum compatibility', async () => {
    const res = await request(app).get('/helpdesk');
    expect(res.text).toContain('id="main-content"');
    expect(res.text).toContain('role="main"');
  });
});