import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TopMainContent } from "@/components/top-main-content";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { PreferencesForm } from "./preferences-form";
import { getUserPreferences } from "@/lib/requests";

export default async function SettingsPage() {
  const preferences = await getUserPreferences();
  return (
    <div className="h-full">
      <TopMainContent title="Settings" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900  mb-2">
            Data Extraction Preferences
          </h1>
          <PreferencesForm preferences={preferences} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account</h1>
          <div className="border border-red-200 rounded-lg p-4">
            <h2 className="font-bold text-slate-800 text-lg">Delete Account</h2>
            <p className="text-slate-600">
              This action will permanently delete your account and all the data
              associated with it.
            </p>
            <Button variant={"destructive"} className="w-40 mt-4">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
