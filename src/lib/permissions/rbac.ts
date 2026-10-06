import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { verifySessionToken } from '@/lib/auth/jwt';
import { User, Role } from '@/models/types';
import { DEFAULT_ROLE_PERMISSIONS } from './definitions';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  permissions: string[];
}

export const SESSION_COOKIE_NAME = 'biddroho_admin_session';

/**
 * Retrieves the currently authenticated user and their resolved permissions from MongoDB
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    let query: any;
    try {
      query = { _id: new ObjectId(payload.userId) };
    } catch {
      query = { _id: payload.userId };
    }

    const userDoc = await usersCollection.findOne(query);
    if (!userDoc || userDoc.status !== 'ACTIVE') {
      return null;
    }

    // Resolve permissions from database roles
    const rolesCollection = db.collection('roles');
    const userRoleNames = Array.isArray(userDoc.roles) ? userDoc.roles : [];
    
    // Fetch assigned role documents from DB
    const roleDocs = await rolesCollection
      .find({ name: { $in: userRoleNames } })
      .toArray();

    const permissionSet = new Set<string>();

    // If user has 'ADMIN' role, they have universal access
    if (userRoleNames.includes('ADMIN')) {
      permissionSet.add('*');
    }

    // Merge permissions from DB roles
    for (const roleDoc of roleDocs) {
      if (Array.isArray(roleDoc.permissions)) {
        for (const perm of roleDoc.permissions) {
          permissionSet.add(perm);
        }
      }
    }

    // Fallback: If roles are not yet seeded or permissions list is empty, merge defaults
    for (const roleName of userRoleNames) {
      const defaults = DEFAULT_ROLE_PERMISSIONS[roleName] || [];
      for (const p of defaults) {
        permissionSet.add(p);
      }
    }

    return {
      _id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      avatar: userDoc.avatar || '',
      roles: userRoleNames,
      status: userDoc.status,
      permissions: Array.from(permissionSet),
    };
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return null;
  }
}

/**
 * Checks if an authenticated user possesses a given permission
 */
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user || user.status !== 'ACTIVE') return false;
  if (user.roles.includes('ADMIN') || user.permissions.includes('*')) return true;
  return user.permissions.includes(permission);
}

/**
 * Throws an error response or returns the user if authorized
 */
export async function requirePermission(permission: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Unauthorized: Authentication required.');
    (error as any).status = 401;
    throw error;
  }

  if (!hasPermission(user, permission)) {
    const error = new Error(`Forbidden: Missing required permission "${permission}".`);
    (error as any).status = 403;
    throw error;
  }

  return user;
}

/**
 * Checks if user has a specific role
 */
export async function requireRole(roleName: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Unauthorized: Authentication required.');
    (error as any).status = 401;
    throw error;
  }

  if (!user.roles.includes(roleName) && !user.roles.includes('ADMIN')) {
    const error = new Error(`Forbidden: Requires "${roleName}" role.`);
    (error as any).status = 403;
    throw error;
  }

  return user;
}
