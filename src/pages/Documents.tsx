import { useState } from 'react';
import { Folder, FileText, Search, ChevronRight, File, ArrowLeft } from 'lucide-react';
import { Patient } from '../types';

const DocumentsPage = ({ patients }: { patients: Patient[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const filteredPatients = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedPatient) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <button
                        onClick={() => setSelectedPatient(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        <ArrowLeft size={18} /> Back to Folders
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                            <Folder size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Document Inventory</p>
                        </div>
                    </div>
                </header>

                <div className="premium-glass" style={{ padding: '1rem' }}>
                    {selectedPatient.documents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {selectedPatient.documents.map(doc => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'hsl(var(--secondary) / 0.3)',
                                    borderRadius: '12px',
                                    border: '1px solid hsl(var(--border))'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <FileText size={20} style={{ color: 'hsl(var(--primary))' }} />
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{doc.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Uploaded: {doc.uploadDate || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {doc.signed ? (
                                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>SIGNED</span>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>PENDING</span>
                                        )}
                                        <button style={{ background: 'transparent', color: 'hsl(var(--primary))', fontWeight: 600, border: 'none', cursor: 'pointer' }}>View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>
                            <File size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p>No documents found for this patient.</p>
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
                        onClick={() => setSelectedPatient(patient)}
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
