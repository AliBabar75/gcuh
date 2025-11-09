import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { PiStudentFill } from "react-icons/pi";
import { SiSessionize } from "react-icons/si";
import { BsPencil } from "react-icons/bs";
import { MdOutlineCoPresent, MdOutlineLogout } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { CardDemo } from "./Carddemo";
import Dashboard from "@/components/Dashboard";
import StudentManagement from "@/components/StudentManagement";
import { Skeleton } from "@/components/ui/skeleton";
// import ExamForm from "@/components/ExamForm";
import FormReview from "@/components/FormReview";
import ManageExamSession from "@/components/ManageExamSession";
import AttendancePage from "@/components/AttendancePage";
import AttendanceReport from "@/components/AttendanceReport";

const Navbar = () => {
  const [active, setActive] = useState("dashboard");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [loading, setLoading] = useState(false); // new loading state

  // Simulate loading when switching pages
  const handleSetActive = (page: string) => {
    setLoading(true);
    setTimeout(() => {
      setActive(page);
      setLoading(false);
    }, 900); // simulate 0.5s loading
  };

  if (isLoggedOut) {
    return <CardDemo />;
  }
const inout = () => {
  const navBar = document.getElementById("navBar");
  if (navBar) {
    // Toggle between visible (flex) and hidden (none)
    navBar.style.display = navBar.style.display === "none" ? "flex" : "none";
    // navBar.style.transform = navBar.style.transform === "translateX(0px)" ? "translateX(10%)" : "translateX(0px)"
    // navBar.classList.toggle("active");
    //  navBar.style.transition = navBar.style.transition === "transform 0.1s ease " ? "transform 0.9s ease-in " : "transform 0.3s ease-out"
  const tBtn = document.getElementById("tbtn");
if(tBtn){
tBtn.style.color = tBtn.style.color==="black" ? " white" : "black"
}
}
};
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
         <button id="tbtn" onClick={inout} className="text-amber-50 mt-3 sm:mt-5 ml-2 fixed text-2xl sm:text-3xl border-none outline-none z-50 cursor-pointer hover:scale-105 hover:-translate-y-1 
              transition-transform duration-200 " >
              <RxDashboard /> 

         </button>
      <nav id="navBar" className="-mt-24px w-64 sm:w-72 lg:w-80 h-500 bg-red-700 border-red-600 p-6 sm:p-8 lg:p-9 text-amber-50 fixed lg:relative z-40">
        <ul className="mt-10 flex flex-col gap-3 sm:gap-4 lg:gap-5 justify-center text-base sm:text-lg lg:text-xl fixed">
          <li>
            <button
              onClick={() => handleSetActive("dashboard")}
              className="cursor-pointer hover:scale-105 hover:-translate-y-1 
              transition-transform duration-200 flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2"
            >
              <RxDashboard /> Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSetActive("students")}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 cursor-pointer 
              hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
            >
              <PiStudentFill /> Students
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSetActive("session")}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 cursor-pointer hover:scale-105
               hover:-translate-y-1 transition-transform duration-200"
            >
              <SiSessionize /> Session
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSetActive("form")}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 cursor-pointer 
              hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
            >
              <BsPencil /> Form
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSetActive("attendance")}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 cursor-pointer 
              hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
            >
              <MdOutlineCoPresent /> Attendance
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSetActive("reports")}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 cursor-pointer hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
            >
              <IoStatsChartOutline /> Reports
            </button>
          </li>

          <li>
            <button
              onClick={() => setIsLoggedOut(true)}
              className="flex w-32 sm:w-36 lg:w-40 items-center gap-2 p-2 text-red-50 cursor-pointer hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
            >
              <MdOutlineLogout /> Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 lg:p-10 w-full">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-red-800" /> {/* title */}
            <Skeleton className="h-96 sm:h-120 w-full rounded-md bg-red-800" /> {/* main content */}
          </div>
        ) : active === "dashboard" ? (
          <Dashboard />
        ) : active === "students" ? (
          <StudentManagement />
        ) : active === "session" ? (
          <ManageExamSession/>
          
        ) : active === "form" ? (
          <FormReview/>
        ) : active === "attendance" ? (
          <AttendancePage/>
        ) : (
          <AttendanceReport/>
        )}
      </div>
    </div>
  );
};

export default Navbar;

