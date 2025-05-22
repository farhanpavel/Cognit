"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertCircle,
  BarChart,
  Calendar,
  CheckCircle,
  ChevronDown,
  Download,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

// Generate random participant data
const generateParticipants = () => {
  const firstNames = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "William",
    "Sophia",
    "James",
    "Isabella",
    "Benjamin",
    "Mia",
    "Lucas",
    "Charlotte",
    "Henry",
    "Amelia",
    "Alexander",
    "Harper",
    "Michael",
    "Evelyn",
    "Ethan",
    "Abigail",
    "Daniel",
    "Emily",
    "Matthew",
    "Elizabeth",
    "Joseph",
    "Sofia",
    "David",
    "Avery",
    "Jackson",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
    "Lopez",
    "Lee",
    "Gonzalez",
    "Harris",
    "Clark",
    "Lewis",
    "Robinson",
    "Walker",
    "Perez",
    "Hall",
  ];

  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "research.edu",
    "university.edu",
  ];

  const researchProjects = [
    "Climate Change Impact Analysis",
    "Machine Learning in Healthcare",
    "Urban Development Patterns",
    "Cognitive Behavioral Therapy Studies",
    "Sustainable Agriculture Methods",
    "Quantum Computing Applications",
    "Renewable Energy Solutions",
    "Educational Technology Outcomes",
    "Genetic Sequencing Research",
    "Microplastics in Marine Ecosystems",
  ];

  const roles = [
    "Research Subject",
    "Co-Investigator",
    "Data Contributor",
    "Survey Respondent",
    "Expert Advisor",
    "Focus Group Participant",
  ];

  const participants = [];

  // Generate dates from past 90 days
  const today = new Date();

  for (let i = 0; i < 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;

    const invitationDate = new Date(today);
    // Random days offset between 1 and 90 days in the past
    invitationDate.setDate(
      today.getDate() - Math.floor(Math.random() * 90) - 1
    );

    const acceptedDate = new Date(invitationDate);
    // Random days offset between 0 and 7 days after invitation
    acceptedDate.setDate(
      invitationDate.getDate() + Math.floor(Math.random() * 7)
    );

    // 80% completion rate
    const hasCompleted = Math.random() > 0.2;

    const completionDate = hasCompleted ? new Date(acceptedDate) : null;
    if (completionDate) {
      // Random days offset between 1 and 14 days after acceptance
      completionDate.setDate(
        acceptedDate.getDate() + Math.floor(Math.random() * 14) + 1
      );
    }

    // Ensure completion date is not in the future
    if (completionDate && completionDate > today) {
      completionDate.setDate(today.getDate());
    }

    // Randomly assign 1-3 projects
    const numProjects = Math.floor(Math.random() * 3) + 1;
    const assignedProjects = [];
    for (let j = 0; j < numProjects; j++) {
      const project =
        researchProjects[Math.floor(Math.random() * researchProjects.length)];
      if (!assignedProjects.includes(project)) {
        assignedProjects.push(project);
      }
    }

    participants.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`,
      invitationDate,
      acceptedDate,
      completionDate,
      status: completionDate ? "completed" : "active",
      role: roles[Math.floor(Math.random() * roles.length)],
      projects: assignedProjects,
      institution:
        Math.random() > 0.5
          ? `${lastName} University`
          : `${firstName} Research Institute`,
      contributions: Math.floor(Math.random() * 20) + 1,
      lastActive: new Date(
        today.getTime() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)
      ), // 0-15 days ago
    });
  }

  return participants;
};

const participants = generateParticipants();

export default function ParticipantManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [viewMode, setViewMode] = useState("list");

  // Filter participants based on search query and selected status
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || participant.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(
    (p) => p.status === "active"
  ).length;
  const completedParticipants = participants.filter(
    (p) => p.status === "completed"
  ).length;
  const completionRate = Math.round(
    (completedParticipants / totalParticipants) * 100
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedParticipants(filteredParticipants.map((p) => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleSelectParticipant = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((pId) => pId !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Participants
          </h1>
          <p className="text-muted-foreground">
            Oversee all the participants in your research projects
          </p>
        </div>
        <Button className="bg-tertiary hover:bg-tertiary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite New Participants
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(participants.flatMap((p) => p.projects)).size}{" "}
              projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Participants
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Currently participating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-tertiary rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
            <Calendar className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 days</div>
            <p className="text-xs text-muted-foreground">
              From invitation to acceptance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search participants by name or email..."
            className="pl-8 focus-visible:ring-tertiary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] focus-visible:ring-tertiary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Participants</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="completed">Completed Only</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="focus-visible:ring-tertiary">
                <Filter className="h-4 w-4 mr-2" />
                Project
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Array.from(new Set(participants.flatMap((p) => p.projects))).map(
                (project, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Checkbox id={`project-${index}`} />
                    <Label
                      htmlFor={`project-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {project}
                    </Label>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs
        defaultValue={viewMode}
        onValueChange={setViewMode}
        className="w-full"
      >
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Bulk Actions */}
          {selectedParticipants.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedParticipants.length ===
                      filteredParticipants.length
                    }
                    onCheckedChange={handleSelectAll}
                    className="mr-2 data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary"
                  />
                  <Label htmlFor="select-all">
                    {selectedParticipants.length} participant
                    {selectedParticipants.length > 1 ? "s" : ""} selected
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredParticipants.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No participants found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || selectedStatus !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Invite participants to your research projects to get started"}
                </p>
                <Button className="mt-4 bg-tertiary hover:bg-tertiary/90">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Participants
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredParticipants.map((participant) => (
                <Card key={participant.id} className="overflow-hidden">
                  <div className="flex items-start p-6">
                    <Checkbox
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={() =>
                        handleSelectParticipant(participant.id)
                      }
                      className="mt-1 mr-4 data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary"
                    />
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage
                        src={`/placeholder.svg?height=50&width=50&text=${participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback className="bg-tertiary/10 text-tertiary">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold truncate">
                          {participant.name}
                        </h3>
                        <Badge
                          className={
                            participant.status === "active"
                              ? "bg-tertiary"
                              : "bg-slate-500"
                          }
                        >
                          {participant.status.charAt(0).toUpperCase() +
                            participant.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {participant.email}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1 mt-2 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Role:</span>{" "}
                          {participant.role}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Joined:</span>{" "}
                          {formatDate(participant.acceptedDate)}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Projects:</span>{" "}
                          {participant.projects.length}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {participant.projects.map((project, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-tertiary/5 text-tertiary border-tertiary/20"
                          >
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-tertiary"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Message
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-3.5 w-3.5 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-3.5 w-3.5 mr-2" />
                            Share Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Remove Participant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {participant.status === "active" && (
                    <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm text-amber-700">
                        Research in progress:{" "}
                        {participant.completionDate
                          ? formatDate(participant.completionDate)
                          : "Pending completion"}
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* Grid View */}
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedParticipants.includes(participant.id)}
                        onCheckedChange={() =>
                          handleSelectParticipant(participant.id)
                        }
                        className="mr-2 data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary"
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=50&width=50&text=${participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}`}
                        />
                        <AvatarFallback className="bg-tertiary/10 text-tertiary">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Badge
                      className={
                        participant.status === "active"
                          ? "bg-tertiary"
                          : "bg-slate-500"
                      }
                    >
                      {participant.status.charAt(0).toUpperCase() +
                        participant.status.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">
                    {participant.name}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {participant.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium">{participant.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span className="font-medium">
                        {formatDate(participant.acceptedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projects:</span>
                      <span className="font-medium">
                        {participant.projects.length}
                      </span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {participant.projects.map((project, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-tertiary/5 text-tertiary border-tertiary/20"
                      >
                        {project.length > 20
                          ? project.substring(0, 20) + "..."
                          : project}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardContent className="pt-0 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-tertiary">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-3.5 w-3.5 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-3.5 w-3.5 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          <Checkbox
                            checked={
                              selectedParticipants.length ===
                                filteredParticipants.length &&
                              filteredParticipants.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                            className="data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary"
                          />
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Participant
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Role
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Projects
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Joined
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredParticipants.map((participant) => (
                        <tr
                          key={participant.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <Checkbox
                              checked={selectedParticipants.includes(
                                participant.id
                              )}
                              onCheckedChange={() =>
                                handleSelectParticipant(participant.id)
                              }
                              className="data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary"
                            />
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=50&width=50&text=${participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`}
                                />
                                <AvatarFallback className="bg-tertiary/10 text-tertiary text-xs">
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {participant.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {participant.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {participant.role}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap gap-1">
                              {participant.projects
                                .slice(0, 1)
                                .map((project, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-tertiary/5 text-tertiary border-tertiary/20"
                                  >
                                    {project.length > 15
                                      ? project.substring(0, 15) + "..."
                                      : project}
                                  </Badge>
                                ))}
                              {participant.projects.length > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  +{participant.projects.length - 1}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {formatDate(participant.acceptedDate)}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              className={
                                participant.status === "active"
                                  ? "bg-tertiary"
                                  : "bg-slate-500"
                              }
                            >
                              {participant.status.charAt(0).toUpperCase() +
                                participant.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MessageSquare className="h-4 w-4 text-tertiary" />
                                <span className="sr-only">Message</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Participant
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}
