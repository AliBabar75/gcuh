import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: string;
  created_at: string;
  students?: { // array fix
    fullname: string;
    rollno: string;
    program: string;
    batch: string | null;
  }[];
}

export default function AttendanceReport() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Attendance Records with student info
  const fetchRecords = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        id,
        student_id,
        date,
        status,
        created_at,
        students (
          fullname,
          rollno,
          program,
          batch
        )
      `)
      .order("date", { ascending: false });

    if (error) {
      alert("Error loading report!");
      console.error(error);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ CSV Export
  const exportCSV = () => {
    const csvRows = [
      ["Date", "Roll No", "Full Name", "Program", "Batch", "Status"],
      ...records.map((r) => [
        r.date,
        r.students?.[0]?.rollno || "",
        r.students?.[0]?.fullname || "",
        r.students?.[0]?.program || "",
        r.students?.[0]?.batch || "",
        r.status,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = `attendance_report.csv`;
    a.click();
  };

  // ✅ Filtered Records
  const filtered = records.filter((r) =>
    r.students?.[0]?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    r.students?.[0]?.rollno?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-serif text-red-800 mb-6">
        Attendance Report
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Input
          type="text"
          placeholder="Search by name or roll no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-64"
        />
        <Button onClick={fetchRecords} className="bg-blue-700 text-white">
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button onClick={exportCSV} className="bg-green-700 text-white">
          Export CSV
        </Button>
        <Button
          onClick={() => window.history.back()}
          className="bg-gray-700 text-white"
        >
          ← Back
        </Button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-100 text-red-900">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Roll No</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Program</th>
              <th className="p-3 border">Batch</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 border">{r.date}</td>
                  <td className="p-3 border">{r.students?.[0]?.rollno}</td>
                  <td className="p-3 border">{r.students?.[0]?.fullname}</td>
                  <td className="p-3 border">{r.students?.[0]?.program}</td>
                  <td className="p-3 border">{r.students?.[0]?.batch || "N/A"}</td>
                  <td className="p-3 border">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
