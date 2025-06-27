import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import home_page_humaan from "../../public/home_page_humaan.svg"
import home_page_ss from "../../public/home_page_ss.png"

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
        <Navbar />

        <main>
            <div className="w-full h-[calc(50vh-37px)] max-w-150 mx-auto text-center flex flex-col justify-center">
                <span className="font-open-sans text-[32px] font-semibold text-generic-green">Turning Gaps Into Gains</span>
                <span className="font-open-sans text-[32px] font-semibold mb-4 text-generic-green">Together</span>
                <p className="mb-6 text-[16px] text-generic-green font-lato">
                    Whether you're struggling in computer networks but great at database management, or a master in software engineering but need help with operating systems, there's someone out there who can help — and someone who needs you. Get matched with the right peer, and connect and grow through mutual support.
                </p>
                <Button className="w-36 mx-auto" variant="navPrimary" size="nav" onClick={() => navigate("/signup")}>
                    Explore For Free
                </Button>
            </div>
            <div className="w-full h-[calc(50vh-37px)] justify-center items-start flex">
                    <img className="z-[-2] h-[100%]" src={home_page_humaan} alt="humaan raising hand" />
                    <img src={home_page_ss} className="h-[100%] shadow-[0px_0px_34px_9px_rgba(0,0,0,0.11)]" />
            </div>
            <div className="h-[30vh] w-full rounded-t-[23px] bg-[linear-gradient(90.97deg,#FE8261_0%,#103E40_99.16%)] fixed bottom-0 z-[-1]" />
        </main>
        </>
    );
}
