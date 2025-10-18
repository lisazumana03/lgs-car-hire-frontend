import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SignupForm({ ...props }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    // Prepare data for backend
    const signupData = {
      name: formData.name,
      idNumber: parseInt(formData.idNumber),
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      licenseNumber: formData.licenseNumber,
      password: formData.password,
      role: "CUSTOMER", // Default role
    };

    const result = await signup(signupData);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Signup failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Card {...props}>
      <CardHeader className="px-4 py-5 sm:px-6 sm:py-6">
        <CardTitle className="text-xl sm:text-2xl">Create an account</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-3 sm:space-y-4">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="name" className="text-sm">Full Name</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="John Doe" className="text-sm" value={formData.name} onChange={handleChange} required />
              </Field>
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="idNumber" className="text-sm">ID Number</FieldLabel>
                <Input id="idNumber" name="idNumber" type="text" placeholder="9001015800084" className="text-sm" value={formData.idNumber} onChange={handleChange} required />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="email" className="text-sm">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="phoneNumber" className="text-sm">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0821234567"
                  className="text-sm"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="dateOfBirth" className="text-sm">Date of Birth</FieldLabel>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="text-sm"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="licenseNumber" className="text-sm">License Number</FieldLabel>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="ABC123456"
                  className="text-sm"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="password" className="text-sm">Password</FieldLabel>
                <Input id="password" name="password" type="password" className="text-sm" value={formData.password} onChange={handleChange} required />
              </Field>
              <Field className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="confirm-password" className="text-sm">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" name="confirmPassword" type="password" className="text-sm" value={formData.confirmPassword} onChange={handleChange} required />
              </Field>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 pt-2">
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <FieldDescription className="text-center text-xs sm:text-sm">
                Already have an account? <a href="/login" className="text-primary hover:underline font-medium">Sign in</a>
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
