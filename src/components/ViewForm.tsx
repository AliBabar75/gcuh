import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";

interface Student {
  id: string;
  fullname: string;
  program: string;
  batch: string | null;
  created_at: string;
  form_submitted_at: string | null;
}

export default function FormReview() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select(
        "id, fullname, program, batch, created_at, form_submitted_at"
      );

    if (error) {
      alert("Failed to load students!");
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

useEffect(() => {
  const init = async () => {
    await fetchStudents();
  };
  init();

  // subscribe, but do NOT return this promise
  const studentSub = supabase.channel("public:students").on(
    "postgres_changes",
    { event: "*", schema: "public", table: "students" },
    () => {
      fetchStudents().catch(console.error);
    }
  ).subscribe();

  // cleanup must be synchronous
  return () => {
    supabase.removeChannel(studentSub);
  };
}, []);

  const filtered = students.filter(
    (row) =>
      row.fullname.toLowerCase().includes(search.toLowerCase()) ||
      row.program.toLowerCase().includes(search.toLowerCase()) ||
      (row.batch?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading)
    return <p className="p-8 text-gray-700">Loading student submissions...</p>;

  const submittedCount = students.filter(s => s.form_submitted_at).length;
  const pendingCount = students.filter(s => !s.form_submitted_at).length;

  return (
    <div className="min-h-screen bg-white p-8">
      <Button
        variant="outline"
        onClick={() => navigate("/home")}
        className=" mb-5 px-4 py-2"
      >
        ← Back
      </Button>
      <h1 className="text-2xl font-serif text-red-800 mb-6">
        Form Submission Review
      </h1>

      {/* Filter + Actions */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <Button className="bg-green-700 text-white rounded-lg">
          Submitted ({submittedCount})
        </Button>
        <Button className="bg-yellow-500 text-white rounded-lg">
          Pending ({pendingCount})
        </Button>
        <div className="flex-grow md:flex md:justify-end gap-2">
          <Input
            type="text"
            placeholder="Search by name, batch, or program"
            className="max-w-xs border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="bg-red-700 text-white"
            onClick={() => alert("Export feature coming soon!")}
          >
            Export All Data
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-100">
            <tr>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Program</th>
              <th className="p-3 border">Batch</th>
              <th className="p-3 border">Submission Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-3 border">{row.fullname}</td>
                <td className="p-3 border">{row.program}</td>
                <td className="p-3 border">{row.batch || "N/A"}</td>
                <td className="p-3 border">
                  {row.form_submitted_at
                    ? new Date(row.form_submitted_at).toLocaleDateString()
                    : "Not Submitted"}
                </td>
                <td
                  className={`p-3 border font-medium ${
                    row.form_submitted_at ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {row.form_submitted_at ? "Submitted" : "Pending"}
                </td>
                <td className="p-3 border text-center">
                  <Button
                    onClick={() => navigate(`/viewform/${row.id}`)}
                    className="bg-red-600 text-white px-4 py-1"
                  >
                    {row.form_submitted_at ? "Edit" : "View Form"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
