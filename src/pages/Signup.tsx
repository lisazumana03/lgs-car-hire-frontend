import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10 relative">
      {/* Back Button */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <Button
          variant="outline"
          aria-label="Go back to home"
          onClick={() => navigate("/")}
          className="gap-2 text-sm sm:text-base"
          size="sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          Home
        </Button>
      </div>

      <div className="w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
