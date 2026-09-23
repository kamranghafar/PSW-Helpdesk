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
    test('contains Home link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/["'][^>]*>Home<\/a>/i);
    });

    test('contains About PSW link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/about["'][^>]*>About PSW<\/a>/i);
    });

    test('contains Services link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/services["'][^>]*>Services<\/a>/i);
    });

    test('contains Resources link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/resources["'][^>]*>Resources<\/a>/i);
    });

    test('contains Help & Support link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/helpdesk["'][^>]*>Help[^<]*Support<\/a>/i);
    });

    test('contains Login link', () => {
      expect(response.text).toMatch(/<a[^>]*href=["']\/login["'][^>]*>Login<\/a>/i);
    });
  });

  describe('Support Request Form (US-007)', () => {
    test('contains form element', () => {
      expect(response.text).toMatch(/<form[^>]*id=["']support-form["']/i);
    });

    test('form has POST method', () => {
      expect(response.text).toMatch(/<form[^>]*method=["']POST["']/i);
    });

    test('form action points to API endpoint', () => {
      expect(response.text).toMatch(/<form[^>]*action=["']\/api\/support-requests["']/i);
    });

    test('contains name input field', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']name["'][^>]*type=["']text["']|<input[^>]*type=["']text["'][^>]*id=["']name["']/i);
    });

    test('name field is required', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']name["'][^>]*required/i);
    });

    test('name field has aria-required', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']name["'][^>]*aria-required=["']true["']/i);
    });

    test('name field has maxlength 120', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']name["'][^>]*maxlength=["']120["']/i);
    });

    test('contains email input field', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']email["'][^>]*type=["']email["']|<input[^>]*type=["']email["'][^>]*id=["']email["']/i);
    });

    test('email field is required', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']email["'][^>]*required/i);
    });

    test('contains subject input field', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']subject["'][^>]*type=["']text["']|<input[^>]*type=["']text["'][^>]*id=["']subject["']/i);
    });

    test('subject field has maxlength 200', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']subject["'][^>]*maxlength=["']200["']/i);
    });

    test('contains message textarea field', () => {
      expect(response.text).toMatch(/<textarea[^>]*id=["']message["']/i);
    });

    test('message field is required', () => {
      expect(response.text).toMatch(/<textarea[^>]*id=["']message["'][^>]*required/i);
    });

    test('message field has maxlength 2000', () => {
      expect(response.text).toMatch(/<textarea[^>]*id=["']message["'][^>]*maxlength=["']2000["']/i);
    });

    test('contains submit button', () => {
      expect(response.text).toMatch(/<button[^>]*type=["']submit["']/i);
    });

    test('submit button has aria-label', () => {
      expect(response.text).toMatch(/<button[^>]*type=["']submit["'][^>]*aria-label=["'][^"']*["']/i);
    });
  });

  describe('Form Labels and ARIA (US-008)', () => {
    test('name label is associated with input', () => {
      expect(response.text).toMatch(/<label[^>]*for=["']name["']/i);
    });

    test('email label is associated with input', () => {
      expect(response.text).toMatch(/<label[^>]*for=["']email["']/i);
    });

    test('subject label is associated with input', () => {
      expect(response.text).toMatch(/<label[^>]*for=["']subject["']/i);
    });

    test('message label is associated with textarea', () => {
      expect(response.text).toMatch(/<label[^>]*for=["']message["']/i);
    });

    test('error messages have role alert', () => {
      expect(response.text).toMatch(/<span[^>]*class=["'][^"']*error-message[^"']*["'][^>]*role=["']alert["']/i);
    });

    test('inputs have aria-describedby for errors', () => {
      expect(response.text).toMatch(/<input[^>]*id=["']name["'][^>]*aria-describedby=["']name-error["']/i);
    });
  });

  describe('Accessibility compliance (US-020)', () => {
    test('page has lang attribute', () => {
      expect(response.text).toMatch(/<html[^>]*lang=["']en["']/i);
    });

    test('page has viewport meta tag', () => {
      expect(response.text).toMatch(/<meta[^>]*name=["']viewport["']/i);
    });

    test('page has meta description', () => {
      expect(response.text).toMatch(/<meta[^>]*name=["']description["']/i);
    });

    test('sections have aria-labelledby', () => {
      expect(response.text).toMatch(/<section[^>]*aria-labelledby=["'][^"']+["']/i);
    });

    test('navigation has aria-label', () => {
      expect(response.text).toMatch(/<nav[^>]*aria-label=["'][^"']+["']/i);
    });
  });
});