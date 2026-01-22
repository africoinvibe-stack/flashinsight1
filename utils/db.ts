import { FormData, Submission } from '../types';
import { SURVEY_SECTIONS } from '../constants';
import { supabase } from './supabase';

const TABLE_NAME = 'submissions';

export interface DbResult {
  data: Submission[];
  error?: {
    code: string;
    message: string;
  } | null;
}

export const saveSubmission = async (data: FormData): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert([{ data }]);

  if (error) {
    console.error("Error saving submission:", error);
    throw error;
  }
};

export const getSubmissions = async (): Promise<DbResult> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Database query failed:", error);
    return { 
      data: [], 
      error: { code: error.code, message: error.message } 
    };
  }

  const submissions = (data || []).map(item => ({
    id: item.id,
    submittedAt: item.created_at,
    data: item.data
  }));

  return { data: submissions, error: null };
};

export const subscribeToSubmissions = (callback: (result: DbResult) => void) => {
  getSubmissions().then(callback);

  const channel = supabase
    .channel('submissions_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      async () => {
        const result = await getSubmissions();
        callback(result);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const exportToCSV = (submissions: Submission[]) => {
  const questions: {id: string, text: string}[] = [];
  SURVEY_SECTIONS.forEach(section => {
    section.questions.forEach(q => {
      questions.push({ id: q.id, text: q.text });
    });
  });

  const headers = ['Submission ID', 'Date', ...questions.map(q => q.text)];
  
  const rows = submissions.map(sub => {
    const date = new Date(sub.submittedAt).toLocaleString();
    const answers = questions.map(q => {
      const val = sub.data[q.id];
      if (Array.isArray(val)) return `"${val.join(', ')}"`;
      if (val) return `"${val.toString().replace(/"/g, '""')}"`;
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