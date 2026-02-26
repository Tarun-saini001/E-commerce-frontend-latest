import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className=' bg-white h-[8%] rounded p-2  hover:h-[12%] transition-all duration-300 text-black flex my-3 mx-5 shadow justify-between'>
            <p onClick={()=>{navigate("/")}}
                className='text-sm pl-10 flex justify-center  font-bold shadow-2xl items-center cursor-pointer'
            >
                TS Mart
            </p>
            <nav className='flex justify-center  items-center j pr-10 w-[60%]'>
                <ul className='flex font-bold  space-x-8'>
                    <li onClick={() => navigate("/")} className='cursor-pointer'>Home</li>
                    <li onClick={() => navigate("/about")} className='cursor-pointer'>About Us</li>
                    <li onClick={() => navigate("/contact-us")} className='cursor-pointer'>Contact Us</li>
                </ul>
            </nav>
            <span className='flex space-x-4 pr-2'>
                <button className='bg-white text-black w-20 shadow cursor-pointer rounded-md'
                    onClick={() => navigate("/register")}>
                    Register
                </button>
                <button className='bg-white text-black w-20 shadow cursor-pointer rounded-md'
                    onClick={() => navigate("/login")}>
                    Login
                </button>
            </span>
        </div>
    )
}

export default Navbar
