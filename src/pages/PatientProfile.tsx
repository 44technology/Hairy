import { useState, useRef } from 'react';
import { ChevronLeft, Camera, FileText, Activity, Scissors, Plus as PlusIcon, ArrowLeft, Pill, ShieldAlert, Droplets, User as UserIcon, Check } from 'lucide-react';
import { MOCK_PATIENTS } from '../data/mockPatients';
import SignatureModal from '../components/SignatureModal';
import MultiPhotoViewer from '../components/MultiPhotoViewer';
import Lightbox from '../components/Lightbox';
import ScalpMap from '../components/ScalpMap';
import ComprehensiveConsentForm from '../components/ComprehensiveConsentForm';
import AddVitalsModal from '../components/AddVitalsModal';
import { Patient, UserRole } from '../types';

const PatientProfile = ({ id, onBack, userRole }: {
    id: string,
    onBack: () => void,
    userRole: UserRole
}) => {
    const patient = MOCK_PATIENTS.find(p => p.id === id);
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
    const [vitalsType, setVitalsType] = useState<'bp' | 'glucose'>('bp');
    const [currentDoc, setCurrentDoc] = useState<string | null>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!patient) return <div>Patient not found.</div>;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`${file.name} uploaded successfully!`);
        }
    };

    const togglePhotoSelection = (url: string) => {
        setSelectedPhotos(prev =>
            prev.includes(url)
                ? prev.filter(u => u !== url)
                : (prev.length < 3 ? [...prev, url] : prev)
        );
    };

    const allGalleryImages = patient.photos.flatMap(p => p.urls);

    const openLightbox = (url: string) => {
        const index = allGalleryImages.indexOf(url);
        setLightboxImages(allGalleryImages);
        setLightboxIndex(index);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
                <ChevronLeft size={18} />
                Go Back
            </button>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{patient.firstName} {patient.lastName}</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', color: 'hsl(var(--muted-foreground))' }}>
                            <span>Patient ID: #{patient.id}</span>
                            <span>•</span>
                            <span>{userRole === 'specialist' ? '***-***-**-**' : patient.phone}</span>
                            <span>•</span>
                            <span>{userRole === 'specialist' ? '*******@*******.***' : patient.email}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => alert('Editing mode opening...')}
                        className="premium-glass" style={{ padding: '0.75rem 1.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Edit</button>
                    <button
                        onClick={() => setIsConsentModalOpen(true)}
                        style={{ padding: '0.75rem 1.5rem', background: 'hsl(var(--secondary))', color: 'white', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} /> Official Consent Form
                    </button>
                    <button
                        onClick={() => alert('Operation scheduler opening...')}
                        disabled={!patient.isConsentSigned}
                        style={{ padding: '0.75rem 1.5rem', background: 'hsl(var(--primary))', color: 'white', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', opacity: patient.isConsentSigned ? 1 : 0.5 }}>
                        Schedule Operation
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {(patient.hepatitisB || patient.hepatitisC || patient.hiv) && (
                        <div className="premium-glass" style={{ padding: '1.5rem', border: '2px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                                <ShieldAlert size={20} />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>INFECTION STATUS</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                {patient.hepatitisB && <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>HEPATITIS B+</span>}
                                {patient.hepatitisC && <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>HEPATITIS C+</span>}
                                {patient.hiv && <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>HIV+</span>}
                            </div>
                        </div>
                    )}
                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} /> Operation Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>Status</p>
                                <p style={{ fontWeight: 600 }}>{patient.status.toUpperCase()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>Graft Count</p>
                                <p style={{ fontWeight: 600 }}>{patient.graftCount || '-'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>Surgery Date</p>
                                <p style={{ fontWeight: 600 }}>{patient.surgeryDate || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} /> Chronic Diseases
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: patient.medicalHistory ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                            {patient.medicalHistory || 'No recorded chronic diseases.'}
                        </p>
                    </div>

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldAlert size={18} color="#ef4444" /> Allergies
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: patient.allergies ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                            {patient.allergies || 'No recorded allergies.'}
                        </p>
                    </div>

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Pill size={18} /> Medications
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: patient.medications ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                            {patient.medications || 'No recorded medications.'}
                        </p>
                    </div>

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={18} /> Blood Pressure Records
                            </h3>
                            <button
                                onClick={() => { setVitalsType('bp'); setIsVitalsModalOpen(true); }}
                                style={{ background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <PlusIcon size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {patient.vitals && patient.vitals.filter(v => v.type === 'bp').length > 0 ? (
                                patient.vitals.filter(v => v.type === 'bp').map((v, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'hsl(var(--secondary) / 0.3)', borderRadius: '8px' }}>
                                        <div>
                                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{v.systolic}/{v.diastolic}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>mmHg</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.825rem', fontWeight: 500 }}>{new Date(v.timestamp).toLocaleDateString()}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>No BP records found.</p>
                            )}
                        </div>
                    </div>

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Droplets size={18} /> Glucose Tracking
                            </h3>
                            <button
                                onClick={() => { setVitalsType('glucose'); setIsVitalsModalOpen(true); }}
                                style={{ background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <PlusIcon size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {patient.vitals && patient.vitals.filter(v => v.type === 'glucose').length > 0 ? (
                                patient.vitals.filter(v => v.type === 'glucose').map((v, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'hsl(var(--secondary) / 0.3)', borderRadius: '8px' }}>
                                        <div>
                                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{v.glucose}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>mg/dL</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.825rem', fontWeight: 500 }}>{new Date(v.timestamp).toLocaleDateString()}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>No glucose records found.</p>
                            )}
                        </div>
                    </div>

                    <ScalpMap />

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} /> Documents
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {patient.documents.map(doc => (
                                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'hsl(var(--background) / 0.5)', borderRadius: '10px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{doc.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{doc.signed ? 'Signed' : 'Awaiting Signature'}</p>
                                    </div>
                                    {!doc.signed && (
                                        <button
                                            onClick={() => {
                                                setCurrentDoc(doc.name);
                                                setIsSigModalOpen(true);
                                            }}
                                            style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        >
                                            Sign Now
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={handleUploadClick}
                                style={{ width: '100%', padding: '0.75rem', border: '2px dashed hsl(var(--border))', background: 'transparent', borderRadius: '10px', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', cursor: 'pointer' }}>
                                + Upload Document
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedPhotos.length > 0 && (
                        <MultiPhotoViewer
                            photos={selectedPhotos}
                            onClose={() => setSelectedPhotos([])}
                        />
                    )}

                    <div className="premium-glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Camera size={18} /> Photo Gallery
                            </h3>
                            {selectedPhotos.length > 0 && (
                                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 700 }}>
                                    {selectedPhotos.length} SELECTED FOR COMPARISON
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {['pre-op', 'intra-op', 'post-op'].map((type) => (
                                <div key={type}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {type.replace('-', ' ')}
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        {patient.photos.filter(a => a.type === type).flatMap(a => a.urls).map((url, i) => (
                                            <div key={i} style={{ position: 'relative', aspectRatio: '1', background: 'hsl(var(--secondary))', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => openLightbox(url)}>
                                                <img src={url} alt={type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePhotoSelection(url);
                                                    }}
                                                    style={{
                                                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                                                        width: '24px', height: '24px', borderRadius: '6px',
                                                        background: selectedPhotos.includes(url) ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.4)',
                                                        border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', transition: 'all 0.2s', zIndex: 10
                                                    }}
                                                >
                                                    {selectedPhotos.includes(url) && <Check size={16} strokeWidth={3} />}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleUploadClick}
                                            style={{ aspectRatio: '1', border: '2px dashed hsl(var(--border))', background: 'transparent', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' }}>
                                            <PlusIcon size={20} />
                                            <span style={{ fontSize: '0.65rem' }}>Add</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <SignatureModal
                isOpen={isSigModalOpen}
                onClose={() => setIsSigModalOpen(false)}
                onSave={(data) => {
                    console.log('Signature saved for doc:', currentDoc, data);
                    alert('Signature saved successfully!');
                }}
            />

            <ComprehensiveConsentForm
                isOpen={isConsentModalOpen}
                onClose={() => setIsConsentModalOpen(false)}
                patientName={`${patient.firstName} ${patient.lastName}`}
                onSave={(data) => {
                    console.log('Comprehensive Consent Saved:', data);
                    alert('Comprehensive Consent Form signed and archived!');
                }}
            />

            <AddVitalsModal
                isOpen={isVitalsModalOpen}
                onClose={() => setIsVitalsModalOpen(false)}
                type={vitalsType}
                onSave={(vital) => {
                    console.log('New Vital Record:', vital);
                    alert(`${vital.type === 'bp' ? 'Blood Pressure' : 'Glucose'} record added!`);
                }}
            />

            {lightboxIndex !== null && (
                <Lightbox
                    images={lightboxImages}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    );
};

export default PatientProfile;
