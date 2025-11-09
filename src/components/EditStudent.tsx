import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  fullName: string;
  guardian: string;
  rollNo: string;
  program: string;
  batch: string;
  gender: string;
  cnic: string;
  contact: string;
  dob: string;
  email: string;
  address: string;
}

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([
    {
      fullName: "Sumair Ahmed",
      guardian: "Shahir Ahmed",
      rollNo: "BSCS-2025-003",
      program: "BSCS",
      batch: "2025",
      gender: "Male",
      cnic: "41302-xxxxxxx-x",
      contact: "0315-xxxxx",
      dob: "2003-05-23",
      email: "sumair@gmail.com",
      address: "House No C-37/104-A, Qasimabad, Hyderabad",
    },
  ]);

  const [form, setForm] = useState<Student>({
    fullName: "",
    guardian: "",
    rollNo: "",
    program: "",
    batch: "",
    gender: "Male",
    cnic: "",
    contact: "",
    dob: "",
    email: "",
    address: "",
  });

  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Update existing
      const updated = [...students];
      updated[editIndex] = form;
      setStudents(updated);
      setEditIndex(null);
      alert("Student updated successfully!");
    } else {
      // Check if roll number already exists
      const exists = students.find((s) => s.rollNo === form.rollNo);
      if (exists) {
        alert("Roll number already exists!");
        return;
      }
      setStudents([...students, form]);
      alert("Student registered successfully!");
    }

    setForm({
      fullName: "",
      guardian: "",
      rollNo: "",
      program: "",
      batch: "",
      gender: "Male",
      cnic: "",
      contact: "",
      dob: "",
      email: "",
      address: "",
    });
  };

  const handleEdit = (index: number) => {
    setForm(students[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-serif text-red-800 mb-6 text-center">
        Student Registration & Management
      </h1>

      {/* Registration / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-gray-50 border rounded-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left */}
          <div className="space-y-3">
            <div>
              <Label>Full Name</Label>
              <Input name="fullName" value={form.fullName} onChange={handleChange} />
            </div>

            <div>
              <Label>Guardian</Label>
              <Input name="guardian" value={form.guardian} onChange={handleChange} />
            </div>

            <div>
              <Label>Roll No</Label>
              <Input name="rollNo" value={form.rollNo} onChange={handleChange} />
            </div>

            <div>
              <Label>Program</Label>
              <select
                name="program"
                value={form.program}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
              >
                <option value="">Select Program</option>
                <option>BSCS</option>
                <option>BSIT</option>
                <option>BBA</option>
                <option>MBA</option>
              </select>
            </div>

            <div>
              <Label>Batch</Label>
              <Input name="batch" value={form.batch} onChange={handleChange} />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-3">
            <div>
              <Label>Gender</Label>
              <select
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
              <Label>CNIC</Label>
              <Input name="cnic" value={form.cnic} onChange={handleChange} />
            </div>

            <div>
              <Label>Contact</Label>
              <Input name="contact" value={form.contact} onChange={handleChange} />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Label>Address</Label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-2 py-2"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="submit" className="bg-red-700 text-white">
            {editIndex !== null ? "Update Student" : "Register Student"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setForm({
                fullName: "",
                guardian: "",
                rollNo: "",
                program: "",
                batch: "",
                gender: "Male",
                cnic: "",
                contact: "",
                dob: "",
                email: "",
                address: "",
              });
              setEditIndex(null);
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-4">
        <Input
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto border rounded-lg p-4 bg-gray-50">
        <h2 className="text-xl font-medium mb-4 text-red-700">Student List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-700 text-white text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Roll No</th>
              <th className="p-2">Program</th>
              <th className="p-2">Batch</th>
              <th className="p-2">Contact</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s, i) => (
                <tr key={i} className="border-t hover:bg-gray-100">
                  <td className="p-2">{s.fullName}</td>
                  <td className="p-2">{s.rollNo}</td>
                  <td className="p-2">{s.program}</td>
                  <td className="p-2">{s.batch}</td>
                  <td className="p-2">{s.contact}</td>
                  <td className="p-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(i)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
