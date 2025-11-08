"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Save, Camera, Globe, MapPin, Twitter, Github, Linkedin } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: "",
    website: "",
    location: "",
    twitter: "",
    github: "",
    linkedin: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load full profile data
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
          twitter: data.twitter || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update session with new name
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
          },
        });

        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{user.name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge
              variant={
                user.role === "ADMIN" || user.role === "SUPERADMIN"
                  ? "destructive"
                  : "outline"
              }
            >
              {user.role === "ADMIN" || user.role === "SUPERADMIN"
                ? "Administrator"
                : "User"}
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Camera className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>

        <Separator />

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Additional Fields */}
          <Separator />
          <h3 className="font-semibold text-sm">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          <Separator />
          <h3 className="font-semibold text-sm">Social Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="@username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="github.com/username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    loadProfile();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}