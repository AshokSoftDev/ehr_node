import { ChatGroq } from '@langchain/groq';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { SOAPNotesResult, SOAPNotes } from './soapNotes.types';

interface LLMOutput {
  soap_notes: SOAPNotes;
  prescription: string[];
}

const SYSTEM_PROMPT = `You are a medical documentation assistant. Extract structured SOAP notes and prescriptions from the given transcription.

Return a JSON object with the following structure:
{{
  "soap_notes": {{
    "subjective": {{
      "chief_complaint": "Main reason for visit (required)",
      "history_of_present_illness": "Details of current condition (required)",
      "past_medical_history": "Previous medical conditions (optional)",
      "medications": "Current medications (optional)",
      "allergies": "Known allergies (optional)",
      "social_history": "Social factors (optional)",
      "family_history": "Family medical history (optional)",
      "review_of_systems": "Systems review (optional)"
    }},
    "objective": {{
      "vital_signs": {{
        "blood_pressure": "e.g., 120/80 mmHg",
        "pulse": "e.g., 72 bpm",
        "temperature": "e.g., 98.6°F",
        "respiratory_rate": "e.g., 16/min",
        "spo2": "e.g., 98%",
        "weight": "e.g., 70 kg",
        "height": "e.g., 175 cm"
      }},
      "physical_examination": "Findings from physical exam",
      "investigations": "Lab results, imaging, etc."
    }},
    "assessment": {{
      "primary_diagnosis": "Main diagnosis (required)",
      "differential_diagnosis": ["Other possible diagnoses"],
      "icd_codes": ["ICD-10 codes if identifiable"]
    }},
    "plan": {{
      "treatment_plan": "Treatment approach (required)",
      "follow_up": "Follow-up instructions",
      "referrals": "Specialist referrals if any",
      "patient_education": "Patient instructions"
    }}
  }},
  "prescription": ["drug_name1", "drug_name2"]
}}

Rules:
1. Extract all drug names mentioned as prescriptions into the "prescription" array
2. If no prescriptions are mentioned, return an empty array for "prescription"
3. Include only the drug name in the prescription array (e.g., "Aspirin 75mg", "Metformin 500mg")
4. Use null for optional fields if information is not available
5. Always provide chief_complaint, primary_diagnosis, and treatment_plan
6. Format for US and Indian medical documentation standards`;

/**
 * Generate SOAP notes and extract prescriptions from a transcription
 * @param transcription - The medical consultation transcription text
 * @returns SOAPNotesResult with soap_notes, prescription list, and error
 */
export async function generateSoapNotes(transcription: string): Promise<SOAPNotesResult> {
  // Check for API key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      soap_notes: null,
      prescription: [],
      error: 'GROQ_API_KEY is not set in environment variables',
    };
  }

  // Validate input
  if (!transcription || transcription.trim().length === 0) {
    return {
      soap_notes: null,
      prescription: [],
      error: 'Transcription is empty or invalid',
    };
  }

  try {
    // Initialize Groq LLM
    const llm = new ChatGroq({
      apiKey,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
    });

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_PROMPT],
      ['human', 'Extract SOAP notes and prescriptions from the following transcription:\n\n{transcription}'],
    ]);

    // Create JSON output parser
    const parser = new JsonOutputParser<LLMOutput>();

    // Create chain
    const chain = prompt.pipe(llm).pipe(parser);

    // Execute chain
    const result = await chain.invoke({ transcription });

    return {
      soap_notes: result.soap_notes,
      prescription: result.prescription || [],
      error: null,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      soap_notes: null,
      prescription: [],
      error: errorMessage,
    };
  }
}
