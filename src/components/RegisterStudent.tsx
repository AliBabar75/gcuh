import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function RegisterStudent() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    guardian: "",
    rollNo: "",
    program: "BSCS",
    batch: "2025",
    gender: "Male",
    cnic: "",
    contact: "",
    dob: "",
    email: "",
    address: "",
  });

  // skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // generate roll number: last 3 of CNIC + year + program code
  const generateRollNo = () => {
    if (!form.cnic) return "";
    const last3CNIC = form.cnic.slice(9,11);
    const year = new Date().getFullYear().toString().slice(2);
    const programCode = form.program.slice(2, 4).toUpperCase();
    return `${programCode}${year}${last3CNIC}`;
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const rollNo = generateRollNo();

    const { data, error } = await supabase.from("students").insert([
      {
        fullname: form.fullName,
        guardian: form.guardian,
        rollno: rollNo,
        program: form.program,
        batch: form.batch,
        gender: form.gender,
        cnic: form.cnic,
        contact: form.contact,
        dob: form.dob,
        email: form.email,
        address: form.address,
        
      },
    ]);

    setLoading(false);

    if (error) {
      alert("❌ Error saving student: " + error.message);
    } else {
      setStudents((prev) => [...prev, { ...form, rollNo, id: Date.now() }]);
      alert("✅ Student registered successfully!");
      navigate("/Home");
    }
  };

  // skeleton component
  const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`bg-red-700 animate-pulse rounded ${className}`} />
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-serif text-red-800 mb-6">
          {loading ? <SkeletonBlock className="h-8 w-64" /> : "Register New Student"}
        </h1>

        <form className="bg-gray-50 border rounded-lg p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {loading ? (
                <>
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Ali Khokhar"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guardian">Guardian</Label>
                    <Input
                      id="guardian"
                      name="guardian"
                      value={form.guardian}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rollNo">Roll No (auto)</Label>
                    <Input id="rollNo" name="rollNo" value={generateRollNo()} readOnly />
                  </div>

                  <div>
                    <Label htmlFor="program">Program</Label>
                    <select
                      name="program"
                      id="program"
                      value={form.program}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-2"
                    >
                      <option>BSCS</option>
                      <option>BSIT</option>
                      <option>BSSE</option>
                      <option>BBA</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="batch">Batch</Label>
                    <Input id="batch" name="batch" value={form.batch} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {loading ? (
                <>
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-2"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input id="cnic" name="cnic" value={form.cnic} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" name="contact" value={form.contact} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={form.email} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">{loading ? <SkeletonBlock className="h-20 w-full" /> : (
            <>
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
                rows={3}
              />
            </>
          )}</div>

          {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
  <Button type="submit" className="bg-red-700 text-white">
    Register Student
  </Button>

  <Button
    type="button"
    variant="outline"
    onClick={() => setForm({
      fullName: "",
      guardian: "",
      rollNo: "",
      program: "BSCS",
      batch: "2025",
      gender: "Male",
      cnic: "",
      contact: "",
      dob: "",
      email: "",
      address: "",
    })}
  >
    Clear Form
  </Button>

  <Button
    type="button"
    variant="outline"
    onClick={() => navigate("/Home")}
  >
    Back to Dashboard
  </Button>
</div>
        </form>

        {/* Show student list */}
        {students.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-red-700 mb-3">Registered Students</h2>
            <ul className="space-y-2">
              {students.map((s) => (
                <li key={s.id} className="border p-3 rounded-md shadow-sm bg-gray-100">
                  <strong>{s.fullName}</strong> — {s.program} ({s.batch}) — Roll No: {generateRollNo()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
