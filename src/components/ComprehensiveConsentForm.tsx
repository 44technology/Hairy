import { useState, useRef } from 'react';
import { X, Check, Save, AlertCircle, FileText, UserCheck, ShieldCheck } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface Section {
    id: string;
    title: string;
    content: JSX.Element;
}

const ComprehensiveConsentForm = ({ isOpen, onClose, onSave, patientName }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    patientName: string;
}) => {
    const patientSigCanvas = useRef<SignatureCanvas>(null);
    const repSigCanvas = useRef<SignatureCanvas>(null);
    const [initials, setInitials] = useState<Record<string, boolean>>({
        B: false,
        C: false,
        D: false,
        E: false,
        F: false,
        G: false,
        H: false
    });
    const [repName, setRepName] = useState('');
    const [marketingConsent, setMarketingConsent] = useState<boolean | null>(null);

    if (!isOpen) return null;

    const handleInitial = (id: string) => {
        setInitials(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isComplete = () => {
        const allInitials = Object.values(initials).every(v => v);
        const signaturePatient = !patientSigCanvas.current?.isEmpty();
        const signatureRep = !repSigCanvas.current?.isEmpty();
        return allInitials && signaturePatient && signatureRep && repName && marketingConsent !== null;
    };

    const handleSubmit = () => {
        if (!isComplete()) {
            alert('Please complete all initial fields, signatures, and representative information.');
            return;
        }

        onSave({
            date: new Date().toISOString(),
            initials,
            marketingConsent,
            representativeName: repName,
            patientSignature: patientSigCanvas.current?.getTrimmedCanvas().toDataURL(),
            representativeSignature: repSigCanvas.current?.getTrimmedCanvas().toDataURL(),
        });
        onClose();
    };

    const sections: Section[] = [
        {
            id: 'A',
            title: 'A. PATIENT INFORMATION',
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <p><strong>Full Name:</strong> {patientName}</p>
                    <p><strong>Location:</strong> Florida, USA</p>
                </div>
            )
        },
        {
            id: 'B',
            title: 'B. HAIR TRANSPLANT OPERATION INFORMED CONSENT',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I understand that hair transplantation (FUE/DHI) is a medical and cosmetic procedure involving the extraction of hair follicles from the donor area and their transplantation to the recipient areas.</p>
                    <p><strong>Possible Risks:</strong> Infection, bleeding, swelling, scarring, shock loss, low graft survival rate, loss of sensation, asymmetry, and the potential need for additional corrective procedures.</p>
                    <p>I acknowledge that full results may take 6 to 18 months to appear and that Capilar Max does not guarantee a specific density or outcome.</p>
                    <InitialButton active={initials.B} onClick={() => handleInitial('B')} />
                </div>
            )
        },
        {
            id: 'C',
            title: 'C. ANESTHESIA AND MEDICATION CONSENT',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I consent to the administration of local anesthesia. I understand that anesthesia carries risks such as allergic reactions, dizziness, or temporary numbness.</p>
                    <p>I commit that I have fully and accurately disclosed my entire medical history, allergies, and currently used medications to Capilar Max.</p>
                    <InitialButton active={initials.C} onClick={() => handleInitial('C')} />
                </div>
            )
        },
        {
            id: 'D',
            title: 'D. NO GUARANTEE AND RESULTS DISCLAIMER',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I am aware that results can vary from patient to patient based on genetic factors, healing capacity, and adherence to post-operative care instructions.</p>
                    <p>I acknowledge that no verbal promises replace this written consent document.</p>
                    <InitialButton active={initials.D} onClick={() => handleInitial('D')} />
                </div>
            )
        },
        {
            id: 'E',
            title: 'E. POST-OPERATIVE CARE AND PATIENT RESPONSIBILITY',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I agree to avoid smoking, alcohol, and heavy physical activity during the healing process and to protect the area from the sun.</p>
                    <p>Capilar Max is not responsible for graft losses resulting from failure to follow instructions.</p>
                    <InitialButton active={initials.E} onClick={() => handleInitial('E')} />
                </div>
            )
        },
        {
            id: 'F',
            title: 'F. DEPOSIT AND FINANCIAL AGREEMENT',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I acknowledge that the deposit paid for the appointment will not be refunded for cancellations made outside the specified period.</p>
                    <InitialButton active={initials.F} onClick={() => handleInitial('F')} />
                </div>
            )
        },
        {
            id: 'G',
            title: 'G. PHOTO AND VIDEO CONSENT',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <p><strong>G.1 Medical Record (Mandatory):</strong> I consent to the taking of photos/videos for medical follow-up.</p>
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid hsl(var(--border))', borderRadius: '10px' }}>
                        <p><strong>G.2 Marketing and Education (Optional):</strong> Do you permit the use of your images for social media, website, or advertising purposes?</p>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" checked={marketingConsent === true} onChange={() => setMarketingConsent(true)} /> YES
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" checked={marketingConsent === false} onChange={() => setMarketingConsent(false)} /> NO
                            </label>
                        </div>
                    </div>
                    <InitialButton active={initials.G} onClick={() => handleInitial('G')} />
                </div>
            )
        },
        {
            id: 'H',
            title: 'H. HIPAA AUTHORIZATION',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>I consent to the use of my health information for operational processes, billing, and legal compliance in accordance with HIPAA regulations.</p>
                    <InitialButton active={initials.H} onClick={() => handleInitial('H')} />
                </div>
            )
        }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1500, backdropFilter: 'blur(15px)', padding: '2rem'
        }}>
            <div className="premium-glass" style={{
                width: '100%', maxWidth: '1000px', height: '90vh',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', border: '1px solid hsl(var(--primary) / 0.2)'
            }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'hsl(var(--primary) / 0.05)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>COMPREHENSIVE PATIENT CONSENT & AGREEMENT</h2>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>CAPILAR MAX Hair Transplant Center — Florida</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}><X size={32} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {sections.map(section => (
                        <section key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'hsl(var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{section.id}</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 750, color: 'hsl(var(--primary))' }}>{section.title}</h3>
                            </div>
                            <div style={{ paddingLeft: '3.5rem', color: 'hsl(var(--foreground))', lineHeight: '1.7', fontSize: '1rem' }}>
                                {section.content}
                            </div>
                        </section>
                    ))}

                    <section style={{ marginTop: '2rem', borderTop: '2px solid hsl(var(--border))', paddingTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>I. CONFIRMATION AND VOLUNTARY CONSENT</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            <div>
                                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>PATIENT SIGNATURE</p>
                                <div style={{ background: 'white', borderRadius: '12px', height: '180px', border: '2px solid hsl(var(--border))' }}>
                                    <SignatureCanvas ref={patientSigCanvas} penColor="black" canvasProps={{ width: 420, height: 180, className: 'sigCanvas' }} />
                                </div>
                                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>Patient: <strong>{patientName}</strong></p>
                            </div>
                            <div>
                                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>CLINIC REPRESENTATIVE</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Representative Name and Surname"
                                        value={repName}
                                        onChange={(e) => setRepName(e.target.value)}
                                        style={{ padding: '0.875rem', borderRadius: '10px', background: 'black', border: '1px solid hsl(var(--border))', color: 'white' }}
                                    />
                                    <div style={{ background: 'white', borderRadius: '12px', height: '120px', border: '2px solid hsl(var(--border))' }}>
                                        <SignatureCanvas ref={repSigCanvas} penColor="black" canvasProps={{ width: 420, height: 120, className: 'sigCanvas' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div style={{ padding: '2rem', borderTop: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'hsl(var(--primary) / 0.05)' }}>
                    <button onClick={onClose} style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'hsl(var(--secondary))', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete()}
                        style={{
                            padding: '1rem 3rem', borderRadius: '12px', background: isComplete() ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                            border: 'none', color: 'white', fontWeight: 700, cursor: isComplete() ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '0.75rem'
                        }}
                    >
                        <ShieldCheck size={20} />
                        CONFIRM AND SAVE DOCUMENT
                    </button>
                </div>
            </div>
        </div>
    );
};

const InitialButton = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        style={{
            alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '8px',
            background: active ? '#10b981' : 'transparent',
            border: `2px solid ${active ? '#10b981' : 'hsl(var(--primary))'}`,
            color: active ? 'white' : 'hsl(var(--primary))',
            fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s'
        }}
    >
        {active ? <Check size={14} /> : null}
        {active ? 'INITIALED' : 'INITIAL THIS SECTION TO CONFIRM'}
    </button>
);

export default ComprehensiveConsentForm;
