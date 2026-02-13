import * as z from 'zod';

export const CallScalarFieldEnumSchema = z.enum(['id', 'siteId', 'gudokId', 'projectId', 'projectTitle', 'dst', 'advChannelId', 'advChannelName', 'src', 'duration', 'billsec', 'callstatus', 'date', 'region', 'callNumber', 'audio', 'source', 'createdAt', 'updatedAt'])

export type CallScalarFieldEnum = z.infer<typeof CallScalarFieldEnumSchema>;