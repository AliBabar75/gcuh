import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "./Navbar";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 added

export function CardDemo() {
  const [active, setActive] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const [, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      Swal.fire({
        icon: "error",
        title: "You are not Admin",
        text: `${error.message}. This portal is only for admin.`,
        confirmButtonColor: "#d33",
      });
    } else {
      const userName = data?.user?.user_metadata?.name || data?.user?.email;

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${userName}! 👋`,
        showConfirmButton: false,
        timer: 1700,
      });

      setTimeout(() => setActive("nav"), 1500);
    }
  };

  if (active === "nav") {
    return <Navbar />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl text-white font-bold">GCUH</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="grid gap-2">
                <Label className="text-white"  htmlFor="email">Email</Label>
                <Input
                className="text-white border-none outline-none   "
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input with Eye */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white " htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                 <Input
  id="password"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  minLength={8} // minimum 8 characters
  maxLength={32} // maximum 32 characters
  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" 
  title="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
  className="pr-10 text-amber-50 border-none outline-none"
/>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className=" absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <CardFooter className="flex flex-col gap-3 mt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
