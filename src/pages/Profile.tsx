import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

const Profile = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const { coaches } = useData();
  const { id: coachId } = useParams();

  // Determine if we're viewing our own profile or a coach's profile
  const isViewingCoach = !!coachId;
  const viewedCoach = coachId ? coaches.find(coach => coach.id === coachId) : null;

  // If we're viewing a coach that doesn't exist, redirect to coaches page
  if (isViewingCoach && !viewedCoach) {
    return <Navigate to="/coaches" />;
  }

  // Use the appropriate profile data based on whether we're viewing our profile or a coach's
  const profileData = isViewingCoach ? viewedCoach : user;

  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    bio: profileData?.bio || "",
    specialty: profileData?.specialty || "",
    profilePicture: profileData?.profilePicture || ""
  });

  // Sync formData with profileData when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        bio: profileData.bio || "",
        specialty: profileData.specialty || "",
        profilePicture: profileData.profilePicture || ""
      });
    }
  }, [profileData]);

  const [isLoading, setIsLoading] = useState(false);

  // If not authenticated and trying to view own profile, redirect to login
  if (!isViewingCoach && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setFormData((prev) => ({
            ...prev,
            profilePicture: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        user?.role === "coach"
          ? `${BASE_URL}/coaches/${user.id}`
          : `${BASE_URL}/clients/${user.id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");

        // Update the user in context and localStorage
        const updatedUser = {
          ...user,
          ...data,
          id: data._id ? data._id : user.id,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Update the formData state
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          specialty: data.specialty || "",
          profilePicture: data.profilePicture || "",
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {isViewingCoach ? `${formData.name}'s Profile` : 'My Profile'}
                </CardTitle>
                <CardDescription>
                  {isViewingCoach 
                    ? `Learn more about ${formData.name} and their coaching services` 
                    : 'Update your personal information and profile settings'}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={formData.profilePicture} alt={formData.name} />
                      <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="picture"
                        className="cursor-pointer text-sm px-3 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                      >
                        Change Picture
                      </Label>
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {formData.bio ? (
                    <div className="space-y-1">
                      <Label htmlFor="bio">Bio</Label>
                      <p className="text-gray-700">{formData.bio}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us a bit about yourself..."
                        rows={4}
                      />
                    </div>
                  )}
                  {user?.role === "coach" && (
                    <div className="space-y-1">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        placeholder="e.g. Strength Training, Yoga, Diet, etc."
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;