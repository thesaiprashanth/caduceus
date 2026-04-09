import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/Logo.jpeg';
import image from '../Assets/image.png';

// ─── Google Logo SVG ───────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
            />
            <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
            />
            <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
            />
            <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
            />
        </svg>
    );
}

// ─── Main Login Component ─────────────────────────────────────────────────────
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    // Redirect if already logged in
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u: User | null) => {
            if (u) navigate('/');
        });
        return () => unsub();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message || 'Google sign-in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsEmailLoading(true);
        setError(null);
        try {
            if (mode === 'signup') {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/');
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message || (mode === 'signup' ? 'Sign up failed. Please try again.' : 'Invalid credentials. Please try again.'));
        } finally {
            setIsEmailLoading(false);
        }
    };

    return (
        <div
            className="h-screen w-full overflow-hidden flex font-sans antialiased"
            style={{ background: '#0A0A0F', color: 'white' }}
        >
            {/* ── LEFT PANEL ── */}
            <div className="flex-1 flex flex-col justify-center items-center px-8 relative z-10 h-full">

                {/* Login Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-md relative p-8 sm:p-10 rounded-[2rem]"
                    style={{
                        background: '#0B0F19', // Slightly distinct dark tone for the card
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* Logo + Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div
                            className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                            style={{ boxShadow: '0 0 0 1px rgba(139,92,246,0.3)' }}
                        >
                            <img src={logo} alt="CADUCEUS logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="text-white">CADUCEUS</span>
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
                        {mode === 'login' ? 'Log in to CADUCEUS' : 'Create your account'}
                    </h1>
                    <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        AI-powered Instagram profile intelligence for businesses.
                    </p>

                    {/* Google Button */}
                    <motion.button
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        id="google-signin-btn"
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'white',
                        }}
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <GoogleIcon />
                                Continue with Google
                            </>
                        )}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            or
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Email / Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        {/* Email Field */}
                        <div className="relative">
                            <div
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                            >
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                id="email-input"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    color: 'white',
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(139,92,246,0.6)';
                                    e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                            >
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    color: 'white',
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(139,92,246,0.6)';
                                    e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-xs px-3 py-2 rounded-lg"
                                    style={{
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        color: '#f87171',
                                    }}
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Log In Button */}
                        <motion.button
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            type="submit"
                            id="login-btn"
                            disabled={isEmailLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 mt-4"
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                                color: 'white',
                                boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
                            }}
                        >
                            {isEmailLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Log In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Utility Links */}
                    <div className="mt-6 flex flex-col items-center gap-3">
                        <a
                            href="#"
                            id="forgot-password-link"
                            className="text-xs transition-colors"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(167,139,250,0.9)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                        >
                            Forgot password?
                        </a>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                id="toggle-mode-btn"
                                type="button"
                                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                                className="font-semibold transition-colors"
                                style={{ color: '#a78bfa' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4b5fd')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#a78bfa')}
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── DIVIDER ── */}
            <div
                className="hidden lg:block w-px self-stretch my-8"
                style={{ background: 'rgba(255,255,255,0.06)' }}
            />

            {/* ── RIGHT PANEL ── */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-10 relative overflow-hidden h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-md h-full max-h-[80vh] relative z-10 flex justify-center items-center"
                >
                    <img
                        src={image}
                        alt="Preview"
                        className="w-full max-h-full rounded-3xl object-contain"
                        style={{
                            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}