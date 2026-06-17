"use client";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
  Fragment,
  type RefObject,
} from "react";
import gsap from "gsap";
import styles from "@/app/form/inquiry.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

interface FieldConfig {
  label: string;
  placeholder: string;
  key: string;
  type?: string;
  textarea?: boolean;
  optional?: boolean;
  selectOptions?: string[];
}

interface OptionItem {
  title: string;
  desc?: string;
}

interface ToastProps {
  message: string;
  visible: boolean;
  error: boolean;
}

interface BubbleProps {
  side: "wi" | "client";
  html: string;
  emoji: boolean;
  delay: number;
  hideMeta: boolean;
  clientLabel: string;
}

interface TextCardProps {
  fields: FieldConfig[];
  mode: "active" | "completed";
  formData: Record<string, string>;
  onUpdate: (key: string, val: string) => void;
  onContinue: () => void;
  onBack: () => void;
  showBack: boolean;
  delay: number;
  hideMeta: boolean;
  clientLabel: string;
  onScrollRequest?: (target?: HTMLElement | null) => void;
}

interface OptionCardProps {
  label: string;
  dataKey: string;
  options: OptionItem[];
  multi: boolean;
  mode: "active" | "completed";
  formData: Record<string, any>;
  onUpdate: (key: string, val: any) => void;
  onContinue: () => void;
  onBack: () => void;
  showBack: boolean;
  delay: number;
  hideMeta: boolean;
  clientLabel: string;
  onScrollRequest?: (target?: HTMLElement | null) => void;
}

// ── Hook: one-shot GSAP entrance ─────────────────────────────────────────────

function useEntranceAnimation(
  ref: React.RefObject<HTMLElement | null>,
  delay: number,
) {
  useEffect(() => {
    if (delay <= 0) return;
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        delay: delay / 1000,
        ease: "power2.out",
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps — intentionally fire once per mount
  }, []);
}

// ── Static data ──────────────────────────────────────────────────────────────

const ROLE_OPTIONS: OptionItem[] = [
  "Founder",
  "Co-Founder",
  "CEO",
  "Brand Owner",
  "Marketing Director",
  "Brand Manager",
  "Creative Director",
  "Investor or Partner",
  "Other",
].map((t) => ({ title: t }));

const REVENUE_OPTIONS: OptionItem[] = [
  "Pre-revenue / Under USD 500K",
  "USD 500K to 2M",
  "USD 2M to 10M",
  "USD 10M+",
  "Prefer not to disclose",
].map((t) => ({ title: t }));

const SUPPORT_OPTIONS: OptionItem[] = [
  "Brand Strategy",
  "Brand Creation",
  "Brand Refresh / Rebranding",
  "Repositioning",
  "Brand Identity",
  "Packaging Design System",
  "Product Range Extension",
  "Launch & Go-to-Market Assets",
  "Brand Audit",
  "Not sure yet, I need a recommendation",
].map((t) => ({ title: t }));

const PROJECT_OPTIONS: OptionItem[] = [
  "A new brand",
  "An existing brand preparing for launch",
  "A brand refresh",
  "A product line extension",
  "A repositioning project",
  "A packaging redesign",
  "A portfolio or multi-SKU project",
  "Other",
].map((t) => ({ title: t }));

const KICKOFF_OPTIONS: OptionItem[] = [
  "ASAP, somewhere within the next 2 weeks",
  "Soon, the next month would be fantastic",
  "Within the next 3 months, at the latest",
  "No rush, whatever works best for your team",
].map((t) => ({ title: t }));

const COMPLETION_OPTIONS: OptionItem[] = [
  "In 2 to 3 months",
  "Within 6 months",
  "In about a year",
  "Not sure yet",
].map((t) => ({ title: t }));

