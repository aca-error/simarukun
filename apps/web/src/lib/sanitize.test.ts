/**
 * Unit Tests for Sanitize Functions
 * 
 * @package SimaRukun
 * @subpackage Frontend/Lib
 */

import {
  sanitize,
  sanitizeObject,
  sanitizeText,
  sanitizeHtml,
  sanitizeUrl,
} from './sanitize';

describe('Sanitize Functions', () => {
  describe('sanitize', () => {
    it('should sanitize script tags', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitize(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should allow basic HTML tags', () => {
      const input = '<b>Bold</b> and <i>Italic</i>';
      const result = sanitize(input);
      expect(result).toBe('<b>Bold</b> and <i>Italic</i>');
    });

    it('should allow paragraph tags', () => {
      const input = '<p>Paragraph</p>';
      const result = sanitize(input);
      expect(result).toBe('<p>Paragraph</p>');
    });

    it('should allow list tags', () => {
      const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitize(input);
      expect(result).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>');
    });

    it('should allow anchor tags with href', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitize(input);
      expect(result).toBe('<a href="https://example.com">Link</a>');
    });

    it('should remove event handlers', () => {
      const input = '<img src="test.jpg" onclick="alert(1)">';
      const result = sanitize(input);
      expect(result).not.toContain('onclick');
    });

    it('should remove style attributes', () => {
      const input = '<div style="color: red;">Content</div>';
      const result = sanitize(input);
      expect(result).not.toContain('style');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitize(input);
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const input = null as any;
      const result = sanitize(input);
      expect(result).toBe('null');
    });

    it('should handle undefined input', () => {
      const input = undefined as any;
      const result = sanitize(input);
      expect(result).toBe('undefined');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string values in object', () => {
      const input = {
        name: '<script>alert(1)</script>',
        email: 'test@example.com',
        bio: '<b>Bold</b>',
      };
      const result = sanitizeObject(input);
      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('test@example.com');
      expect(result.bio).toBe('<b>Bold</b>');
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<script>alert(1)</script>',
          profile: {
            bio: '<p>Test</p>',
          },
        },
      };
      const result = sanitizeObject(input);
      expect(result.user.name).not.toContain('<script>');
      expect(result.user.profile.bio).toBe('<p>Test</p>');
    });

    it('should handle arrays', () => {
      const input = {
        tags: ['<script>tag1</script>', '<b>tag2</b>'],
      };
      const result = sanitizeObject(input);
      expect(result.tags[0]).not.toContain('<script>');
      expect(result.tags[1]).toBe('<b>tag2</b>');
    });

    it('should return non-object input as-is', () => {
      const input = 'plain string';
      const result = sanitizeObject(input);
      expect(result).toBe('plain string');
    });

    it('should handle null input', () => {
      const input = null as any;
      const result = sanitizeObject(input);
      expect(result).toBeNull();
    });

    it('should handle empty object', () => {
      const input = {};
      const result = sanitizeObject(input);
      expect(result).toEqual({});
    });
  });

  describe('sanitizeText', () => {
    it('should remove all HTML tags', () => {
      const input = '<b>Bold</b> and <i>Italic</i>';
      const result = sanitizeText(input);
      expect(result).toBe('Bold and Italic');
    });

    it('should handle script tags', () => {
      const input = '<script>alert(1)</script>';
      const result = sanitizeText(input);
      expect(result).toBe('alert(1)');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeText(input);
      expect(result).toBe('');
    });

    it('should preserve special characters', () => {
      const input = '<>&"\'';
      const result = sanitizeText(input);
      expect(result).toBe('<>&"\'"');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow heading tags', () => {
      const input = '<h1>Heading 1</h1><h2>Heading 2</h2>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<h1>Heading 1</h1><h2>Heading 2</h2>');
    });

    it('should allow class and id attributes', () => {
      const input = '<div class="container" id="main">Content</div>';
      const result = sanitizeHtml(input);
      expect(result).toContain('class="container"');
      expect(result).toContain('id="main"');
    });

    it('should remove script tags', () => {
      const input = '<h1>Title</h1><script>alert(1)</script>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('<script>');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeHtml(input);
      expect(result).toBe('');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow valid HTTP URLs', () => {
      const input = 'https://example.com/path?query=value';
      const result = sanitizeUrl(input);
      expect(result).toBe('https://example.com/path?query=value');
    });

    it('should allow valid HTTPS URLs', () => {
      const input = 'https://example.com';
      const result = sanitizeUrl(input);
      expect(result).toBe('https://example.com');
    });

    it('should allow valid FTP URLs', () => {
      const input = 'ftp://example.com/file.txt';
      const result = sanitizeUrl(input);
      expect(result).toBe('ftp://example.com/file.txt');
    });

    it('should allow URLs without protocol', () => {
      const input = 'www.example.com';
      const result = sanitizeUrl(input);
      expect(result).toBe('www.example.com');
    });

    it('should remove script tags from URL', () => {
      const input = 'javascript:alert(1)';
      const result = sanitizeUrl(input);
      expect(result).not.toContain('javascript:');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should handle URL with special characters', () => {
      const input = 'https://example.com/path?query=value&param=test';
      const result = sanitizeUrl(input);
      expect(result).toBe('https://example.com/path?query=value&param=test');
    });
  });
});
