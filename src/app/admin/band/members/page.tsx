'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import { Plus, Users, Edit, Trash2, CheckCircle2, XCircle, Save, X } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminBandMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/members');
      const data = await res.json();
      if (data.members) setMembers(data.members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember({
      name: '',
      role: 'Guitarist',
      instrument: 'Guitars',
      bio: '',
      joinedYear: 2024,
      image: '/assets/logo.png',
      quote: '',
      gear: ['Custom Rig'],
      active: true,
      displayOrder: members.length + 1,
    });
    setIsNew(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMember({
      ...m,
      gearString: Array.isArray(m.gear) ? m.gear.join(', ') : '',
    });
    setIsNew(false);
    setModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/members/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => (m._id || m.id) !== deleteTarget.id && m._id !== deleteTarget.id && m.id !== deleteTarget.id));
        setDeleteTarget(null);
        await fetchMembers();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to remove member');
      }
    } catch (err) {
      console.error(err);
      alert('Error during deletion');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gearArray = editingMember.gearString
        ? editingMember.gearString.split(',').map((s: string) => s.trim()).filter(Boolean)
        : editingMember.gear || [];

      const payload = {
        name: editingMember.name,
        role: editingMember.role,
        instrument: editingMember.instrument,
        bio: editingMember.bio,
        joinedYear: Number(editingMember.joinedYear),
        image: editingMember.image || '/assets/logo.png',
        quote: editingMember.quote || '',
        gear: gearArray,
        active: editingMember.active !== false,
        displayOrder: Number(editingMember.displayOrder) || 1,
      };

      if (isNew) {
        const res = await fetch('/api/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create member');
      } else {
        const memberId = editingMember._id || editingMember.id;
        const res = await fetch(`/api/admin/members/${memberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update member');
      }

      setModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Error saving member');
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Official Band Lineup"
        subtitle="Manage BIDDROHO official musicians, bios, stage instruments, gear rigs, and display order."
        actionButton={
          <button
            onClick={handleOpenAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.04em'
            }}
          >
            <Plus size={15} />
            <span>Add Musician</span>
          </button>
        }
      />

      <div style={{ padding: '32px' }}>
        {loading ? (
          <MusicLoader text="CONNECTING STAGE ROSTER & BAND MEMBERS..." size="card" />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {members.map((m) => (
              <div
                key={m._id || m.id}
                style={{
                  backgroundColor: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{
                      position: 'relative',
                      width: '56px',
                      height: '56px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(225, 29, 72, 0.3)',
                      flexShrink: 0
                    }}>
                      <Image
                        src={m.image || '/assets/logo.png'}
                        alt={m.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f4f4f5' }}>
                        {m.name}
                      </h3>
                      <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
                        {m.role} • {m.instrument}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                        Since {m.joinedYear} • Order: #{m.displayOrder || 1}
                      </div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '12px',
                    color: '#a1a1aa',
                    lineHeight: '1.6',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {m.bio}
                  </p>
                </div>

                <div style={{
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: m.active !== false ? '#10b981' : '#71717a' }}>
                    {m.active !== false ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span>{m.active !== false ? 'Active Lineup' : 'Inactive'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(m)}
                      title="Edit Member Profile"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: m._id || m.id, name: m.name })}
                      title="Remove Member"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {modalOpen && editingMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                {isNew ? 'Add Band Musician' : `Edit: ${editingMember.name}`}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="Vocalist, Guitarist, Bassist..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '4px',
                      color: '#f4f4f5',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Instrument *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.instrument}
                    onChange={(e) => setEditingMember({ ...editingMember, instrument: e.target.value })}
                    placeholder="Lead Vocals, Lead Guitars..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '4px',
                      color: '#f4f4f5',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Joined Year
                  </label>
                  <input
                    type="number"
                    value={editingMember.joinedYear}
                    onChange={(e) => setEditingMember({ ...editingMember, joinedYear: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '4px',
                      color: '#f4f4f5',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Display Order #
                  </label>
                  <input
                    type="number"
                    value={editingMember.displayOrder}
                    onChange={(e) => setEditingMember({ ...editingMember, displayOrder: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '4px',
                      color: '#f4f4f5',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <ImageUpload
                preset="member"
                value={editingMember.image || ''}
                onChange={(url) => setEditingMember({ ...editingMember, image: url })}
                label="Band Member Portrait Photo"
              />

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Biography *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Gear Rig (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingMember.gearString !== undefined ? editingMember.gearString : (Array.isArray(editingMember.gear) ? editingMember.gear.join(', ') : '')}
                  onChange={(e) => setEditingMember({ ...editingMember, gearString: e.target.value })}
                  placeholder="ESP E-II, Peavey 6505+, Darkglass..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#a1a1aa',
                    border: 'none',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Musician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Remove Band Member"
        itemName={deleteTarget?.name}
        loading={deleting}
      />
    </div>
  );
}
