import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Dashboard from "./components/Dashboard";
import RegisterStudent from "./components/RegisterStudent";
import EditStudent from "./components/EditStudent";
import StudentManagement from "./components/StudentManagement";
import Navbar from "./Pages/Navbar";
import FormReview from "./components/FormReview";
import ViewForm from "./components/ViewForm";
import ManageExamSession from "./components/ManageExamSession";
import ExamSessionDetails from "./components/ExamSessionDetails";
import AttendancePage from "./components/AttendancePage";
import AttendanceReport from "./components/AttendanceReport";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/Home", element: <Navbar /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/register", element: <RegisterStudent /> },
        { path: "/edit", element: <EditStudent  /> },
        { path: "/student", element: <StudentManagement /> },
        { path: "/formreview", element: <FormReview /> },
        { path: "/attendance", element: <AttendancePage /> },
        { path: "/attendance-report", element: <AttendanceReport /> },
        { path: "/viewform/:id", element: <ViewForm /> },
        { path:"/manage-session", element:<ManageExamSession /> },
        { path:"/exam-session/:id", element:<ExamSessionDetails /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />
      
}

export default App;
