import React, { useContext, useState } from "react";
import { FaArrowRight, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { TbEyeClosed, TbLockPassword, TbEye } from "react-icons/tb";
import logo from "/Logo.png";
import logoimage from "/Logoname.png";
import { AuthContext } from "../../context/AuthContext";
const LoginPage = () => {
    const [state, setState] = useState("Login");
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {login} = useContext(AuthContext)

    const toggleState = () => {
        setState(state === "Login" ? "Sign Up" : "Login");
        setfullName("");
        setEmail("");
        setPassword("");
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ fullName, email, password });
        login(state==="Sign Up"?'register':"login",{fullName,email,password})
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e1f3b] to-[#3b3f58] bg-cover bg-center flex items-center justify-evenly px-4 max-sm:flex-col">
        {/* Logo */}
        <div>
            <img src={logo} alt="Logo" className="w-[min(30vw,200px)]" />
            <img src={logoimage} alt="" />
        </div>

        {/* Form */}
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl text-white flex flex-col gap-6">
            <h2 className="text-3xl font-semibold mb-2 text-center">{state}</h2>

            {/* Full Name (only in Sign Up) */}
            {state === "Sign Up" && (
            <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-gray-500 rounded-md focus:outline-none"
                required
                />
            </div>
            )}

            {/* Email */}
            <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-gray-500 rounded-md focus:outline-none"
                required
            />
            </div>

            {/* Password */}
            <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-gray-500 rounded-md focus:outline-none"
                required
            />
            <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                {showPassword ? <TbEye size={20} /> : <TbEyeClosed size={20} />}
            </span>
            </div>

            {/* Submit Button */}
            <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-md font-semibold flex items-center justify-center gap-2">
            {state === "Sign Up" ? "Create Account" : "Login"}
            <FaArrowRight />
            </button>

            {/* Switch Login/Signup */}
            <p className="text-center text-sm mt-2 text-gray-300">
            {state === "Login" ? (
                <>
                Don't have an account?{" "}
                <span
                    onClick={toggleState}
                    className="text-blue-400 hover:underline cursor-pointer"
                >
                    Sign Up
                </span>
                </>
            ) : (
                <>
                Already have an account?{" "}
                <span
                    onClick={toggleState}
                    className="text-blue-400 hover:underline cursor-pointer"
                >
                    Login
                </span>
                </>
            )}
            </p>
        </form>
        </div>
    );
    };

export default LoginPage;