const BUDGET_OPTIONS: OptionItem[] = [
  { title: "USD 10,000 to 15,000", desc: "Focused single-scope engagement" },
  {
    title: "USD 15,000 to 30,000",
    desc: "Focused brand or packaging project, usually around 1 to 4 SKUs",
  },
  {
    title: "USD 30,000 to 50,000",
    desc: "Brand identity and packaging system, usually around 4 to 8 SKUs",
  },
  {
    title: "USD 50,000 to 100,000",
    desc: "Product range or portfolio transformation, usually around 8 to 15+ SKUs",
  },
  { title: "USD 100,000+", desc: "Multi-category brand system engagement" },
  { title: "Not sure yet, but we are ready to invest in the right scope" },
];

const SOURCE_OPTIONS: OptionItem[] = [
  "A client referral",
  "A friend or colleague",
  "Google",
  "Instagram",
  "LinkedIn",
  "Behance",
  "World Brand Design Society",
  "I've been following your work for some time",
  "Other",
].map((t) => ({ title: t }));

const REQUIRED_BY_STEP: string[][] = [
  ["fullName", "role", "company"],
  ["category", "primaryMarket"],
  ["revenueRange"],
  ["support"],
  ["projectType"],
  ["wishTo"],
  ["kickOff"],
  ["completion"],
  ["budget"],
  ["email"],
  ["source"],
];

const INITIAL_FORM: Record<string, any> = {
  fullName: "",
  role: "",
  company: "",
  businessLocation: "",
  website: "",
  category: "",
  primaryMarket: "",
  revenueRange: "",
  support: [],
  projectType: "",
  wishTo: "",
  challenge: "",
  kickOff: "",
  completion: "",
  budget: "",
  email: "",
  source: "",
};

// ── Delays ───────────────────────────────────────────────────────────────────

const B_DELAY = 1000;
const C_DELAY = 200;
// const GSAP_DURATION = 100;

// ── Helpers ───────────────────────────────────────────────────────────────────

