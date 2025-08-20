import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg-1.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      // Simpan token ke localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role); // simpan role juga
      }
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950">
      <div className="w-1/2 h-full lg:block md:block hidden">
        <img src={bg} className="w-full h-full" alt="" />
      </div>
      <div className="lg:w-1/2 w-full">
        <div className="h-full flex items-center mx-10">
          <div className="w-full text-slate-300">
            <h1 className="lg:text-2xl text-lg font-semibold">
              Selamat Datang di Kuna Patisserie
            </h1>
            <form
              className="text-slate-400 flex flex-col"
              onSubmit={handleLogin}
            >
              <label className="my-2 lg:text-base text-sm">Alamat Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                className="lg:w-1/2 w-full lg:h-9 h-7 border border-slate-400 rounded-md px-3"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="my-2 lg:text-base text-sm">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                className="lg:w-1/2 w-full lg:h-9 h-7 border border-slate-400 rounded-md px-3"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-primary lg:w-1/4 w-full mt-4 font-semibold lg:text-lg text-base">
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
