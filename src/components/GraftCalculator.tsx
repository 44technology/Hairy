import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

const GraftCalculator = () => {
    const [density, setDensity] = useState(40); // follicular units per cm2
    const [area, setArea] = useState(100); // cm2

    const totalGrafts = area * density;

    return (
        <div className="premium-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--primary))' }}>
                <Calculator size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Graft Calculator</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Donor Area Density (FU/cm²)</label>
                        <span style={{ fontWeight: 600 }}>{density}</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="100"
                        value={density}
                        onChange={(e) => setDensity(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Recipient Area Size (cm²)</label>
                        <span style={{ fontWeight: 600 }}>{area}</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="300"
                        value={area}
                        onChange={(e) => setArea(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                    />
                </div>
            </div>

            <div style={{
                padding: '1.5rem',
                background: 'hsl(var(--primary) / 0.1)',
                borderRadius: '12px',
                border: '1px solid hsl(var(--primary) / 0.2)',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '1rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>Estimated Graft Count</p>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>{totalGrafts}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'hsl(var(--secondary))', borderRadius: '8px', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                <Info size={16} />
                <p>These values may vary based on donor capacity and baldness level (Norwood Scale).</p>
            </div>
        </div>
    );
};

export default GraftCalculator;
