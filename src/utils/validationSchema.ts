import { z } from "zod";

export const employeeValidationSchema = z.object({
  id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Employee name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  organization: z.string().min(1, "Organization is required"),
  number: z.string().regex(/^[0-9]{10}$/, "Number must be 10 digits"),
  gender: z.string().min(1, "Gender is required"),
  company: z.string().min(1, "Company is required"),
});
