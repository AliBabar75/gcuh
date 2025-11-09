import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  fullname: string;
  rollno: string;
  program: string;
  batch: string | null;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Fetch Students
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("id, fullname, rollno, program, batch")
      .order("rollno", { ascending: true });

    if (error) {
   
      alert("Error fetching students!");
    } else {
      setStudents(data || []);
    }
  };

  // ✅ Fetch Attendance For Date
  const fetchAttendanceForDate = async (selectedDate: string) => {
    if (!selectedDate) return;

    const { data, error } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("date", selectedDate);

    if (error) {
      alert("Error loading attendance data!");
      return;
    }

    if (data && data.length > 0) {
      // existing records → edit mode
      const existing: Record<string, string> = {};
      data.forEach((r) => {
        existing[r.student_id] = r.status;
      });
      setAttendance(existing);
      setIsEditMode(true);
    } else {
      // new attendance → empty inputs
      const empty: Record<string, string> = {};
      students.forEach((s) => (empty[s.id] = ""));
      setAttendance(empty);
      setIsEditMode(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (date && students.length > 0) {
      fetchAttendanceForDate(date);
    }
  }, [date, students]);

  // ✅ Input change handler
  const handleChange = (id: string, value: string) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Save or Update Attendance
  const handleSave = async () => {
    if (!date) return alert("Please select a date first!");

    setLoading(true);

    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      date,
      status: status.trim() || "-",
    }));

    

    try {
      if (isEditMode) {
        // Update existing attendance
        for (const record of records) {
          const { error } = await supabase
            .from("attendance")
            .update({ status: record.status })
            .eq("student_id", record.student_id)
            .eq("date", date);

          
        }
        alert("✅ Attendance updated successfully!");
      } else {
        // Insert new attendance
        const { error } = await supabase.from("attendance").insert(records);
        if (error) throw error;
        alert("✅ Attendance saved successfully!");
        setIsEditMode(true);
      }
    } catch (err) {
      
      alert("❌ Error saving attendance!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-serif text-red-800 mb-6">
        Attendance Management (Manual Entry)
      </h1>

      {/* 📅 Date Selector & Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="font-semibold">Select Date:</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-48"
        />

        <Button
          onClick={handleSave}
          className="bg-green-700 text-white"
          disabled={loading || !date}
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Attendance"
            : "Save Attendance"}
        </Button>

        <Button
          onClick={() => window.history.back()}
          className="bg-gray-700 text-white"
        >
          ← Back
        </Button>
      </div>

      {/* 🧾 Attendance Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-red-100 text-red-900">
            <tr>
              <th className="p-3 border">Roll No</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Program</th>
              <th className="p-3 border">Batch</th>
              <th className="p-3 border">Status (Manual Entry)</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td className="p-3 border">{s.rollno}</td>
                  <td className="p-3 border">{s.fullname}</td>
                  <td className="p-3 border">{s.program}</td>
                  <td className="p-3 border">{s.batch || "N/A"}</td>
                  <td className="p-3 border">
                    <Input
                      type="text"
                      placeholder="e.g. 76%, Present, Absent"
                      value={attendance[s.id] || ""}
                      onChange={(e) => handleChange(s.id, e.target.value)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
