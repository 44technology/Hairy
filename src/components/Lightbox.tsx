import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Lightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const next = () => setCurrentIndex((currentIndex + 1) % images.length);
    const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3000, backdropFilter: 'blur(10px)'
        }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={40} /></button>

            <button onClick={prev} style={{ position: 'absolute', left: '2rem', background: 'hsl(var(--secondary) / 0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '1rem', borderRadius: '50%' }}><ChevronLeft size={32} /></button>

            <div style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img src={images[currentIndex]} alt="Full size" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} />
                <p style={{ color: 'white', fontWeight: 600 }}>{currentIndex + 1} / {images.length}</p>
            </div>

            <button onClick={next} style={{ position: 'absolute', right: '2rem', background: 'hsl(var(--secondary) / 0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '1rem', borderRadius: '50%' }}><ChevronRight size={32} /></button>
        </div>
    );
};

export default Lightbox;
