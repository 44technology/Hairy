import { X, ZoomIn } from 'lucide-react';

const MultiPhotoViewer = ({ photos, onClose }: { photos: string[], onClose: () => void }) => {
    if (photos.length === 0) return null;

    return (
        <div className="premium-glass" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid hsl(var(--primary) / 0.2)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>Comparison Viewer ({photos.length} photos)</h4>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${photos.length}, 1fr)`,
                gap: '1rem',
                maxHeight: '400px',
                overflow: 'hidden'
            }}>
                {photos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '12px', overflow: 'hidden', border: '1px solid hsl(var(--border))' }}>
                        <img src={url} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                            Photo {i + 1}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
                Select up to 3 photos from the gallery below to compare side-by-side.
            </p>
        </div>
    );
};

export default MultiPhotoViewer;
