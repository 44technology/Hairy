import { jsPDF } from 'jspdf';

export const generateConsentPDF = (patientName: string, data: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CAPILAR MAX', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text('CONSENT & AGREEMENT FORM', pageWidth / 2, 30, { align: 'center' });

    // Patient Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 20, 45);
    doc.text(`Patient Name: ${patientName}`, 20, 52);
    doc.text(`Clinic Representative: ${data.representativeName || 'N/A'}`, 20, 59);

    // Sections Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Agreement Sections Initialed:', 20, 75);

    let y = 85;
    const initialLabels: Record<string, string> = {
        B: 'Operation Informed Consent',
        C: 'Anesthesia & Medication',
        D: 'No Guarantee Disclaimer',
        E: 'Post-Op Care Responsibility',
        F: 'Financial Agreement',
        G: 'Photo/Video Consent',
        H: 'HIPAA Authorization'
    };

    Object.entries(data.initials).forEach(([key, value]) => {
        if (value && initialLabels[key]) {
            doc.text(`[YES] ${initialLabels[key]}`, 25, y);
            y += 7;
        }
    });

    // Marketing Consent
    y += 5;
    doc.text(`Marketing Consent: ${data.marketingConsent ? 'YES' : 'NO'}`, 20, y);

    // Signatures
    y += 20;
    doc.text('Signatures:', 20, y);
    y += 10;

    if (data.patientSignature) {
        doc.text('Patient Signature:', 20, y);
        doc.addImage(data.patientSignature, 'PNG', 20, y + 5, 50, 20);
    }

    if (data.representativeSignature) {
        doc.text('Representative Signature:', 120, y);
        doc.addImage(data.representativeSignature, 'PNG', 120, y + 5, 50, 20);
    }

    // Save the PDF
    doc.save(`Consent_${patientName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