function cx(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

function getGreeting(): string {
  return "Hello.";
}

// ── Avatar Reveal ─────────────────────────────────────────────────────────────

function AvatarReveal({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        delay: delay / 1000,
        ease: "back.out(1.7)",
      },
    );
  }, [delay]);

  return (
    <div ref={ref} className={styles.bubbleAvatar}>
      <img
        src="/images/widarto-impact-portrait.jpeg"
        alt="Eko"
        className={styles.avatarImg}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

// ── Typing Indicator ──────────────────────────────────────────────────────────

function TypingIndicator({
  visible,
  anchorRef,
}: {
  visible: boolean;
  anchorRef?: RefObject<HTMLDivElement | null>;
}) {
  if (!visible) return null;

  return (
    <div ref={anchorRef} className={styles.typingWrap}>
      <div className={styles.bubbleAvatar}>
        <img
          src="/images/eko-avatar.jpg"
          alt="Eko"
          className={styles.avatarImg}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className={styles.typingBubble}>
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = memo<ToastProps>(function Toast({ message, visible, error }) {
  return (
    <div
      className={cx(
        styles.toast,
        visible && styles.toastVisible,
        error && styles.toastError,
      )}
    >
      {message}
    </div>
  );
});

// ── Bubble ────────────────────────────────────────────────────────────────────

const Bubble = memo<BubbleProps>(function Bubble({
  side,
  html,
  emoji,
  delay,
  hideMeta,
  clientLabel,
}) {
  const elRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(elRef, delay);

  return (
    <div ref={elRef} className={cx(styles.chatRow, styles[side])}>
      {!hideMeta && (
        <div className={styles.chatMeta}>
          <strong>{side === "wi" ? "EKO" : clientLabel}</strong>
        </div>
      )}
      <div
        className={cx(
          styles.bubbleWrap,
          side === "client" && styles.clientBubbleWrap,
        )}
      >
        <div
          className={cx(
            styles.bubble,
            side === "client" && styles.clientBubble,
            emoji && styles.emojiBubble,
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
});

// ── TextCard ──────────────────────────────────────────────────────────────────

const TextCard = memo<TextCardProps>(function TextCard({
  fields,
  mode,
  formData,
  onUpdate,
  onContinue,
  onBack,
  showBack,
  delay,
  hideMeta,
  clientLabel,
  onScrollRequest,
}) {
  const elRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(elRef, delay);

  const isCompleted = mode === "completed";
  const requiredFields = fields.filter((f) => !f.optional);
  const allFilled = requiredFields.every((f) => (formData[f.key] || "").trim());
  const [visibleCount, setVisibleCount] = useState(
    isCompleted || allFilled ? fields.length : 1,
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allVisible = visibleCount >= fields.length;

  useEffect(() => {
    if (visibleCount > 1) {
      const t = window.setTimeout(() => onScrollRequest?.(), 80);
      return () => window.clearTimeout(t);
    }
  }, [visibleCount, onScrollRequest]);

  useEffect(() => {
    if (isCompleted) return;
    for (const f of fields) {
      const el = refs.current[f.key];
      if (el && !(formData[f.key] || "").trim()) {
        setTimeout(() => el?.focus({ preventScroll: true }), delay + 350);
        break;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMiniOk = useCallback(
    (idx: number) => {
      const field = fields[idx];
      const val = (formData[field.key] || "").trim();
      if (!field.optional && !val) {
        setErrors((p) => ({ ...p, [field.key]: true }));
        refs.current[field.key]?.focus();
        return;
      }
      setErrors((p) => ({ ...p, [field.key]: false }));
      if (idx < fields.length - 1) {
        const nextKey = fields[idx + 1].key;
        setVisibleCount(idx + 2);
        window.setTimeout(() => {
          refs.current[nextKey]?.focus({ preventScroll: true });
          onScrollRequest?.(blockRefs.current[nextKey]);
        }, 80);
      }
    },
    [fields, formData, onScrollRequest],
  );

  const handleContinue = useCallback(() => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    fields.forEach((f) => {
      if (f.optional) return;
      if (!(formData[f.key] || "").trim()) {
        newErrors[f.key] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    if (!valid) {
      for (const f of fields) {
        if (newErrors[f.key]) {
          refs.current[f.key]?.focus();
          break;
        }
      }
      return;
    }
    onContinue();
  }, [fields, formData, onContinue]);

  return (
    <div ref={elRef} className={cx(styles.chatRow, styles.client)}>
      {!hideMeta && (
        <div className={styles.chatMeta}>
          <strong>{clientLabel}</strong>
        </div>
      )}
      <div className={cx(styles.bubble, styles.clientBubble, styles.inputCard)}>
        {fields.map((field, idx) => {
          if (idx >= visibleCount) return null;
          const val = formData[field.key] || "";
          const isLastField = idx === fields.length - 1;
          const isLastVisible = idx === visibleCount - 1;
          const showMiniOk = !isCompleted && isLastVisible && !isLastField;
          const hasError = !!errors[field.key];
          const Tag = field.textarea ? "textarea" : ("input" as const);

          return (
            <div
              key={field.key}
              className={styles.fieldBlock}
              ref={(el: HTMLDivElement | null) => {
                blockRefs.current[field.key] = el;
              }}
            >
              <label htmlFor={`field-${field.key}`}>
                {field.label}
                {field.optional && (
                  <span className={styles.optionalTag}> optional</span>
                )}
              </label>
              {field.selectOptions ? (
                <div className={styles.fieldOptionList}>
                  {field.selectOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={cx(
                        styles.optionButton,
                        val === opt && styles.optionButtonSelected,
                        hasError && !val && styles.optionButtonInvalid,
                      )}
                      onClick={() => {
                        onUpdate(field.key, opt);
                        if (hasError) {
                          setErrors((p) => ({ ...p, [field.key]: false }));
                        }
                        onScrollRequest?.();
                      }}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <Tag
                  id={`field-${field.key}`}
                  ref={(el: HTMLElement | null) => {
                    refs.current[field.key] = el;
                  }}
                  {...(!field.textarea ? { type: field.type || "text" } : {})}
                  placeholder={field.placeholder || ""}
                  value={val}
                  className={cx(
                    hasError && styles.inputInvalid,
                    !hasError && val && styles.inputCompleted,
                  )}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                  ) => {
                    onUpdate(field.key, e.target.value);
                    if (hasError && e.target.value.trim()) {
                      setErrors((p) => ({ ...p, [field.key]: false }));
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (field.textarea || e.key !== "Enter") return;
                    e.preventDefault();
                    if (showMiniOk) handleMiniOk(idx);
                    else if (isLastField && !isCompleted) handleContinue();
                  }}
                />
              )}
              <div
                className={cx(
                  styles.fieldError,
                  hasError && styles.fieldErrorVisible,
                )}
              >
                This field is required.
              </div>
              {showMiniOk && (
                <div className={styles.fieldMiniAction}>
                  <button
                    type="button"
                    className={styles.okButton}
                    onClick={() => handleMiniOk(idx)}
                  >
                    OK ↳
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!isCompleted && (allVisible || fields.length === 1) && (
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
              style={!showBack ? { visibility: "hidden" as const } : undefined}
            >
              ← Back
            </button>
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.okButton}
                onClick={handleContinue}
              >
                OK ↳
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ── OptionCard ────────────────────────────────────────────────────────────────

const OptionCard = memo<OptionCardProps>(function OptionCard({
  label,
  dataKey,
  options,
  multi,
  mode,
  formData,
  onUpdate,
  onContinue,
  onBack,
  showBack,
  delay,
  hideMeta,
  clientLabel,
  onScrollRequest,
}) {
  const elRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(elRef, delay);

  const isCompleted = mode === "completed";

  const isSelected = (title: string): boolean => {
    if (multi)
      return (
        Array.isArray(formData[dataKey]) && formData[dataKey].includes(title)
      );
    return formData[dataKey] === title;
  };

  const toggle = (title: string): void => {
    if (multi) {
      const cur: string[] = formData[dataKey] || [];
      onUpdate(
        dataKey,
        cur.includes(title)
          ? cur.filter((t: string) => t !== title)
          : [...cur, title],
      );
    } else {
      onUpdate(dataKey, title);
    }
    window.setTimeout(() => onScrollRequest?.(), 80);
  };

  return (
    <div ref={elRef} className={cx(styles.chatRow, styles.client)}>
      {!hideMeta && (
        <div className={styles.chatMeta}>
          <strong>{clientLabel}</strong>
        </div>
      )}
      <div className={cx(styles.bubble, styles.clientBubble, styles.inputCard)}>
        <div className={styles.optionLabel}>{label}</div>
        <div className={styles.optionList}>
          {options.map((opt) => (
            <button
              key={opt.title}
              type="button"
              className={cx(
                styles.optionButton,
                isSelected(opt.title) && styles.optionButtonSelected,
              )}
              onClick={() => toggle(opt.title)}
            >
              <span>{opt.title}</span>
              {opt.desc && (
                <span className={styles.optionDesc}>{opt.desc}</span>
              )}
            </button>
          ))}
        </div>
        {!isCompleted && (
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
              style={!showBack ? { visibility: "hidden" as const } : undefined}
            >
              ← Back
            </button>
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.okButton}
                onClick={onContinue}
              >
                OK ↳
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ── Main page ─────────────────────────────────────────────────────────────────

type StepCardConfig =
  | {
      type: "text";
      key: string;
      fields: FieldConfig[];
      mode: "active" | "completed";
      delay: number;
      showBack: boolean;
    }
  | {
      type: "option";
      key: string;
      label: string;
      dataKey: string;
      options: OptionItem[];
      multi: boolean;
      mode: "active" | "completed";
      delay: number;
      showBack: boolean;
    };

interface RenderBubble {
  type: "bubble";
  key: string;
  side: "wi" | "client";
  html: string;
  emoji: boolean;
  delay: number;
  hideMeta?: boolean;
}

interface RenderTyping {
  type: "typing";
  key: string;
}

type RenderItem =
  | RenderBubble
  | RenderTyping
  | (StepCardConfig & { side: "client"; hideMeta?: boolean });

type InquiryPageProps = {
  variant?: "page" | "modal";
};

export default function InquiryPage({ variant = "page" }: InquiryPageProps) {
  const [formData, setFormData] = useState<Record<string, any>>(INITIAL_FORM);
  const [currentStep, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wiTyping, setWiTyping] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    error: false,
  });

  const update = useCallback((key: string, val: any) => {
    setFormData((p: Record<string, any>) => ({ ...p, [key]: val }));
  }, []);

  const showToast = useCallback((message: string, error: boolean = false) => {
    setToast({ message, visible: true, error });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 4000);
  }, []);

  const submitInquiry = useCallback(
    async (data: Record<string, any>) => {
      const budgetOption = BUDGET_OPTIONS.find((opt) => opt.title === data.budget);

      const body = {
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        role: data.role,
        website: data.website,
        businessLocation: data.businessLocation,
        category: data.category,
        primaryMarket: data.primaryMarket,
        revenueRange: data.revenueRange,
        support: Array.isArray(data.support) ? data.support : [],
        projectType: data.projectType,
        wishTo: data.wishTo,
        challenge: data.challenge,
        kickOff: data.kickOff,
        completion: data.completion,
        budget: data.budget,
        budgetDetail: budgetOption?.desc || "",
        source: data.source,
      };

      try {
        const res = await fetch("/api/send-chat-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json: Record<string, any> = await res.json();
        if (res.ok) {
          setSubmitted(true);
          showToast("Inquiry sent. We'll be in touch.", false);
        } else {
          showToast(
            json.error || json.message || "Something went wrong.",
            true,
          );
        }
      } catch {
        showToast("Network error. Please try again.", true);
      }
    },
    [showToast],
  );

  const validateStep = useCallback(
    (step: number): boolean => {
      const isValid = (REQUIRED_BY_STEP[step] || []).every((key: string) => {
        const val = formData[key];
        if (key === "email") {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((val || "").trim());
        }
        return Array.isArray(val)
          ? val.length > 0
          : Boolean((val || "").trim());
      });

      if (!isValid) {
        if (REQUIRED_BY_STEP[step]?.includes("email")) {
          const email = (formData.email || "").trim();
          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Please enter a valid email address.", true);
          } else {
            showToast("Please complete all required fields before continuing.", true);
          }
        } else {
          showToast("Please complete all required fields before continuing.", true);
        }
      }

      return isValid;
    },
    [formData, showToast],
  );

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setStep((p) => p - 1);
      setFinished(false);
    }
  }, [currentStep]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const queueScroll = useCallback(
    (
      target: RefObject<HTMLElement | null> | HTMLElement | null,
      behavior: ScrollBehavior = "smooth",
      delay = 120,
      block: ScrollLogicalPosition | "down" = "nearest",
    ) => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        const container = scrollContainerRef.current;
        const el =
          target && "current" in target ? target.current : target;
        if (!container || !el) return;

        const padding = 12;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const elTop = elRect.top - containerRect.top + container.scrollTop;
        const elBottom = elTop + el.offsetHeight;
        const viewTop = container.scrollTop;
        const viewBottom = viewTop + container.clientHeight;

        let nextScroll = viewTop;

        if (block === "start") {
          nextScroll = elTop - padding;
        } else if (block === "end") {
          nextScroll = elBottom - container.clientHeight + padding;
        } else if (block === "down") {
          // Reveal-only: scroll down to expose new content, never jump back up.
          if (elBottom <= viewBottom) return;
          nextScroll = elBottom - container.clientHeight + padding;
        } else if (elTop < viewTop) {
          nextScroll = elTop - padding;
        } else if (elBottom > viewBottom) {
          nextScroll = elBottom - container.clientHeight + padding;
        } else {
          return;
        }

        container.scrollTo({
          top: Math.max(0, nextScroll),
          behavior,
        });
      }, delay);
    },
    [],
  );

  const scrollToNewField = useCallback(
    (target?: HTMLElement | null) => {
      // A specific newly-revealed field anchors near the top (scrolls down to
      // it). Otherwise just reveal the bottom of the active card — never jump up.
      if (target) {
        queueScroll(target, "smooth", 100, "start");
      } else {
        queueScroll(activeCardRef, "smooth", 100, "down");
      }
    },
    [queueScroll],
  );

  const fn = (formData.fullName || "there").split(" ")[0];
  const co = formData.company || "your brand";
  const clientLabel = (formData.fullName || "").trim()
    ? formData.fullName.trim().toUpperCase()
    : "CLIENT";

  const STEPS = useMemo(
    () => [
      {
        prompts: [] as string[],
        card: (delay: number): StepCardConfig => ({
          type: "text",
          key: "card-0",
          fields: [
            { label: "My name is", placeholder: "Full Name", key: "fullName" },
            {
              label: "I'm a",
              placeholder: "Select your role",
              key: "role",
              selectOptions: ROLE_OPTIONS.map((r) => r.title),
            },
            { label: "at", placeholder: "Company / Brand Name", key: "company" },
            {
              label: "We are based in",
              placeholder: "City / Country",
              key: "businessLocation",
              optional: true,
            },
            {
              label: "You can find us here",
              placeholder: "Website or social media",
              key: "website",
              optional: true,
            },
          ],
          mode: "active",
          delay,
          showBack: false,
        }),
      },
      {
        prompts: [
          `Good to meet you, ${fn}.`,
          `Tell me a little about <strong>${co}</strong>.`,
        ],
        card: (delay: number): StepCardConfig => ({
          type: "text",
          key: "card-1",
          fields: [
            {
              label: "We are in",
              placeholder: "Category / Industry",
              key: "category",
            },
            {
              label: "Our main market is",
              placeholder:
                "Example: United States, United Kingdom, Saudi Arabia, GCC, Southeast Asia, Indonesia, etc.",
              key: "primaryMarket",
            },
          ],
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [] as string[],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-1b",
          label: "At the moment, our annual revenue is around:",
          dataKey: "revenueRange",
          options: REVENUE_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: ["Good.", "<strong>What do you need help with?</strong>"],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-2",
          label: "I am seeking a partner to help me with:",
          dataKey: "support",
          options: SUPPORT_OPTIONS,
          multi: true,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "Good. That gives me the direction.",
          "<strong>What should I understand about the project?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-3a",
          label: "This is:",
          dataKey: "projectType",
          options: PROJECT_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [] as string[],
        card: (delay: number): StepCardConfig => ({
          type: "text",
          key: "card-3b",
          fields: [
            {
              label: "We are looking to:",
              placeholder:
                "Tell us what you want to build, change, or improve",
              key: "wishTo",
              textarea: true,
            },
            {
              label: "Our main challenge right now is",
              placeholder:
                "Tell us what feels unclear, underperforming, or ready to evolve",
              key: "challenge",
              textarea: true,
              optional: true,
            },
          ],
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "Understood. That gives us a clearer picture.",
          "<strong>When would you like to kick off the project?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-4",
          label: "We would like to start:",
          dataKey: "kickOff",
          options: KICKOFF_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "<strong>And when would you like to see the project completed?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-5",
          label: "We are aiming for:",
          dataKey: "completion",
          options: COMPLETION_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "And to wrap up...",
          "<strong>What investment range do you have in mind for this engagement?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-6",
          label: "I would say:",
          dataKey: "budget",
          options: BUDGET_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "Good. That gives me enough to review the project properly.",
          "<strong>Where should I send the follow-up?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "text",
          key: "card-7",
          fields: [
            {
              label: "You can reach me at",
              placeholder: "you@email.com",
              key: "email",
              type: "email",
            },
          ],
          mode: "active",
          delay,
          showBack: true,
        }),
      },
      {
        prompts: [
          "Thank you.",
          "One quick question before we wrap up.",
          "<strong>How did you hear about Widarto Impact?</strong>",
        ],
        card: (delay: number): StepCardConfig => ({
          type: "option",
          key: "card-8",
          label: "I found you through:",
          dataKey: "source",
          options: SOURCE_OPTIONS,
          multi: false,
          mode: "active",
          delay,
          showBack: true,
        }),
      },
    ],
    [fn, co],
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep < REQUIRED_BY_STEP.length - 1) {
      const nextStepIndex = currentStep + 1;
      const nextHasPrompts =
        (STEPS[nextStepIndex]?.prompts.length ?? 0) > 0;
      setWiTyping(nextHasPrompts);
      setStep(nextStepIndex);
    } else {
      setFinished(true);
      submitInquiry(formData);
    }
  }, [currentStep, validateStep, submitInquiry, formData, STEPS]);

  // ── Build render list ─────────────────────────────────────────────────────

  const greeting = useMemo(() => getGreeting(), []);

  const { items, lastWiIdx } = useMemo(() => {
    const items: RenderItem[] = [];
    let prevSide: string | null = null;
    let delayMs = 0;
    let lastWiIdx = -1;

    const push = (item: RenderItem) => {
      if (item.type !== "typing") {
        item.hideMeta = item.side === prevSide;
        prevSide = item.side;
      }
      items.push(item);
      if (item.type === "bubble" && item.side === "wi") {
        lastWiIdx = items.length - 1;
      }
    };

    // Intro bubbles
    [
      { side: "wi" as const, html: greeting, emoji: false },
      { side: "wi" as const, html: "☺️", emoji: true },
      {
        side: "wi" as const,
        html: "I'm Eko, Founder and Creative Director of Widarto Impact. 👋",
        emoji: false,
      },
      {
        side: "client" as const,
        html: "Nice to meet you, Eko. 👋",
        emoji: false,
      },
    ].forEach((b, i) => {
      delayMs += i === 0 ? 200 : B_DELAY;
      push({
        type: "bubble",
        key: `intro-${i}`,
        ...b,
        delay: delayMs,
      });
    });

    // Steps — completed steps are already on screen from earlier renders, so they
    // render with no entrance delay. Only the *active* step animates, on a fresh
    // timeline so its prompts/typing/card trigger immediately and in order.
    for (let i = 0; i <= currentStep; i++) {
      const step = STEPS[i];
      const isCompleted = i < currentStep || finished;
      const mode: "active" | "completed" = isCompleted ? "completed" : "active";

      if (isCompleted) {
        step.prompts.forEach((html, pi) => {
          push({
            type: "bubble",
            key: `prompt-${i}-${pi}`,
            side: "wi",
            html,
            emoji: false,
            delay: 0,
          });
        });
        const card = step.card(0);
        push({ ...card, key: `card-${i}`, side: "client", mode });
        continue;
      }

      // Active step: keep the intro timeline on first load (step 0), otherwise
      // start from zero so the new prompts + card animate in right away.
      delayMs = i === 0 ? delayMs + 30 : 0;

      step.prompts.forEach((html, pi) => {
        delayMs += B_DELAY;
        push({
          type: "bubble",
          key: `prompt-${i}-${pi}`,
          side: "wi",
          html,
          emoji: false,
          delay: delayMs,
        });
      });

      // Typing indicator only when EKO has new messages to show
      if (step.prompts.length > 0) {
        push({ type: "typing", key: `typing-${i}` });
      }

      delayMs += C_DELAY;
      const card = step.card(delayMs);
      push({ ...card, key: `card-${i}`, side: "client", mode });
    }

    // Closing bubbles — fresh timeline so they animate sequentially on finish
    if (finished) {
      delayMs = 0;
      [
        { side: "wi" as const, html: "Perfect. Thank you for sharing." },
        {
          side: "wi" as const,
          html: "I'll review your inquiry carefully and get back to you within 1 to 2 business days.",
        },
        { side: "wi" as const, html: "Speak soon." },
      ].forEach((b, i) => {
        delayMs += B_DELAY;
        push({
          type: "bubble",
          key: `close-${i}`,
          ...b,
          emoji: false,
          delay: delayMs,
        });
      });
    }

    return { items, lastWiIdx };
  }, [STEPS, currentStep, finished, greeting]);

  // Keep typing indicator until the last WI bubble has animated in
  useEffect(() => {
    if (currentStep === 0) return;

    let lastWiDelay = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item.type === "bubble" && item.side === "wi") {
        lastWiDelay = item.delay;
        break;
      }
    }

    const t = window.setTimeout(() => setWiTyping(false), lastWiDelay);
    return () => window.clearTimeout(t);
  }, [currentStep, items]);

  // Scroll to typing or the next active question — never past the bottom
  useEffect(() => {
    if (finished) {
      queueScroll(bottomRef, "smooth", B_DELAY + 200, "nearest");
      return;
    }

    const step = STEPS[currentStep];
    const hasPrompts = (step?.prompts.length ?? 0) > 0;

    if (wiTyping && hasPrompts) {
      queueScroll(typingRef, "smooth", 120, "nearest");
      return;
    }

    queueScroll(activeCardRef, "smooth", hasPrompts ? 380 : 140, "start");
    // STEPS is intentionally excluded: it is re-created on every keystroke (it
    // depends on the typed name/company), which would otherwise re-fire this
    // effect mid-typing and yank the view back to the top of the active card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, wiTyping, finished, queueScroll]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={scrollContainerRef}
      className={variant === "modal" ? styles.modalRoot : styles.page}
    >
      <div className={styles.chatWindow}>
        {items.map((item, idx) => {
          if (item.type === "bubble") {
            return (
              <Fragment key={item.key}>
                <Bubble
                  side={item.side}
                  html={item.html}
                  emoji={item.emoji}
                  delay={item.delay}
                  hideMeta={item.hideMeta ?? false}
                  clientLabel={clientLabel}
                />
                {item.side === "wi" && idx === lastWiIdx && (
                  <AvatarReveal delay={item.delay + 60} />
                )}
              </Fragment>
            );
          }
          if (item.type === "typing") {
            return (
              <TypingIndicator
                key={item.key}
                visible={wiTyping}
                anchorRef={typingRef}
              />
            );
          }
          if (item.type === "text") {
            const card = (
              <TextCard
                fields={item.fields}
                mode={item.mode}
                delay={item.delay}
                showBack={item.showBack}
                hideMeta={item.hideMeta ?? false}
                clientLabel={clientLabel}
                formData={formData}
                onUpdate={update}
                onContinue={goNext}
                onBack={goBack}
                onScrollRequest={scrollToNewField}
              />
            );

            return (
              <div
                key={item.key}
                ref={item.mode === "active" ? activeCardRef : undefined}
              >
                {card}
              </div>
            );
          }
          if (item.type === "option") {
            const card = (
              <OptionCard
                label={item.label}
                dataKey={item.dataKey}
                options={item.options}
                multi={item.multi}
                mode={item.mode}
                delay={item.delay}
                showBack={item.showBack}
                hideMeta={item.hideMeta ?? false}
                clientLabel={clientLabel}
                formData={formData}
                onUpdate={update}
                onContinue={goNext}
                onBack={goBack}
                onScrollRequest={scrollToNewField}
              />
            );

            return (
              <div
                key={item.key}
                ref={item.mode === "active" ? activeCardRef : undefined}
              >
                {card}
              </div>
            );
          }
          return null;
        })}

        {submitted && (
          <div className={styles.successCard}>
            <p className={styles.successTitle}>
              Your inquiry has been received.
            </p>
            <p className={styles.successText}>
              I&apos;ll review the details and get back to you if the project
              looks aligned.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        error={toast.error}
      />
    </div>
  );
}
