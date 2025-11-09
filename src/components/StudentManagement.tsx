import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";

interface Student {
  id: string;
  fullname: string;
  guardian: string;
  rollno: string;
  program: string;
  batch: string;
  contact?: string;
  email?:any;
  cnic?: string;
  address?: string;
  dob?: string;
  gender?: string;
  
}

interface FormType {
  fullname: string;
  guardian: string;
  rollno: string;
  program: string;
  batch: string;
  contact: string;
  email:string;
  cnic: string;
  address: string;
  dob: string;
  gender: string;
}

export default function StudentManagement() {
  // const [sessions, setSessions] = useState<Student[]>([]);
  const [form, setForm] = useState<FormType>({
    fullname: "",
    guardian: "",
    rollno: "",
    program: "",
    batch: "",
    contact: "",
    email: "",
    cnic: "",
    address: "",
    dob:"",
  gender:"",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) console.error(error);
      else setStudents(data as Student[]);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement  | HTMLTextAreaElement >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This student record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;

      setStudents((prev) => prev.filter((s) => s.id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Student record has been deleted successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
      });
    }
  }
};


  // Generate rollno max 6 chars
  const generaterollno = () => {
    if (!form.cnic) return "";
    const last3CNIC = form.cnic.slice(9,11);
    const year = new Date().getFullYear().toString().slice(2);
    const programCode = form.program.slice(2, 4).toUpperCase();
    return `${programCode}${year}${last3CNIC}`.slice(0, 6);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const rollno = generaterollno();
    const studentData: Omit<Student, "id"> = { ...form, rollno };

    try {
      if (editId) {
        // Update
        const { error } = await supabase
          .from("students")
          .update(studentData)
          .eq("id", editId);
        if (error) throw error;

        setStudents((prev) =>
          prev.map((s) => (s.id === editId ? { ...s, ...studentData } : s))
        );

        Swal.fire({
          icon: "success",
          title: "Student Updated",
          showConfirmButton: false,
          timer: 1500,
        });

        setEditId(null);
      } else {
        // Insert
        const { data, error } = await supabase
          .from("students")
          .insert([studentData])
          .select(); // return inserted row
        if (error) throw error;

        const insertedStudent = data![0] as Student;

        setStudents((prev) => [...prev, insertedStudent]);

        Swal.fire({
          icon: "success",
          title: "Student Added",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Reset form
      setForm({
        fullname: "",
        guardian: "",
        rollno: "",
        program: "BSCS",
        batch: "2025",
        contact: "",
        email:"",
        cnic: "",
        address: "",
        dob: "",
        gender: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (err as any).message,
      });
      console.error(err);
    }

    setLoading(false);
  };

  // Handle edit click
  const handleEdit = (stu: Student) => {
    setForm({
      fullname: stu.fullname,
      guardian: stu.guardian,
      rollno: stu.rollno,
      program: stu.program,
      batch: stu.batch,
      contact: stu.contact ?? "",
      email: stu.email ?? "",
      address: stu.address ?? "",
      dob: stu.dob ?? "",
      gender: stu.gender ?? "",
      cnic: "", // keep empty for new roll generation
    });
    setEditId(stu.id);
  };

  // Filter students safely
  const filtered = students.filter((s) =>
    (s.fullname ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  );

  // Skeleton loader
  const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`bg-red-300 animate-pulse rounded ${className}`} />
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-serif text-red-800 mb-6">
        Student Management
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border rounded-lg p-6 mb-6 shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-10 w-full" />
              ))
            : (
                <>
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      required
                      placeholder="Muhammad Ali Khokhar"
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
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input
                      id="cnic"
                      name="cnic"
                      value={form.cnic}
                      onChange={handleChange}
                      placeholder="xxxxx-xxxxxxx-x"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rollno">Roll No (auto)</Label>
                    <Input
                      id="rollno"
                      name="rollno"
                      value={generaterollno()}
                      readOnly
                    />
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
                    <Input
                      id="batch"
                      name="batch"
                      value={form.batch}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                                     <Label htmlFor="dob">Date of Birth</Label>
                                     <Input id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} />
                                   </div>
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
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                      id="contact"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
    placeholder="student@example.com"
  />
 </div>
                  <div>
  <Label htmlFor="email">address</Label>
   <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
                rows={3}
              />
 </div>
                </>
              )}
        </div>

        <div className="flex justify-end
         gap-3 mt-4">
          <Button type="submit" className="bg-red-700 hover:bg-red-600">
            {editId ? "Update Student" : "Register Student"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setForm({
                fullname: "",
                guardian: "",
                rollno: "",
                program: "",
                batch: "",
                contact: "",
                email: "",
                address: "",
                cnic: "",
                dob: "",
                gender: "",
              })
            }
          >
            Clear Form
          </Button>
        </div>
      </form>

      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <p className="text-gray-600 text-sm">Total: {filtered.length}</p>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto shadow-md border rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead className="bg-red-100">
            <tr>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Guardian</th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Program</th>
              <th className="border p-2">Batch</th>
              <th className="border  p-2">dob</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2 text-center">Email</th>
              <th className="border p-2 text-center">address</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="p-2">
                        <SkeletonBlock className="h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-100 transition-colors">
                    <td className="border p-2">{s.fullname ?? "-"}</td>
                    <td className="border p-2">{s.guardian ?? "-"}</td>
                    <td className="border p-2">{s.rollno ?? "-"}</td>
                    <td className="border p-2">{s.program}</td>
                    <td className="border p-2">{s.batch}</td>
                    <td className="border p-2">{s.dob ?? "-"}</td>
                    <td className="border p-2">{s.contact ?? "-"}</td>
                    <td className="border p-2">{s.email ?? "-"}</td>
                    <td className="border p-2">{s.address ?? "-"}</td>
                    <td className="border p-2 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </Button>
                      <Button variant="outline" className="border-red-600 text-red-600 px-4 py-1" onClick={() => s.id && handleDelete(s.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
