// src/pages/Checkout.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { createOrder } from "../../redux/slices/orderSlice";
import { checkoutSchema } from "../../schemas/validators";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { clearCart } from "../../redux/slices/cartSlice";
import { paths } from "../../constants/paths";

const countries = ["Bangladesh", "India", "USA", "UK"];
const districtsByCountry: Record<string, string[]> = {
    Bangladesh: ["Dhaka", "Chattogram", "Khulna", "Rajshahi"],
    India: ["Delhi", "Mumbai", "Bangalore", "Chandigrah"],
    USA: ["New York", "California", "Texas"],
    UK: ["London", "Manchester", "Bristol"],
};

const Checkout = () => {
    const API = import.meta.env.VITE_API_URL
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { items, total } = useSelector((state: RootState) => state.cart);
    const { loading } = useSelector((state: RootState) => state.order);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [phoneCode, setPhoneCode] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        postalCode: "",
        streetAddress: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
            }));
        }
    }, [user]);

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
        setSelectedDistrict("");
        setSelectedState("");
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

    const handlePlaceOrder = async () => {

        if (!selectedCountry || !selectedState || !selectedDistrict || !shippingMethod || !phoneCode) {
            toast.error("Please fill all required fields", {
                id: "checkout-form-error"
            });
            return;
        }

        const result = checkoutSchema.safeParse({
            ...formData,
            country: selectedCountry,
            district: selectedDistrict,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            toast.error("Please correct the form errors", {
                id: "form-error"
            });
            return;
        }
        try {
            const res = await fetch(`${API}/service/stripe/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",

                body: JSON.stringify({
                    billingDetails: {
                        country: selectedCountry,
                        city: selectedState,
                        district: selectedDistrict,
                        postalCode: formData.postalCode,
                        address: formData.streetAddress,
                        phone: phoneCode + formData.phone,
                    },
                    shippingMethod,
                }),
            })
            const data = await res.json();


            if (data.status === "Success") {
                //redirect to Stripe Checkout
                window.location.href = data.data.url;
            } else {
                toast.error(data.message || "Failed to initiate payment", {
                    id: "payment-failed"
                });
            }

        } catch (error) {
            console.error("handlePlaceOrder error : ", error);
            toast.error("Something went wrong", {
                id: "stripe-error"
            });
        }
    };

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
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter Name "
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select Country</option>
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
                                    State <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    disabled={!selectedCountry}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select State</option>
                                    {(districtsByCountry[selectedCountry] || []).map((city) => (
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
                                    maxLength={6}
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
                                    placeholder="Enter 6-digit postal code"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select District</option>
                                {(districtsByCountry[selectedCountry] || []).map((district) => (
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.streetAddress && <p className="text-red-500">{errors.streetAddress}</p>}
                        </div>

                        {/* phone number */}
                        <div className="flex gap-2">
                            {/* Country Code */}
                            <select
                                value={phoneCode}
                                className="border border-gray-300 rounded-md px-2 py-2"
                                onChange={(e) => setPhoneCode(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="+91">+91 (India)</option>
                                <option value="+1">+1 (USA)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+880">+880 (Bangladesh)</option>
                            </select>

                            {/* Phone Input */}
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (/^\d*$/.test(value)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            phone: value
                                        }));

                                        validateField("phone", phoneCode + value);
                                    }
                                }}
                                onBlur={handleBlur}
                                placeholder="Enter phone number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* email address */}
                        <div>
                            <label className="block mb-1 font-semibold">
                                Email Address <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <div key={item._id} className="flex justify-between">
                                <span>{item.title} (x{item.quantity})</span>
                                <span> {(item.price * item.quantity).toFixed(2)} Rs.</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t" >
                        <div className="flex justify-between text-gray-700 mb-1">
                            <span>Subtotal</span>
                            <span> {total.toFixed(2)} Rs.</span>
                        </div>

                        <div className="flex justify-between text-gray-700 mb-1">
                            <span>Shipping Fee</span>
                            <span> {shippingFee.toFixed(2)} Rs.</span>
                        </div>

                        <div className="flex justify-between text-gray-700 mb-4">
                            <span>Tax (5%)</span>
                            <span> {tax.toFixed(2)} Rs.</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{grandTotal.toFixed(2)} Rs.</span>
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
                                checked={shippingMethod === "upi"}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="mr-2"
                            />
                            UPI Payment
                        </label>

                        <label className="inline-flex ml-3 items-center mb-2 cursor-pointer">
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="cod"
                                checked={shippingMethod === "cod"}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="mr-2"
                            />
                            Cash on Delivery
                        </label>
                    </div>

                    {/* Place Order Button */}
                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="mt-6 w-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-md"
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;