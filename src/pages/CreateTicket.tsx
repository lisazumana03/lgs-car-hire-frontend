import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportTicketAPI, CreateTicketData, TicketCategory, TicketPriority } from "@/services/api";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import axios from "axios";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "" as TicketCategory,
    priority: "" as TicketPriority,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.priority) {
      toast.error("Please select a priority");
      return;
    }

    try {
      setLoading(true);
      const ticketData: CreateTicketData = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      };

      const newTicket = await supportTicketAPI.create(ticketData);
      toast.success("Support ticket created successfully!");
      navigate(`/support/ticket/${newTicket.ticketID}`);
    } catch (error: any) {
      console.error("Failed to create ticket:", error);

      if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
        toast.error("Support ticket system is not yet available. Please contact us directly.");
        navigate("/support");
      } else {
        toast.error(error.response?.data?.message || "Failed to create ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "BOOKING_ISSUE", label: "Booking Issue" },
    { value: "PAYMENT_ISSUE", label: "Payment Issue" },
    { value: "VEHICLE_ISSUE", label: "Vehicle Issue" },
    { value: "ACCOUNT_ISSUE", label: "Account Issue" },
    { value: "GENERAL_INQUIRY", label: "General Inquiry" },
    { value: "COMPLAINT", label: "Complaint" },
    { value: "FEEDBACK", label: "Feedback" },
    { value: "OTHER", label: "Other" },
  ];

  const priorities = [
    { value: "LOW", label: "Low - Can wait a few days" },
    { value: "MEDIUM", label: "Medium - Should be addressed soon" },
    { value: "HIGH", label: "High - Needs attention" },
    { value: "URGENT", label: "Urgent - Critical issue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/support")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600 mt-1">Submit a new support request or inquiry</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Please provide detailed information about your issue or inquiry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Brief summary of your issue"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">
                  {formData.subject.length}/200 characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((prio) => (
                      <SelectItem key={prio.value} value={prio.value}>
                        {prio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide detailed information about your issue or inquiry..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  maxLength={2000}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/support")}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Tips for better support</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about the issue you're experiencing</li>
              <li>• Include relevant booking or transaction IDs if applicable</li>
              <li>• Describe the steps that led to the issue</li>
              <li>• Our team typically responds within 24-48 hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
