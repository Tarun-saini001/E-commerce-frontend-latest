// import React from 'react'
import { MdLocalPhone } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { BiLogoLinkedin } from "react-icons/bi";
import { BsCart4 } from "react-icons/bs";
 
 
const Footer = () => {
  return (
<div className="w-full  flex flex-col mt-10">
 
  <div className="bg-sky-950 flex justify-center py-12">
 
    <div className="w-full max-w-[1300px] px-6 flex justify-between text-white">
 
      {/* Links */}
      <div className="flex gap-20">
       
        <div className="flex flex-col gap-3">
          <div className="text-xl font-semibold">Links</div>
          <div className="cursor-pointer">Home</div>
          <div className="cursor-pointer">Services</div>
          <div className="cursor-pointer">Shop</div>
          <div className="cursor-pointer">Sale</div>
        </div>
 
        <div className="flex flex-col gap-3">
          <div className="text-xl font-semibold">Categories</div>
          <div>Men</div>
          <div>Women</div>
          <div>Children</div>
          <div>Winter</div>
        </div>
 
        <div className="flex flex-col gap-3">
          <div className="text-xl font-semibold">Support</div>
          <div>Contact</div>
          <div>Help</div>
          <div>Customers</div>
          <div>Forum</div>
        </div>
 
      </div>
 
      {/* Contact */}
      <div className="flex gap-12">
 
        <div>
          <div className="text-2xl flex gap-2 items-center mb-4">
            <BsCart4 /> TS Mart
          </div>
 
          <div className="flex items-center gap-2">
            <MdLocalPhone /> +91-9817766364
          </div>
 
          <div className="flex items-center gap-2">
            <MdOutlineMailOutline /> tarun@yopmail.com
          </div>
        </div>
 
        <div>
          <div className="text-lg font-semibold mb-2">Address</div>
          <div>TS Mart, 3b2</div>
          <div>Sector-60, Mohali</div>
          <div>India</div>
        </div>
 
      </div>
 
    </div>
 
  </div>
 
  {/* Bottom */}
  <div className="bg-slate-950 py-4 flex justify-center">
 
    <div className="text-white flex gap-6 text-xl">
      <SiFacebook />
      <FaXTwitter />
      <FaInstagram />
      <BiLogoLinkedin />
    </div>
 
  </div>
 
</div>
       
       
   
  )
}
 
export default Footer
 