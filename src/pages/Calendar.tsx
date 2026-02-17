import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus, User } from 'lucide-react';
import { Patient, UserRole, User as SystemUser } from '../types';
import AddAppointmentModal from '../components/AddAppointmentModal';

const CalendarPage = ({ patients, userRole, currentUser, onUpdatePatient }: {
    patients: Patient[],
    userRole: UserRole,
    currentUser: SystemUser,
    onUpdatePatient: (id: string, data: Partial<Patient>) => void
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Calendar</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Operation scheduling and appointment management.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'hsl(var(--secondary) / 0.5)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}><ChevronLeft size={20} /></button>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, minWidth: '120px', textAlign: 'center' }}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}><ChevronRight size={20} /></button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const numDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Blank days for start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`blank-${i}`} style={{ padding: '1rem', background: 'transparent' }}></div>);
        }

        for (let d = 1; d <= numDays; d++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayOps = patients.filter(p => p.surgeryDate === dateStr);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
            const isSelected = selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();

            days.push(
                <div
                    key={d}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))}
                    className="premium-glass"
                    style={{
                        padding: '0.75rem',
                        minHeight: '120px',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid hsl(var(--primary))' : isToday ? '1px solid hsl(var(--primary) / 0.5)' : '1px solid hsl(var(--border))',
                        background: isSelected ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--background) / 0.5)',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: isToday ? 'hsl(var(--primary))' : 'white'
                        }}>{d}</span>
                        {dayOps.length > 0 && (
                            <span style={{ fontSize: '0.75rem', height: '18px', padding: '0 0.5rem', background: 'hsl(var(--primary))', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                {dayOps.length}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {dayOps.map(op => (
                            <div key={op.id} style={{
                                fontSize: '0.65rem',
                                padding: '0.25rem 0.5rem',
                                background: 'hsl(var(--secondary) / 0.8)',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: 'white',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                <Clock size={8} /> {op.surgeryTime} {op.lastName}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {weekDays.map(wd => (
                    <div key={wd} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                        {wd}
                    </div>
                ))}
                {days}
            </div>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {renderHeader()}
            <div style={{ flex: 1 }}>
                {renderDays()}
            </div>

            {selectedDate && (
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'hsl(var(--primary) / 0.05)',
                    borderRadius: '16px',
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                            {selectedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                            {patients.filter(p => p.surgeryDate === selectedDate.toISOString().split('T')[0]).length} operations scheduled for this date.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        style={{ padding: '0.75rem 1.5rem', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Add New Appointment
                    </button>
                </div>
            )}

            <AddAppointmentModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={onUpdatePatient}
                patients={patients}
                currentUser={currentUser}
                initialDate={selectedDate || undefined}
            />
        </div>
    );
};

export default CalendarPage;
