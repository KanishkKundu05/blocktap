import { internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { validateSignup } from './validation.mjs';

// Private: visitors can only submit via the HTTP endpoint, never read addresses.
export const join = internalMutation({
  args: { signup: v.any() },
  handler: async (ctx, { signup }) => {
    const { email, firstName, lastName, ...deliveryAddress } = validateSignup(signup);
    const existing = await ctx.db.query('waitlist').withIndex('by_email', q => q.eq('email', email)).unique();
    // A retry is safe, and an unauthenticated visitor cannot overwrite an address.
    // Return the same response so this endpoint cannot reveal who has signed up.
    if (existing) return { ok: true };
    await ctx.db.insert('waitlist', {
      email, firstName, lastName, deliveryAddress,
      product: 'blocktap-violet', priceUsd: 39, status: 'waitlisted',
      consentVersion: 'preorder-updates-v1', createdAt: Date.now(),
    });
    return { ok: true };
  },
});
