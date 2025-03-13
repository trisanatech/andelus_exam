"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useEffect, useState } from "react";

export function ExamDetailsForm() {
  const form = useFormContext();
  // Fetch subjects from API; replace with your API route
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch("/api/teacher/subjects");
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Final Exam - Mathematics" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
 <FormField
          control={form.control}
          name="examCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exam Code ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
        control={form.control}
        name="isMock"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormLabel>Mock Exam?</FormLabel>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormItem>
        )}
      /> */}

        <FormField
          control={form.control}
          name="isMock"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <FormLabel>Mock Exam?</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Makes the exam appear in the mock exam section
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 border rounded-lg bg-background"
                >
                  <option value="" disabled>
                    {loading ? "Loading subjects..." : "Select a subject"}
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gradeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Level</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Grade ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date & Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value || new Date()}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={4}
                placeholder="Enter exam instructions..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="shuffleOptions"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <FormLabel>Shuffle Answer Options</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Randomize the order of answer choices
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="randomizeOrder"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <FormLabel>Randomize Question Order</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Present questions in random order
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
