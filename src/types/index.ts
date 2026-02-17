export interface Clinic {
    id: string;
    name: string;
    city: string;
}

export type UserRole = 'super-admin' | 'admin' | 'manager' | 'specialist';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    clinicIds?: string[]; // Multiple clinic support
    isAllClinics?: boolean; // Flag for access to all clinics
}

export interface VitalSign {
    type: 'bp' | 'glucose';
    systolic?: number;
    diastolic?: number;
    glucose?: number;
    unit: string;
    timestamp: string;
    notes?: string;
}

export interface ConsentRecord {
    id: string;
    date: string;
    patientSignature: string;
    representativeSignature: string;
    representativeName: string;
    initials: Record<string, boolean>; // sectionId -> initialed
    fullVersion: string;
}

export interface OperationNote {
    id: string;
    author: string;
    date: string;
    content: string;
}

export interface Patient {
    id: string;
    clinicId: string; // Every patient belongs to a clinic
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    surgeryDate?: string;
    surgeryTime?: string;
    status: 'pending' | 'scheduled' | 'post-op' | 'completed';
    graftCount?: number;
    medicalHistory?: string;
    medications?: string;
    allergies?: string;
    hepatitisB?: boolean;
    hepatitisC?: boolean;
    hiv?: boolean;
    vitals?: VitalSign[];
    notes?: string;
    photos: PhotoAlbum[];
    documents: Document[];
    consent?: ConsentRecord;
    isConsentSigned?: boolean;
    operationNotes?: OperationNote[];
}

export interface PhotoAlbum {
    id: string;
    type: 'pre-op' | 'intra-op' | 'post-op' | 'follow-up';
    date: string;
    urls: string[];
}

export interface Document {
    id: string;
    name: string;
    type: 'consent' | 'medical-history' | 'lab-results';
    uploadDate: string;
    url: string;
    signed?: boolean;
}
