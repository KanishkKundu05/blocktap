import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSignup } from '../convex/validation.mjs';

const signup = { email: ' HELLO@example.com ', firstName: ' Test ', lastName: 'Person', country: 'United States', address: '123 Example St', apartment: '', city: 'New York', region: 'NY', postal: '10001', consent: true };
test('normalizes email and associates the delivery fields', () => {
  const result = validateSignup(signup);
  assert.equal(result.email, 'hello@example.com');
  assert.equal(result.firstName, 'Test');
  assert.equal(result.address, '123 Example St');
  assert.equal(result.apartment, '');
});
test('requires a valid email and consent and validates provided address fields', () => {
  for (const change of [{ email: 'invalid' }, { consent: false }, { consent: 'on' }, { country: 5 }, { email: 'a\n@example.com' }, { address: 'x'.repeat(201) }]) {
    assert.throws(() => validateSignup({ ...signup, ...change }));
  }
  for (const invalid of [null, [], 'hello']) assert.throws(() => validateSignup(invalid));
});
test('supports countries without states or postal codes', () => {
  assert.doesNotThrow(() => validateSignup({ ...signup, region: '', postal: '' }));
});

test('accepts email-only signups with no name or delivery address', () => {
  const result = validateSignup({ email: 'only@example.com', consent: true });
  assert.equal(result.email, 'only@example.com');
  for (const field of ['firstName', 'lastName', 'country', 'address', 'apartment', 'city', 'region', 'postal']) {
    assert.equal(result[field], '');
  }
});
test('accepts partial delivery details without making other fields required', () => {
  const result = validateSignup({ email: 'partial@example.com', consent: true, country: 'Canada' });
  assert.equal(result.country, 'Canada');
  assert.equal(result.address, '');
});
