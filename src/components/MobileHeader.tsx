import { Menu } from 'lucide-react'
import logo from '../assets/logo.png'

interface MobileHeaderProps {
    onMenuOpen: () => void
}

const MobileHeader = ({ onMenuOpen }: MobileHeaderProps) => {
    return (
        <header className="premium-glass show-on-mobile" style={{
            display: 'none', // Controlled by CSS media queries
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'hsl(var(--background) / 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid hsl(var(--border))'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={logo} alt="Capilar Max Logo" style={{ height: '32px', objectFit: 'contain' }} />
            </div>

            <button
                onClick={onMenuOpen}
                style={{
                    background: 'transparent',
                    color: 'hsl(var(--foreground))',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))'
                }}
            >
                <Menu size={24} />
            </button>
        </header>
    )
}

export default MobileHeader
