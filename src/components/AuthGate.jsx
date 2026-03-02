import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import UsernameModal from "./UsernameModal";
import { useAuth } from "../context/AuthProvider";

export default function AuthGate({ children }) {
  const {
    hasFirebaseConfig,
    loading,
    profileLoading,
    isAuthenticated,
    needsUsername,
    authError,
    actions,
  } = useAuth();
  const [busy, setBusy] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const GateShell = ({ children: inner }) => (
    <div className="relative min-h-screen overflow-hidden text-white">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(130deg, #0f172a 0%, #0b3b4a 45%, #1e3a8a 100%)",
          backgroundSize: "180% 180%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className="mesh-overlay absolute inset-0 opacity-40" />
      <div className="noise-overlay absolute inset-0 opacity-10" />
      <div className="relative z-10 grid min-h-screen place-items-center p-4">{inner}</div>
    </div>
  );

  if (!hasFirebaseConfig) {
    return (
      <GateShell>
        <GlassCard className="max-w-lg p-6">
          <h2 className="font-display text-2xl font-semibold">Firebase config missing</h2>
          <p className="mt-2 text-sm text-slate-200">Add `.env` values and restart dev server.</p>
        </GlassCard>
      </GateShell>
    );
  }

  if (loading || (isAuthenticated && profileLoading)) {
    return (
      <GateShell>
        <GlassCard className="w-full max-w-md p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-36 rounded bg-white/15" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
          </div>
        </GlassCard>
      </GateShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <GateShell>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <GlassCard className="space-y-4 p-6">
            <h2 className="font-display text-2xl font-semibold">LOCK IN</h2>
            <p className="text-sm text-slate-200">Continue as guest or login to sync streaks and friends.</p>
            <PrimaryButton className="w-full" disabled={busy} onClick={() => run(actions.continueGuest)}>
              Continue as Guest
            </PrimaryButton>
            <PrimaryButton className="w-full" variant="ghost" onClick={() => setOpenLogin(true)}>
              Login
            </PrimaryButton>
            <PrimaryButton className="w-full" variant="ghost" onClick={() => setOpenSignup(true)}>
              Sign up
            </PrimaryButton>
            {authError && <p className="text-sm text-rose-200">{authError}</p>}
          </GlassCard>
        </motion.div>

        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
          busy={busy}
          onSubmit={(email, password) =>
            run(async () => {
              await actions.loginEmail(email, password);
              setOpenLogin(false);
            })
          }
          onGoogle={() =>
            run(async () => {
              await actions.loginGoogle();
              setOpenLogin(false);
            })
          }
          onGuest={() =>
            run(async () => {
              await actions.continueGuest();
              setOpenLogin(false);
            })
          }
        />

        <SignupModal
          open={openSignup}
          onClose={() => setOpenSignup(false)}
          busy={busy}
          onSubmit={(email, password) =>
            run(async () => {
              await actions.signupEmail(email, password);
              setOpenSignup(false);
            })
          }
          onGoogle={() =>
            run(async () => {
              await actions.loginGoogle();
              setOpenSignup(false);
            })
          }
        />
      </GateShell>
    );
  }

  if (needsUsername) {
    return (
      <GateShell>
        <UsernameModal
          open
          busy={busy}
          error={usernameError}
          onSubmit={(username) =>
            run(async () => {
              setUsernameError("");
              try {
                await actions.claimProfileUsername(username);
              } catch (err) {
                setUsernameError(err?.message || "Failed to claim username");
              }
            })
          }
        />
      </GateShell>
    );
  }

  return children;
}
