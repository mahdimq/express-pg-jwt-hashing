process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
let cats = require('../fakeDB');
let pickles = { name: 'pickles' };

beforeEach(() => cats.push(pickles));
afterEach(() => (cats.length = 0));

describe('GET /cats', () => {
	test('Get all cats', async () => {
		const res = await request(app).get('/cats');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ cats: [pickles] });
	});
});

describe('POST ONE /cats', () => {
	test('Post single cat', async () => {
		const res = await request(app).post('/cats').send({ name: 'Lilly' });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ cat: { name: 'Lilly' } });
	});
});

describe('GET ONE /cats/:name', () => {
	test('Get single cat', async () => {
		const res = await request(app).get(`/cats/${pickles.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ cat: { name: 'pickles' } });
	});
});

describe('PATCH ONE /cats/:name', () => {
	test('Update single cat', async () => {
		const res = await request(app).patch(`/cats/${pickles.name}`).send({ name: 'Bilal' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ cat: { name: 'Bilal' } });
	});
	test('Responds with 404 for Invalid Name', async () => {
		const res = await request(app).patch('/cats/wiggles').send({ name: 'Monster' });
		expect(res.statusCode).toBe(404);
	});
});

describe('DELETE ONE /cats/:name', () => {
	test('Delete single cat', async () => {
		const res = await request(app).delete(`/cats/${pickles.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
});
