import { TopMainContent } from "@/components/top-main-content";
import { PreferencesForm } from "./components/preferences-form";
import { Status } from "@prisma/client";
import { DeleteSection } from "./components/delete-section";
import { getExtractions, getPreferences } from "@/lib/server-requests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Main page for user settings",
};

export default async function SettingsPage() {
  const preferences = await getPreferences();
  const extractions = await getExtractions(Status.PROCESSED);
  return (
    <div className="h-full">
      <TopMainContent title="Settings" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Data Extraction Preferences
          </h1>
          <PreferencesForm
            preferences={preferences}
            extractions={extractions}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account</h1>
          <DeleteSection />
        </div>
      </div>
    </div>
  );
}
