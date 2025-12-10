import { FormData, Submission } from '../types';
import { SURVEY_SECTIONS } from '../constants';
import { db } from './firebase';
import { collection, addDoc, getDocs, orderBy, query, onSnapshot, Unsubscribe } from 'firebase/firestore';

const COLLECTION_NAME = 'submissions';

export const saveSubmission = async (data: FormData): Promise<void> => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      submittedAt: new Date().toISOString(),
      data
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    throw error;
  }
};

// Kept for reference, but subscribeToSubmissions is preferred for the UI
export const getSubmissions = async (): Promise<Submission[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Submission[];
  } catch (error) {
    console.error("Error getting submissions:", error);
    return [];
  }
};

// New real-time listener
export const subscribeToSubmissions = (callback: (data: Submission[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("submittedAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Submission[];
    callback(submissions);
  }, (error) => {
    console.error("Error subscribing to submissions:", error);
  });
};

export const exportToCSV = (submissions: Submission[]) => {
  // Get all unique question IDs
  const questions: {id: string, text: string}[] = [];
  SURVEY_SECTIONS.forEach(section => {
    section.questions.forEach(q => {
      questions.push({ id: q.id, text: q.text });
    });
  });

  // Create Header Row
  const headers = ['Submission ID', 'Date', ...questions.map(q => q.text)];
  
  // Create Data Rows
  const rows = submissions.map(sub => {
    const date = new Date(sub.submittedAt).toLocaleString();
    const answers = questions.map(q => {
      const val = sub.data[q.id];
      if (Array.isArray(val)) return `"${val.join(', ')}"`; // Escape commas in arrays
      if (val) return `"${val.toString().replace(/"/g, '""')}"`; // Escape quotes
      return '';
    });
    return [sub.id, date, ...answers];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `flash_survey_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};