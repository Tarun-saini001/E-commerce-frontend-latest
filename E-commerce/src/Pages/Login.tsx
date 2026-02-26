import { Link } from "react-router-dom"


const Login = () => {

    const handleLogin  = async ()=>{

    }
    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className='w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5'>
                <p className='text-4xl'>Login</p>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder='Enter Email'
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 `}
                    />
                </div>
                {/* password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="password"
                        placeholder='Enter password'
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                </div>

                 <button
                    onClick={handleLogin}
                    className="mt-4 rounded p-2 w-[60%] bg-black text-white cursor-pointer"
                >
                    Login
                </button>

                {/* <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-blue-600 font-medium cursor-pointer text-sm"
                >
                    Forgot Password?
                </p> */}

                <div className="w-[80%] text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="text-blue-600 cursor-pointer font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
