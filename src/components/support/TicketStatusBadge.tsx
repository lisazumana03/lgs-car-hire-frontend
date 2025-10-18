import { Badge } from "@/components/ui/badge";
import { TicketStatus, TicketPriority } from "@/services/api";

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusStyles()} ${className || ""}`}>
      {getStatusLabel()}
    </Badge>
  );
}

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const getPriorityStyles = () => {
    switch (priority) {
      case "LOW":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "URGENT":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityLabel = () => {
    switch (priority) {
      case "LOW":
        return "Low";
      case "MEDIUM":
        return "Medium";
      case "HIGH":
        return "High";
      case "URGENT":
        return "Urgent";
      default:
        return priority;
    }
  };

  return (
    <Badge className={`${getPriorityStyles()} ${className || ""}`}>
      {getPriorityLabel()}
    </Badge>
  );
}
