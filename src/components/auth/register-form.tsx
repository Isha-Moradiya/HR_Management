"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { signupSchema } from "@/validations/auth.validation";
import { register } from "@/apiServices/auth.api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import z from "zod";

export type RegisterFormValues = z.infer<typeof signupSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setEmail } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      // confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values);

      setEmail(values.email);

      toast({
        title: "Account created",
        description: "Please verify your email to continue",
      });

      router.push("/verify-otp?type=registration");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.32 1.53 7.77 2.81l5.68-5.68C33.93 3.5 29.45 1.5 24 1.5 14.73 1.5 6.73 6.84 3.01 14.57l6.63 5.15C11.4 13.53 17.2 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.07-.4-4.5H24v9h12.7c-.55 2.96-2.18 5.47-4.62 7.18l7.08 5.5c4.14-3.82 6.34-9.45 6.34-17.18z" />
            <path fill="#FBBC05" d="M9.64 28.72c-.45-1.35-.7-2.79-.7-4.22s.25-2.87.7-4.22l-6.63-5.15C1.07 18.28 0 21.07 0 24.5s1.07 6.22 3.01 9.37l6.63-5.15z" />
            <path fill="#34A853" d="M24 47.5c5.45 0 9.93-1.8 13.24-4.89l-7.08-5.5c-1.96 1.32-4.49 2.09-6.16 2.09-6.8 0-12.6-4.03-14.36-9.78l-6.63 5.15C6.73 41.16 14.73 47.5 24 47.5z" />
          </svg>
          Sign up with Google
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className={`underline underline-offset-4`}
          >
            Sign in
          </a>
        </div>

      </form>
    </Form >
  );
}

