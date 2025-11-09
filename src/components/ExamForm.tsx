import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExamForm() {
  const [form, setForm] = useState({
    examName: "",
    examCode: "",
    examDate: "",
    center: "",
    fullName: "",
    rollNo: "",
    program: "",
    batch: "",
    cnic: "",
    contact: "",
    email: "",
    address: "",
    documents: {
      idCopy: false,
      photo: false,
      feeReceipt: false,
      certificate: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setForm((s) => ({
        ...s,
        documents: { ...s.documents, [name]: target.checked },
      }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Exam form submitted ");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-serif text-red-800 mb-6">
        Exam Registration Form
      </h1>

      <form
        className="max-w-4xl bg-gray-50 border rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="examName">Exam Name</Label>
              <Input
                id="examName"
                name="examName"
                value={form.examName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="examCode">Exam Code</Label>
              <Input
                id="examCode"
                name="examCode"
                value={form.examCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                name="examDate"
                type="date"
                value={form.examDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="center">Exam Center</Label>
              <Input
                id="center"
                name="center"
                value={form.center}
                onChange={handleChange}
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
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="rollNo">Roll No</Label>
              <Input
                id="rollNo"
                name="rollNo"
                value={form.rollNo}
                onChange={handleChange}
              />
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
              <Label htmlFor="cnic">CNIC</Label>
              <Input
                id="cnic"
                name="cnic"
                value={form.cnic}
                onChange={handleChange}
              />
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
          </div>
        </div>

        {/* Email + Address */}
        <div className="mt-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="address">Address</Label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-2 py-2"
            rows={3}
          ></textarea>
        </div>

        {/* Documents */}
        <div className="mt-4">
          <Label>Documents Attached</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {[
              ["idCopy", "ID Copy"],
              ["photo", "Photo"],
              ["feeReceipt", "Fee Receipt"],
              ["certificate", "Certificate"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={
                    form.documents[key as keyof typeof form.documents]
                  }
                  onChange={handleChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="submit" className="bg-red-700 text-white">
            Submit Exam Form
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
