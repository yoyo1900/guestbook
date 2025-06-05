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

export default function GuestbookClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  type FormData = {
    name: string;
    message: string;
    hide: boolean;
  };

  const form = useForm<FormData>({
    defaultValues: { name: "", message: "", hide: false },
  });

  type ErrorResponse = { error?: string };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json().catch(() => ({}))) as ErrorResponse;

      if (!res.ok) {
        throw new Error(json.error || "Submission failed");
      }

      form.reset();
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error(error);
      setServerError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. De Gregori" className="hover:border-gray-700" />
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
                <Textarea {...field} placeholder="e.g. I'm pleased to invite you" className="hover:border-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hide"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0" >
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormLabel className="cursor-pointer">Hide</FormLabel>
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-red-600">{serverError}</p>
        )}

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Adding..." : "Add Guest"}
        </Button>
      </form>
    </Form>
  );
}
