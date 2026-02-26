
const Navbar = () => {
    return (
        <div className=' bg-white h-[8%] rounded p-2 text-black flex my-2 mx-4 shadow justify-between'>
            <p
                className='text-sm pl-10 flex justify-center  font-bold shadow-2xl items-center cursor-pointer'
            >
                TS Mart
            </p>
            <nav className='flex justify-center  items-center j pr-10 w-[60%]'>
                <ul className='flex font-bold  space-x-8'>
                    <li className='cursor-pointer'>Home</li>
                    <li className='cursor-pointer'>About Us</li>
                    <li className='cursor-pointer'>Contact Us</li>
                </ul>
            </nav>
            <span className='flex space-x-4 pr-2'>
                <button className='bg-white text-black w-20 shadow cursor-pointer rounded-md'>Register</button>
                <button className='bg-white text-black w-20 shadow cursor-pointer rounded-md'>Login</button>
            </span>
        </div>
    )
}

export default Navbar
