"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ArrowBigRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Video,
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
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";

export default function MeetingsOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [meetings, setMeetings] = useState([]); // Simplified to single array
  const itemsPerPage = 5;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Fetch meetings from API
  const fetchMeetings = async () => {
    try {
      const token = Cookies.get("AccessToken");
      if (!token) {
        router.push("/login");
        return;
      }

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
      alert("Failed to load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  // Filter meetings based on search query and status
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "upcoming" && meeting.schedule === "UPCOMING") ||
      (statusFilter === "complete" && meeting.schedule === "COMPLETE") ||
      (statusFilter === "cancel" && meeting.schedule === "CANCEL");
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
  const paginatedMeetings = filteredMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meeting link copied to clipboard");
  };
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(
      currentMonth.getMonth() + (direction === "prev" ? -1 : 1)
    );
    setCurrentMonth(newMonth);
  };
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleCancel = async (meetingId) => {
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
          schedule: "CANCEL",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel meeting");
      }

      // Update the meetings state to reflect the cancellation immediately
      setMeetings(
        meetings.map((meeting) =>
          meeting.id === meetingId
            ? { ...meeting, schedule: "CANCEL" }
            : meeting
        )
      );

      alert("Meeting cancelled successfully");
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      alert("Failed to cancel meeting. Please try again.");
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getStatusColor = (schedule) => {
    switch (schedule) {
      case "UPCOMING":
        return "bg-tertiary text-white";
      case "COMPLETE":
        return "bg-slate-500";
      case "CANCEL":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatStatus = (schedule) => {
    switch (schedule) {
      case "UPCOMING":
        return "Upcoming";
      case "COMPLETE":
        return "Completed";
      case "CANCEL":
        return "Cancelled";
      default:
        return schedule;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-tertiary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Research Meetings
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled research meetings
          </p>
        </div>
        <Link href="/researchdashboard/schedule/new">
          <Button className="bg-tertiary hover:bg-tertiary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Schedule
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search meetings..."
            className="pl-8 focus-visible:ring-tertiary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] focus-visible:ring-tertiary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="complete">Completed</SelectItem>
              <SelectItem value="cancel">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="focus-visible:ring-tertiary"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {paginatedMeetings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Video className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No meetings found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Schedule your first research meeting to get started"}
                </p>
                <Link href="/researchdashboard/schedule/new" className="mt-4">
                  <Button className="bg-tertiary hover:bg-tertiary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedMeetings.map((meeting) => (
                <Card key={meeting.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {meeting.title}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(meeting.meetingDate)} •
                          <Clock className="h-3.5 w-3.5 mx-1" />
                          {formatTime(meeting.meetingDate)} • {meeting.duration}{" "}
                          minutes
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(meeting.schedule)}>
                        {formatStatus(meeting.schedule)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 text-tertiary mr-2" />
                        <span className="text-sm font-medium mr-1">
                          Meeting Link:
                        </span>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {meeting.meetingLink || "No link available"}
                        </span>
                        {meeting.meetingLink && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-6 w-6 p-0"
                            onClick={() => copyToClipboard(meeting.meetingLink)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="sr-only">Copy link</span>
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {meeting.formLink ? "Form attached" : "No form"}
                        </span>
                      </div>
                    </div>
                    {meeting.description && (
                      <div className="mt-3">
                        <p className="text-sm line-clamp-2">
                          {meeting.description}
                        </p>
                      </div>
                    )}
                    {meeting.agenda && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Agenda:</p>
                        <p className="text-sm line-clamp-2">{meeting.agenda}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-1">
                    {meeting.meetingLink && meeting.schedule === "UPCOMING" && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-tertiary border-tertiary hover:bg-tertiary/10"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Join Meeting
                        </Button>
                      </a>
                    )}
                    {!meeting.meetingLink &&
                      meeting.schedule === "UPCOMING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-tertiary border-tertiary hover:bg-tertiary/10"
                          onClick={() =>
                            router.push(
                              `/researchdashboard/schedule/${meeting.id}/edit`
                            )
                          }
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Meeting Link
                        </Button>
                      )}
                    {meeting.schedule !== "UPCOMING" && (
                      <Button variant="outline" size="sm" disabled>
                        {meeting.schedule === "COMPLETE"
                          ? "Meeting Completed"
                          : "Meeting Cancelled"}
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/researchdashboard/schedule/${meeting.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Manage
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.meetingLink && (
                            <DropdownMenuItem
                              onClick={() =>
                                copyToClipboard(meeting.meetingLink)
                              }
                            >
                              <Copy className="h-3.5 w-3.5 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          )}
                          {meeting.formLink && (
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(meeting.formLink)}
                            >
                              <Copy className="h-3.5 w-3.5 mr-2" />
                              Copy Form Link
                            </DropdownMenuItem>
                          )}
                          {meeting.schedule === "UPCOMING" && (
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => {
                                handleCancel(meeting.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Cancel Meeting
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredMeetings.length
                    )}{" "}
                    of {filteredMeetings.length} meetings
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-tertiary hover:bg-tertiary/90"
                              : ""
                          }
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Calendar View
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous month</span>
                </Button>
                <h2 className="text-sm font-medium">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next month</span>
                </Button>
              </div>
              <Select defaultValue="month">
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 bg-muted/20">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-sm font-medium"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 border-t">
                {(() => {
                  const daysInMonth = getDaysInMonth(currentMonth);
                  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
                  const days = [];

                  // Add blank cells for days before the first day of month
                  for (let i = 0; i < firstDayOfMonth; i++) {
                    days.push(
                      <div
                        key={`empty-${i}`}
                        className="min-h-[120px] border-b border-r bg-muted/10"
                      />
                    );
                  }

                  // Add cells for each day of the month
                  for (let i = 1; i <= daysInMonth; i++) {
                    const date = new Date(currentMonth);
                    date.setDate(i);
                    const dateStr = date.toISOString().split("T")[0];
                    const isToday =
                      new Date().toDateString() === date.toDateString();

                    // Find meetings for this date
                    const dayMeetings = meetings.filter(
                      (meeting) =>
                        new Date(meeting.meetingDate)
                          .toISOString()
                          .split("T")[0] === dateStr
                    );

                    days.push(
                      <div
                        key={i}
                        className={`min-h-[120px] border-b border-r p-1 ${
                          isToday ? "bg-tertiary/10" : "bg-white"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center h-7 w-7 rounded-full mb-1 text-xs font-medium ${
                            isToday ? "bg-tertiary text-white" : ""
                          }`}
                        >
                          {i}
                        </div>
                        <div className="space-y-1 max-h-[90px] overflow-y-auto pr-1 scrollbar-thin">
                          {dayMeetings.map((meeting) => (
                            <div
                              key={meeting.id}
                              className={`text-xs p-2 rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${getStatusColor(
                                meeting.schedule
                              )}`}
                              title={meeting.title}
                              onClick={() =>
                                router.push(
                                  `/researchdashboard/schedule/${meeting.id}`
                                )
                              }
                            >
                              <div className="font-medium truncate">
                                {meeting.title}
                              </div>
                              <div className="flex items-center mt-0.5">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(meeting.meetingDate)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Ensure we always have 42 cells (6 rows) for consistent height
                  while (days.length < 42) {
                    days.push(
                      <div
                        key={`empty-after-${days.length}`}
                        className="min-h-[120px] border-b border-r bg-muted/10"
                      />
                    );
                  }

                  return days;
                })()}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end space-x-4 p-4 border-t">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-tertiary mr-2"></div>
                  <span className="text-xs">Upcoming</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-500 mr-2"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">Cancelled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge className="bg-tertiary mr-2">
                {meetings.filter((m) => m.schedule === "UPCOMING").length}
              </Badge>
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Next:{" "}
              {meetings.filter((m) => m.schedule === "UPCOMING").length > 0
                ? formatDate(
                    meetings
                      .filter((m) => m.schedule === "UPCOMING")
                      .sort(
                        (a, b) =>
                          new Date(a.meetingDate) - new Date(b.meetingDate)
                      )[0].meetingDate
                  )
                : "No upcoming meetings"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge className="bg-slate-500 mr-2">
                {meetings.filter((m) => m.schedule === "COMPLETE").length}
              </Badge>
              Completed Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last:{" "}
              {meetings.filter((m) => m.schedule === "COMPLETE").length > 0
                ? formatDate(
                    meetings
                      .filter((m) => m.schedule === "COMPLETE")
                      .sort(
                        (a, b) =>
                          new Date(b.meetingDate) - new Date(a.meetingDate)
                      )[0].meetingDate
                  )
                : "No completed meetings"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge className="bg-red-500 mr-2">
                {meetings.filter((m) => m.schedule === "CANCEL").length}
              </Badge>
              Cancelled Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {meetings.filter((m) => m.schedule === "CANCEL").length > 0
                ? `${(
                    (meetings.filter((m) => m.schedule === "CANCEL").length /
                      meetings.length) *
                    100
                  ).toFixed(1)}% cancellation rate`
                : "No cancelled meetings"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
