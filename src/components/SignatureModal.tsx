import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Check, Save } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: string) => void }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    if (!isOpen) return null;

    const clear = () => sigCanvas.current?.clear();
    const save = () => {
        if (sigCanvas.current?.isEmpty()) return;
        onSave(sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || '');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
        }}>
            <div className="premium-glass" style={{ width: '90%', maxWidth: '600px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Digital Signature</h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'hsl(var(--muted-foreground))' }}><X size={24} /></button>
                </div>

                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                    Please sign in the area below. This signature will be added to the consent form.
                </p>

                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '240px' }}>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ width: 600, height: 240, className: 'sigCanvas' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={clear} style={{ padding: '0.75rem 1.5rem', background: 'hsl(var(--secondary))', borderRadius: '10px', fontWeight: 600 }}>Clear</button>
                    <button onClick={save} style={{
                        padding: '0.75rem 1.5rem',
                        background: 'hsl(var(--primary))',
                        color: 'white',
                        borderRadius: '10px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Save size={18} />
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
