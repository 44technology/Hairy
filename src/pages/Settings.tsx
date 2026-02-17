import { useState } from 'react';
import { UserPlus, Shield, User, Mail, Lock, Building, Check, X, ShieldAlert, Key } from 'lucide-react';
import { UserRole, Clinic, User as UserType } from '../types';
import { MOCK_CLINICS, MOCK_USERS } from '../data/mockPatients';

const SettingsPage = ({ userRole, clinic }: { userRole: UserRole, clinic: Clinic | null }) => {
    const [activeSection, setActiveSection] = useState<'users' | 'permissions'>('users');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const roles: UserRole[] = ['super-admin', 'admin', 'manager', 'specialist'];

    const permissions = [
        { id: 'view_patients', label: 'View Patient List', roles: ['super-admin', 'admin', 'manager', 'specialist'] },
        { id: 'view_sensitive_data', label: 'View Contact Details (Phone/Email)', roles: ['super-admin', 'admin', 'manager'] },
        { id: 'add_patient', label: 'Register New Patient', roles: ['super-admin', 'admin', 'manager'] },
        { id: 'schedule_op', label: 'Schedule Operations', roles: ['super-admin', 'admin', 'manager'] },
        { id: 'view_all_clinics', label: 'View Multi-Clinic Data', roles: ['super-admin'] },
        { id: 'edit_notes', label: 'Add Clinical Notes', roles: ['super-admin', 'admin', 'specialist'] },
        { id: 'sign_consent', label: 'Legal Representative Signing', roles: ['super-admin', 'admin'] },
    ];

    if (userRole !== 'super-admin' && userRole !== 'admin') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                <ShieldAlert size={48} color="hsl(var(--primary))" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Denied</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>You do not have permission to access system settings.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Settings</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>System configuration and user management</p>
            </header>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setActiveSection('users')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeSection === 'users' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                        color: 'white', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveSection('permissions')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeSection === 'permissions' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                        color: 'white', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    Role Permissions
                </button>
            </div>

            {activeSection === 'users' ? (
                <div className="premium-glass" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>System Users</h3>
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            style={{ padding: '0.625rem 1rem', background: 'hsl(var(--primary))', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UserPlus size={18} />
                            Add User
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'hsl(var(--muted-foreground))' }}>User Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'hsl(var(--muted-foreground))' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'hsl(var(--muted-foreground))' }}>Clinics</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: 'hsl(var(--muted-foreground))' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_USERS.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
                                        <td style={{ padding: '1rem' }}>{user.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {user.isAllClinics ? (
                                                <span style={{ color: 'hsl(var(--primary))', fontWeight: 700 }}>ALL CLINICS</span>
                                            ) : (
                                                user.clinicIds?.map(cid => MOCK_CLINICS.find(c => c.id === cid)?.city).join(', ') || 'None'
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button style={{ padding: '0.4rem', borderRadius: '4px', background: 'hsl(var(--secondary))', color: 'white', border: 'none', fontSize: '0.7rem', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="premium-glass" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Role Permission Matrix</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'hsl(var(--muted-foreground))' }}>Permission</th>
                                    {roles.map(role => (
                                        <th key={role} style={{ padding: '1rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>
                                            {role.replace('-', ' ').toUpperCase()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map(perm => (
                                    <tr key={perm.id} style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{perm.label}</td>
                                        {roles.map(role => (
                                            <td key={role} style={{ padding: '1rem', textAlign: 'center' }}>
                                                {perm.roles.includes(role) ? <Check size={18} color="hsl(var(--primary))" /> : <X size={18} color="#ef4444" />}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isAddUserModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="premium-glass" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New User</h3>
                            <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input required type="email" placeholder="john@company.com" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <input required type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>System Role</label>
                                <div style={{ position: 'relative' }}>
                                    <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                    <select style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white' }}>
                                        {roles.map(role => <option key={role} value={role} style={{ color: 'black' }}>{role.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Clinic Permissions</label>
                                <div style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'hsl(var(--secondary) / 0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                                        <span style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>All Clinics (Global Access)</span>
                                    </label>
                                    <div style={{ height: '1px', background: 'hsl(var(--border))', margin: '0.25rem 0' }} />
                                    {MOCK_CLINICS.map(clinic => (
                                        <label key={clinic.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'hsl(var(--secondary) / 0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                                            <span>{clinic.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setIsAddUserModalOpen(false)} type="button" style={{ marginTop: '0.5rem', padding: '1rem', background: 'hsl(var(--primary))', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                                Create User Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
