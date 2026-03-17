// src/pages/Checkout.tsx

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { checkoutSchema } from "../schemas/validators";

const countries = ["Bangladesh", "India", "USA", "UK"];
const districtsByCountry: Record<string, string[]> = {
    Bangladesh: ["Dhaka", "Chattogram", "Khulna", "Rajshahi"],
    India: ["Delhi", "Mumbai", "Bangalore", "Chandigrah"],
    USA: ["New York", "California", "Texas"],
    UK: ["London", "Manchester", "Bristol"],
};

const Checkout = () => {
    const { items, total } = useSelector((state: RootState) => state.cart);

    const [selectedCountry, setSelectedCountry] = useState("India");
    const [selectedDistrict, setSelectedDistrict] = useState("Delhi");

    const [formData, setFormData] = useState({
        postalCode: "",
        streetAddress: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

    const validateField = (name: keyof typeof formData, value: string) => {
        const fieldSchema = checkoutSchema.shape[name];
        if (!fieldSchema) return;

        const result = fieldSchema.safeParse(value);
        setErrors((prev) => ({
            ...prev,
            [name]: result.success ? "" : result.error.issues[0].message,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name as keyof typeof formData, value);
    };

    const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedDistrict(districtsByCountry[country][0]);
    };

    const onDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name as keyof typeof formData, value);
    };




    const shippingFee = 15;
    const tax = total * 0.05;
    const grandTotal = total + shippingFee + tax;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="grid grid-cols-12 gap-12">
                {/* left-side billing form */}
                <div className="col-span-7">
                    <h2 className="text-lg font-semibold mb-6">Billing details</h2>
                    <form className="space-y-6">
                        {/* name */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Name "
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>


                        {/* country */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Country <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={selectedCountry}
                                onChange={onCountryChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Town / City and Postal Code side by side */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-7">
                                <label className="block mb-1 font-semibold">
                                    Town / City <span className="text-red-600">*</span>
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                >
                                    {districtsByCountry[selectedCountry].map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-5">
                                <label className="block mb-1 font-semibold">
                                    Postal code <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={4}
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // only set the value if its empty or contains only digits
                                        if (/^\d*$/.test(value)) {
                                            setFormData((prev) => ({ ...prev, postalCode: value }));
                                            validateField("postalCode", value);
                                        }
                                        // if value has any letters thenignore input)
                                    }}
                                    onBlur={handleBlur}
                                    placeholder="0000"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                                {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}

                            </div>
                        </div>

                        {/* district */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                District <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={selectedDistrict}
                                onChange={onDistrictChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                {districtsByCountry[selectedCountry].map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Street address */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Street Address <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter Full Address"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                            {errors.streetAddress && <p className="text-red-500">{errors.streetAddress}</p>}
                        </div>

                        {/* phone number */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Phone Number <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="00000-00000"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                        </div>

                        {/* email address */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Email Address <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>
                    </form>
                </div>

                {/* right side order summary */}
                <div className="col-span-5 bg-white border rounded-lg p-6 shadow-sm h-fit flex flex-col">
                    <h3 className="font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-2 text-sm max-h-52 overflow-y-auto flex-grow">
                        {items.length === 0 && (
                            <p className="text-gray-500">No items in the cart</p>
                        )}
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.title} (x{item.quantity})</span>
                                <span>$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t" >
                        <div className="flex justify-between text-gray-700 mb-1">
                            <span>Subtotal</span>
                            <span>$ {total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-700 mb-1">
                            <span>Shipping Fee</span>
                            <span>$ {shippingFee.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-700 mb-4">
                            <span>Tax (5%)</span>
                            <span>$ {tax.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>$ {grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* shipping method */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Shipping Method</h4>

                        <label className="inline-flex items-center mb-2 cursor-pointer">
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="upi"
                                defaultChecked
                                className="mr-2"
                            />
                            UPI Payment
                        </label>

                        <label className="inline-flex ml-2 items-center mb-2 cursor-pointer">
                            <input type="radio" name="shippingMethod" value="cod" className="mr-2" />
                            Cash on Delivery
                        </label>
                    </div>

                    {/* Place Order Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition"
                    >
                        Place an Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;