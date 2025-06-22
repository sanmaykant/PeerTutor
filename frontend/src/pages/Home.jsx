import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
        <header className="sticky bg-white top-0 z-50 border-b border-gray-200 w-full px-32 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <span className="font-darker-grotesque font-bold text-3xl text-generic-green">
                        PeerTutor<span className="text-generic-light-green">.</span>
                    </span>
                </div>
                <div className="flex gap-20">
                    <Button variant="navLink">Who we're for</Button>
                    <Button variant="navLink">About Us</Button>
                    <Button variant="navLink">Contact us</Button>
                </div>
                <div className="flex gap-4">
                    <Button variant="navSecondary" size="nav" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                    <Button variant="navPrimary" size="nav" onClick={() => navigate("/signup")}>
                        Signup
                    </Button>
                </div>
            </div>
        </header>
        </>
    );
}
