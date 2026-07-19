import React, { useState } from 'react';
import { Lock, Mail, Shield, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { Modal } from '../ui/Modal.tsx';
import { MegaMendungPattern } from '../ui/MegaMendungPattern.tsx';
import { KujangLogo } from '../ui/KujangLogo.tsx';

export function LoginPage() {
  const { login, error: authError, clearError } = useAuth();
  const { navigateTo } = useNavigationStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'GOVERNMENT' | 'ADMIN'>('GOVERNMENT');
  const [localError, setLocalError] = useState<string | null>(null);

  // OTP Verification Modal states
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email) {
      setLocalError('Alamat email wajib diisi.');
      return;
    }

    if (!email.endsWith('.go.id') && !email.endsWith('.gov')) {
      setLocalError('Kesalahan GOV-ID: Domain email harus berupa akun pemerintah resmi berakhiran .go.id atau .gov.');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }

    // Passwords and emails validated, open OTP Modal
    setIsOtpOpen(true);
  };

  const handleOtpValueChange = (index: number, val: string) => {
    if (val.length > 1) return; // Only single-digit entries
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input index if populated
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpVerify = async () => {
    setOtpError(null);
    const enteredCode = otpCode.join('');

    if (enteredCode.length < 6) {
      setOtpError('Harap masukkan seluruh 6 digit kode keamanan OTP.');
      return;
    }

    // Mock successful OTP verification
    const success = await login(email, role, role === 'ADMIN' ? 'Petugas Admin' : 'Perencana Pemerintah');

    if (success) {
      setIsOtpOpen(false);
      navigateTo('dashboard');
    } else {
      setOtpError('Kode OTP tidak valid atau token sesi telah kedaluwarsa.');
    }
  };

  return (
    <div className="space-y-6 relative rounded-md p-6 sm:p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <MegaMendungPattern className="text-blue-500 opacity-[0.03] dark:opacity-[0.02]" />
      <div className="relative z-10 space-y-6">
        <div className="space-y-2 flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-900">
          <div className="h-12 w-12 rounded-sm bg-blue-600/10 border border-kujang-gold/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(197,150,42,0.15)]">
            <KujangLogo size={28} className="text-[#C5962A]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 uppercase">
            Sistem Kredensial Tatar Sunda
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Masukkan kredensial resmi Pemerintah Daerah Provinsi Jawa Barat Anda.
          </p>
        </div>

      {(localError || authError) && (
        <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 rounded-sm text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Kesalahan Otorisasi</span>
          </div>
          <p className="font-mono text-[11px] leading-relaxed">
            {localError || authError}
          </p>
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Alamat Email Resmi
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: bappeda_officer@jabarprov.go.id"
              className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-1 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Kata Sandi Sistem
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-9 rounded-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-1 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Role Segment Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Grup Peran Izin Akses
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('GOVERNMENT')}
              className={`py-2 text-xs font-semibold rounded-sm border transition-colors ${
                role === 'GOVERNMENT'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/30'
              }`}
            >
              Pengguna Pemerintah
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`py-2 text-xs font-semibold rounded-sm border transition-colors ${
                role === 'ADMIN'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/30'
              }`}
            >
              Administrator Sistem
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-10 flex items-center justify-center gap-2 bg-[#C5962A] hover:bg-[#8B6508] text-white text-xs font-bold rounded-sm transition-colors mt-6 shadow-sm uppercase tracking-wide"
        >
          <Shield className="h-4 w-4" />
          Ajukan Masuk Gov-ID Aman
        </button>
      </form>
      </div>

      {/* OTP Verification Modal Layer */}
      <Modal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        title="Verifikasi Multi-Faktor SMS-OTP GOV-ID"
        footer={
          <div className="flex gap-2.5">
            <button
              onClick={() => setIsOtpOpen(false)}
              className="px-3.5 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Batal Masuk
            </button>
            <button
              onClick={handleOtpVerify}
              className="px-4 py-1.5 rounded-sm bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors"
            >
              Verifikasi Kode OTP
            </button>
          </div>
        }
      >
        <div className="space-y-6 text-center py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 mx-auto">
            <Key className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
              Kode Verifikasi 2FA yang Diaudit
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Kode keamanan 6 digit telah dikirimkan ke perangkat seluler resmi Anda. 
              Masukkan kode di bawah ini untuk menyelesaikan log otorisasi.
            </p>
          </div>

          {otpError && (
            <p className="text-[11px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-sm border border-rose-100 dark:border-rose-900">
              {otpError}
            </p>
          )}

          {/* OTP Code Input Slots */}
          <div className="flex justify-center gap-2 items-center">
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpValueChange(idx, e.target.value)}
                className="w-10 h-12 text-center text-lg font-bold font-mono border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <p className="text-[10px] text-slate-400">
            Waktu kedaluwarsa kode SMS: <strong className="text-slate-600 dark:text-slate-300">59 detik</strong>
          </p>
        </div>
      </Modal>
    </div>
  );
}
