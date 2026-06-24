"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Save, Code, Palette } from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import { settingsSchema, SettingsInput } from "@/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/ui/Editor";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const { handleSubmit, control, reset } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { customCss: "", customJs: "" },
  });

  useEffect(() => {
    getSiteSettings().then((settings) => {
      if (settings) {
        reset({ customCss: settings.customCss || "", customJs: settings.customJs || "" });
      }
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    setSaving(true);
    try {
      const result = await updateSiteSettings(data);
      if (result.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Inject custom CSS and JavaScript into every public page</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} loading={saving} icon={<Save className="h-4 w-4" />}>
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Custom CSS</h3>
              <p className="text-xs text-slate-400">Injected as &lt;style&gt; in every public page</p>
            </div>
          </div>
          <Controller
            name="customCss"
            control={control}
            render={({ field }) => (
              <CodeEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={`/* Custom styles */\nbody { font-family: 'Georgia', serif; }\n.hero { background: linear-gradient(135deg, #667eea, #764ba2); }`}
                rows={14}
              />
            )}
          />
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Custom JavaScript</h3>
              <p className="text-xs text-slate-400">Injected as &lt;script&gt; before &lt;/body&gt; on every public page</p>
            </div>
          </div>
          <Controller
            name="customJs"
            control={control}
            render={({ field }) => (
              <CodeEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={`// Custom scripts\nconsole.log('Site loaded');\n// Google Analytics, chat widgets, etc.`}
                rows={14}
              />
            )}
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />} size="lg">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
