import { EarningsPrep } from "../../components/EarningsPrep";

export default function DashboardPage() {
  const dummyUserId = "00000000-0000-0000-0000-000000000000";
  const dummyProjectId = "00000000-0000-0000-0000-000000000001";

  return (
    <main className="min-h-screen p-6">
      <EarningsPrep userId={dummyUserId} projectId={dummyProjectId} />
    </main>
  );
}
