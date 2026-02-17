import { useState } from 'react';

const ScalpMap = () => {
    const [selectedZones, setSelectedZones] = useState<string[]>([]);

    const zones = [
        { id: 'frontal', label: 'Frontal Line', d: 'M 100,100 Q 200,50 300,100 L 300,150 Q 200,120 100,150 Z' },
        { id: 'mid-scalp', label: 'Mid-Scalp', d: 'M 100,150 Q 200,120 300,150 L 300,250 Q 200,220 100,250 Z' },
        { id: 'vertex', label: 'Vertex', d: 'M 100,250 Q 200,220 300,250 Q 300,350 200,400 Q 100,350 100,250 Z' },
    ];

    const toggleZone = (id: string) => {
        setSelectedZones(prev =>
            prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]
        );
    };

    return (
        <div className="premium-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Operation Planning Map</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>Select areas for transplantation:</p>

            <div style={{ position: 'relative', width: '300px', height: '400px', margin: '0 auto' }}>
                <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%' }}>
                    {/* Scalp Outline */}
                    <path
                        d="M 50,100 Q 200,0 350,100 Q 380,250 200,450 Q 20,250 50,100"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                    />

                    {zones.map(zone => (
                        <path
                            key={zone.id}
                            d={zone.d}
                            fill={selectedZones.includes(zone.id) ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--secondary) / 0.3)'}
                            stroke={selectedZones.includes(zone.id) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                            strokeWidth="2"
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onClick={() => toggleZone(zone.id)}
                        />
                    ))}

                    {/* Labels */}
                    {zones.map(zone => (
                        <text
                            key={`${zone.id}-label`}
                            x="200"
                            y={zone.id === 'frontal' ? '125' : zone.id === 'mid-scalp' ? '200' : '310'}
                            textAnchor="middle"
                            fill={selectedZones.includes(zone.id) ? 'white' : 'hsl(var(--muted-foreground))'}
                            style={{ fontSize: '14px', fontWeight: 600, pointerEvents: 'none' }}
                        >
                            {zone.label}
                        </text>
                    ))}
                </svg>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedZones.map(z => (
                    <span key={z} style={{ padding: '0.25rem 0.75rem', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {zones.find(zone => zone.id === z)?.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScalpMap;
