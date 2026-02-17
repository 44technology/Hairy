import { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const LoginPage = ({ onLogin }: { onLogin: (userId: string) => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For demo: match any u1-u5
        if (email.includes('admin')) onLogin('u1');
        else if (email.includes('specialist')) onLogin('u4');
        else onLogin('u2');
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'hsl(var(--background))',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background pattern */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%',
                width: '50%', height: '50%',
                background: 'hsl(var(--primary) / 0.05)',
                filter: 'blur(100px)', borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: '50%', height: '50%',
                background: 'hsl(var(--primary) / 0.05)',
                filter: 'blur(100px)', borderRadius: '50%'
            }} />

            <div className="premium-glass" style={{
                width: '100%', maxWidth: '450px',
                padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem',
                border: '1px solid hsl(var(--primary) / 0.1)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'hsl(var(--primary))',
                        borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1 className="premium-gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Capilar Max</h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>Clinical Excellence Portal</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Work Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                            <input
                                required type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@capilarmax.com"
                                style={{
                                    width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem',
                                    background: 'hsl(var(--background) / 0.5)',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '12px', color: 'white'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                            <input
                                required type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '0.875rem 0.875rem 0.875rem 2.75rem',
                                    background: 'hsl(var(--background) / 0.5)',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '12px', color: 'white'
                                }}
                            />
                        </div>
                    </div>

                    <button type="submit" style={{
                        marginTop: '1rem', padding: '1.125rem',
                        background: 'hsl(var(--primary))', color: 'white',
                        borderRadius: '14px', border: 'none',
                        fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        transition: 'transform 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                    Forgot password? Contact your IT administrator.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
