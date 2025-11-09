import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface ExamSession {
  id?: string;
  session_name: string;
  end_date: string;
  targeted_programs: string[];
  status: "Active" | "Pending" | "Completed";
  exam_details?: string;
  assignments?: string;
}

export default function ManageExamSession() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState<ExamSession>({
    session_name: "",
    end_date: "",
    targeted_programs: [],
    status: "Pending",
    exam_details: "",
    assignments: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("exam_sessions")
      .select("*")
      .order("end_date", { ascending: false });
    if (error) error
    else setSessions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle targeted programs (multi-select)
  const handleProgramsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setForm((f) => ({ ...f, targeted_programs: selected }));
  };

  // Submit form (create / edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // update
        const { error } = await supabase
          .from("exam_sessions")
          .update(form)
          .eq("id", editId);
        if (error) throw error;
        setSessions((prev) => prev.map(s => s.id === editId ? { ...s, ...form } : s));
        setEditId(null);
      } else {
        // create
        const { data, error } = await supabase
          .from("exam_sessions")
          .insert([form])
          .select(); // ensures returned data
        if (error) throw error;
        if (!data || data.length === 0) throw new Error("Failed to create session");
        setSessions((prev) => [...prev, data[0]]);
      }
      setForm({
        session_name: "",
        end_date: "",
        targeted_programs: [],
        status: "Pending",
        exam_details: "",
        assignments: "",
      });
    } catch (err: any) {
      alert("Error: " + err.message+loading);
    }
  };

  const handleEdit = (session: ExamSession) => {
    setForm({ ...session });
    setEditId(session.id || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      const { error } = await supabase.from("exam_sessions").delete().eq("id", id);
      if (error) throw error;
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert("Error deleting session: " + err.message);
    }
  };

  const filteredSessions = sessions.filter(
    s =>
      (statusFilter === "All" || s.status === statusFilter) &&
      s.session_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
       <Button
            variant="outline"
            onClick={() => navigate("/home")} // go back in history
            className=" mb-5 px-4 py-2"
          >
            ← Back
          </Button>
      <h1 className="text-2xl font-serif text-red-800 mb-6">Create / Manage Exam Session</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="border rounded-lg p-5 mb-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label>Session Name</label>
            <Input name="session_name" value={form.session_name} onChange={handleChange} required />
          </div>

          <div>
            <label>End Date</label>
            <Input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
          </div>

          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option>Pending</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label>Targeted Programs</label>
            <select value={form.targeted_programs} onChange={handleProgramsChange} className="w-full border rounded px-2 py-1 h-24" multiple>
              <option>BSCS</option>
              <option>BSIT</option>
              <option>BSSE</option>
              <option>BBA</option>
            </select>
          </div>

          <div>
            <label>Exam Details</label>
            <Input name="exam_details" value={form.exam_details} onChange={handleChange} />
          </div>

          <div>
            <label>Assignments / Projects</label>
            <Input name="assignments" value={form.assignments} onChange={handleChange} />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button type="submit">{editId ? "Update Session" : "Create Session"}</Button>
          <Button type="button" variant="outline" onClick={() => {
            setForm({
              session_name: "",
              end_date: "",
              targeted_programs: [],
              status: "Pending",
              exam_details: "",
              assignments: "",
            });
            setEditId(null);
          }}>Clear</Button>
        </div>
      </form>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input type="text" placeholder="Search sessions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="-w-160px border">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Session Cards */}
      <div className="grid gap-4">
        {filteredSessions.map((s) => (
          <div key={s.id} className="border p-5 rounded-lg shadow hover:shadow-md flex justify-between items-start md:items-center">
            <div>
              <h2 className="font-semibold text-lg">{s.session_name}</h2>
              <p><strong>End Date:</strong> {s.end_date}</p>
              <p><strong>Targeted Programs:</strong> {s.targeted_programs.join(", ")}</p>
              <p className={`font-medium mt-1 ${s.status === "Active" ? "text-green-600" : s.status === "Pending" ? "text-yellow-600" : "text-gray-600"}`}>
                Status: {s.status}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="bg-blue-700 text-white px-4 py-1" onClick={() => navigate(`/exam-session/${s.id}`)}>View</Button>
              <Button variant="outline" className="border-yellow-600 text-yellow-600 px-4 py-1" onClick={() => handleEdit(s)}>Edit</Button>
              <Button variant="outline" className="border-red-600 text-red-600 px-4 py-1" onClick={() => s.id && handleDelete(s.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {filteredSessions.length === 0 && <p className="text-center text-gray-500 mt-10">No sessions found</p>}
      </div>
    </div>
  );
}
