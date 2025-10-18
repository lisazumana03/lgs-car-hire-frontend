import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supportTicketAPI, SupportTicketDTO, TicketReplyDTO } from "@/services/api";
import { ArrowLeft, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { TicketStatusBadge, TicketPriorityBadge } from "@/components/support/TicketStatusBadge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<SupportTicketDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;

      try {
        setLoading(true);
        const ticketData = await supportTicketAPI.getById(parseInt(ticketId));
        setTicket(ticketData);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);

        if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
          toast.error("Support ticket system is not yet available");
        } else {
          toast.error("Failed to load ticket details");
        }
        navigate("/support");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, navigate]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!ticket) return;

    try {
      setSubmittingReply(true);
      const newReply = await supportTicketAPI.addReply(ticket.ticketID, {
        message: replyMessage.trim(),
      });

      setTicket({
        ...ticket,
        replies: [...(ticket.replies || []), newReply],
      });

      setReplyMessage("");
      toast.success("Reply submitted successfully");
    } catch (error: any) {
      console.error("Failed to submit reply:", error);

      if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
        toast.error("Support ticket system is not yet available");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit reply");
      }
    } finally {
      setSubmittingReply(false);
    }
  };

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              Loading ticket details...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const isTicketClosed = ticket.status === "CLOSED" || ticket.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/support")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </div>

        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                  <span className="text-sm text-gray-500">#{ticket.ticketID}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {ticket.description}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Category</p>
                <p className="text-gray-900">{getCategoryLabel(ticket.category)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Created</p>
                <p className="text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Last Updated</p>
                <p className="text-gray-900">{formatDate(ticket.updatedAt)}</p>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <p className="text-gray-600 font-medium">Resolved</p>
                  <p className="text-gray-900">{formatDate(ticket.resolvedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600 font-medium">Submitted by</p>
                <p className="text-gray-900">{ticket.user.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>
              {ticket.replies && ticket.replies.length > 0
                ? `${ticket.replies.length} ${ticket.replies.length === 1 ? "reply" : "replies"}`
                : "No replies yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ticket.replies && ticket.replies.length > 0 ? (
              <div className="space-y-6">
                {ticket.replies.map((reply, index) => (
                  <div key={reply.replyID}>
                    {index > 0 && <Separator className="my-6" />}
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={
                          reply.userRole === "ADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }>
                          {getInitials(reply.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {reply.userName}
                          </span>
                          {reply.userRole === "ADMIN" && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Support Team
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No replies yet. {!isTicketClosed && "Be the first to reply!"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Reply Form */}
        {!isTicketClosed && (
          <Card>
            <CardHeader>
              <CardTitle>Add Reply</CardTitle>
              <CardDescription>
                Send a message to continue the conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  className="resize-none"
                  disabled={submittingReply}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {replyMessage.length}/2000 characters
                  </p>
                  <Button type="submit" disabled={submittingReply || !replyMessage.trim()}>
                    {submittingReply ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isTicketClosed && (
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="pt-6 text-center text-gray-600">
              This ticket has been {ticket.status.toLowerCase()}. No new replies can be added.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
