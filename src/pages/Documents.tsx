import { useState, useRef } from 'react';
import { Folder, FileText, Search, ChevronRight, File, ArrowLeft, Upload, Image as ImageIcon, FileVideo } from 'lucide-react';
import { Patient, Document } from '../types';

const DocumentsPage = ({ patients, onUpdatePatient }: { patients: Patient[], onUpdatePatient: (id: string, updates: Partial<Patient>) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredPatients = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) || null : null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !currentPatient) return;

        const newDocs: Document[] = Array.from(e.target.files).map(file => {
            const url = URL.createObjectURL(file);
            let type: Document['type'] = 'other';

            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type === 'application/pdf') type = 'pdf';
            else if (file.type.includes('document') || file.type.includes('word') || file.type.includes('text')) type = 'document';

            return {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                type,
                uploadDate: new Date().toISOString().split('T')[0],
                url,
                signed: false
            };
        });

        onUpdatePatient(currentPatient.id, {
            documents: [...currentPatient.documents, ...newDocs]
        });

        // Reset input so the same file could be uploaded again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (currentPatient) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <button
                        onClick={() => setSelectedPatientId(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        <ArrowLeft size={18} /> Back to Folders
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                            <Folder size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{currentPatient.firstName} {currentPatient.lastName}</h2>
                            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Document Archive</p>
                        </div>
                    </div>
                </header>

                <div className="premium-glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Files</h3>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(var(--primary))', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                            <Upload size={18} /> Upload Files
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>

                    {currentPatient.documents.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            {currentPatient.documents.map(doc => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'hsl(var(--secondary) / 0.3)',
                                    borderRadius: '12px',
                                    border: '1px solid hsl(var(--border))',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ height: '140px', background: 'hsl(var(--secondary) / 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {doc.type === 'image' && doc.url ? (
                                            <img src={doc.url} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : doc.type === 'video' && doc.url ? (
                                            <video src={doc.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : doc.type === 'video' ? (
                                            <FileVideo size={48} style={{ color: 'hsl(var(--muted-foreground))' }} />
                                        ) : doc.type === 'image' ? (
                                            <ImageIcon size={48} style={{ color: 'hsl(var(--muted-foreground))' }} />
                                        ) : (
                                            <FileText size={48} style={{ color: 'hsl(var(--muted-foreground))' }} />
                                        )}
                                    </div>
                                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <p style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.name}>{doc.name}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{doc.uploadDate || 'N/A'}</span>
                                            {doc.type === 'consent' && (
                                                doc.signed ? (
                                                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>SIGNED</span>
                                                ) : (
                                                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>PENDING</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'hsl(var(--muted-foreground))' }}>
                            <File size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p>No documents found for this patient.</p>
                            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click the 'Upload Files' button to add some.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Document Archive</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Browse patient document inventory by folders.</p>
            </header>

            <div className="premium-glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem' }}>
                <Search size={20} style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredPatients.map(patient => (
                    <div
                        key={patient.id}
                        className="premium-glass"
                        onClick={() => setSelectedPatientId(patient.id)}
                        style={{
                            padding: '1.5rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                                <Folder size={24} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 700 }}>{patient.firstName} {patient.lastName}</p>
                                <p style={{ fontSize: '0.825rem', color: 'hsl(var(--muted-foreground))' }}>{patient.documents.length} Items</p>
                            </div>
                        </div>
                        <ChevronRight size={20} style={{ color: 'hsl(var(--muted-foreground))' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentsPage;
