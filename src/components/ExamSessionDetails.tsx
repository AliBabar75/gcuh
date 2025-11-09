import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface ExamSession {
  id: string;
  session_name: string;
  end_date: string;
  targeted_programs: string[];
  status: "Active" | "Pending" | "Completed";
  exam_details?: string;
   assignments?: string;
}

export default function ExamSessionDetails() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("exam_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) alert(error.message);
      else setSession(data);
      setLoading(false);
    };
    fetchSession();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Session not found</p>;

  return (
    <div className="min-h-screen p-8 bg-white">
      <Button onClick={() => navigate(-1)} className="mb-4">← Back</Button>
      <h1 className="text-2xl font-bold mb-4">{session.session_name}</h1>
      <p><strong>End Date:</strong> {session.end_date}</p>
      <p><strong>Targeted Programs:</strong> {session.targeted_programs.join(", ")}</p>
      <p><strong>Status:</strong> {session.status}</p>
      <p><strong>Exam Details:</strong> {session.exam_details || "No details"}</p>
      <p><strong>Assignments / Projects:</strong> {session. assignments || "No assignments"}</p>
    </div>
  );
}
