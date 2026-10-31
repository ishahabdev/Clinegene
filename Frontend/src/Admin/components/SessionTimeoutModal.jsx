import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Clock, ShieldAlert } from "lucide-react";

export default function SessionTimeoutModal() {
  const { showInactivityWarning, secondsRemaining, stayLoggedIn, logout } = useAuth();

  if (!showInactivityWarning) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <Modal
      isOpen={showInactivityWarning}
      onClose={stayLoggedIn}
      title="Session Timeout Warning"
      maxWidth="max-w-md"
    >
      <div className="flex items-start gap-4 py-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <Clock className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="font-inter text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            You have been inactive for 28 minutes. For laboratory data security, your session will automatically log out in:
          </p>
          <div className="pt-2">
            <span className="font-outfit text-2xl font-extrabold text-[#b91c1c] dark:text-rose-400">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="sm" onClick={() => logout("manual")}>
          Log Out Now
        </Button>
        <Button variant="crimson" size="sm" onClick={stayLoggedIn}>
          Keep Me Logged In
        </Button>
      </div>
    </Modal>
  );
}

