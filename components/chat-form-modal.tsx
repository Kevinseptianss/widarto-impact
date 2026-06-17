"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import InquiryPage from "@/components/pages/form/chat-form";
import styles from "@/app/form/inquiry.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatFormModal({ open, onClose }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    window.setTimeout(() => setSessionKey((key) => key + 1), 350);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="false"
      aria-label="Start a project"
    >
      <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Start a Project</span>
          <button
            type="button"
            className={styles.modalClose}
            onClick={handleClose}
            aria-label="Close chat"
          >
            <X size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <InquiryPage key={sessionKey} variant="modal" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
