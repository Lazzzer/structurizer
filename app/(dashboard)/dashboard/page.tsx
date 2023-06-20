import { TopMainContent } from "@/components/top-main-content";

export default function DashboardPage() {
  return (
    <>
      <TopMainContent title="Dashboard" displayUploadButton />
      <div className="m-4">
        <h1>Content</h1>
      </div>
    </>
  );
}
