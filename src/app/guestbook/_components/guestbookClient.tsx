"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: { name: "", message: "", hide: false },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const jsonErr = await res.json().catch(() => ({}));
        throw new Error(
          (jsonErr as any).error || "Failed to submit. Try again."
        );
      }

      // Optionally read returned entry or just check success
      const json = await res.json();
      setSuccessMsg("Your entry was submitted!");
      form.reset();
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
        {successMsg && (
          <p className="text-sm text-green-600">{successMsg}</p>
        )}

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Submitting…" : "Sign Guestbook"}
        </Button>
      </form>
    </Form>
  );
}
