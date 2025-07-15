import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", class: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Validate email
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.class) {
      setErrorMsg("Please fill all fields.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (!validateEmail(form.email)) {
      setErrorMsg("Invalid email address.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/students", form);
      setForm({ name: "", email: "", class: "" });
      fetchStudents();
      setSuccessMsg("Student added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:5000/api/students/${id}');
      fetchStudents();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-white flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6"> Student Registration</h1>

        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-center">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            className="border border-blue-300 rounded p-2"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border border-blue-300 rounded p-2"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border border-blue-300 rounded p-2"
            type="text"
            placeholder="Class"
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
          />
          <button
            type="submit"
            className="md:col-span-3 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
          >
             Add Student
          </button>
        </form>

        <table className="w-full border text-sm">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id} className="text-center hover:bg-blue-50">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.email}</td>
                  <td className="border p-2">{student.class}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Dele
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-gray-400 text-center">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
