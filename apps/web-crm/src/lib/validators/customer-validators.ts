import { z } from "zod";

export const createCustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email address is required"),
  phoneNumber: z.string().optional(),
  customerType: z.enum(["Regular", "InstitutionalBuyer", "VIP", "Lead"]),
  address: z.string().optional(),
});

export type CreateCustomerFormInput = z.infer<typeof createCustomerSchema>;
