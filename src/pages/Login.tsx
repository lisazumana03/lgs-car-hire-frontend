import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login1 = ({
  heading = "Login",
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "LGS Car Hire",
    title: "LGS Car Hire",
  },
  buttonText = "Login",
  signupText = "Need an account?",
  signupUrl = "/signup",
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful!");

      // Navigate based on user role
      if (result.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      toast.error(result.error || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="bg-muted min-h-screen relative">
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

      <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
          <a href={logo.url}>
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-8 sm:h-10"
            />
          </a>
          <form onSubmit={handleSubmit} className="border-muted bg-background flex w-full max-w-[90%] sm:max-w-sm flex-col items-center gap-y-3 sm:gap-y-4 rounded-md border px-4 py-6 sm:px-6 sm:py-8 shadow-md">
            {heading && <h1 className="text-lg sm:text-xl font-semibold">{heading}</h1>}
            <Input
              type="email"
              placeholder="Email"
              className="text-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="text-sm w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? "Logging in..." : buttonText}
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-xs sm:text-sm">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login1;
