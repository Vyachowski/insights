import * as z from 'zod';

export const CallImportScalarFieldEnumSchema = z.enum(['id', 'siteId', 'date', 'src', 'region', 'callNumber', 'class', 'projectTitle', 'advChannelName', 'billsec', 'comment', 'redirectNumber', 'source', 'importedAt'])

export type CallImportScalarFieldEnum = z.infer<typeof CallImportScalarFieldEnumSchema>;