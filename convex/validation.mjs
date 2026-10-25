export function validateSignup(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Please enter your email and delivery address.');
  }
  const limits = { email: 254, firstName: 80, lastName: 80, country: 100, address: 200, apartment: 120, city: 100, region: 100, postal: 24 };
  const values = {};
  for (const [field, limit] of Object.entries(limits)) {
    if (typeof input[field] !== 'string' || input[field].length > limit || /[\x00-\x1f\x7f]/.test(input[field])) {
      throw new Error('Please check your email and delivery address.');
    }
    values[field] = input[field].trim();
    if (!values[field] && !['apartment', 'region', 'postal'].includes(field)) {
      throw new Error('Please fill in all required fields.');
    }
  }
  values.email = values.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new Error('Please enter a valid email address.');
  if (input.consent !== true) throw new Error('Please agree to receive preorder updates.');
  return values;
}
