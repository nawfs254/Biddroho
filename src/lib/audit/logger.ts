import { getDatabase } from '@/lib/mongodb';
import { AuditLog } from '@/models/types';

export async function recordAuditLog(entry: {
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const db = await getDatabase();
    const collection = db.collection('audit_logs');
    const logDoc: AuditLog = {
      userId: entry.userId,
      userName: entry.userName,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId || '',
      timestamp: new Date(),
      metadata: entry.metadata || {},
    };
    await collection.insertOne(logDoc as any);
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}
