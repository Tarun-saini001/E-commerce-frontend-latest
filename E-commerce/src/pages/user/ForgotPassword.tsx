import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../../schemas/validators";
import toast from "react-hot-toast";
import { paths } from "../../constants/paths";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const result = forgotPasswordSchema.shape.email.safeParse(value);
    setError(result.success ? "" : result.error.issues[0].message);
  };

  const handleSendOtp = async () => {
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/service/user/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otpType: 3, // forgot password 
        }),
      });

      const data = await response.json();
      console.log('data:(forgot) ', data);

      if (response.ok && data.message !== "Account not found") {
        toast.success("OTP sent successfully!", {
          id: "otp-sent"
        });
        const otpSession = {
          email,
          otpType: 3,
          expiresAt: Date.now() + 1 * 60 * 1000,
        };

        localStorage.setItem("otpSession", JSON.stringify(otpSession));

        navigate(paths.VERIFY_OTP);
      } else {
        setError(data.message || "Something went wrong");
        toast.error(data.message, {
          id: "server-error"
        });
      }
    } catch (err) {
      toast.error("Server-error", {
        id: "server-error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-[80%] my-15">
      <div className="w-full max-w-md shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
        <p className="text-4xl">Forgot Password</p>

        <div className="w-[80%] flex flex-col space-y-1">
          <label>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            onBlur={(e) => validateEmail(e.target.value)}
            className="px-3 py-2 border rounded"
            placeholder="Enter your email"
          />
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="bg-black text-white px-4 w-[60%] py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;