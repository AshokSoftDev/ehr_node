/**
 * Terminal test script for SOAP Notes generation
 * Run: npx ts-node src/modules/ai/soapNotes.test.ts
 */
import 'dotenv/config';
import { generateSoapNotes } from './soapNotes.service';
 
// Sample transcription for testing
const sampleTranscription = `
Patient John Doe, 45 years old male, presents with chest pain for 3 days.
Pain is described as squeezing, radiating to left arm, worse on exertion.
History of hypertension for 5 years and type 2 diabetes for 3 years.
Currently taking Metformin 500mg twice daily and Amlodipine 5mg once daily.
No known drug allergies. Non-smoker, occasional alcohol use.
Father had MI at age 55.

Vitals: Blood pressure 150/90 mmHg, pulse 88 bpm, temperature 98.4°F, SpO2 97%.
Physical examination reveals normal heart sounds, no murmurs.
ECG shows normal sinus rhythm with no ST changes.
Troponin negative.

Assessment: Suspected stable angina, rule out acute coronary syndrome.
Differential includes GERD, musculoskeletal pain.

Plan: Start Aspirin 75mg once daily, Tab Sorbitrate 5mg SOS for chest pain.
Advice stress test next week. Refer to cardiology for further evaluation.
Continue current medications. Low salt diet advised.
Follow up in 1 week or earlier if symptoms worsen.
`;

async function main() {
  console.log('========================================');
  console.log('  SOAP Notes Generation Test');
  console.log('========================================\n');
  
  console.log('Processing transcription...\n');
  
  const result = await generateSoapNotes(sampleTranscription);
  
  console.log('Result:');
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n========================================');
  if (result.error) {
    console.log('❌ Test completed with error:', result.error);
  } else {
    console.log('✅ Test completed successfully!');
    console.log(`   - SOAP Notes generated: ${result.soap_notes ? 'Yes' : 'No'}`);
    console.log(`   - Prescriptions found: ${result.prescription.length}`);
    if (result.prescription.length > 0) {
      console.log('   - Drugs:', result.prescription.join(', '));
    }
  }
  console.log('========================================\n');
}

main().catch(console.error);
