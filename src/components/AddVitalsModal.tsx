import { useState } from 'react';
import { X, Activity, Droplets, Save, Clock } from 'lucide-react';
import { VitalSign } from '../types';

const AddVitalsModal = ({ isOpen, onClose, onSave, type }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vital: VitalSign) => void;
    type: 'bp' | 'glucose';
}) => {
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        glucose: '',
        timestamp: new Date().toISOString().slice(0, 16),
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let vital: VitalSign;
        if (type === 'bp') {
            vital = {
                type: 'bp',
                systolic: parseInt(formData.systolic),
                diastolic: parseInt(formData.diastolic),
                unit: 'mmHg',
                timestamp: formData.timestamp,
                notes: formData.notes
            };
        } else {
            vital = {
                type: 'glucose',
                glucose: parseInt(formData.glucose),
                unit: 'mg/dL',
                timestamp: formData.timestamp,
                notes: formData.notes
            };
        }

        onSave(vital);
        onClose();
        // Reset form
        setFormData({
            systolic: '',
            diastolic: '',
            glucose: '',
            timestamp: new Date().toISOString().slice(0, 16),
            notes: ''
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1600, backdropFilter: 'blur(10px)', padding: '2rem'
        }}>
            <div className="premium-glass" style={{
                width: '100%', maxWidth: '500px', padding: '2rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--primary))' }}>
                        {type === 'bp' ? <Activity size={24} /> : <Droplets size={24} />}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                            {type === 'bp' ? 'New Blood Pressure Record' : 'New Glucose (Sugar) Record'}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {type === 'bp' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Systolic (Sys)</label>
                                <input required type="number" placeholder="120" value={formData.systolic} onChange={(e) => setFormData({ ...formData, systolic: e.target.value })} style={{ padding: '0.75rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Diastolic (Dia)</label>
                                <input required type="number" placeholder="80" value={formData.diastolic} onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })} style={{ padding: '0.75rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Glucose Level (mg/dL)</label>
                            <input required type="number" placeholder="95" value={formData.glucose} onChange={(e) => setFormData({ ...formData, glucose: e.target.value })} style={{ padding: '0.75rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Measurement Time</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Clock size={16} style={{ position: 'absolute', left: '12px', color: 'hsl(var(--muted-foreground))' }} />
                            <input required type="datetime-local" value={formData.timestamp} onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Notes (Optional)</label>
                        <textarea placeholder="Fasting/After meal, etc." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ padding: '0.75rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white', resize: 'none', height: '80px' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', background: 'hsl(var(--secondary))', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', background: 'hsl(var(--primary))', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVitalsModal;
