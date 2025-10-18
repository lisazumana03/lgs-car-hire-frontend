import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supportTicketAPI, SupportTicketDTO, TicketStatus } from "@/services/api";
import { Search, Plus, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { TicketStatusBadge, TicketPriorityBadge } from "@/components/support/TicketStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

export default function SupportTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [backendNotReady, setBackendNotReady] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const allTickets = await supportTicketAPI.getAll();

        const userTickets = user.role === "ADMIN"
          ? allTickets
          : allTickets.filter(ticket => ticket.user.userId === user.id);

        const sortedTickets = userTickets.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTickets(sortedTickets);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);

        if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
          setBackendNotReady(true);
          console.warn("Support ticket backend endpoints not yet implemented");
        } else {
          toast.error("Failed to load support tickets");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryLabel = (category: string) => {
    return category.split("_").map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === "OPEN").length,
      inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter(t => t.status === "RESOLVED").length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Manage your support requests and inquiries</p>
          </div>
          <Button onClick={() => navigate("/support/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-600">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <p className="text-xs text-gray-600">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-gray-600">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tickets by subject or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Backend Not Ready Message */}
        {backendNotReady ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Support Ticket System Coming Soon
                  </h3>
                  <p className="text-orange-800 text-sm mb-4">
                    The support ticket feature is currently being set up on our backend.
                    In the meantime, please contact us through the following channels:
                  </p>
                  <div className="space-y-2 text-sm text-orange-900">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      <a href="mailto:support@lgscarhire.com" className="underline hover:text-orange-700">
                        support@lgscarhire.com
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      <a href="tel:+27123456789" className="underline hover:text-orange-700">
                        +27 12 345 6789
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Hours:</span> Monday - Friday, 8:00 AM - 5:00 PM SAST
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/contact")}
                      className="border-orange-300 text-orange-900 hover:bg-orange-100"
                    >
                      Visit Contact Page
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              Loading tickets...
            </CardContent>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              {searchQuery || statusFilter !== "ALL"
                ? "No tickets found matching your criteria"
                : "You don't have any support tickets yet"}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.ticketID}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/support/ticket/${ticket.ticketID}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {ticket.subject}
                            </h3>
                            <span className="text-sm text-gray-500">
                              #{ticket.ticketID}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center mt-3">
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          {getCategoryLabel(ticket.category)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(ticket.createdAt)}
                        </div>
                        {ticket.replies && ticket.replies.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.replies.length} {ticket.replies.length === 1 ? "reply" : "replies"}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/support/ticket/${ticket.ticketID}`);
                    }}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
