"use client";

import { useState } from "react";
// Import tipe-tipe yang dibutuhkan
import {
  Controller,
  useForm,
  useWatch,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { formSchema, FormData, defaultFormValues } from "./sheet-form-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  GlassSheet,
  GlassSheetContent,
  GlassSheetFooter,
  GlassSheetHeader,
  GlassSheetTitle,
} from "@/components/glass-sheet";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { XIcon } from "../config/icons";
import { GlassCheckbox } from "@/components/glass-checkbox";
import { GlassTextarea } from "@/components/glass-textarea";
import { GlassRadioGroup, GlassRadioGroupItem } from "@/components/glass-radio";
import {
  GlassSelect,
  GlassSelectContent,
  GlassSelectGroup,
  GlassSelectItem,
  GlassSelectTrigger,
  GlassSelectValue,
} from "./glass-select";

// .superRefine((data, ctx) => {
//   // Slide 2: If "Need something else?" is selected
//   if (
//     data.services.includes("other") &&
//     (!data.otherServiceDetails || data.otherServiceDetails.trim() === "")
//   ) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Please tell us more about what you need",
//       path: ["otherServiceDetails"],
//     });
//   }

//   // Slide 4: If "Other" is selected in expectedImpact
//   //   if (
//   //   data.expectedImpact.includes("other") &&
//   //   (!data.otherImpactDetails || data.otherImpactDetails.trim() === "")
//   // ) {
//   //   ctx.addIssue({
//   //     code: z.ZodIssueCode.custom,
//   //     message: "Please specify your expected impact",
//   //     path: ["otherImpactDetails"],
//   //   });
//   // }
// });

type Props = {
  onOpen: boolean;
  onClose: () => void;
};

