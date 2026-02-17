import { Patient, Clinic, User } from '../types';

export const MOCK_CLINICS: Clinic[] = [
    { id: 'c1', name: 'Capilar Max Miami', city: 'Miami' },
    { id: 'c2', name: 'Capilar Max New York', city: 'New York' },
    { id: 'c3', name: 'Capilar Max Boston', city: 'Boston' },
];

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Zeynep Williams', role: 'super-admin', isAllClinics: true },
    { id: 'u2', name: 'Mark Can', role: 'admin', clinicIds: ['c1'] },
    { id: 'u3', name: 'Ashley Stone', role: 'manager', clinicIds: ['c1', 'c2'] },
    { id: 'u4', name: 'Emily Miller', role: 'specialist', clinicIds: ['c1'] },
    { id: 'u5', name: 'Oliver Shaw', role: 'admin', clinicIds: ['c2'] },
];

export const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        clinicId: 'c1',
        firstName: 'Adam',
        lastName: 'Yilmaz',
        email: 'adam@example.com',
        phone: '0532 000 00 00',
        birthDate: '1985-05-20',
        surgeryDate: '2026-02-15',
        surgeryTime: '09:00',
        status: 'scheduled',
        graftCount: 3500,
        photos: [
            { id: 'a1', type: 'pre-op', date: '2026-02-10', urls: ['https://images.unsplash.com/photo-1590439471364-192aa70c0c53', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'] },
            { id: 'a2', type: 'intra-op', date: '2026-02-15', urls: ['https://images.unsplash.com/photo-1576091160550-217359f42f8c'] },
            { id: 'a3', type: 'post-op', date: '2026-02-15', urls: ['https://images.unsplash.com/photo-1605918321755-97520e2e92c5'] }
        ],
        documents: [
            { id: 'd1', name: 'Consent Form', type: 'consent', uploadDate: '2026-02-10', url: '#', signed: false }
        ]
    },
    {
        id: '2',
        clinicId: 'c1',
        firstName: 'Matthew',
        lastName: 'Kaya',
        email: 'matthew@example.com',
        phone: '0533 111 22 33',
        birthDate: '1990-10-12',
        status: 'post-op',
        graftCount: 4200,
        surgeryDate: '2026-01-20',
        hepatitisC: true,
        photos: [
            { id: 'a4', type: 'pre-op', date: '2026-01-15', urls: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2'] },
            { id: 'a5', type: 'post-op', date: '2026-01-20', urls: ['https://images.unsplash.com/photo-1552374196-c4e7ffc6e1c2'] }
        ],
        documents: [
            { id: 'd2', name: 'Operation Report', type: 'lab-results', uploadDate: '2026-01-20', url: '#', signed: true }
        ]
    },
    {
        id: '3',
        clinicId: 'c2',
        firstName: 'Alice',
        lastName: 'Demir',
        email: 'alice@example.com',
        phone: '0535 999 88 77',
        birthDate: '1988-03-15',
        status: 'pending',
        photos: [],
        documents: []
    }
];
