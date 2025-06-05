// components/GuestbookClient.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type FormData = {
  name: string;
  message: string;
  hide: boolean;
};

export default function GuestbookClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: { name: "", message: "", hide: false },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        throw new Error((json as any).error || "Submission failed");
      }

      form.reset();
      // This will cause `app/guestbook/page.tsx` to re‐fetch on the server
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md w-full"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          rules={{ required: "Message is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Your message" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hide"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormLabel>Hide my entry</FormLabel>
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-red-600">{serverError}</p>
        )}

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Submitting…" : "Sign Guestbook"}
        </Button>
      </form>
    </Form>
  );
}
