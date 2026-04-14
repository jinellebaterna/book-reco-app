import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "#F8F9F5" }}
        >
            <SignIn />
        </div>
    );
}     
