import { FormData, Submission } from '../types';
import { SURVEY_SECTIONS } from '../constants';
import { supabase } from './supabase';

const SUBMISSIONS_TABLE = 'submissions';
const WAITLIST_TABLE = 'waitlist';

export interface DbResult<T> {
  data: T[];
  error?: {
    code: string;
    message: string;
  } | null;
}

export interface WaitlistEntry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
}

export const saveSubmission = async (data: FormData): Promise<void> => {
  const { error } = await supabase
    .from(SUBMISSIONS_TABLE)
    .insert([{ data }]);

  if (error) {
    console.error("Error saving submission:", error);
    throw error;
  }
};

export const saveWaitlistEntry = async (entry: { name: string; email: string; whatsapp: string }): Promise<void> => {
  const { error } = await supabase
    .from(WAITLIST_TABLE)
    .insert([entry]);

  if (error) {
    console.error("Error saving waitlist entry:", error);
    throw error;
  }
};

export const getSubmissions = async (): Promise<DbResult<Submission>> => {
  const { data, error } = await supabase
    .from(SUBMISSIONS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: { code: error.code, message: error.message } };
  }

  const submissions = (data || []).map(item => ({
    id: item.id,
    submittedAt: item.created_at,
    data: item.data
  }));

  return { data: submissions, error: null };
};

export const getWaitlist = async (): Promise<DbResult<WaitlistEntry>> => {
  const { data, error } = await supabase
    .from(WAITLIST_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: { code: error.code, message: error.message } };
  }

  return { data: data || [], error: null };
};

export const subscribeToData = (table: 'submissions' | 'waitlist', callback: (result: DbResult<any>) => void) => {
  const fetcher = table === 'submissions' ? getSubmissions : getWaitlist;
  
  fetcher().then(callback);

  const channel = supabase
    .channel(`${table}_realtime`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: table },
      async () => {
        const result = await fetcher();
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

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(csvContent, 'flash_survey_export');
};

export const exportWaitlistToCSV = (entries: WaitlistEntry[]) => {
  const headers = ['ID', 'Date', 'Name', 'Email', 'WhatsApp'];
  const rows = entries.map(e => [
    e.id, 
    new Date(e.created_at).toLocaleString(), 
    `"${e.name}"`, 
    e.email, 
    e.whatsapp
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(csvContent, 'flash_waitlist_export');
};

const downloadCSV = (content: string, prefix: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${prefix}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};