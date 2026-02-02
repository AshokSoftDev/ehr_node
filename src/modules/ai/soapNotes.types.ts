/**
 * SOAP Notes Types
 * Optimized for US & Indian market doctors
 */

export interface SOAPNotes {
  subjective: {
    chief_complaint: string;
    history_of_present_illness: string;
    past_medical_history?: string;
    medications?: string;
    allergies?: string;
    social_history?: string;
    family_history?: string;
    review_of_systems?: string;
  };
  objective: {
    vital_signs?: {
      blood_pressure?: string;
      pulse?: string;
      temperature?: string;
      respiratory_rate?: string;
      spo2?: string;
      weight?: string;
      height?: string;
    };
    physical_examination?: string;
    investigations?: string;
  };
  assessment: {
    primary_diagnosis: string;
    differential_diagnosis?: string[];
    icd_codes?: string[];
  };
  plan: {
    treatment_plan: string;
    follow_up?: string;
    referrals?: string;
    patient_education?: string;
  };
}

export interface SOAPNotesResult {
  soap_notes: SOAPNotes | null;
  prescription: string[];  // Only drug names list
  error: string | null;
}
