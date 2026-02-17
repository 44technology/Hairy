import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Building, MapPin } from 'lucide-react';
import { Patient, Clinic, User as SystemUser } from '../types';
import { MOCK_CLINICS } from '../data/mockPatients';

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patientId: string, appointmentData: Partial<Patient>) => void;
    patients: Patient[];
    currentUser: SystemUser;
    initialDate?: Date;
}

const AddAppointmentModal = ({ isOpen, onClose, onSave, patients, currentUser, initialDate }: AddAppointmentModalProps) => {
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [selectedClinicId, setSelectedClinicId] = useState('');
    const [date, setDate] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
    const [time, setTime] = useState('09:00');
    const [graftCount, setGraftCount] = useState<number>(3000);

    // Filter clinics based on user role
    const availableClinics = currentUser.isAllClinics
        ? MOCK_CLINICS
        : MOCK_CLINICS.filter(c => currentUser.clinicIds?.includes(c.id));

    // Auto-select clinic if only one is available
    useEffect(() => {
        if (availableClinics.length === 1 && !selectedClinicId) {
            setSelectedClinicId(availableClinics[0].id);
        }
    }, [availableClinics, selectedClinicId]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedPatientId, {
            clinicId: selectedClinicId,
            surgeryDate: date,
            surgeryTime: time,
            graftCount: graftCount,
            status: 'scheduled'
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="premium-glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Schedule New Appointment</h3>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>Create a new operation record for a patient.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Patient Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Select Patient</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                            <select
                                required
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                style={{ width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Choose a patient...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id} style={{ color: 'black' }}>
                                        {p.firstName} {p.lastName} (#{p.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {/* Clinic Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Clinic Location</label>
                            <div style={{ position: 'relative' }}>
                                <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                <select
                                    required
                                    value={selectedClinicId}
                                    onChange={(e) => setSelectedClinicId(e.target.value)}
                                    style={{ width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                                >
                                    <option value="" disabled style={{ color: 'black' }}>Select clinic...</option>
                                    {availableClinics.map(c => (
                                        <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Graft Count */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Estimated Grafts</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                <input
                                    type="number"
                                    value={graftCount}
                                    onChange={(e) => setGraftCount(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {/* Date */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Surgery Date</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Start Time</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    style={{ width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '1rem', background: 'hsl(var(--secondary))', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 2, padding: '1rem', background: 'hsl(var(--primary))', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAppointmentModal;
