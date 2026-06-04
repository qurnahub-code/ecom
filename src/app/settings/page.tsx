"use client"

import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"
import { 
  Moon, Sun, Monitor, LogOut, User, Bell, Shield, 
  Globe, CreditCard, Trash2, Save, Smartphone, Mail, Lock, X, CheckCircle, Loader2, QrCode
} from "lucide-react"
import { useEffect, useState } from "react"
// Ensure you have this file created as per the previous step
import { verifyCurrentPassword, sendVerificationCode, updatePassword, generate2FASecret, enable2FA } from "@/app/actions/security"

// --- HELPER: TOGGLE SWITCH ---
function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'}`}
      >
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
      </button>
    </div>
  )
}

// --- HELPER: MODAL CONTAINER ---
function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500"><X className="w-5 h-5"/></button>
                {children}
            </div>
        </div>
    )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  // --- 1. SETTINGS STATE ---
  const [profile, setProfile] = useState({ name: "Abu Sufyan", email: "user@example.com", bio: "Tech Enthusiast" })
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: false, security: true })
  const [preferences, setPreferences] = useState({ currency: "USD", language: "English" })

  // --- 2. SECURITY MODAL STATE ---
  const [activeModal, setActiveModal] = useState<'password' | '2fa' | null>(null)
  const [pwStep, setPwStep] = useState<'verify_current' | 'verify_email' | 'new_password' | 'success'>('verify_current')
  const [twoFaStep, setTwoFaStep] = useState<'intro' | 'setup' | 'success'>('intro')
  const [twoFaSecret, setTwoFaSecret] = useState<string>("")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false) // In real app, fetch from DB

  // --- 3. FORM INPUTS ---
  const [inputs, setInputs] = useState({ currentPw: "", emailCode: "", newPw: "", confirmPw: "", twoFaCode: "" })
  const [error, setError] = useState("")

  useEffect(() => { setMounted(true) }, [])

  // --- HANDLERS: PROFILE ---
  const handleSaveProfile = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); alert("Profile updated!") }, 1000)
  }

  // --- HANDLERS: SECURITY (PASSWORD) ---
  const handleVerifyCurrentPw = async () => {
      setLoading(true); setError("")
      const res = await verifyCurrentPassword(inputs.currentPw)
      setLoading(false)
      if (res.success) setPwStep('new_password')
      else setError("Incorrect password.")
  }

  const handleForgotPassword = async () => {
      setLoading(true); setError("")
      const res = await sendVerificationCode(profile.email)
      setLoading(false)
      if (res.success) setPwStep('verify_email')
      else setError("Could not send email.")
  }

  const handleVerifyEmailCode = () => {
      if (inputs.emailCode === '123456') setPwStep('new_password')
      else setError("Invalid code. Try 123456.")
  }

  const handleUpdatePassword = async () => {
      if (inputs.newPw !== inputs.confirmPw) return setError("Passwords do not match")
      setLoading(true); setError("")
      const res = await updatePassword(inputs.newPw)
      setLoading(false)
      if (res.success) setPwStep('success')
  }

  // --- HANDLERS: SECURITY (2FA) ---
  const handleStart2FA = async () => {
      setLoading(true)
      const res = await generate2FASecret()
      setLoading(false)
      if (res.success && res.secret) {
          setTwoFaSecret(res.secret)
          setTwoFaStep('setup')
      }
  }

  const handleVerify2FA = async () => {
      setLoading(true); setError("")
      const res = await enable2FA(inputs.twoFaCode)
      setLoading(false)
      if (res.success) {
          setIs2FAEnabled(true)
          setTwoFaStep('success')
      } else {
          setError("Invalid Authenticator Code")
      }
  }

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Manage your account preferences and security.</p>
        </div>

        {/* 1. APPEARANCE */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Sun className="w-5 h-5 text-indigo-500" /> Appearance</h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
             {['light', 'dark', 'system'].map((mode) => (
                <button key={mode} onClick={() => setTheme(mode)} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === mode ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-500'}`}>
                    {mode === 'light' && <Sun className="w-6 h-6 mb-2" />}
                    {mode === 'dark' && <Moon className="w-6 h-6 mb-2" />}
                    {mode === 'system' && <Monitor className="w-6 h-6 mb-2" />}
                    <span className="text-sm font-bold capitalize">{mode}</span>
                </button>
             ))}
          </div>
        </section>

        {/* 2. PROFILE */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Display Name</label>
                    <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                    <input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Bio</label>
                <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
          </div>
        </section>

        {/* 3. NOTIFICATIONS */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-500" /> Notifications</h2>
            </div>
            <div className="p-6 divide-y divide-gray-100 dark:divide-white/5">
                <Toggle label="Order Updates (Email)" checked={notifications.orderUpdates} onChange={(v) => setNotifications({...notifications, orderUpdates: v})} />
                <Toggle label="Marketing & Promotions" checked={notifications.promotions} onChange={(v) => setNotifications({...notifications, promotions: v})} />
                <Toggle label="Security Alerts" checked={notifications.security} onChange={(v) => setNotifications({...notifications, security: v})} />
            </div>
        </section>

        {/* 4. REGIONAL */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> Language & Region</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Language</label>
                    <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>English</option><option>Spanish</option><option>French</option><option>Chinese</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Currency</label>
                    <select value={preferences.currency} onChange={(e) => setPreferences({...preferences, currency: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option><option>PKR (₨)</option>
                    </select>
                </div>
            </div>
        </section>

        {/* 5. SECURITY (UPDATED WITH LOGIC) */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500" /> Security</h2>
            </div>
            <div className="p-6 space-y-4">
                {/* Change Password Trigger */}
                <button 
                    onClick={() => { setActiveModal('password'); setPwStep('verify_current'); setInputs({...inputs, currentPw: ""}); setError("") }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left border border-gray-200 dark:border-white/5"
                >
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <div><p className="font-bold text-sm text-gray-900 dark:text-white">Change Password</p><p className="text-xs text-gray-500">Secure your account</p></div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Update</span>
                </button>

                {/* 2FA Trigger */}
                <button 
                    onClick={() => { setActiveModal('2fa'); setTwoFaStep('intro'); setError("") }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left border border-gray-200 dark:border-white/5"
                >
                    <div className="flex items-center gap-3">
                        <Smartphone className={`w-5 h-5 ${is2FAEnabled ? "text-green-500" : "text-gray-500"}`} />
                        <div><p className="font-bold text-sm text-gray-900 dark:text-white">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security</p></div>
                    </div>
                    <span className={`text-xs font-bold ${is2FAEnabled ? "text-green-500" : "text-gray-400"}`}>{is2FAEnabled ? "Enabled" : "Disabled"}</span>
                </button>
            </div>
            
            {/* Danger Zone */}
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20">
                 <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                 <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-4">Permanently delete your account and all of your content.</p>
                 <div className="flex gap-4">
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"><LogOut className="w-4 h-4" /> Sign Out</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"><Trash2 className="w-4 h-4" /> Delete Account</button>
                 </div>
            </div>
        </section>

      </div>

      {/* --- MODAL: CHANGE PASSWORD --- */}
      {activeModal === 'password' && (
          <Modal onClose={() => setActiveModal(null)}>
              {/* Step 1: Verify Current */}
              {pwStep === 'verify_current' && (
                  <div className="space-y-4">
                      <div className="text-center">
                          <Lock className="w-10 h-10 mx-auto text-indigo-500 mb-3" />
                          <h3 className="text-xl font-bold dark:text-white">Verify it's you</h3>
                          <p className="text-sm text-gray-500">Enter current password to continue.</p>
                      </div>
                      <input type="password" className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl outline-none border focus:border-indigo-500 dark:border-white/10 dark:text-white" placeholder="Current Password" value={inputs.currentPw} onChange={(e) => setInputs({...inputs, currentPw: e.target.value})} />
                      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                      <button onClick={handleVerifyCurrentPw} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? "Verifying..." : "Continue"}</button>
                      <button onClick={handleForgotPassword} className="w-full text-sm text-gray-500 hover:text-indigo-500">Forgot Password? Verify via Email</button>
                  </div>
              )}
              {/* Step 2: Verify Email Code */}
              {pwStep === 'verify_email' && (
                  <div className="space-y-4">
                      <div className="text-center">
                          <Mail className="w-10 h-10 mx-auto text-indigo-500 mb-3" />
                          <h3 className="text-xl font-bold dark:text-white">Check your Email</h3>
                          <p className="text-sm text-gray-500">We sent a code to {profile.email}</p>
                      </div>
                      <input className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl outline-none border focus:border-indigo-500 dark:border-white/10 dark:text-white text-center tracking-widest text-lg" placeholder="123456" maxLength={6} value={inputs.emailCode} onChange={(e) => setInputs({...inputs, emailCode: e.target.value})} />
                      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                      <button onClick={handleVerifyEmailCode} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Verify Code</button>
                  </div>
              )}
              {/* Step 3: New Password */}
              {pwStep === 'new_password' && (
                  <div className="space-y-4">
                      <h3 className="text-xl font-bold text-center dark:text-white">Set New Password</h3>
                      <input type="password" className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl outline-none border dark:border-white/10 dark:text-white" placeholder="New Password" value={inputs.newPw} onChange={(e) => setInputs({...inputs, newPw: e.target.value})} />
                      <input type="password" className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl outline-none border dark:border-white/10 dark:text-white" placeholder="Confirm Password" value={inputs.confirmPw} onChange={(e) => setInputs({...inputs, confirmPw: e.target.value})} />
                      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                      <button onClick={handleUpdatePassword} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? "Updating..." : "Update Password"}</button>
                  </div>
              )}
              {/* Step 4: Success */}
              {pwStep === 'success' && (
                  <div className="text-center space-y-4 py-6">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600"><CheckCircle className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold dark:text-white">Password Updated!</h3>
                      <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-gray-200 dark:bg-zinc-800 rounded-lg font-bold">Close</button>
                  </div>
              )}
          </Modal>
      )}

      {/* --- MODAL: 2FA SETUP --- */}
      {activeModal === '2fa' && (
          <Modal onClose={() => setActiveModal(null)}>
              {/* Step 1: Intro */}
              {twoFaStep === 'intro' && (
                  <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-600"><QrCode className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold dark:text-white">Enable 2FA</h3>
                      <p className="text-sm text-gray-500">Secure your account using an authenticator app.</p>
                      <button onClick={handleStart2FA} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? "Generating..." : "Start Setup"}</button>
                  </div>
              )}
              {/* Step 2: Scan */}
              {twoFaStep === 'setup' && (
                  <div className="space-y-4 text-center">
                      <h3 className="text-lg font-bold dark:text-white">Scan this QR Code</h3>
                      <div className="w-48 h-48 bg-white border-4 border-indigo-100 mx-auto rounded-xl flex flex-col items-center justify-center p-2"><div className="w-full h-full bg-black/10 flex items-center justify-center text-xs text-gray-500 break-all px-2">[QR Code: {twoFaSecret.slice(0,10)}...]</div></div>
                      <p className="text-xs text-gray-500">Or enter manual key: <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-1 rounded">{twoFaSecret}</span></p>
                      <input className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl outline-none border dark:border-white/10 dark:text-white text-center tracking-widest text-lg mt-4" placeholder="Enter Code" maxLength={6} value={inputs.twoFaCode} onChange={(e) => setInputs({...inputs, twoFaCode: e.target.value})} />
                      {error && <p className="text-red-500 text-xs">{error}</p>}
                      <button onClick={handleVerify2FA} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">{loading ? "Verifying..." : "Activate"}</button>
                  </div>
              )}
              {/* Step 3: Success */}
              {twoFaStep === 'success' && (
                  <div className="text-center space-y-4 py-6">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600"><CheckCircle className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold dark:text-white">2FA Enabled!</h3>
                      <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-gray-200 dark:bg-zinc-800 rounded-lg font-bold">Done</button>
                  </div>
              )}
          </Modal>
      )}

    </div>
  )
}