import { useState } from 'react'
import { Sparkles, Users, Calendar, Settings, Plus, LayoutDashboard, FileText } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import PatientProfile from './pages/PatientProfile'
import CalendarPage from './pages/Calendar'
import AddPatientModal from './components/AddPatientModal'
import SettingsPage from './pages/Settings'
import { MOCK_CLINICS, MOCK_USERS, MOCK_PATIENTS } from './data/mockPatients'
import { User, Clinic, Patient } from './types'

import LoginPage from './pages/Login'
import logo from './assets/logo.png'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
    const [allPatients, setAllPatients] = useState<Patient[]>(MOCK_PATIENTS)

    // Auth & Clinic Context
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Super Admin
    const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null); // Null for Super Admin

    const handleLogin = (userId: string) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            if (!user.isAllClinics && user.clinicIds && user.clinicIds.length > 0) {
                setCurrentClinic(MOCK_CLINICS.find(c => c.id === user.clinicIds![0]) || null);
            } else {
                setCurrentClinic(null);
            }
        }
    };

    const handleAddPatient = (data: any) => {
        const newPatient: Patient = {
            id: (allPatients.length + 1).toString(),
            clinicId: currentClinic?.id || 'c1',
            firstName: data.firstName || 'New',
            lastName: data.lastName || 'Patient',
            email: data.email || '',
            phone: data.phone || '',
            birthDate: data.birthDate || '',
            status: 'pending',
            photos: [],
            documents: []
        };
        setAllPatients([...allPatients, newPatient]);
        setIsAddPatientOpen(false);
    }

    const handleUpdatePatient = (id: string, updates: Partial<Patient>) => {
        setAllPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        alert('Record updated successfully!');
    };

    const filteredPatients = allPatients.filter(p => {
        if (currentUser.isAllClinics) {
            return currentClinic ? p.clinicId === currentClinic.id : true;
        }
        return currentUser.clinicIds?.includes(p.clinicId);
    });

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderContent = () => {
        if (selectedPatientId) {
            return <PatientProfile
                id={selectedPatientId}
                onBack={() => setSelectedPatientId(null)}
                userRole={currentUser.role}
            />
        }

        switch (activeTab) {
            case 'dashboard': return <Dashboard
                onAddPatient={() => setIsAddPatientOpen(true)}
                patients={filteredPatients}
                userRole={currentUser.role}
            />
            case 'patients': return <PatientList
                onSelectPatient={(id) => setSelectedPatientId(id)}
                onAddPatient={() => setIsAddPatientOpen(true)}
                patients={filteredPatients}
                userRole={currentUser.role}
            />
            case 'calendar': return <CalendarPage
                patients={filteredPatients}
                userRole={currentUser.role}
                currentUser={currentUser}
                onUpdatePatient={handleUpdatePatient}
            />
            case 'settings':
                if (currentUser.role === 'super-admin' || currentUser.role === 'admin') {
                    return <SettingsPage userRole={currentUser.role} clinic={currentClinic} />
                }
                return <Dashboard onAddPatient={() => setIsAddPatientOpen(true)} patients={filteredPatients} userRole={currentUser.role} />
            default: return <Dashboard onAddPatient={() => setIsAddPatientOpen(true)} patients={filteredPatients} userRole={currentUser.role} />
        }
    }

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--background))' }}>
            {/* Sidebar */}
            <aside className="premium-glass" style={{
                width: '280px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                margin: '1rem',
                height: 'calc(100vh - 2rem)',
                position: 'sticky',
                top: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.5rem' }}>
                    <img src={logo} alt="Capilar Max Logo" style={{ height: '45px', objectFit: 'contain' }} />
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { id: 'patients', icon: Users, label: 'Patients' },
                        { id: 'calendar', icon: Calendar, label: 'Calendar' },
                        { id: 'docs', icon: FileText, label: 'Documents' },
                        { id: 'settings', icon: Settings, label: 'Settings', roles: ['super-admin', 'admin'] },
                    ].filter(item => !item.roles || item.roles.includes(currentUser.role)).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id)
                                setSelectedPatientId(null)
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                background: (activeTab === item.id && !selectedPatientId) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                color: (activeTab === item.id && !selectedPatientId) ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                                textAlign: 'left',
                                width: '100%',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Role & Clinic Switcher (Development Only) */}
                    <div className="premium-glass" style={{ padding: '0.75rem', fontSize: '0.75rem', background: 'hsl(var(--secondary) / 0.5)' }}>
                        <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>DEV SWITCHER</p>
                        <select
                            value={currentUser.id}
                            onChange={(e) => {
                                const user = MOCK_USERS.find(u => u.id === e.target.value);
                                if (user) {
                                    setCurrentUser(user);
                                    if (user.isAllClinics) {
                                        setCurrentClinic(null);
                                    } else if (user.clinicIds && user.clinicIds.length > 0) {
                                        setCurrentClinic(MOCK_CLINICS.find(c => c.id === user.clinicIds![0]) || null);
                                    }
                                }
                            }}
                            style={{ width: '100%', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                        >
                            {MOCK_USERS.map(u => <option key={u.id} value={u.id} style={{ color: 'black' }}>{u.name} ({u.role})</option>)}
                        </select>

                        {currentUser.isAllClinics && (
                            <select
                                value={currentClinic?.id || 'all'}
                                onChange={(e) => {
                                    const clinic = MOCK_CLINICS.find(c => c.id === e.target.value);
                                    setCurrentClinic(clinic || null);
                                }}
                                style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                            >
                                <option value="all" style={{ color: 'black' }}>All Clinics</option>
                                {MOCK_CLINICS.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
                            </select>
                        )}
                        {!currentUser.isAllClinics && currentUser.clinicIds && currentUser.clinicIds.length > 1 && (
                            <select
                                value={currentClinic?.id || ''}
                                onChange={(e) => {
                                    const clinic = MOCK_CLINICS.find(c => c.id === e.target.value);
                                    setCurrentClinic(clinic || null);
                                }}
                                style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', color: 'white', border: '1px solid hsl(var(--border))', borderRadius: '4px', padding: '0.25rem' }}
                            >
                                {currentUser.clinicIds.map(cid => {
                                    const c = MOCK_CLINICS.find(cl => cl.id === cid);
                                    return <option key={cid} value={cid} style={{ color: 'black' }}>{c?.name}</option>;
                                })}
                            </select>
                        )}
                        <div style={{ marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                            View: {currentClinic?.name || 'ALL CLINICS'}
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            style={{ width: '100%', marginTop: '0.75rem', padding: '0.4rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                            LOGOUT
                        </button>
                    </div>

                    <button
                        onClick={() => setIsAddPatientOpen(true)}
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

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {renderContent()}
            </main>

            <AddPatientModal
                isOpen={isAddPatientOpen}
                onClose={() => setIsAddPatientOpen(false)}
                onSave={handleAddPatient}
            />
        </div>
    )
}

export default App
