import { Camera, Users, Calendar, TrendingUp, Sparkles, Plus as PlusIcon } from 'lucide-react';
import GraftCalculator from '../components/GraftCalculator';
import { useRef } from 'react';
import { Patient, UserRole } from '../types';

const Dashboard = ({ onAddPatient, patients, userRole }: {
    onAddPatient: () => void,
    patients: Patient[],
    userRole: UserRole
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`${file.name} uploaded successfully!`);
        }
    };

    const stats = [
        { label: 'Total Patients', value: patients.length.toString(), icon: Users, color: 'hsl(var(--primary))' },
        { label: 'Ops This Month', value: patients.filter(p => p.status === 'scheduled').length.toString(), icon: Sparkles, color: '#10b981' },
        { label: 'Pending Photos', value: '12', icon: Camera, color: '#f59e0b' },
        { label: 'Growth', value: '+12%', icon: TrendingUp, color: '#3b82f6' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Management Dashboard</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Welcome to the clinic overview.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="premium-glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.75rem',
                                background: `${stat.color}15`,
                                borderRadius: '12px',
                                color: stat.color
                            }}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="responsive-dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Upcoming Operations</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {patients.filter(p => p.status === 'scheduled').length > 0 ? (
                                patients.filter(p => p.status === 'scheduled').map((patient, i, arr) => (
                                    <div key={patient.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        borderBottom: i !== arr.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                                {patient.firstName[0]}{patient.lastName[0]}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{patient.firstName} {patient.lastName}</p>
                                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>{patient.graftCount || 0} Grafts</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 500 }}>{patient.surgeryDate ? new Date(patient.surgeryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '-'}</p>
                                            <p style={{ fontSize: '0.825rem', color: 'hsl(var(--primary))' }}>{patient.surgeryTime || '--:--'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>No scheduled operations.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <GraftCalculator />

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                onClick={onAddPatient}
                                className="premium-glass" style={{ padding: '1rem', textAlign: 'left', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Register New Patient</button>
                            <button
                                onClick={handleUploadClick}
                                className="premium-glass" style={{ padding: '1rem', textAlign: 'left', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Upload Photo</button>
                            <button
                                onClick={() => alert('Report being prepared...')}
                                className="premium-glass" style={{ padding: '1rem', textAlign: 'left', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
