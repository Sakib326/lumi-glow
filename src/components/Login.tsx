import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Logged in:", user);
     alert(`Welcome ${user.displayName}`);
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      alert("Login Failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
