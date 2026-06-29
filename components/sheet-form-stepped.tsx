"use client";

import { useState } from "react";
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
import { CalendarIcon, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassTextarea } from "@/components/glass-textarea";
import { GlassCheckbox } from "@/components/glass-checkbox";
import { GlassRadioGroup, GlassRadioGroupItem } from "@/components/glass-radio";
import {
  GlassSelect,
  GlassSelectContent,
  GlassSelectGroup,
  GlassSelectItem,
  GlassSelectTrigger,
  GlassSelectValue,
} from "./glass-select";
import { formSchema, FormData, defaultFormValues } from "./sheet-form-schema";

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
    <div className="lg:space-y-6 lg:grid lg:grid-cols-2 lg:gap-x-6">
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
          <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="mb-2 block">
          Website or Social Media
        </label>
        <GlassInput {...register("website")} placeholder="Type here" />
      </div>

      <div>
        <label htmlFor="businessLocation" className="mb-2 block">
          Where is your business based?
        </label>
        <GlassInput
          {...register("businessLocation")}
          placeholder="City / Country"
        />
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
          <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
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
    <div className="space-y-6">
      <span className="mb-6 block text-base">
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
    <div className="space-y-6">
      <div>
        <label htmlFor="brandStage" className="mb-4 block">
          This project is:
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

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
        <div>
          <label htmlFor="projectDescription" className="mb-2 block">
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
          <label htmlFor="mainChallenge" className="mb-2 block">
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
  control,
  errors,
  setValue,
}: {
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
    <div className="space-y-6">
      <div>
        <span className="block text-base">
          This investment reflects the brand system itself, scoped to the
          strategic depth, complexity, and commercial ambition of the project.
        </span>
      </div>

      <div>
        <label htmlFor="investmentRange" className="mb-2 block font-bold">
          Do you have an investment range in mind for this engagement?
        </label>
        <Controller
          name="investmentRange"
          control={control}
          render={({ field }) => (
            <GlassSelect
              onValueChange={(val) => {
                field.onChange(val);
                const nums = val.match(/\d[\d,]*/g);
                const maxAmount = nums
                  ? nums
                      .map((n) => n.replace(/,/g, ""))
                      .sort((a, b) => Number(b) - Number(a))[0]
                  : "";
                if (maxAmount) {
                  setValue("specificInvestmentDetails", maxAmount, {
                    shouldValidate: true,
                    shouldDirty: true,
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
          required.
        </p>
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
    "ASAP, somewhere within the next 2 weeks",
    "Soon, the next month would be fantastic",
    "Within the next 3 months, at the latest",
    "No rush, whatever works best for your team",
  ];

  const targetLaunchOptions = [
    "In 2 - 3 months",
    "Within the next 6 months",
    "In about a year",
    "Not sure yet",
  ];

  const referalOptions = [
    "A client referral",
    "A friend or colleague",
    "Google",
    "Instagram",
    "LinkedIn",
    "Behance",
    "World Brand Design Society",
    "I've been following your work for some time",
    "Other",
  ];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const parseDateString = (dateString: string | undefined) => {
    if (!dateString) return undefined;
    return new Date(`${dateString}T00:00:00`);
  };

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="startDate" className="mb-2 block">
          When would you like to kick off the project?
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
        <label htmlFor="targetLaunchDate" className="mb-2 block">
          When would you like to see the project completed?
        </label>
        <Controller
          name="targetLaunchDate"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {targetLaunchOptions.map((option) => (
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
      </div>

      <div>
        <label htmlFor="howDidYouHear" className="mb-2 block">
          How did you hear about us?
        </label>
        <Controller
          name="howDidYouHear"
          control={control}
          render={({ field }) => (
            <GlassSelect onValueChange={field.onChange} value={field.value}>
              <GlassSelectTrigger>
                <GlassSelectValue
                  className="placeholder:text-muted"
                  placeholder="I found you through"
                />
              </GlassSelectTrigger>
              <GlassSelectContent>
                <GlassSelectGroup>
                  {referalOptions.map((range) => (
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
        {errors.howDidYouHear && (
          <p className="text-red-400 text-xs mt-1">
            {errors.howDidYouHear.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="additionalNotes" className="mb-2 block">
          Anything else we should know before the call?
        </label>
        <GlassTextarea
          {...register("additionalNotes")}
          placeholder="Type here"
        />
      </div>
    </div>
  );
}

export default function SheetFormStepped() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleNext = async () => {
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

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

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
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
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
          <h2 className="text-3xl font-semibold mb-4 text-white">Thank you.</h2>
          <p className="text-white/70 leading-relaxed max-w-md">
            Your inquiry has been received. We’ll review it carefully and get
            back to you if it feels like a strong fit.
          </p>
          <GlassButton
            onClick={() => {
              reset(defaultFormValues);
              setIsSubmitted(false);
              setStep(1);
            }}
            className="mt-10"
            variant="primary"
          >
            Submit another inquiry
          </GlassButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-white/10 px-4.5 py-9 lg:px-8 lg:py-9 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-12 text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8C8C8C]">
          New project inquiry
        </p>
        {/* <h1 className="mt-8 text-4xl font-semibold lg:text-5xl">
          Start your project
        </h1>
        <p className="mt-1.5 max-w-2xl text-base text-white/70">
          Use the stepped form below to complete your inquiry in the same format
          as the slide sheet.
        </p> */}
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 rounded-[1.5rem] bg-white/5 p-4 text-sm text-white/70">
        <div>
          Step {step} of {totalSteps}
        </div>
        <div
          style={{ minWidth: 220 }}
          className="overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-2 rounded-full bg-[#ECFD01] transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < totalSteps) {
            handleNext();
          } else {
            handleSubmit(onSubmit)(e);
          }
        }}
        className="space-y-10"
      >
        <div className="space-y-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
            <div className="mb-15 flex items-center justify-between gap-4">
              <div>
                {/* <p className="text-sm uppercase tracking-[0.3em] text-[#8C8C8C]">
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
                </p> */}
                <h2 className="text-2xl font-semibold text-white">
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
                </h2>
              </div>
            </div>
            <div className="text-white/90">
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
                <Step4 register={register} control={control} errors={errors} />
              )}
              {step === 5 && (
                <Step5 control={control} errors={errors} setValue={setValue} />
              )}
              {step === 6 && (
                <Step6 register={register} control={control} errors={errors} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <GlassButton
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 1}
            className="w-full sm:w-auto"
          >
            Back
          </GlassButton>
          <GlassButton
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
          >
            {step < totalSteps
              ? "Next"
              : isLoading
                ? "Submitting..."
                : "Submit"}
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
