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

        <main>
            <div className="w-full h-[50vh] max-w-150 mx-auto text-center flex flex-col justify-center">
                <span className="font-open-sans text-[32px] font-semibold text-generic-green">Turning Gaps Into Gains</span>
                <span className="font-open-sans text-[32px] font-semibold mb-4 text-generic-green">Together</span>
                <p className="mb-6 text-[16px] text-generic-green font-lato">
                    Whether you're struggling in computer networks but great at database management, or a master in software engineering but need help with operating systems, there's someone out there who can help — and someone who needs you. Get matched with the right peer, and connect and grow through mutual support.
                </p>
                <Button className="w-36 mx-auto" variant="navPrimary" size="nav" onClick={() => navigate("/signup")}>
                    Explore For Free
                </Button>
            </div>
            <div className="h-[50vh] w-full bg-gray-300" />
        </main>
        </>
    );
}
