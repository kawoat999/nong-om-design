import { useTheme } from "@/components/layout/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { Moon, Sun, Laptop, LogOut, Camera, Loader2, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { profileService } from "@/services/profileService";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { signOut, user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Local state to display updated name/avatar immediately without needing Supabase refresh
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const trimmedName = editName.trim();

      // Check if anything changed
      if (trimmedName === user?.user_metadata?.full_name && !avatarPreview) {
        setIsEditing(false);
        setIsUpdating(false);
        return;
      }

      let savedToSheets = false;

      // 1. Save to Google Sheets (PRIMARY - must succeed)
      if (user?.id) {
        try {
          savedToSheets = await profileService.updateProfile({
            userId: user.id,
            displayName: trimmedName,
            avatarUrl: avatarPreview || user?.user_metadata?.avatar_url || '',
          });
        } catch (sheetError) {
          console.warn('Failed to save to Google Sheets:', sheetError);
        }
      }

      // 2. Try to update Supabase Auth (SECONDARY - optional)
      try {
        const updates: { fullName?: string; avatarUrl?: string } = {};
        if (trimmedName !== user?.user_metadata?.full_name) updates.fullName = trimmedName;
        if (avatarPreview) updates.avatarUrl = avatarPreview;

        if (Object.keys(updates).length > 0) {
          await updateProfile(updates);
        }
      } catch (supabaseError) {
        console.warn('Failed to sync to Supabase (continuing anyway):', supabaseError);
        // Continue anyway - Google Sheets is the primary source
      }

      // Success if at least Google Sheets was updated, or if user.id doesn't exist (new session)
      if (savedToSheets || !user?.id) {
        // Update local state to show changes immediately
        setDisplayName(trimmedName);
        if (avatarPreview) setSavedAvatar(avatarPreview);

        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        });
        setIsEditing(false);
        setAvatarPreview(null);
      } else {
        throw new Error('Could not save to database');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b shadow-sm pt-safe-top transition-colors duration-300">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h2>
          <Card className="p-4 border-none shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Customize how the app looks</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                  theme === 'light'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-gray-200 text-muted-foreground"
                )}
              >
                <Sun className="w-6 h-6" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                  theme === 'dark'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-gray-200 text-muted-foreground"
                )}
              >
                <Moon className="w-6 h-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                  theme === 'system'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-gray-200 text-muted-foreground"
                )}
              >
                <Laptop className="w-6 h-6" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account</h2>
          <Card className="p-6 border-none shadow-sm flex items-center justify-center bg-muted/20">
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center gap-4">
                {/* Avatar Section */}
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Avatar className="w-24 h-24 border-4 border-background shadow-xl transition-all group-hover:opacity-80">
                      <AvatarImage src={avatarPreview || savedAvatar || user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                        {(displayName || user?.user_metadata?.full_name || user?.email)?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Avatar Save Buttons - Show when new avatar selected */}
                {avatarPreview && !isEditing && (
                  <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatarPreview(null)}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                      Save Avatar
                    </Button>
                  </div>
                )}

                {/* Info Section */}
                <div className="text-center w-full max-w-xs space-y-3">
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your Display Name"
                        className="text-center font-medium"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setAvatarPreview(null);
                            setEditName(user?.user_metadata?.full_name || '');
                          }}
                          disabled={isUpdating}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-bold text-xl text-foreground">{displayName || user?.user_metadata?.full_name || 'User'}</h3>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditName(displayName || user?.user_metadata?.full_name || '');
                          }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <div className="bg-muted p-1.5 rounded-full hover:bg-muted/80">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-border w-full my-4" />

              <Button
                variant="outline"
                className="w-full justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Sign out error:', error);
                    toast({
                      title: "Error",
                      description: "Failed to sign out. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
