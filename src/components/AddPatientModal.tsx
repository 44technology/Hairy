import { useState, useRef } from 'react';
import { X, User, Phone, Mail, Calendar, Save, FileCheck, Pill, ShieldAlert } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

const AddPatientModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (patient: any) => void }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        medicalHistory: '',
        medications: '',
        allergies: '',
        hepatitisB: false,
        hepatitisC: false,
        hiv: false,
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sigCanvas.current?.isEmpty()) {
            alert('Please provide a signature for operation consent.');
            return;
        }
        const signature = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

        onSave({ ...formData, signature, vitals: [] });
        onClose();
    };

    const clearSignature = () => sigCanvas.current?.clear();

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100,
            backdropFilter: 'blur(12px)',
            padding: '2rem'
        }}>
            <div className="premium-glass" style={{
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>New Patient & Clinic Registration</h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'none', cursor: 'pointer' }}><X size={28} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Personal Information Section */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'hsl(var(--primary))' }}>
                            <User size={20} />
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Personal Information</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>First Name</label>
                                <input required type="text" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Last Name</label>
                                <input required type="text" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                                <input required type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                                <input required type="tel" placeholder="+1..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Birth Date</label>
                                <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white' }} />
                            </div>
                        </div>
                    </section>
                    {/* Infection Screening Section */}
                    <section style={{ border: '1px solid hsl(var(--border))', borderRadius: '16px', padding: '1.5rem', background: 'hsl(var(--muted)/0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#ef4444' }}>
                            <ShieldAlert size={20} />
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Critical Infection Screening</h4>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1.25rem', background: formData.hepatitisB ? 'rgba(239, 68, 68, 0.1)' : 'hsl(var(--background))', borderRadius: '12px', border: `1px solid ${formData.hepatitisB ? '#ef4444' : 'hsl(var(--border))'}`, transition: 'all 0.2s' }}>
                                <input type="checkbox" checked={formData.hepatitisB} onChange={(e) => setFormData({ ...formData, hepatitisB: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 600 }}>Hepatitis B</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1.25rem', background: formData.hepatitisC ? 'rgba(239, 68, 68, 0.1)' : 'hsl(var(--background))', borderRadius: '12px', border: `1px solid ${formData.hepatitisC ? '#ef4444' : 'hsl(var(--border))'}`, transition: 'all 0.2s' }}>
                                <input type="checkbox" checked={formData.hepatitisC} onChange={(e) => setFormData({ ...formData, hepatitisC: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 600 }}>Hepatitis C</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1.25rem', background: formData.hiv ? 'rgba(239, 68, 68, 0.1)' : 'hsl(var(--background))', borderRadius: '12px', border: `1px solid ${formData.hiv ? '#ef4444' : 'hsl(var(--border))'}`, transition: 'all 0.2s' }}>
                                <input type="checkbox" checked={formData.hiv} onChange={(e) => setFormData({ ...formData, hiv: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 600 }}>HIV</span>
                            </label>
                        </div>
                    </section>

                    {/* Medical History Section */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'hsl(var(--primary))' }}>
                            <Pill size={20} />
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Medical History</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Chronic Diseases</label>
                                <textarea placeholder="Diabetes, Hypertension, etc." value={formData.medicalHistory} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white', minHeight: '100px', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Allergies</label>
                                <textarea placeholder="Latex, Anesthesia, Medications, etc." value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white', minHeight: '100px', resize: 'none' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Current Medications</label>
                            <textarea placeholder="Names and dosages of medications..." value={formData.medications} onChange={(e) => setFormData({ ...formData, medications: e.target.value })} style={{ padding: '0.875rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'white', minHeight: '100px', resize: 'none' }} />
                        </div>
                    </section>

                    {/* Consent Section */}
                    <section style={{ padding: '1.5rem', border: '2px dashed hsl(var(--primary) / 0.3)', borderRadius: '16px', background: 'hsl(var(--primary) / 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'hsl(var(--primary))' }}>
                            <FileCheck size={20} />
                            <h4 style={{ fontWeight: 700 }}>Operation Planning & Procedure Consent</h4>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                            I hereby declare that the medical information provided above is accurate and I accept the planned operational procedures.
                        </p>

                        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
                            <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 800, height: 180, className: 'sigCanvas' }} />
                        </div>
                        <button type="button" onClick={clearSignature} style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear Signature</button>
                    </section>

                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '1.25rem', borderRadius: '16px', background: 'hsl(var(--secondary))', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white' }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, padding: '1.25rem', borderRadius: '16px', background: 'hsl(var(--primary))', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: 'none', cursor: 'pointer' }}>
                            <Save size={20} /> Complete Registry & Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
