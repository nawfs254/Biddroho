'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { KeyRound, Shield, Check, Save } from 'lucide-react';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeRoleName, setActiveRoleName] = useState<string>('BAND_MANAGER');
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchRolesData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      if (data.roles) {
        setRoles(data.roles);
        setPermissions(data.availablePermissions || []);

        const target = data.roles.find((r: any) => r.name === activeRoleName) || data.roles[0];
        if (target) {
          setActiveRoleName(target.name);
          setActivePermissions(target.permissions || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  const handleSelectRole = (r: any) => {
    setActiveRoleName(r.name);
    setActivePermissions(r.permissions || []);
    setSaveSuccess(false);
  };

  const handleTogglePermission = (permId: string) => {
    if (activeRoleName === 'ADMIN') return; // Cannot alter admin root

    setActivePermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
    setSaveSuccess(false);
  };

  const handleSaveRolePermissions = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleName: activeRoleName,
          permissions: activePermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchRolesData();
    } catch (err: any) {
      alert(err.message || 'Error updating role matrix');
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by module
  const modules = Array.from(new Set(permissions.map((p) => p.module)));

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Roles & Granular RBAC Permissions"
        subtitle="Configure permission matrix per role stored in MongoDB database. Permissions are enforced server-side on all operations."
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Role Cards List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {roles.map((r) => {
            const isSelected = r.name === activeRoleName;
            return (
              <div
                key={r.name}
                onClick={() => handleSelectRole(r)}
                style={{
                  backgroundColor: isSelected ? '#1c1917' : '#121216',
                  border: isSelected ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5' }}>{r.name}</span>
                    <span style={{
                      fontSize: '11px',
                      color: '#a1a1aa',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '2px 8px',
                      borderRadius: '3px'
                    }}>
                      {r.userCount} {r.userCount === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#71717a', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                    {r.description}
                  </p>
                </div>

                <div style={{ fontSize: '11px', color: isSelected ? '#e11d48' : '#a1a1aa', fontWeight: 600 }}>
                  {r.name === 'ADMIN' ? 'Full Universal Access (*)' : `${r.permissions?.length || 0} permissions assigned`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Role Permission Matrix Editor */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '18px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Editing Role Matrix
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f4f4f5', margin: '4px 0 0 0' }}>
                {activeRoleName}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {saveSuccess && (
                <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} />
                  <span>Saved to MongoDB!</span>
                </span>
              )}
              {activeRoleName !== 'ADMIN' && (
                <button
                  onClick={handleSaveRolePermissions}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : 'Save Permissions'}</span>
                </button>
              )}
            </div>
          </div>

          {activeRoleName === 'ADMIN' ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#a1a1aa', fontSize: '13px' }}>
              The <strong>ADMIN</strong> role holds permanent universal privileges across all CMS, RBAC, User Management, and CRM operations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {modules.map((mod) => {
                const modPerms = permissions.filter((p) => p.module === mod);
                return (
                  <div key={mod} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
                      {mod}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '12px'
                    }}>
                      {modPerms.map((perm) => {
                        const isChecked = activePermissions.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              padding: '10px 12px',
                              backgroundColor: isChecked ? 'rgba(225, 29, 72, 0.08)' : '#18181b',
                              border: isChecked ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm.id)}
                              style={{ marginTop: '2px', accentColor: '#e11d48' }}
                            />
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: isChecked ? '#f4f4f5' : '#d4d4d8' }}>
                                {perm.label}
                              </div>
                              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                                {perm.id}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
