"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Calendar,
  Clock,
  Copy,
  FileText,
  Info,
  Link,
  Loader2,
  Send,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { url } from "@/components/Url/page";

export default function ResearchScheduler() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMeetLink, setGeneratedMeetLink] = useState("");
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingDate: "",
    meetingTime: "",
    duration: "60",
    agenda: "",
    formLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meeting link copied to clipboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get("AccessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      // Format the date and time for the API
      const meetingDateTime = new Date(
        `${formData.meetingDate}T${formData.meetingTime}:00`
      );

      const meetingData = {
        title: formData.title,
        description: formData.description,
        meetingLink: generatedMeetLink,
        meetingDate: meetingDateTime.toISOString(),
        duration: Number.parseInt(formData.duration),
        agenda: formData.agenda,
        formLink: formData.formLink,
      };

      // Create the meeting
      const meetingResponse = await fetch(`${url}/api/research/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meetingData),
      });

      if (!meetingResponse.ok) {
        throw new Error("Failed to create meeting");
      }

      alert("Research meeting scheduled successfully!");
      router.push("/researchdashboard/schedule");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to schedule research meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "focus-visible:ring-tertiary focus-visible:border-tertiary focus-visible:ring-2";

  return (
    <div className="flex flex-col p-6 space-y-6 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Schedule Research Meeting
        </h1>
        <p className="text-muted-foreground">
          Create a new research meeting with Google Meet integration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Research Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-tertiary" />
              Research Project
            </CardTitle>
            <CardDescription>Enter your research project name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="projectId">Research Project Name</Label>
              <Input
                id="projectId"
                name="projectId"
                placeholder="Enter your research project name"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Meeting Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-tertiary" />
              Meeting Details
            </CardTitle>
            <CardDescription>
              Provide information about your research meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter meeting title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meeting Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the purpose of this meeting"
                value={formData.description}
                onChange={handleChange}
                className={cn("min-h-[100px]", inputClass)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingDate">Meeting Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="meetingDate"
                    name="meetingDate"
                    type="date"
                    value={formData.meetingDate}
                    onChange={handleChange}
                    className={cn("pl-10", inputClass)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="meetingTime"
                    name="meetingTime"
                    type="time"
                    value={formData.meetingTime}
                    onChange={handleChange}
                    className={cn("pl-10", inputClass)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("duration", value)
                  }
                  value={formData.duration}
                >
                  <SelectTrigger id="duration" className={inputClass}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                name="agenda"
                placeholder="List the topics to be discussed in this meeting"
                value={formData.agenda}
                onChange={handleChange}
                className={cn("min-h-[100px]", inputClass)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Meet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-tertiary" />
              Google Meet Link
            </CardTitle>
            <CardDescription>
              Enter your Google Meet link for the meeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Meeting Link</Label>
              <div className="flex bg-muted p-2 rounded-md items-center">
                <Input
                  placeholder="https://meet.google.com/..."
                  value={generatedMeetLink}
                  onChange={(e) => setGeneratedMeetLink(e.target.value)}
                  className={cn(
                    "bg-transparent border-0 focus-visible:ring-0",
                    inputClass
                  )}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generatedMeetLink)}
                  className="ml-2"
                  disabled={!generatedMeetLink}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste your Google Meet link above. This link will be saved with
                your research meeting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google Form Link Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-tertiary" />
              Google Form (Optional)
            </CardTitle>
            <CardDescription>
              Add a Google Form link for data collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="formLink">Google Form Link</Label>
              <div className="relative">
                <Link className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="formLink"
                  name="formLink"
                  placeholder="https://forms.google.com/..."
                  value={formData.formLink}
                  onChange={handleChange}
                  className={cn("pl-10", inputClass)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: Add a link to a Google Form for participant surveys or
                data collection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card className="bg-tertiary/5 border-tertiary/20">
          <CardHeader>
            <CardTitle className="text-tertiary">Schedule Meeting</CardTitle>
            <CardDescription>
              Review your information before submitting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This will create a new research meeting and send invitations to
              all project participants.
              {generatedMeetLink && " Your Google Meet link will be included."}
              {formData.formLink && " Your Google Form link will be included."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-tertiary hover:bg-tertiary/90 flex items-center gap-2"
              disabled={isLoading || !generatedMeetLink}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
