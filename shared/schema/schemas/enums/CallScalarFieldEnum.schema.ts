import * as z from 'zod';

export const CallScalarFieldEnumSchema = z.enum(['id', 'site_id', 'gudok_id', 'project_id', 'project_title', 'dst', 'adv_channel_id', 'adv_channel_name', 'src', 'duration', 'billsec', 'callstatus', 'date', 'region', 'call_number', 'audio', 'source', 'created_at', 'updated_at'])

export type CallScalarFieldEnum = z.infer<typeof CallScalarFieldEnumSchema>;