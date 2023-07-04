import { TopMainContent } from "@/components/top-main-content";
import { PreferencesForm } from "./components/preferences-form";
import { getExtractions, getUserPreferences } from "@/lib/requests";
import { Status } from "@prisma/client";
import { DeleteSection } from "./components/delete-section";

export default async function SettingsPage() {
  const preferences = await getUserPreferences();
  const extractions = await getExtractions(Status.PROCESSED);
  return (
    <div className="h-full">
      <TopMainContent title="Settings" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900  mb-2">
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
