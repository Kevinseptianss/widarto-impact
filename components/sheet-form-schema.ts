import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  businessLocation: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  category: z.string().min(1, "Category / Industry is required"),
  primaryMarket: z.string().min(1, "Primary Market is required"),
  revenueRange: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  otherServiceDetails: z.string().optional(),
  brandStage: z.string().min(1, "Please select your brand stage"),
  projectDescription: z.string().min(1, "Project description is required"),
  mainChallenge: z.string().optional(),
  investmentRange: z.string().min(1, "Investment range is required"),
  specificInvestmentDetails: z.string().optional(),
  startDate: z.string().min(1, "Start date preference is required"),
  targetLaunchDate: z.string().optional(),
  howDidYouHear: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const defaultFormValues: FormData = {
  name: "",
  email: "",
  company: "",
  website: "",
  businessLocation: "",
  role: "",
  category: "",
  primaryMarket: "",
  revenueRange: "",
  services: [],
  otherServiceDetails: "",
  brandStage: "",
  projectDescription: "",
  mainChallenge: "",
  investmentRange: "",
  specificInvestmentDetails: "",
  startDate: "",
  targetLaunchDate: "",
  howDidYouHear: "",
  additionalNotes: "",
};
