const request = require('supertest');
const app = require('../server');
const fs = require('fs');

describe('PDF to Word API', () => {
  it('converts a PDF to DOCX', async () => {
    const res = await request(app)
      .post('/convert')
      .attach('pdf', 'test/sample.pdf'); // Add a test PDF
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });
});
