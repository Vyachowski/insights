import * as z from 'zod';

export const CallImportScalarFieldEnumSchema = z.enum(['id', 'site_id', 'date', 'src', 'region', 'call_number', 'class', 'project_title', 'adv_channel_name', 'billsec', 'comment', 'redirect_number', 'source', 'imported_at'])

export type CallImportScalarFieldEnum = z.infer<typeof CallImportScalarFieldEnumSchema>;