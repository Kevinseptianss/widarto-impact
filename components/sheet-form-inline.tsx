"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

const roles = [
  "Founder",
  "Co-Founder",
  "CEO",
  "Brand Manager",
  "Marketing Manager",
  "Product Team",
  "Other",
];

const revenueOptions = [
  "Pre-revenue",
  "Under USD 500K",
  "USD 500K to 2M",
  "USD 2M to 10M",
  "USD 10M+",
  "Prefer not to disclose",
];

const serviceOptions = [
  { value: "brand_strategy", label: "Brand Strategy" },
  { value: "brand_naming", label: "Brand Naming" },
  { value: "brand_identity", label: "Brand Identity" },
  { value: "packaging_design", label: "Packaging Design" },
  { value: "launch_assets", label: "Launch & Go-to-Market Assets" },
  { value: "ecommerce_design", label: "eCommerce Website Design" },
  {
    value: "content_strategy",
    label: "Content Strategy & Creative Production",
  },
  { value: "creative_support", label: "Ongoing Creative Support" },
  { value: "other", label: "Need something else? Tell us more." },
];

const brandStages = [
  "A New brand",
  "An existing brand preparing for launch",
  "A brand refresh",
  "A product line extension",
  "A repositioning project",
];

const investmentOptions = [
  "From USD 10,000 — Focused scope / single deliverable",
  "USD 15,000 — USD 25,000",
  "USD 25,000 — USD 50,000",
  "USD 50,000 — USD 75,000",
  "USD 75,000 — USD 100,000",
  "USD 100,000+",
];

const startOptions = [
  "Immediately",
  "In a month",
  "In 2-3 months",
  "In 3-6 months",
  "6 months or later",
];

const parseDateString = (dateString: string | undefined) => {
  if (!dateString) return undefined;
  return new Date(`${dateString}T00:00:00`);
};

export default function SheetFormInline() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: defaultFormValues,
  });

  const selectedServices = useWatch({
    control,
    name: "services",
    defaultValue: [],
  });

  const isOtherSelected = selectedServices.includes("other");

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
      reset(defaultFormValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="text-center py-16">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFD01]/20">
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
          <h2 className="text-3xl font-semibold text-white">Thank you.</h2>
          <p className="mt-4 text-white/70">
            Your inquiry has been received. We’ll review it carefully and get
            back to you if it feels like a strong fit.
          </p>
          <GlassButton
            onClick={() => setIsSubmitted(false)}
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
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8C8C8C]">
          New project inquiry
        </p>
        <h1 className="mt-4 text-4xl font-semibold lg:text-5xl">
          Start your project with our Glass form
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base text-white/70">
          Fill out the full inquiry form below. All fields are visible on this
          page without a slide-out sheet.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <section className="space-y-6">
          <div className="text-lg font-semibold">Basic Information</div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block">
                Full Name
              </label>
              <GlassInput {...register("name")} placeholder="Type here" />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
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
                  <GlassSelect
                    onValueChange={field.onChange}
                    value={field.value}
                  >
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
                <p className="text-red-400 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-lg font-semibold">Business Details</div>
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
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-lg font-semibold">Services</div>
          <div className="flex flex-wrap gap-3">
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
                            : current.filter(
                                (val: string) => val !== item.value,
                              );
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
            <p className="text-red-400 text-xs">{errors.services.message}</p>
          )}
          {isOtherSelected && (
            <div>
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
        </section>

        <section className="space-y-6">
          <div className="text-lg font-semibold">Project Context</div>
          <div>
            <label htmlFor="brandStage" className="mb-4 block">
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
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-lg font-semibold">Investment</div>
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
                    const maxAmount = val.split(" ")[2]?.replace(/[^0-9]/g, "");
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
            <p className="mt-2 text-sm italic text-[#8C8C8C]">
              Investment scales with scope, complexity, and the level of system
              required.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-lg font-semibold">Timing & Final Notes</div>
          <div>
            <label htmlFor="startDate" className="mb-2 block">
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
            <label htmlFor="targetLaunchDate" className="mb-2 block">
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
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      className="bg-transparent text-white"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div>
            <label htmlFor="howDidYouHear" className="mb-2 block">
              How did you hear about us?
            </label>
            <GlassInput
              {...register("howDidYouHear")}
              placeholder="Type here"
            />
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
        </section>

        <div className="flex justify-end">
          <GlassButton type="submit" disabled={isLoading} variant="primary">
            {isLoading ? "Submitting..." : "Submit"}
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
