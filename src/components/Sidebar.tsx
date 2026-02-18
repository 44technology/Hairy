import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileText, Settings, Plus, X } from 'lucide-react'
import logo from '../assets/logo.png'
import { User, Clinic } from '../types'

interface SidebarProps {
    currentUser: User
    currentClinic: Clinic | null
    allUsers: User[]
    allClinics: Clinic[]
    onUserChange: (userId: string) => void
    onClinicChange: (clinicId: string) => void
    onLogout: () => void
    onAddPatient: () => void
    isMobile?: boolean
    onClose?: () => void
}

const Sidebar = ({
    currentUser,
    currentClinic,
    allUsers,
    allClinics,
    onUserChange,
    onClinicChange,
    onLogout,
    onAddPatient,
    isMobile,
    onClose
}: SidebarProps) => {
    const navItems = [
        { id: 'home', path: '/home', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'patients', path: '/patients', icon: Users, label: 'Patients' },
        { id: 'calendar', path: '/calendar', icon: Calendar, label: 'Calendar' },
        { id: 'docs', path: '/documents', icon: FileText, label: 'Documents' },
        { id: 'settings', path: '/settings', icon: Settings, label: 'Settings', roles: ['super-admin', 'admin'] },
    ].filter(item => !item.roles || item.roles.includes(currentUser.role))

    const sidebarStyle: React.CSSProperties = {
        width: isMobile ? '100%' : '280px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: isMobile ? '0' : '1rem',
        height: isMobile ? '100vh' : 'calc(100vh - 2rem)',
        position: isMobile ? 'fixed' : 'sticky',
        top: isMobile ? 0 : '1rem',
        left: isMobile ? 0 : 'auto',
        zIndex: isMobile ? 100 : 1,
        background: 'hsl(var(--card))',
        borderRight: isMobile ? '1px solid hsl(var(--border))' : 'none'
    }

    return (
        <aside className={isMobile ? "" : "premium-glass"} style={sidebarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '0.5rem' }}>
                <img src={logo} alt="Capilar Max Logo" style={{ height: '45px', objectFit: 'contain' }} />
                {isMobile && (
                    <button onClick={onClose} style={{ background: 'transparent', color: 'hsl(var(--foreground))', padding: '0.5rem' }}>
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={isMobile ? onClose : undefined}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            background: isActive ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                            color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                            textAlign: 'left',
                            width: '100%',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        })}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Role & Clinic Switcher */}
                <div className="premium-glass" style={{ padding: '0.75rem', fontSize: '0.75rem', background: 'hsl(var(--secondary) / 0.5)' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>DEV SWITCHER</p>
                    <select
                        value={currentUser.id}
                        onChange={(e) => onUserChange(e.target.value)}
                        style={{ width: '100%', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                    >
                        {allUsers.map(u => <option key={u.id} value={u.id} style={{ color: 'black' }}>{u.name} ({u.role})</option>)}
                    </select>

                    {currentUser.isAllClinics && (
                        <select
                            value={currentClinic?.id || 'all'}
                            onChange={(e) => onClinicChange(e.target.value)}
                            style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                        >
                            <option value="all" style={{ color: 'black' }}>All Clinics</option>
                            {allClinics.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
                        </select>
                    )}
                    {!currentUser.isAllClinics && currentUser.clinicIds && currentUser.clinicIds.length > 1 && (
                        <select
                            value={currentClinic?.id || ''}
                            onChange={(e) => onClinicChange(e.target.value)}
                            style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                        >
                            {currentUser.clinicIds.map(cid => {
                                const c = allClinics.find(cl => cl.id === cid);
                                return <option key={cid} value={cid} style={{ color: 'black' }}>{c?.name}</option>;
                            })}
                        </select>
                    )}
                    <div style={{ marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                        View: {currentClinic?.name || 'ALL CLINICS'}
                    </div>
                    <button
                        onClick={onLogout}
                        style={{ width: '100%', marginTop: '0.75rem', padding: '0.4rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        LOGOUT
                    </button>
                </div>

                <button
                    onClick={() => {
                        onAddPatient()
                        if (isMobile && onClose) onClose()
                    }}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'hsl(var(--primary))',
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    New Patient
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
