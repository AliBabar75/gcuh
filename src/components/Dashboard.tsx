import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalStudents: number;
  formsSubmitted: number;
  formsPending: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    formsSubmitted: 0,
    formsPending: 0,
  });

  // ✅ Fetch dashboard stats
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Total students
      const { count: totalStudents } = await supabase
        .from("students")
        .select("*", { count: "exact" });

      // Submitted forms
      const { count: formsSubmitted } = await supabase
        .from("students")
        .select("*", { count: "exact" })
        .not("form_submitted_at", "is", null);

      // Pending forms
      const { count: formsPending } = await supabase
        .from("students")
        .select("*", { count: "exact" })
        .is("form_submitted_at", null);

      setStats({
        totalStudents: totalStudents || 0,
        formsSubmitted: formsSubmitted || 0,
        formsPending: formsPending || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Async fetch
    fetchDashboardData();

    // ✅ Realtime subscription
    const studentSub = supabase
      .channel("public:students")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(studentSub);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        {loading ? (
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 bg-red-700 " />
        ) : (
          <h1 className="text-2xl sm:text-3xl font-serif text-red-800">Admin Dashboard</h1>
        )}
      </header>

      {/* Overview cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            label: "Total Students",
            value: stats.totalStudents,
            onViewAll: () => navigate("/student"),
          },
          {
            label: "Forms Submitted",
            value: stats.formsSubmitted,
            onViewAll: () =>
              navigate("/formreview", { state: { filter: "submitted" } }),
          },
          {
            label: "Forms Pending",
            value: stats.formsPending,
            onViewAll: () =>
              navigate("/formreview", { state: { filter: "pending" } }),
          },
        ].map((card, i) => (
          <div key={i} className="border rounded-lg p-4 sm:p-6 shadow-sm">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24 sm:w-32 mb-2 bg-red-700" />
                <Skeleton className="h-6 sm:h-8 w-16 sm:w-20 mb-3 bg-red-700" />
                <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-red-700" />
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-gray-500">{card.label}</p>
                <p className="text-xl sm:text-2xl font-semibold">{card.value}</p>
                <button
                  className="mt-2 sm:mt-3 text-xs sm:text-sm underline"
                  onClick={card.onViewAll}
                >
                  View all
                </button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
          {loading ? <Skeleton className="h-5 sm:h-6 w-36 sm:w-48 bg-red-700" /> : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 sm:h-12 w-full rounded-md  bg-red-700git init" />
            ))
          ) : (
            <>
              <Button
                className="bg-red-700 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-auto"
                onClick={() => navigate("/register")}
              >
                Register New Student
              </Button>
              <Button
                className="bg-red-700 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-auto"
                onClick={() => navigate("/manage-session")}
              >
                Create New Exam
              </Button>
              <Button
                className="bg-red-700 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-auto"
                onClick={() => navigate("/attendance")}
              >
                Update Attendance
              </Button>
              <Button
                className="bg-red-700 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-auto"
                onClick={() => navigate("/formreview")}
              >
                View Form Submissions
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
