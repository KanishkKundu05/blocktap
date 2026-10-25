import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    deliveryAddress: v.object({
      country: v.string(),
      address: v.string(),
      apartment: v.string(),
      city: v.string(),
      region: v.string(),
      postal: v.string(),
    }),
    product: v.literal('blocktap-violet'),
    priceUsd: v.number(),
    status: v.literal('waitlisted'),
    consentVersion: v.string(),
    createdAt: v.number(),
  }).index('by_email', ['email']),
});
