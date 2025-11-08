import logo from "/logo.jpg";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useUser } from "../context/UserContext";

function Login() {
  const [show, setShow] = useState(false);
  const { setUserData } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleShowChange = () => {
    setShow(!show);
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(email, password);
      const res = await axios.post(
        serverURL + "/auth/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setLoading(false);
      setUserData(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="bg-zinc-900 w-[100vw] h-[100vh] flex items-center justify-center relative">
      <div className="hidden md:block fixed left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>

      <div className="hidden md:block fixed right-8 lg:right-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all border border-zinc-600 flex items-center gap-2"
      >
        <span>←</span> Return to Home
      </button>
      <form
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
        onSubmit={handleSubmit}
      >
        <div
          className="md:w-[50%] w-[100%] h-[100%] flex flex-col
    items-center justify-center gap-3"
        >
          <div>
            <h1 className="font-semibold tex-[black] text-2xl">Welcome Back</h1>
            <h2 className="text-[#999797] text-[18px]">
              Sign in to your account
            </h2>
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              type={show ? "text" : "password"}
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!show && (
              <IoEyeOff
                onClick={handleShowChange}
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
              />
            )}
            {show && (
              <IoEye
                onClick={handleShowChange}
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
              />
            )}
          </div>

          <button className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center  justify-center rounded-[5px] mt-5 ">
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Continue Your journey"
            )}
          </button>
          <span className="text-[13px] cursor-pointer text-[#585757] hover:underline underline-offset-2">
            Forget your Password?
          </span>

          <div
            onClick={() => {
              navigate("/signup");
            }}
            className="text-[#6f6f6f]"
          >
            Don't have an account?{" "}
            <span className="hover:underline underline-offset-1 cursor-pointer text-black">
              Register
            </span>
          </div>
        </div>
        {/* right div */}
        <div
          className="w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex flex-col
    items-center justify-center hidden"
        >
          <img
            src={logo}
            alt="logo"
            className="w-30 shadow-2xl border-2 border-white"
          ></img>
          <ul className="text-white list-disc list-inside space-y-2 mt-10">
            <li>Real-time 1v1 Coding Battles</li>
            <li>2500+ Problems for Gamified Environment</li>
            <li>Track Your Performance & Stats</li>
            <li>Compete & Improve Your Skills</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default Login;
