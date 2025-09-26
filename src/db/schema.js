import { pgTable, uuid, varchar, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Offers table - stores product/offer information
export const offers = pgTable('offers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  value_props: jsonb('value_props').notNull(), // Array of strings
  ideal_use_cases: jsonb('ideal_use_cases').notNull(), // Array of strings
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Leads table - stores lead information from CSV
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  company: varchar('company', { length: 255 }),
  industry: varchar('industry', { length: 255 }),
  location: varchar('location', { length: 255 }),
  linkedin_bio: text('linkedin_bio'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Results table - stores scoring results
export const results = pgTable('results', {
  id: uuid('id').defaultRandom().primaryKey(),
  lead_id: uuid('lead_id').references(() => leads.id).notNull(),
  offer_id: uuid('offer_id').references(() => offers.id).notNull(),
  rule_score: integer('rule_score').notNull(), // 0-50
  ai_score: integer('ai_score').notNull(), // 0-50  
  final_score: integer('final_score').notNull(), // 0-100
  intent: varchar('intent', { length: 20 }).notNull(), // High/Medium/Low
  reasoning: text('reasoning').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});