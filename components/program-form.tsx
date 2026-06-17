"use client";

import { useState, useEffect } from "react";
import {
  Controller,
  useForm,
  useWatch,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";
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

import {
  GlassSheet,
  GlassSheetContent,
  GlassSheetFooter,
  GlassSheetHeader,
  GlassSheetTitle,
} from "@/components/glass-sheet";
import { XIcon } from "../config/icons";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassCheckbox } from "@/components/glass-checkbox";
import { GlassTextarea } from "@/components/glass-textarea";
import { GlassRadioGroup, GlassRadioGroupItem } from "@/components/glass-radio";

const formSchema = z.object({
  // Slide 1
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email"),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().optional(),

  // Slide 2
  brandStage: z.string().min(1, "Brand Stage is required"),
  category: z.string().min(1, "Category / Industry is required"),
  primaryMarket: z.string().min(1, "Primary Market is required"),
  revenueRange: z.string().optional(),

  // Slide 3 - BRAND AUDIT
  auditReason: z.string().optional(),
  auditAspects: z.array(z.string()).optional(),
  auditDecision: z.string().optional(),
  auditDecisionOther: z.string().optional(),
  auditStudioExperience: z.string().optional(),

  // Slide 3 - BRAND CREATION
  creationAbout: z.string().optional(),
  creationStage: z.string().optional(),
  creationNeeds: z.array(z.string()).optional(),
  creationSkus: z.string().optional(),
  creationCompetitors: z.string().optional(),

  // Slide 3 - BRAND REFRESH
  refreshSignal: z.string().optional(),
  refreshPerformance: z.string().optional(),
  refreshWorkingAspects: z.string().optional(),
  refreshChangeAspects: z.array(z.string()).optional(),
  refreshChangeOther: z.string().optional(),
  refreshSkus: z.string().optional(),

  // Slide 3 - SCALE UP
  scaleNeed: z.string().optional(),
  scaleUrgentChallenge: z.string().optional(),
  scaleSkus: z.string().optional(),
  scaleGrowth: z.string().optional(),
  scaleExistingSystem: z.string().optional(),

  // Slide 3 - TURNAROUND
  turnaroundSignals: z.string().optional(),
  turnaroundDuration: z.string().optional(),
  turnaroundCause: z.string().optional(),
  turnaroundRebuildAspects: z.array(z.string()).optional(),
  turnaroundSkus: z.string().optional(),
  turnaroundInterventions: z.string().optional(),

  // Slide 4
  startDate: z.string().min(1, "Timeline is required"),
  targetLaunchDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  programType: string | null;
};

// =======================
// Step 1: About You
// =======================
function Step1({
  register,
  errors,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}) {
  return (
    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
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
          <label htmlFor="role" className="mb-2 block">
            Role
          </label>
          <GlassInput {...register("role")} placeholder="Type here" />
          {errors.role && (
            <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block">
            Location
          </label>
          <GlassInput {...register("location")} placeholder="Type here" />
          {errors.location && (
            <p className="text-red-400 text-xs mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="website" className="mb-2 block">
            Website (if applicable)
          </label>
          <GlassInput {...register("website")} placeholder="Type here" />
        </div>
      </div>
    </div>
  );
}

// =======================
// Step 2: About the Brand
// =======================
function Step2({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
}) {
  const brandStages = [
    "A new brand (not yet launched)",
    "Recently launched (under 2 years)",
    "Established (2 to 5 years)",
    "Mature (over 5 years)",
  ];

  const revenueOptions = [
    "Pre revenue",
    "Under USD 500K",
    "USD 500K to 2M",
    "USD 2M to 10M",
    "USD 10M+",
    "Prefer not to disclose",
  ];

  return (
    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <label className="mb-4 block">Brand Stage</label>
          <Controller
            name="brandStage"
            control={control}
            render={({ field }) => (
              <GlassRadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-3"
              >
                {brandStages.map((stage) => (
                  <label
                    key={stage}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
          <label className="mb-2 block">Category / Industry</label>
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
          <label className="mb-2 block">Primary Market</label>
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
          <label className="mb-4 block">Annual Revenue Range</label>
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
                    className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
    </div>
  );
}

// =======================
// Step 3: Dynamic Forms
// =======================
function BrandAuditForm({ register, errors, control }: any) {
  const aspects = [
    "Brand Positioning & Strategy",
    "Competitive Position in Category",
    "Shelf Performance & Packaging Impact",
    "Visual Identity System",
    "Brand Communication & Voice",
    "Digital Presence",
    "All of the above",
  ];

  const decisions = [
    "Whether to refresh or rebrand",
    "How to address declining performance",
    "Strategic direction before launching new products",
    "Internal alignment on brand direction",
    "Other",
  ];

  const experiences = [
    "Yes, and we are looking for a different perspective",
    "Yes, and we are happy with our current direction",
    "No, this would be our first",
  ];

  const auditDecision = useWatch({ control, name: "auditDecision" });

  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="mb-1 block">
          What prompted you to consider an audit?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Examples: declining performance, planned investment, considering a
          rebrand, internal disagreement about direction.
        </p>
        <GlassTextarea {...register("auditReason")} placeholder="Type here" />
        {errors.auditReason && (
          <p className="text-red-400 text-xs mt-1">
            {errors.auditReason.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          Which aspects do you want assessed?{" "}
        </label>
        <div className="flex flex-col gap-3">
          {aspects.map((item) => (
            <Controller
              key={item}
              name="auditAspects"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20">
                  <GlassCheckbox
                    checked={field.value?.includes(item)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      const updated = checked
                        ? [...current, item]
                        : current.filter((v: string) => v !== item);
                      field.onChange(updated);
                    }}
                  />
                  <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                    {item}
                  </span>
                </label>
              )}
            />
          ))}
        </div>
        {errors.auditAspects && (
          <p className="text-red-400 text-xs mt-1">
            {errors.auditAspects.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          What decision is this audit informing?{" "}
        </label>
        <Controller
          name="auditDecision"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {decisions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.auditDecision && (
          <p className="text-red-400 text-xs mt-2">
            {errors.auditDecision.message}
          </p>
        )}
        {auditDecision === "Other" && (
          <div className="mt-3">
            <GlassInput
              {...register("auditDecisionOther")}
              placeholder="Please specify..."
            />
            {errors.auditDecisionOther && (
              <p className="text-red-400 text-xs mt-1">
                {errors.auditDecisionOther.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          Have you worked with a brand studio before?{" "}
        </label>
        <Controller
          name="auditStudioExperience"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {experiences.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.auditStudioExperience && (
          <p className="text-red-400 text-xs mt-2">
            {errors.auditStudioExperience.message}
          </p>
        )}
      </div>
    </div>
  );
}

function BrandCreationForm({ register, errors, control }: any) {
  const stages = [
    "Idea stage, concept being developed",
    "Product in development, preparing for launch",
    "Soft launch, in market but not officially launched",
    "Funding secured, ready to build the brand",
  ];

  const needs = [
    "Brand Strategy & Positioning",
    "Brand Naming",
    "Brand Identity (logo, type, color system)",
    "Packaging Design",
    "Brand Guidelines",
    "Launch Visual Assets",
    "E-commerce / Digital Presence",
    "All of the above",
  ];

  const skus = [
    "1 hero SKU",
    "2 to 3 SKUs",
    "4 to 6 SKUs",
    "7+ SKUs",
    "Not yet decided",
  ];

  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="mb-1 block">
          Tell us about the brand you are building{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          What is the product, who is it for, and what gap in the market does it
          fill.
        </p>
        <GlassTextarea {...register("creationAbout")} placeholder="Type here" />
        {errors.creationAbout && (
          <p className="text-red-400 text-xs mt-1">
            {errors.creationAbout.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">Where is the brand right now?</label>
        <Controller
          name="creationStage"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {stages.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.creationStage && (
          <p className="text-red-400 text-xs mt-2">
            {errors.creationStage.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          What stage of the brand needs to be built?{" "}
        </label>
        <div className="flex flex-col gap-3">
          {needs.map((item) => (
            <Controller
              key={item}
              name="creationNeeds"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20">
                  <GlassCheckbox
                    checked={field.value?.includes(item)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      const updated = checked
                        ? [...current, item]
                        : current.filter((v: string) => v !== item);
                      field.onChange(updated);
                    }}
                  />
                  <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                    {item}
                  </span>
                </label>
              )}
            />
          ))}
        </div>
        {errors.creationNeeds && (
          <p className="text-red-400 text-xs mt-1">
            {errors.creationNeeds.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">How many SKUs at launch?</label>
        <Controller
          name="creationSkus"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {skus.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.creationSkus && (
          <p className="text-red-400 text-xs mt-2">
            {errors.creationSkus.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block">
          Are there competitors or reference brands you admire?
        </label>
        <p className="text-xs text-white/60 mb-2">
          Not to replicate, but to help us understand your sensibility.
        </p>
        <GlassTextarea
          {...register("creationCompetitors")}
          placeholder="Type here"
        />
      </div>
    </div>
  );
}

function BrandRefreshForm({ register, errors, control }: any) {
  const performances = [
    "Still strong, but losing relative edge",
    "Flat for the past 12 to 24 months",
    "Slight decline that is not yet alarming",
    "Steady, but the brand feels behind the business",
  ];

  const aspects = [
    "Brand Positioning",
    "Logo & Identity System",
    "Packaging Design",
    "Brand Communication & Voice",
    "Digital Presence",
    "Photography & Visual Style",
    "Other",
  ];

  const skus = [
    "1 to 3 SKUs",
    "4 to 8 SKUs",
    "9 to 15 SKUs",
    "16+ SKUs",
    "Not yet decided",
  ];

  const changeAspects = useWatch({
    control,
    name: "refreshChangeAspects",
    defaultValue: [],
  });

  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="mb-1 block">
          What is signaling that the brand needs a refresh?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Examples: stronger competitors, dated visual language, packaging
          losing shelf presence, brand disconnected from current direction.
        </p>
        <GlassTextarea {...register("refreshSignal")} placeholder="Type here" />
        {errors.refreshSignal && (
          <p className="text-red-400 text-xs mt-1">
            {errors.refreshSignal.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          How would you describe the brand's current performance?{" "}
        </label>
        <Controller
          name="refreshPerformance"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {performances.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.refreshPerformance && (
          <p className="text-red-400 text-xs mt-2">
            {errors.refreshPerformance.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block">
          What aspects of the current brand still work?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          This helps us understand what equity to preserve.
        </p>
        <GlassTextarea
          {...register("refreshWorkingAspects")}
          placeholder="Type here"
        />
        {errors.refreshWorkingAspects && (
          <p className="text-red-400 text-xs mt-1">
            {errors.refreshWorkingAspects.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          What aspects feel like they need to change?{" "}
        </label>
        <div className="flex flex-col gap-3">
          {aspects.map((item) => (
            <Controller
              key={item}
              name="refreshChangeAspects"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20">
                  <GlassCheckbox
                    checked={field.value?.includes(item)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      const updated = checked
                        ? [...current, item]
                        : current.filter((v: string) => v !== item);
                      field.onChange(updated);
                    }}
                  />
                  <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                    {item}
                  </span>
                </label>
              )}
            />
          ))}
        </div>
        {errors.refreshChangeAspects && (
          <p className="text-red-400 text-xs mt-1">
            {errors.refreshChangeAspects.message}
          </p>
        )}
        {changeAspects?.includes("Other") && (
          <div className="mt-3">
            <GlassInput
              {...register("refreshChangeOther")}
              placeholder="Please specify..."
            />
            {errors.refreshChangeOther && (
              <p className="text-red-400 text-xs mt-1">
                {errors.refreshChangeOther.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          How many SKUs are involved in the refresh?{" "}
        </label>
        <Controller
          name="refreshSkus"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {skus.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.refreshSkus && (
          <p className="text-red-400 text-xs mt-2">
            {errors.refreshSkus.message}
          </p>
        )}
      </div>
    </div>
  );
}

function ScaleUpForm({ register, errors, control }: any) {
  const challenges = [
    "Product range expansion (new SKUs, new categories)",
    "Market expansion (new countries, new channels)",
    "Brand architecture (sub brands, master brand structure)",
    "Packaging system extension across many SKUs",
    "Visual coherence breaking down across touchpoints",
  ];

  const skus = ["Under 10", "10 to 25", "26 to 50", "51+"];

  const systems = [
    "Yes, comprehensive and current",
    "Yes, but outdated or incomplete",
    "No formal system yet",
  ];

  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="mb-1 block">
          What is driving the need to scale the brand system?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Examples: expanding product range, entering new markets, building sub
          brand structure, preparing for distribution growth.
        </p>
        <GlassTextarea {...register("scaleNeed")} placeholder="Type here" />
        {errors.scaleNeed && (
          <p className="text-red-400 text-xs mt-1">
            {errors.scaleNeed.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          Which scale challenge is most urgent?{" "}
        </label>
        <Controller
          name="scaleUrgentChallenge"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {challenges.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.scaleUrgentChallenge && (
          <p className="text-red-400 text-xs mt-2">
            {errors.scaleUrgentChallenge.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          How many SKUs in your current portfolio?{" "}
        </label>
        <Controller
          name="scaleSkus"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {skus.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.scaleSkus && (
          <p className="text-red-400 text-xs mt-2">
            {errors.scaleSkus.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block">
          What is the projected growth in next 12 months?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Number of new SKUs, new markets, or new categories you plan to enter.
        </p>
        <GlassTextarea {...register("scaleGrowth")} placeholder="Type here" />
        {errors.scaleGrowth && (
          <p className="text-red-400 text-xs mt-1">
            {errors.scaleGrowth.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          Do you have an existing brand system or guidelines?{" "}
        </label>
        <Controller
          name="scaleExistingSystem"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {systems.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.scaleExistingSystem && (
          <p className="text-red-400 text-xs mt-2">
            {errors.scaleExistingSystem.message}
          </p>
        )}
      </div>
    </div>
  );
}

function TurnaroundForm({ register, errors, control }: any) {
  const durations = [
    "6 to 12 months",
    "1 to 2 years",
    "2 to 4 years",
    "More than 4 years",
  ];

  const aspects = [
    "Brand Positioning & Strategy",
    "Brand Identity System",
    "Packaging Design",
    "Brand Communication & Voice",
    "Digital Presence",
    "All of the above, comprehensive rebuild",
  ];

  const skus = [
    "1 to 5 SKUs",
    "6 to 12 SKUs",
    "13 to 25 SKUs",
    "26+ SKUs",
    "Not yet decided",
  ];

  const interventions = [
    "Yes, and they did not work",
    "Yes, partial improvement but not enough",
    "No, this is the first serious effort",
  ];

  return (
    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="mb-1 block">
          What signals are showing that the brand is declining?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Examples: falling sales, weakening shelf presence, loss of market
          share, distributor pushback, retail negotiation difficulty.
        </p>
        <GlassTextarea
          {...register("turnaroundSignals")}
          placeholder="Type here"
        />
        {errors.turnaroundSignals && (
          <p className="text-red-400 text-xs mt-1">
            {errors.turnaroundSignals.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          How long has the decline been happening?{" "}
        </label>
        <Controller
          name="turnaroundDuration"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {durations.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.turnaroundDuration && (
          <p className="text-red-400 text-xs mt-2">
            {errors.turnaroundDuration.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block">
          What do you believe is causing the decline?{" "}
        </label>
        <p className="text-xs text-white/60 mb-2">
          Your honest read, even if you are uncertain. We will diagnose this
          rigorously, but your perspective matters.
        </p>
        <GlassTextarea
          {...register("turnaroundCause")}
          placeholder="Type here"
        />
        {errors.turnaroundCause && (
          <p className="text-red-400 text-xs mt-1">
            {errors.turnaroundCause.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">What aspects need to be rebuilt? </label>
        <div className="flex flex-col gap-3">
          {aspects.map((item) => (
            <Controller
              key={item}
              name="turnaroundRebuildAspects"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20">
                  <GlassCheckbox
                    checked={field.value?.includes(item)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      const updated = checked
                        ? [...current, item]
                        : current.filter((v: string) => v !== item);
                      field.onChange(updated);
                    }}
                  />
                  <span className="text-[#8C8C8C] group-has-data-[state=checked]:text-white transition-colors">
                    {item}
                  </span>
                </label>
              )}
            />
          ))}
        </div>
        {errors.turnaroundRebuildAspects && (
          <p className="text-red-400 text-xs mt-1">
            {errors.turnaroundRebuildAspects.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          How many SKUs are in scope for the redesign?{" "}
        </label>
        <Controller
          name="turnaroundSkus"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
            >
              {skus.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.turnaroundSkus && (
          <p className="text-red-400 text-xs mt-2">
            {errors.turnaroundSkus.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-4 block">
          Have any previous interventions been attempted?{" "}
        </label>
        <Controller
          name="turnaroundInterventions"
          control={control}
          render={({ field }) => (
            <GlassRadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-3"
            >
              {interventions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
        {errors.turnaroundInterventions && (
          <p className="text-red-400 text-xs mt-2">
            {errors.turnaroundInterventions.message}
          </p>
        )}
      </div>
    </div>
  );
}

// =======================
// Step 4: Timeline
// =======================
function Step4({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const startOptions = [
    "Within 1 month",
    "1 to 3 months",
    "3 to 6 months",
    "Flexible",
  ];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const parseDateString = (dateString: string | undefined) => {
    if (!dateString) return undefined;
    return new Date(`${dateString}T00:00:00`);
  };

  return (
    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block">What's your timeline?</label>
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
                    className="flex items-center gap-3 px-4 py-2 rounded-xl btn cursor-pointer transition-all hover:bg-white/10 group has-data-[state=checked]:bg-white/15 has-data-[state=checked]:border-white/20"
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
          <label className="mb-2 block">Target Launch or Completion Date</label>
          <Controller
            name="targetLaunchDate"
            control={control}
            render={({ field }) => (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-xl p-3 text-sm min-h-[48px]",
                      "bg-white/5 border border-white/10",
                      "text-white transition-all duration-300 hover:bg-white/10",
                      "focus:outline-none focus:border-white/30",
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
                  className="w-auto p-0 z-[100] backdrop-blur-xl bg-black/60 border-white/20 text-white"
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
          <label className="mb-2 block">Anything else we should know?</label>
          <GlassTextarea
            {...register("additionalNotes")}
            placeholder="Type here"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProgramForm({ isOpen, onClose, programType }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      location: "",
      website: "",
      brandStage: "",
      category: "",
      primaryMarket: "",
      revenueRange: "",
      startDate: "",
      targetLaunchDate: "",
      additionalNotes: "",
      // Optional defaults
      auditAspects: [],
      creationNeeds: [],
      refreshChangeAspects: [],
      turnaroundRebuildAspects: [],
    },
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setIsSubmitted(false);
        reset();
      }, 300);
    }
  }, [isOpen, reset]);

  const validateStep3 = (): boolean => {
    let isValid = true;
    if (programType === "brand-audit") {
      if (!control._formValues.auditReason) {
        setError("auditReason", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.auditAspects?.length) {
        setError("auditAspects", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.auditDecision) {
        setError("auditDecision", { message: "Required" });
        isValid = false;
      }
      if (
        control._formValues.auditDecision === "Other" &&
        !control._formValues.auditDecisionOther
      ) {
        setError("auditDecisionOther", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.auditStudioExperience) {
        setError("auditStudioExperience", { message: "Required" });
        isValid = false;
      }
    } else if (programType === "brand-creation") {
      if (!control._formValues.creationAbout) {
        setError("creationAbout", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.creationStage) {
        setError("creationStage", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.creationNeeds?.length) {
        setError("creationNeeds", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.creationSkus) {
        setError("creationSkus", { message: "Required" });
        isValid = false;
      }
    } else if (programType === "brand-refresh") {
      if (!control._formValues.refreshSignal) {
        setError("refreshSignal", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.refreshPerformance) {
        setError("refreshPerformance", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.refreshWorkingAspects) {
        setError("refreshWorkingAspects", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.refreshChangeAspects?.length) {
        setError("refreshChangeAspects", { message: "Required" });
        isValid = false;
      }
      if (
        control._formValues.refreshChangeAspects?.includes("Other") &&
        !control._formValues.refreshChangeOther
      ) {
        setError("refreshChangeOther", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.refreshSkus) {
        setError("refreshSkus", { message: "Required" });
        isValid = false;
      }
    } else if (programType === "scale-up") {
      if (!control._formValues.scaleNeed) {
        setError("scaleNeed", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.scaleUrgentChallenge) {
        setError("scaleUrgentChallenge", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.scaleSkus) {
        setError("scaleSkus", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.scaleGrowth) {
        setError("scaleGrowth", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.scaleExistingSystem) {
        setError("scaleExistingSystem", { message: "Required" });
        isValid = false;
      }
    } else if (programType === "turnaround") {
      if (!control._formValues.turnaroundSignals) {
        setError("turnaroundSignals", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.turnaroundDuration) {
        setError("turnaroundDuration", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.turnaroundCause) {
        setError("turnaroundCause", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.turnaroundRebuildAspects?.length) {
        setError("turnaroundRebuildAspects", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.turnaroundSkus) {
        setError("turnaroundSkus", { message: "Required" });
        isValid = false;
      }
      if (!control._formValues.turnaroundInterventions) {
        setError("turnaroundInterventions", { message: "Required" });
        isValid = false;
      }
    }
    return isValid;
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1)
      fieldsToValidate = ["name", "email", "company", "role", "location"];
    if (step === 2)
      fieldsToValidate = ["brandStage", "category", "primaryMarket"];
    if (step === 4) fieldsToValidate = ["startDate"];

    let isStepValid = false;

    if (step === 3) {
      isStepValid = validateStep3();
    } else {
      isStepValid = await trigger(fieldsToValidate);
    }

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
    // Re-validate step 4 just in case
    const isStep4Valid = await trigger(["startDate"]);
    if (!isStep4Valid) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-program-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, programType }),
      });

      if (!response.ok) throw new Error("Gagal mengirim data");

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === 1) return "About You";
    if (step === 2) return "About the Brand";
    if (step === 3) return "Project Details";
    if (step === 4) return "Timeline";
    return "";
  };

  const renderStep3 = () => {
    switch (programType) {
      case "brand-audit":
        return (
          <BrandAuditForm
            register={register}
            errors={errors}
            control={control}
          />
        );
      case "brand-creation":
        return (
          <BrandCreationForm
            register={register}
            errors={errors}
            control={control}
          />
        );
      case "brand-refresh":
        return (
          <BrandRefreshForm
            register={register}
            errors={errors}
            control={control}
          />
        );
      case "scale-up":
        return (
          <ScaleUpForm register={register} errors={errors} control={control} />
        );
      case "turnaround":
        return (
          <TurnaroundForm
            register={register}
            errors={errors}
            control={control}
          />
        );
      default:
        return <div>Select a program</div>;
    }
  };

  if (isSubmitted) {
    return (
      <GlassSheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
              Your inquiry has been received. We'll review it carefully and get
              back to you soon.
            </p>
            <GlassButton onClick={onClose} className="mt-10" variant="primary">
              Close
            </GlassButton>
          </div>
        </GlassSheetContent>
      </GlassSheet>
    );
  }

  return (
    <GlassSheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <GlassSheetContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <GlassSheetHeader>
          <div className="flex justify-between items-center">
            <p className="opacity-70">
              {step}/{totalSteps}
            </p>
            <GlassSheetTitle className="text-base font-normal">
              {getStepTitle()}
            </GlassSheetTitle>
            <button onClick={onClose} className="cursor-pointer">
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
            {step === 1 && <Step1 register={register} errors={errors} />}
            {step === 2 && (
              <Step2 register={register} errors={errors} control={control} />
            )}
            {step === 3 && renderStep3()}
            {step === 4 && (
              <Step4 register={register} control={control} errors={errors} />
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
