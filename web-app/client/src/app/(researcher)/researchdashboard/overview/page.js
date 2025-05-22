"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Loader2,
  Plus,
  Search,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ResearchDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Calculate time difference for "time ago" display
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  // Calculate days until meeting
  const getDaysUntilMeeting = (dateString) => {
    const meetingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = meetingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Past";
    return `In ${diffDays} days`;
  };

  // Get meeting status badge color
  const getMeetingStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "bg-emerald-500";
      case "CANCEL":
        return "bg-red-500";
      case "COMPLETE":
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  // Get meeting status icon
  const getMeetingStatusIcon = (status) => {
    switch (status) {
      case "UPCOMING":
        return <Clock className="h-4 w-4" />;
      case "CANCEL":
        return <XCircle className="h-4 w-4" />;
      case "COMPLETE":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Format meeting status for display
  const formatMeetingStatus = (status) => {
    switch (status) {
      case "UPCOMING":
        return "Upcoming";
      case "CANCEL":
        return "Cancelled";
      case "COMPLETE":
        return "Completed";
      default:
        return status;
    }
  };

  // Fetch meetings
  const fetchMeetings = async () => {
    try {
      const token = Cookies.get("AccessToken");
     

      const response = await fetch(`${url}/api/research`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      // Handle error notification
    } finally {
      setLoading(false);
    }
  };

  // Handle scheduling a new meeting
  const handleScheduleMeeting = () => {
    router.push("/researchdashboard/schedule/new");
  };

  // Handle updating meeting status
  const handleUpdateMeetingStatus = async (meetingId, newStatus) => {
    try {
      const token = Cookies.get("AccessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${url}/api/research/meetings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: meetingId,
          schedule: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update meeting status");
      }

      // Refresh meetings after update
      fetchMeetings();
    } catch (error) {
      console.error("Error updating meeting status:", error);
      // Handle error notification
    }
  };

  // Filter meetings based on search query and status filter
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && meeting.schedule === filterStatus;
  });

  // Get counts for dashboard stats
  const getUpcomingMeetingsCount = () =>
    meetings.filter((m) => m.schedule === "UPCOMING").length;
  const getCompletedMeetingsCount = () =>
    meetings.filter((m) => m.schedule === "COMPLETE").length;
  const getCancelledMeetingsCount = () =>
    meetings.filter((m) => m.schedule === "CANCEL").length;

  // Get next upcoming meeting
  const getNextUpcomingMeeting = () => {
    const upcomingMeetings = meetings.filter((m) => m.schedule === "UPCOMING");
    if (upcomingMeetings.length === 0) return null;

    return upcomingMeetings.sort(
      (a, b) =>
        new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime()
    )[0];
  };

  // Load data on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-muted-foreground">
            Loading your research dashboard...
          </p>
        </div>
      </div>
    );
  }

  const nextMeeting = getNextUpcomingMeeting();

  return (
    <div className="flex flex-col p-6 space-y-8 w-full max-w-[1600px] mx-auto">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
            Research Meetings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your research meetings and schedules
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meetings..."
              className="w-[200px] sm:w-[300px] pl-8 border-emerald-200 focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {getUpcomingMeetingsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
                      {getUpcomingMeetingsCount()}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                    ME
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">My Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-emerald-50">
            <CardTitle className="text-sm font-medium">
              Upcoming Meetings
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-emerald-600">
              {getUpcomingMeetingsCount()}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {nextMeeting
                  ? `Next: ${formatDate(
                      nextMeeting.meetingDate
                    )} at ${formatTime(nextMeeting.meetingDate)}`
                  : "No upcoming meetings"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-emerald-50">
            <CardTitle className="text-sm font-medium">
              Completed Meetings
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-emerald-600">
              {getCompletedMeetingsCount()}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {getCompletedMeetingsCount() > 0
                  ? `${Math.round(
                      (getCompletedMeetingsCount() / meetings.length) * 100
                    )}% completion rate`
                  : "No completed meetings"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-emerald-50">
            <CardTitle className="text-sm font-medium">
              Cancelled Meetings
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-emerald-600">
              {getCancelledMeetingsCount()}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {getCancelledMeetingsCount() > 0
                  ? `${Math.round(
                      (getCancelledMeetingsCount() / meetings.length) * 100
                    )}% cancellation rate`
                  : "No cancelled meetings"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-emerald-700">
              Schedule New Meeting
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Video className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <CardDescription>
            Set up a Google Meet session with your research team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Schedule a meeting, invite participants, and share your agenda in
            advance.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleScheduleMeeting}
          >
            <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
          </Button>
        </CardFooter>
      </Card>

      {/* Meetings List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Research Meetings</h2>
          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] h-9 text-sm border-emerald-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meetings</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="COMPLETE">Completed</SelectItem>
                <SelectItem value="CANCEL">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={handleScheduleMeeting}
            >
              <Plus className="mr-2 h-4 w-4" /> New Meeting
            </Button>
          </div>
        </div>

        {filteredMeetings.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 border-muted-foreground/20">
            <div className="flex flex-col items-center gap-2">
              <Video className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No meetings found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "Schedule your first meeting to get started"}
              </p>
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleScheduleMeeting}
              >
                <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="overflow-hidden hover:shadow-md transition-shadow border-emerald-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-emerald-50 p-4 md:p-6 flex flex-col justify-center items-center md:w-48 text-center">
                    <div className="text-2xl font-bold text-emerald-700">
                      {new Date(meeting.meetingDate).getDate()}
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(meeting.meetingDate).toLocaleString("default", {
                        month: "short",
                      })}
                    </div>
                    <div className="mt-2 text-xs text-emerald-600 font-medium">
                      {formatTime(meeting.meetingDate)}
                    </div>
                    <Badge
                      variant="outline"
                      className={`mt-2 ${
                        meeting.schedule === "CANCEL"
                          ? "border-red-200 text-red-700"
                          : meeting.schedule === "COMPLETE"
                          ? "border-blue-200 text-blue-700"
                          : "border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {getDaysUntilMeeting(meeting.meetingDate)}
                    </Badge>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {meeting.title}
                          </h3>
                          <Badge
                            className={`${getMeetingStatusColor(
                              meeting.schedule
                            )} flex items-center gap-1`}
                          >
                            {getMeetingStatusIcon(meeting.schedule)}
                            {formatMeetingStatus(meeting.schedule)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Duration: {meeting.duration} minutes
                        </p>
                      </div>
                      {meeting.meetingLink &&
                        meeting.schedule === "UPCOMING" && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2"
                            >
                              <Video className="h-4 w-4" />
                              Join Meet
                            </Button>
                          </a>
                        )}
                    </div>

                    {meeting.description && (
                      <div className="mt-3">
                        <p className="text-sm">{meeting.description}</p>
                      </div>
                    )}

                    {meeting.agenda && (
                      <div className="mt-3 bg-slate-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-slate-500 mb-1">
                          Agenda:
                        </p>
                        <p className="text-sm">{meeting.agenda}</p>
                      </div>
                    )}

                    {meeting.formLink && (
                      <div className="mt-3">
                        <a
                          href={meeting.formLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-800"
                        >
                          <FileText className="h-3 w-3" />
                          View Form
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    <div className="flex justify-between mt-4 pt-3 border-t">
                      <div className="flex gap-2">
                        {meeting.schedule === "UPCOMING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() =>
                                handleUpdateMeetingStatus(
                                  meeting.id,
                                  "COMPLETE"
                                )
                              }
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" /> Mark
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                handleUpdateMeetingStatus(meeting.id, "CANCEL")
                              }
                            >
                              <XCircle className="mr-1 h-4 w-4" /> Cancel
                            </Button>
                          </>
                        )}
                        {meeting.schedule === "CANCEL" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={() =>
                              handleUpdateMeetingStatus(meeting.id, "UPCOMING")
                            }
                          >
                            <Calendar className="mr-1 h-4 w-4" /> Reschedule
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 gap-1"
                      >
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Card className="border-emerald-100">
          <CardContent className="p-0">
            <div className="divide-y">
              {meetings.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <>
                  {/* Show recent meetings */}
                  {meetings
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5)
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center gap-4 p-4 hover:bg-emerald-50/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                            {meeting.creatorId ===
                            localStorage.getItem("userId")
                              ? "ME"
                              : "CR"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">
                              {meeting.creatorId ===
                              localStorage.getItem("userId")
                                ? "You"
                                : "Creator"}
                            </span>{" "}
                            {meeting.updatedAt !== meeting.createdAt
                              ? "updated"
                              : "scheduled"}{" "}
                            the meeting{" "}
                            <span className="font-medium">{meeting.title}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(meeting.updatedAt)}
                            </p>
                            <Badge
                              className={`${getMeetingStatusColor(
                                meeting.schedule
                              )} text-[10px] px-1 py-0 h-4 flex items-center`}
                            >
                              {formatMeetingStatus(meeting.schedule)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  );
}
