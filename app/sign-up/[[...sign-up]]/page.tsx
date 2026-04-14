import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "#F8F9F5" }}
        >
            <SignUp />
        </div>
    );
}   