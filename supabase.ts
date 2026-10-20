import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  // Don't throw here: throwing during module import happens before React
  // ever calls render(), so the whole app fails to mount and the page is
  // blank with no visible error. Warn instead and fail at call time.
  console.warn(
    'Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    'Supabase calls will fail until these are set in your deployment environment.'
  );
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
);

export type ApplicationInsert = {
  full_name: string;
  phone: string;
  email?: string | null;
  loan_amount: number;
  loan_purpose?: string | null;
};

export type ApplicationRow = { id: string };

export async function submitApplication(
  data: ApplicationInsert
): Promise<ApplicationRow> {
  if (!supabaseConfigured) {
    throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }

  const { data: row, error } = await supabase
    .from('applications')
    .insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email ?? null,
      loan_amount: data.loan_amount,
      loan_purpose: data.loan_purpose ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  if (!row) throw new Error('No row returned from insert.');
  return row as ApplicationRow;
}

export async function notifyNewApplication(applicationId: string): Promise<void> {
  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-telegram`;
  const res = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ applicationId }),
  });
  if (!res.ok) {
    throw new Error(`Notification failed (${res.status})`);
  }
}