// Ganti any dengan tipe yang sesuai
function Step1({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
}) {
  const roles = [
    "Founder",
    "Co-Founder",
    "CEO",
    "Brand Manager",
    "Marketing Manager",
    "Product Team",
    "Other",
  ];

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4.5">
        <div>
          <label htmlFor="name" className="mb-2 block">
            Full Name
          </label>
          <GlassInput {...register("name")} placeholder="Type here" />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block">
            Email Address
          </label>
          <GlassInput
            {...register("email")}
            placeholder="Type here"
            type="email"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block">
            Company / Brand Name
          </label>
          <GlassInput {...register("company")} placeholder="Type here" />
          {errors.company && (
            <p className="text-red-400 text-xs mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="website" className="mb-2 block">
            Website or Social Media
          </label>
          <GlassInput {...register("website")} placeholder="Type here" />
          {errors.website && (
            <p className="text-red-400 text-xs mt-1">
              {errors.website.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessLocation" className="mb-2 block">
            Where is your business based?
          </label>
          <GlassInput
            {...register("businessLocation")}
            placeholder="City / Country"
          />
          {errors.businessLocation && (
            <p className="text-red-400 text-xs mt-1">
              {errors.businessLocation.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="mb-2 block">
            Your Role
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <GlassSelect onValueChange={field.onChange} value={field.value}>
                <GlassSelectTrigger>
                  <GlassSelectValue placeholder="Select your role" />
                </GlassSelectTrigger>
                <GlassSelectContent>
                  <GlassSelectGroup>
                    {roles.map((role) => (
                      <GlassSelectItem
                        className="text-base"
                        key={role}
                        value={role}
                      >
                        {role}
                      </GlassSelectItem>
                    ))}
                  </GlassSelectGroup>
                </GlassSelectContent>
              </GlassSelect>
            )}
          />
          {errors.role && (
            <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
}) {
  const revenueOptions = [
    "Pre-revenue",
    "Under USD 500K",
    "USD 500K to 2M",
    "USD 2M to 10M",
    "USD 10M+",
    "Prefer not to disclose",
  ];

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <label htmlFor="category" className="mb-2 block">
            Category / Industry
          </label>
          <GlassInput
            {...register("category")}
            placeholder="Example: Beverage, skincare, snacks, wellness, pet care, hospitality, etc."
          />
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="primaryMarket" className="mb-2 block">
            Primary Market
          </label>
          <GlassInput
            {...register("primaryMarket")}
            placeholder="Example: United States, United Kingdom, Saudi Arabia, GCC, Southeast Asia, Indonesia, etc."
          />
          {errors.primaryMarket && (
            <p className="text-red-400 text-xs mt-1">
              {errors.primaryMarket.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="revenueRange" className="mb-4 block">
            Current Annual Revenue Range
          </label>
          <Controller
            name="revenueRange"
            control={control}
            render={({ field }) => (
              <GlassRadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-wrap gap-3"
              >
                {revenueOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center max-h-8.5 gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
                  >
                    <GlassRadioGroupItem value={option} id={option} />
                    <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </GlassRadioGroup>
            )}
          />
          {errors.revenueRange && (
            <p className="text-red-400 text-xs mt-2">
              {errors.revenueRange.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step3({
  control,
  errors,
  register,
}: {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
}) {
  const serviceOptions = [
    { value: "brand_strategy", label: "Brand Strategy" },
    {
      value: "brand_creation",
      label: "Brand Creation (new brand from the ground up)",
    },
    { value: "brand_identity", label: "Brand Identity" },
    { value: "packaging_design_system", label: "Packaging Design System" },
    {
      value: "product_range_extension",
      label: "Product Range Extension / Multi-SKU system",
    },
    { value: "launch_assets", label: "Launch & Go-to-Market Assets" },
    { value: "brand_refresh", label: "Brand Refresh / Rebranding" },
    { value: "repositioning", label: "Repositioning" },
    { value: "brand_audit", label: "Brand Audit" },
    {
      value: "not_sure",
      label: "Not sure yet, I need a recommendation",
    },
  ];

  const selectedServices = useWatch({
    control,
    name: "services",
    defaultValue: [],
  });

  const isOtherSelected = selectedServices.includes("other");

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <span className="mb-6 block  ">
        Which service best fits your current need?
      </span>

      <div className="flex gap-3 flex-wrap">
        {serviceOptions.map((item) => (
          <div key={item.value}>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <label className="flex items-center max-h-8.5 gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20">
                  <GlassCheckbox
                    checked={field.value?.includes(item.value)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      const updated = checked
                        ? [...current, item.value]
                        : current.filter((val: string) => val !== item.value);
                      field.onChange(updated);
                    }}
                  />
                  <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                    {item.label}
                  </span>
                </label>
              )}
            />
          </div>
        ))}
      </div>

      {errors.services && (
        <p className="text-red-400 text-xs mt-2">{errors.services.message}</p>
      )}

      {isOtherSelected && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="mb-2 block">Tell us more</label>
          <GlassTextarea
            {...register("otherServiceDetails")}
            placeholder="Tell us more about what you need..."
          />
          {errors.otherServiceDetails && (
            <p className="text-red-400 text-xs mt-1">
              {errors.otherServiceDetails.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Step4({
  control,
  errors,
  register,
}: {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
}) {
  const brandStages = [
    "A totally new brand (startup or new venture)",
    "An update or rebrand of an existing brand",
    "A line extension (new SKU in an existing range)",
    "An extension of something else (new category or market)",
  ];

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <label htmlFor="brandStage" className="mb-4 block ">
            This project is :
          </label>
          <Controller
            name="brandStage"
            control={control}
            render={({ field }) => (
              <GlassRadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-wrap gap-3"
              >
                {brandStages.map((stage) => (
                  <label
                    key={stage}
                    className="flex items-center max-h-8.5 gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
                  >
                    <GlassRadioGroupItem value={stage} id={stage} />
                    <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                      {stage}
                    </span>
                  </label>
                ))}
              </GlassRadioGroup>
            )}
          />
          {errors.brandStage && (
            <p className="text-red-400 text-xs mt-2">
              {errors.brandStage.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="projectDescription" className="mb-2 block ">
            Tell us a bit about your project
          </label>
          <GlassTextarea
            {...register("projectDescription")}
            placeholder="Type here"
          />
          {errors.projectDescription && (
            <p className="text-red-400 text-xs mt-1">
              {errors.projectDescription.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mainChallenge" className="mb-2 block ">
            What is your main challenge right now?
          </label>
          <GlassTextarea
            {...register("mainChallenge")}
            placeholder="Type here"
          />
          {errors.mainChallenge && (
            <p className="text-red-400 text-xs mt-1">
              {errors.mainChallenge.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step5({
  register,
  control,
  errors,
  setValue,
}: {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
}) {
  const investmentOptions = [
    "USD 10,000–15,000 — Entry single or focused scope, limited SKU",
    "USD 15,000–30,000 — Starter brand & packaging system",
    "USD 30,000–50,000 — Growth transformation / core rebrand / refresh",
    "USD 50,000–100,000 — Comprehensive rebrand / portfolio transformation",
    "USD 100,000+ — Multi-category, multi-market brand system",
  ];

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-12">
        <div>
          <span className="block text-base ">
            This investment reflects the brand system itself, scoped to the
            strategic depth, complexity, and commercial ambition of the project.{" "}
            <br /> <br />
          </span>
          <br />
          <div>
            <label htmlFor="investmentRange" className="mb-2 block font-bold ">
              Do you have an investment range in mind for this engagement?
            </label>
            <Controller
              name="investmentRange"
              control={control}
              render={({ field }) => (
                <GlassSelect
                  onValueChange={(val) => {
                    field.onChange(val); // Tetap update state dropdown-nya

                    // Ekstrak angka maksimum dari string (misal: "USD 10,000–15,000 — ..." -> "15000")
                    const nums = val.match(/\d[\d,]*/g);
                    const maxAmount = nums
                      ? nums
                          .map((n) => n.replace(/,/g, ""))
                          .sort((a, b) => Number(b) - Number(a))[0]
                      : "";

                    if (maxAmount) {
                      // Isi otomatis input specificInvestmentDetails
                      setValue("specificInvestmentDetails", maxAmount, {
                        shouldValidate: true, // Opsional: trigger validasi
                        shouldDirty: true, // Opsional: tandai form sudah diubah
                      });
                    }
                  }}
                  value={field.value}
                >
                  <GlassSelectTrigger>
                    <GlassSelectValue placeholder="Select your budget" />
                  </GlassSelectTrigger>
                  <GlassSelectContent>
                    <GlassSelectGroup>
                      {investmentOptions.map((range) => (
                        <GlassSelectItem
                          className="text-base"
                          key={range}
                          value={range}
                        >
                          {range}
                        </GlassSelectItem>
                      ))}
                    </GlassSelectGroup>
                  </GlassSelectContent>
                </GlassSelect>
              )}
            />
            {errors.investmentRange && (
              <p className="text-red-400 text-xs mt-2">
                {errors.investmentRange.message}
              </p>
            )}

            <p className="mt-2 block italic text-[#8C8C8C] text-sm">
              Investment scales with scope, complexity, and the level of system
              required. Full rebrands and multi-SKU brand systems typically
              require higher investment.
            </p>
          </div>
        </div>

        {/* <div>

          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="specificInvestmentDetails" className="mb-2 block">
              Do you have a specific budget to share?
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                <span className="text-white text-base font-medium opacity-70 group-focus-within:opacity-100 transition-opacity">
                  $
                </span>
              </div>

              <GlassInput
                {...register("specificInvestmentDetails")}
                type="number"
                inputMode="numeric" // Memunculkan keyboard angka di HP
                placeholder="0"
                className="pl-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20" // <--- Kuncinya di sini: memberikan ruang untuk simbol
              />
            </div>
          </div>

          <p className="text-[#8C8C8C] text-xs mt-2 italic">
            All amounts are in USD.
          </p>
        </div> */}
      </div>
    </div>
  );
}

function Step6({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const startOptions = [
    "Immediately",
    "In a month",
    "In 2-3 months",
    "In 3-6 months",
    "6 months or later",
  ];

  // 1. Tambahkan state untuk mengontrol buka-tutup Calendar Popover
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 2. Helper function untuk mencegah bug timezone (tanggal mundur 1 hari)
  const parseDateString = (dateString: string | undefined) => {
    if (!dateString) return undefined;
    // Menambahkan T00:00:00 memastikan JS membacanya di local timezone
    return new Date(`${dateString}T00:00:00`);
  };

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <label htmlFor="startDate" className="mb-2 block ">
            What's your timeline?
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <GlassRadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-wrap gap-3"
              >
                {startOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center max-h-8.5 gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
                  >
                    <GlassRadioGroupItem value={option} id={option} />
                    <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </GlassRadioGroup>
            )}
          />
          {errors.startDate && (
            <p className="text-red-400 text-xs mt-2">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="targetLaunchDate" className="mb-2 block ">
            Do you have a target launch date or internal deadline?
          </label>
          <Controller
            name="targetLaunchDate"
            control={control}
            render={({ field }) => (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-xl p-3 text-sm max-h-11.5",
                      "bg-white/30 backdrop-blur-xl border border-white/20",
                      "text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
                      "transition-all duration-300 hover:bg-white/40",
                      "focus:outline-none focus:border-white/40 focus:bg-white/15",
                      !field.value && "text-white/40",
                    )}
                  >
                    {field.value ? (
                      format(parseDateString(field.value) as Date, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-70" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-100 backdrop-blur-xl bg-black/60 border-white/20 text-white"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    // selected={parseDateString(field.value)}
                    onSelect={(date) => {
                      // Format tanggal ke string saat dipilih
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      // 3. Tutup popover otomatis sesudah klik
                      setIsCalendarOpen(false);
                    }}
                    initialFocus // Berikan fokus otomatis saat popover terbuka (best practice accessibility)
                    className="bg-transparent text-white"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div>
          <label htmlFor="howDidYouHear" className="mb-2 block ">
            How did you hear about us?
          </label>
          <GlassInput {...register("howDidYouHear")} placeholder="Type here" />
          {errors.howDidYouHear && (
            <p className="text-red-400 text-xs mt-1">
              {errors.howDidYouHear.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="additionalNotes" className="mb-2 block ">
            Anything else we should know before the call?
          </label>
          <GlassTextarea
            {...register("additionalNotes")}
            placeholder="Type here"
          />
        </div>
      </div>
    </div>
  );
}

export default function SheetForm({ onOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 6;

  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: defaultFormValues,
  });

  const handleClose = () => {
    onClose();
    // Reset form and step after the sheet slide-out animation completes
    setTimeout(() => {
      setStep(1);
      reset();
    }, 300);
  };

  // Validate only the fields of the current step before advancing
  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1)
      fieldsToValidate = [
        "name",
        "email",
        "company",
        "website",
        "businessLocation",
        "role",
      ];
    if (step === 2)
      fieldsToValidate = ["category", "primaryMarket", "revenueRange"];
    if (step === 3) fieldsToValidate = ["services", "otherServiceDetails"];
    if (step === 4)
      fieldsToValidate = ["brandStage", "mainChallenge", "projectDescription"];
    if (step === 5) fieldsToValidate = ["investmentRange"];
    if (step === 6) fieldsToValidate = ["startDate", "howDidYouHear"];

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      clearErrors();
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim data");
      }

      console.log("Form Submitted Successfully:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <GlassSheet open={onOpen} onOpenChange={handleClose}>
        <GlassSheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-[#ECFD01]/20 flex items-center justify-center mb-8">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ECFD01"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Thank you.
            </h2>
            <p className="text-white/70 leading-relaxed max-w-md">
              Your inquiry has been received. We’ll review it carefully and get
              back to you if it feels like a strong fit.
            </p>
            <GlassButton
              onClick={handleClose}
              className="mt-10"
              variant="primary"
            >
              Close
            </GlassButton>
          </div>
        </GlassSheetContent>
      </GlassSheet>
    );
  }

  return (
    <GlassSheet open={onOpen} onOpenChange={handleClose}>
      <GlassSheetContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <GlassSheetHeader>
          <div className="flex justify-between items-center">
            <p className=" opacity-70">
              {step}/{totalSteps}
            </p>
            <GlassSheetTitle className="text-base font-normal">
              {step === 1
                ? "Basic Information"
                : step === 2
                  ? "Business Details"
                  : step === 3
                    ? "Services"
                    : step === 4
                      ? "Project Context"
                      : step === 5
                        ? "Investment"
                        : "Timing & Final Notes"}
            </GlassSheetTitle>
            <button onClick={handleClose} className="cursor-pointer">
              <XIcon />
            </button>
          </div>
        </GlassSheetHeader>

        {/* Form Wrapper */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < totalSteps) {
              nextStep();
            } else {
              handleSubmit(onSubmit)(e);
            }
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Step Renders */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide">
            {step === 1 && (
              <Step1 register={register} errors={errors} control={control} />
            )}
            {step === 2 && (
              <Step2 register={register} errors={errors} control={control} />
            )}
            {step === 3 && (
              <Step3 register={register} control={control} errors={errors} />
            )}
            {step === 4 && (
              <Step4 control={control} register={register} errors={errors} />
            )}
            {step === 5 && (
              <Step5
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
              />
            )}
            {step === 6 && (
              <Step6 control={control} register={register} errors={errors} />
            )}
          </div>

          {/* Persistent Footer for Navigation */}
          <GlassSheetFooter className="mt-10 flex gap-3 justify-between items-center backdrop-blur-md p-4 -mx-6 -mb-6 border-t border-white/10">
            {step > 1 ? (
              <GlassButton type="button" onClick={prevStep} variant="ghost">
                Back
              </GlassButton>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <GlassButton type="button" onClick={nextStep} variant="primary">
                Next
              </GlassButton>
            ) : (
              <GlassButton type="submit" disabled={isLoading} variant="primary">
                {isLoading ? "Submitting..." : "Submit"}
              </GlassButton>
            )}
          </GlassSheetFooter>
        </form>
      </GlassSheetContent>
    </GlassSheet>
  );
}
