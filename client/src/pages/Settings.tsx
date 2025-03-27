import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const sourceSchema = z.object({
  github: z.boolean(),
  producthunt: z.boolean(),
  twitter: z.boolean(),
  reddit: z.boolean(),
});

const apiSettingsSchema = z.object({
  openaiApiKey: z.string().min(1, { message: "API key is required" }),
  updateFrequency: z.enum(["daily", "hourly", "weekly"]),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  emailAddress: z.string().email().optional().or(z.literal("")),
  notifyOnHighRisk: z.boolean(),
  notifyOnMediumRisk: z.boolean(),
  notifyOnLowRisk: z.boolean(),
});

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const sourceForm = useForm<z.infer<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      github: settings?.sources?.github || false,
      producthunt: settings?.sources?.producthunt || false,
      twitter: settings?.sources?.twitter || false,
      reddit: settings?.sources?.reddit || false,
    },
  });

  const apiSettingsForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      openaiApiKey: settings?.api?.openaiApiKey || "",
      updateFrequency: settings?.api?.updateFrequency || "daily",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: settings?.notifications?.emailNotifications || false,
      emailAddress: settings?.notifications?.emailAddress || "",
      notifyOnHighRisk: settings?.notifications?.notifyOnHighRisk || true,
      notifyOnMediumRisk: settings?.notifications?.notifyOnMediumRisk || false,
      notifyOnLowRisk: settings?.notifications?.notifyOnLowRisk || false,
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSourceSubmit = (data: z.infer<typeof sourceSchema>) => {
    updateSettings.mutate({ sources: data });
  };

  const onApiSettingsSubmit = (data: z.infer<typeof apiSettingsSchema>) => {
    updateSettings.mutate({ api: data });
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    updateSettings.mutate({ notifications: data });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              <Skeleton className="h-10 w-24 mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-500">Configure your AI tool monitoring preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-slate-500">
                      Toggle between light and dark interface
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-slate-500">
                      Change application language
                    </p>
                  </div>
                  <select className="px-3 py-2 rounded-md border border-slate-300">
                    <option value="en">English</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Select which sources to monitor for new AI tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...sourceForm}>
                <form
                  onSubmit={sourceForm.handleSubmit(onSourceSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={sourceForm.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <div className="flex items-center">
                              <i className="ri-github-fill text-xl mr-2"></i>
                              GitHub
                            </div>
                          </FormLabel>
                          <FormDescription>
                            Monitor GitHub repositories for new AI tools
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={sourceForm.control}
                    name="producthunt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <div className="flex items-center">
                              <i className="ri-product-hunt-line text-xl mr-2"></i>
                              Product Hunt
                            </div>
                          </FormLabel>
                          <FormDescription>
                            Monitor Product Hunt for new AI tool launches
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={sourceForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <div className="flex items-center">
                              <i className="ri-twitter-x-line text-xl mr-2"></i>
                              Twitter/X
                            </div>
                          </FormLabel>
                          <FormDescription>
                            Monitor Twitter/X for mentions of new AI tools
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={sourceForm.control}
                    name="reddit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <div className="flex items-center">
                              <i className="ri-reddit-line text-xl mr-2"></i>
                              Reddit
                            </div>
                          </FormLabel>
                          <FormDescription>
                            Monitor Reddit for discussions on new AI tools
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={updateSettings.isPending}
                    className="mt-4"
                  >
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API keys and tool update frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiSettingsForm}>
                <form
                  onSubmit={apiSettingsForm.handleSubmit(onApiSettingsSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={apiSettingsForm.control}
                    name="openaiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your OpenAI API key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used for AI-powered analysis of tools
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={apiSettingsForm.control}
                    name="updateFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Frequency</FormLabel>
                        <select
                          className="w-full px-3 py-2 rounded-md border border-slate-300"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                        <FormDescription>
                          How often to check for new AI tools
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={updateSettings.isPending}
                    className="mt-4"
                  >
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to be notified about new AI tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel>Email Notifications</FormLabel>
                          <FormDescription>
                            Receive email alerts about new AI tools
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {notificationForm.watch("emailNotifications") && (
                    <FormField
                      control={notificationForm.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-2">
                    <FormLabel>Notification Preferences</FormLabel>
                    <FormField
                      control={notificationForm.control}
                      name="notifyOnHighRisk"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              High Risk Tools
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="notifyOnMediumRisk"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Medium Risk Tools
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="notifyOnLowRisk"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Low Risk Tools
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={updateSettings.isPending}
                    className="mt-4"
                  >
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
