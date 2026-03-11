import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
    authTransitioning,
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
  const [usernamePending, setUsernamePending] = useState(false);
  const [authPendingLabel, setAuthPendingLabel] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const lowPowerDevice = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const cores = Number(navigator.hardwareConcurrency || 0);
    return cores > 0 && cores <= 4;
  }, []);
  const ambientMotion = !prefersReducedMotion && !lowPowerDevice;

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const runAuth = async (label, fn) => {
    setAuthPendingLabel(label);
    setOpenLogin(false);
    setOpenSignup(false);
    try {
      await run(fn);
    } catch (err) {
      setAuthPendingLabel("");
      throw err;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setOpenLogin(false);
    setOpenSignup(false);
    setAuthPendingLabel("");
  }, [isAuthenticated]);

  useEffect(() => {
    if (busy || authTransitioning || isAuthenticated) return;
    setAuthPendingLabel("");
  }, [busy, authTransitioning, isAuthenticated, authError]);

  useEffect(() => {
    if (needsUsername) return;
    setUsernamePending(false);
    setUsernameError("");
  }, [needsUsername]);

  useEffect(() => {
    if (!usernamePending) return undefined;
    const timer = setTimeout(() => {
      setUsernamePending(false);
      setUsernameError("Still syncing username. Please try again.");
    }, 12000);
    return () => clearTimeout(timer);
  }, [usernamePending]);

  const GateShell = ({ children: inner }) => (
    <div className="relative min-h-screen overflow-hidden text-white">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(130deg, #0f172a 0%, #0b3b4a 45%, #1e3a8a 100%)",
          backgroundSize: "180% 180%",
        }}
        animate={
          ambientMotion
            ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
            : { backgroundPosition: "40% 50%" }
        }
        transition={
          ambientMotion
            ? { duration: 24, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      />
      <div className="mesh-overlay absolute inset-0 opacity-35" />
      {!lowPowerDevice && <div className="noise-overlay absolute inset-0 opacity-10" />}
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

  if ((loading && !authTransitioning) || (isAuthenticated && profileLoading)) {
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
        {authPendingLabel && (busy || authTransitioning) ? (
          <GlassCard className="w-full max-w-md space-y-3 p-5">
            <h3 className="font-display text-xl font-semibold">{authPendingLabel}</h3>
            <p className="text-sm text-slate-200">Please wait while we connect your session.</p>
            <div className="animate-pulse space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/15" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
            {authError && <p className="text-sm text-rose-200">{authError}</p>}
          </GlassCard>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <GlassCard className="space-y-4 p-6">
                <h2 className="font-display text-2xl font-semibold">LOCK IN</h2>
                <p className="text-sm text-slate-200">Continue as guest or login to sync streaks and friends.</p>
                <PrimaryButton
                  className="w-full"
                  disabled={busy}
                  onClick={() => runAuth("Signing in as guest...", actions.continueGuest)}
                >
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
                runAuth("Signing in...", async () => {
                  await actions.loginEmail(email, password);
                })
              }
              onGoogle={() =>
                runAuth("Signing in with Google...", async () => {
                  await actions.loginGoogle();
                })
              }
              onGuest={() =>
                runAuth("Signing in as guest...", async () => {
                  await actions.continueGuest();
                })
              }
            />

            <SignupModal
              open={openSignup}
              onClose={() => setOpenSignup(false)}
              busy={busy}
              onSubmit={(email, password) =>
                runAuth("Creating account...", async () => {
                  await actions.signupEmail(email, password);
                })
              }
              onGoogle={() =>
                runAuth("Signing in with Google...", async () => {
                  await actions.loginGoogle();
                })
              }
            />
          </>
        )}
      </GateShell>
    );
  }

  if (needsUsername) {
    if (usernamePending) {
      return (
        <GateShell>
          <GlassCard className="w-full max-w-md space-y-3 p-5">
            <h3 className="font-display text-xl font-semibold">Saving username...</h3>
            <p className="text-sm text-slate-200">Please wait while we sync your profile.</p>
            <div className="animate-pulse space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/15" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          </GlassCard>
        </GateShell>
      );
    }

    return (
      <GateShell>
        <UsernameModal
          open
          busy={busy || usernamePending}
          error={usernameError}
          onSubmit={(username) =>
            run(async () => {
              setUsernameError("");
              setUsernamePending(true);
              try {
                await actions.claimProfileUsername(username);
              } catch (err) {
                setUsernamePending(false);
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
