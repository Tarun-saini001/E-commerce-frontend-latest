import { useState } from "react";
import { Link } from "react-router-dom";


const Register = () => {
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {

    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Register</p>

                {/* name */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                </div>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Email <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter email"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                </div>

                {/* password */}

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter password"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                </div>

                {/* confirm password */}

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="confirm password"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-black text-white px-4 w-[60%] py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <div className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register
