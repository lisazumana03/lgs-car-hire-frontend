import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          aria-label="Go back to home"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Button>
      </div>

      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
