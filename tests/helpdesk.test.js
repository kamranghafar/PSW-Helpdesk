const request = require('supertest');
const app = require('../src/app');

describe('GET /helpdesk', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/helpdesk');
  });

  describe('Route availability', () => {
    test('returns 200 OK', () => {
      expect(response.status).toBe(200);
    });

    test('returns HTML content type', () => {
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('Semantic HTML5 structure', () => {
    test('contains doctype declaration', () => {
      expect(response.text).toMatch(/<!DOCTYPE html>/i);
    });

    test('contains header element with role banner', () => {
      expect(response.text).toMatch(/<header[^>]*role=["']banner["']/i);
    });

    test('contains nav element with role navigation', () => {
      expect(response.text).toMatch(/<nav[^>]*role=["']navigation["']/i);
    });

    test('contains main element with role main', () => {
      expect(response.text).toMatch(/<main[^>]*role=["']main["']/i);
    });

    test('contains section elements', () => {
      expect(response.text).toMatch(/<section/i);
    });

    test('contains address element for contact details', () => {
      expect(response.text).toMatch(/<address/i);
    });

    test('contains footer element with role contentinfo', () => {
      expect(response.text).toMatch(/<footer[^>]*role=["']contentinfo["']/i);
    });
  });

  describe('Contact details - Telephone (US-001)', () => {
    test('displays telephone number', () => {
      expect(response.text).toMatch(/\+92 51 926 1101/);
    });

    test('telephone is clickable tel: link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']tel:\+92519261101["']/i);
    });

    test('telephone link has ARIA label', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']tel:[^"']*["'][^>]*aria-label=["'][^"']*["']/i);
    });
  });

  describe('Contact details - Email (US-002)', () => {
    test('displays email address helpdesk@psw.gov.pk', () => {
      expect(response.text).toMatch(/helpdesk@psw\.gov\.pk/);
    });

    test('email is clickable mailto: link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']mailto:helpdesk@psw\.gov\.pk["']/i);
    });

    test('email link has ARIA label', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']mailto:[^"']*["'][^>]*aria-label=[^>]*>/i);
    });
  });

  describe('Contact details - Office Hours (US-003)', () => {
    test('displays office hours day and time range', () => {
      expect(response.text).toMatch(/Monday[\s\-]*Friday/i);
      expect(response.text).toMatch(/9:00 AM[\s\-]*5:00 PM/i);
    });

    test('displays PKT timezone', () => {
      expect(response.text).toMatch(/PKT/);
    });

    test('displays public holiday exclusion', () => {
      expect(response.text).toMatch(/Excluding public holidays/i);
    });
  });

  describe('Contact details - WhatsApp (US-004)', () => {
    test('displays WhatsApp contact text', () => {
      expect(response.text).toMatch(/WhatsApp/i);
    });

    test('WhatsApp link uses wa.me URL format', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']https:\/\/wa\.me\/\d+["']/i);
    });

    test('WhatsApp link has descriptive text', () => {
      expect(response.text).toMatch(/Chat with us on WhatsApp/i);
    });

    test('WhatsApp link opens in new tab', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']https:\/\/wa\.me\/[^"']*["'][^>]*target=["']_blank["']/i);
    });

    test('WhatsApp link has security attributes', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']https:\/\/wa\.me\/[^"']*["'][^>]*rel=["']noopener noreferrer["']/i);
    });
  });

  describe('Contact details - Response Commitment (US-005)', () => {
    test('displays response commitment text', () => {
      expect(response.text).toMatch(/Written requests answered within one working day/i);
    });
  });

  describe('PSW Navigation (US-006)', () => {
    test('contains PSW logo', () => {
      expect(response.text).toMatch(/<img[^>]*alt=["']Pakistan Single Window["']/i);
    });

    test('navigation contains Home link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/["'][^>]*>Home<\/a>/i);
    });

    test('navigation contains About PSW link', () => {
      expect(response.text).toMatch(/<a[^>]*>About PSW<\/a>/i);
    });

    test('navigation contains Services link', () => {
      expect(response.text).toMatch(/<a[^>]*>Services<\/a>/i);
    });

    test('navigation contains Resources link', () => {
      expect(response.text).toMatch(/<a[^>]*>Resources<\/a>/i);
    });

    test('navigation contains Help & Support link', () => {
      expect(response.text).toMatch(/<a[^>]*>Help[\s&]+Support<\/a>/i);
    });

    test('navigation contains Login link', () => {
      expect(response.text).toMatch(/<a[^>]*>Login<\/a>/i);
    });

    test('current page indicated with aria-current', () => {
      expect(response.text).toMatch(/<a[^>]*aria-current=["']page["']/i);
    });
  });

  describe('Section Headings (US-007)', () => {
    test('contains Contact Details heading', () => {
      expect(response.text).toMatch(/<h1[^>]*>Contact Details<\/h1>/i);
    });

    test('contains Contact Details subheading', () => {
      expect(response.text).toMatch(/We're here to help/i);
    });

    test('contains Submit a Support Request heading', () => {
      expect(response.text).toMatch(/<h1[^>]*>Submit a Support Request<\/h1>/i);
    });

    test('contains form instructions', () => {
      expect(response.text).toMatch(/Fill out the form/i);
    });
  });

  describe('Support Request Form Fields (US-008)', () => {
    test('contains form element', () => {
      expect(response.text).toMatch(/<form[^>]*id=["']support-form["']/i);
    });

    test('form posts to /api/support-requests', () => {
      expect(response.text).toMatch(/<form[^>]*action=["']\/api\/support-requests["']/i);
    });

    test('contains Name field', () => {
      expect(response.text).toMatch(/<input[^>]*name=["']name["']/i);
    });

    test('Name field is required', () => {
      expect(response.text).toMatch(/<input[^>]*name=["']name["'][^>]*required/i);
    });

    test('contains Email Address field', () => {
      expect(response.text).toMatch(/<input[^>]*name=["']email["']/i);
    });

    test('Email field is required', () => {
      expect(response.text).toMatch(/<input[^>]*name=["']email["'][^>]*required/i);
    });

    test('Email field has type email', () => {
      expect(response.text).toMatch(/<input[^>]*type=["']email["']/i);
    });

    test('contains Subject field', () => {
      expect(response.text).toMatch(/<input[^>]*name=["']subject["']/i);
    });

    test('Subject field is optional', () => {
      const subjectMatch = response.text.match(/<input[^>]*name=["']subject["'][^>]*>/i);
      expect(subjectMatch).toBeTruthy();
      expect(subjectMatch[0]).not.toMatch(/required/i);
    });

    test('contains Message field', () => {
      expect(response.text).toMatch(/<textarea[^>]*name=["']message["']/i);
    });

    test('Message field is required', () => {
      expect(response.text).toMatch(/<textarea[^>]*name=["']message["'][^>]*required/i);
    });

    test('contains Submit Request button', () => {
      expect(response.text).toMatch(/<button[^>]*type=["']submit["'][^>]*>Submit Request<\/button>/i);
    });
  });

  describe('Accessibility compliance (US-020)', () => {
    test('has language attribute', () => {
      expect(response.text).toMatch(/<html[^>]*lang=["']en["']/i);
    });

    test('has viewport meta tag', () => {
      expect(response.text).toMatch(/<meta[^>]*name=["']viewport["']/i);
    });

    test('form fields have aria-required', () => {
      expect(response.text).toMatch(/<input[^>]*required[^>]*aria-required=["']true["']/i);
    });

    test('form fields have aria-describedby for errors', () => {
      expect(response.text).toMatch(/<input[^>]*aria-describedby=["'][^"']*error["']/i);
    });

    test('error messages have role alert', () => {
      expect(response.text).toMatch(/<span[^>]*role=["']alert["']/i);
    });

    test('sections have aria-labelledby', () => {
      expect(response.text).toMatch(/<section[^>]*aria-labelledby=/i);
    });

    test('navigation has aria-label', () => {
      expect(response.text).toMatch(/<nav[^>]*aria-label=["']Main navigation["']/i);
    });
  });
});
