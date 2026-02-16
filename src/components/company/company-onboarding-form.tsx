"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2, Upload } from "lucide-react";
import z from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Company, getCompanyDetails, updateCompanyDetails, UpdateCompanyPayload } from "@/apiServices/company.api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

const companyOnboardingSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    industry: z.string(),
    otherIndustry: z.string().optional(),
    size: z.string(),
    otherSize: z.string().optional(),
    description: z.string().optional(),
    logo: z.any().optional(),
});

type CompanyOnboardingValues = z.infer<typeof companyOnboardingSchema>;

const INDUSTRIES = ["IT", "Finance", "Healthcare", "Education", "Other"];
const SIZES = ["1-10", "11-50", "51-200", "200+", "Other"];

export default function CompanyOnboardingForm() {
    const router = useRouter();
    const { user } = useAuth()
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<CompanyOnboardingValues>({
        resolver: zodResolver(companyOnboardingSchema),
        defaultValues: {
            name: "",
            email: companyData?.email || "",
            phone: "",
            address: "",
            industry: "",
            size: "",
            description: "",
        },
    });

    const watchIndustry = form.watch("industry");
    const watchSize = form.watch("size");

    // Fetch company details on mount
    useEffect(() => {
        const fetchCompany = async () => {
            if (!user?.id) return;
            setLoading(true)
            try {
                const data = await getCompanyDetails(user.id);
                setCompanyData(data);

                // Set form values
                form.reset({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    industry: data.industry || "",
                    size: data.companySize || "",
                    description: data.description || "",
                });

                if (data.logo) setLogoPreview(data.logo);
            } catch (err: any) {
                setLoading(false)
                console.error(err);
                toast(err?.message || "Failed to fetch company data");
            } finally {
                setLoading(false)
            }
        };

        fetchCompany();
    }, [user?.id, companyData?.email, form]);

    const handleSubmit = async (values: CompanyOnboardingValues) => {
        const industryValue =
            values.industry === "Other" && values.otherIndustry
                ? values.otherIndustry
                : values.industry;

        const sizeValue =
            values.size === "Other" && values.otherSize
                ? values.otherSize
                : values.size;

        const payload: UpdateCompanyPayload = {
            name: values.name,
            phone: values.phone,
            address: values.address,
            industry: industryValue,
            companySize: sizeValue,
            description: values.description,
            logo: values.logo,
        };

        try {
            const data = await updateCompanyDetails(user?.id, payload);

            toast.success("Company details saved successfully");
            router.push("/admin");
        } catch (error: any) {
            console.error(error);
            toast(error?.message || "Failed to save company details");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <Loader className="h-6 w-6 animate-spin transition ease-in" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
                noValidate
            >
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold">Company onboarding</h1>
                    <p className="text-sm text-muted-foreground">
                        Tell us a bit about your company
                    </p>
                </div>

                {/* Logo */}
                <div className="flex justify-center">
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormLabel>Company logo</FormLabel>
                                <FormControl>
                                    <label className="cursor-pointer">
                                        <div className="h-32 w-32 rounded-full border flex items-center justify-center overflow-hidden">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                field.onChange(file);
                                                setLogoPreview(URL.createObjectURL(file));
                                            }}
                                        />
                                    </label>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="+91 98765 43210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Industry */}
                    <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {INDUSTRIES.map((i) => (
                                            <SelectItem key={i} value={i}>
                                                {i}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Other Industry */}
                    {watchIndustry === "Other" && (
                        <FormField
                            control={form.control}
                            name="otherIndustry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Other industry</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter industry" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Company Size */}
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company size</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {SIZES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Other Size */}
                    {watchSize === "Other" && (
                        <FormField
                            control={form.control}
                            name="otherSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Other size</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter company size" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* About / Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About your company</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe what your company does"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Complete onboarding"
                    )}
                </Button>
            </form>
        </Form>
    );
}
