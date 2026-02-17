import { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, ShieldAlert } from 'lucide-react';
import { Patient, UserRole } from '../types';

const PatientList = ({ onSelectPatient, onAddPatient, patients, userRole }: {
    onSelectPatient: (id: string) => void,
    onAddPatient: () => void,
    patients: Patient[],
    userRole: UserRole
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredPatients = patients.filter(patient => {
        const matchesSearch =
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const cycleStatus = () => {
        const statuses = ['all', 'pending', 'scheduled', 'post-op', 'completed'];
        const currentIndex = statuses.indexOf(statusFilter);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setStatusFilter(statuses[nextIndex]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Patients</h2>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>{filteredPatients.length} patients found.</p>
                </div>
                <button
                    onClick={onAddPatient}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'hsl(var(--primary))',
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    Add New Patient
                </button>
            </header>

            <div className="premium-glass" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                background: 'hsl(var(--background) / 0.5)',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                color: 'hsl(var(--foreground))',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button
                        onClick={cycleStatus}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: statusFilter === 'all' ? 'hsl(var(--secondary))' : 'hsl(var(--primary) / 0.2)',
                            borderRadius: '12px',
                            color: statusFilter === 'all' ? 'hsl(var(--foreground))' : 'hsl(var(--primary))',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: `1px solid ${statusFilter === 'all' ? 'transparent' : 'hsl(var(--primary))'}`,
                            cursor: 'pointer',
                            fontWeight: 600,
                            minWidth: '140px',
                            justifyContent: 'center'
                        }}
                    >
                        <Filter size={18} />
                        {statusFilter === 'all' ? 'Filter' : statusFilter.toUpperCase()}
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Patient</th>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Graft Count</th>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Birth Date</th>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Surgery Date</th>
                                <th style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    onClick={() => onSelectPatient(patient.id)}
                                    style={{ borderBottom: '1px solid hsl(var(--border))', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--secondary) / 0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, position: 'relative' }}>
                                                {patient.firstName[0]}{patient.lastName[0]}
                                                {(patient.hepatitisB || patient.hepatitisC || patient.hiv) && (
                                                    <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid hsl(var(--background))' }}>
                                                        <ShieldAlert size={10} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <p style={{ fontWeight: 600 }}>{patient.firstName} {patient.lastName}</p>
                                                    {(patient.hepatitisB || patient.hepatitisC || patient.hiv) && (
                                                        <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(239, 68, 68, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #ef4444' }}>INFECTION WARNING</span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>
                                                    {userRole === 'specialist' ? '***-***-**-**' : patient.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: patient.status === 'scheduled' ? 'hsl(var(--primary) / 0.1)' :
                                                patient.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'hsl(var(--muted) / 0.1)',
                                            color: patient.status === 'scheduled' ? 'hsl(var(--primary))' :
                                                patient.status === 'completed' ? '#10b981' : 'hsl(var(--muted-foreground))'
                                        }}>
                                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{patient.graftCount || '-'}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {userRole === 'specialist' ? '**.**.****' : patient.birthDate}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>{patient.surgeryDate || '-'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'none', cursor: 'pointer' }}>
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientList;
