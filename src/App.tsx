import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/Login'
import { useState, useMemo } from 'react'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import PatientProfile from './pages/PatientProfile'
import CalendarPage from './pages/Calendar'
import AddPatientModal from './components/AddPatientModal'
import SettingsPage from './pages/Settings'
import DocumentsPage from './pages/Documents'
import { MOCK_CLINICS, MOCK_USERS, MOCK_PATIENTS } from './data/mockPatients'
import { User, Clinic, Patient } from './types'
import Sidebar from './components/Sidebar'
import MobileHeader from './components/MobileHeader'

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
            navigate('/home');
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

    const filteredPatients = useMemo(() => {
        return allPatients.filter(p => {
            if (currentUser.isAllClinics) {
                return currentClinic ? p.clinicId === currentClinic.id : true;
            }
            return currentUser.clinicIds?.includes(p.clinicId);
        });
    }, [allPatients, currentUser, currentClinic]);

    if (isAuthenticated && location.pathname === '/login') {
        return <Navigate to="/home" replace />;
    }

    if (!isAuthenticated && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--background))' }}>
            {/* Desktop Sidebar */}
            <div className="hide-on-mobile">
                <Sidebar
                    currentUser={currentUser}
                    currentClinic={currentClinic}
                    allUsers={MOCK_USERS}
                    allClinics={MOCK_CLINICS}
                    onUserChange={(userId) => {
                        const user = MOCK_USERS.find(u => u.id === userId);
                        if (user) {
                            setCurrentUser(user);
                            if (user.isAllClinics) setCurrentClinic(null);
                            else if (user.clinicIds?.length) setCurrentClinic(MOCK_CLINICS.find(c => c.id === user.clinicIds![0]) || null);
                        }
                    }}
                    onClinicChange={(clinicId) => setCurrentClinic(MOCK_CLINICS.find(c => c.id === clinicId) || null)}
                    onLogout={() => setIsAuthenticated(false)}
                    onAddPatient={() => setIsAddPatientOpen(true)}
                />
            </div>

            {/* Mobile Header and Sidebar Overlay */}
            <MobileHeader onMenuOpen={() => setIsMobileMenuOpen(true)} />

            {isMobileMenuOpen && (
                <div
                    className="show-on-mobile"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 90,
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div onClick={e => e.stopPropagation()} style={{ width: '80%', height: '100%' }}>
                        <Sidebar
                            isMobile
                            currentUser={currentUser}
                            currentClinic={currentClinic}
                            allUsers={MOCK_USERS}
                            allClinics={MOCK_CLINICS}
                            onUserChange={(userId) => {
                                const user = MOCK_USERS.find(u => u.id === userId);
                                if (user) {
                                    setCurrentUser(user);
                                    if (user.isAllClinics) setCurrentClinic(null);
                                    else if (user.clinicIds?.length) setCurrentClinic(MOCK_CLINICS.find(c => c.id === user.clinicIds![0]) || null);
                                }
                            }}
                            onClinicChange={(clinicId) => setCurrentClinic(MOCK_CLINICS.find(c => c.id === clinicId) || null)}
                            onLogout={() => setIsAuthenticated(false)}
                            onAddPatient={() => setIsAddPatientOpen(true)}
                            onClose={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/home" element={<Dashboard onAddPatient={() => setIsAddPatientOpen(true)} patients={filteredPatients} userRole={currentUser.role} />} />
                    <Route path="/patients" element={<PatientList onSelectPatient={(id) => navigate(`/patients/${id}`)} onAddPatient={() => setIsAddPatientOpen(true)} patients={filteredPatients} userRole={currentUser.role} />} />
                    <Route path="/patients/:id" element={<PatientProfile onBack={() => navigate('/patients')} userRole={currentUser.role} />} />
                    <Route path="/calendar" element={<CalendarPage patients={filteredPatients} userRole={currentUser.role} currentUser={currentUser} onUpdatePatient={handleUpdatePatient} />} />
                    <Route path="/documents" element={<DocumentsPage patients={filteredPatients} />} />
                    <Route path="/settings" element={
                        (currentUser.role === 'super-admin' || currentUser.role === 'admin')
                            ? <SettingsPage userRole={currentUser.role} clinic={currentClinic} />
                            : <Navigate to="/home" replace />
                    } />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
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
