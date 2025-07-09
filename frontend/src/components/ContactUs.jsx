import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const contactUs = async (name, email, message) => {
    try {
        const response = await fetch("https://peertutor-2lce.onrender.com/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });

        const json = await response.json();
        if (json.success) {
            return true;
        }
        else return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const hide = {
    display: "none",
};
const show = {
    display: "block",
    color: "#44be88",
    textAlign: "center",
};

function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [successStyle, setSuccessStyle] = useState(hide);

    const handleSubmit = () => {
        console.log(name, email, message);
        if (contactUs(name, email, message)) {
            setSuccessStyle(show);
        }
    }

    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="navLink">Contact Us</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="font-hanken-grotesque font-bold text-[32px] text-[#103E40] text-center mt-[16px]">Contact Us</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 px-[40px]">
                    <div className="grid gap-[22px]">
                        <input onChange={e => setName(e.target.value)} className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px] mt-[25px]" id="name-1" name="name" placeholder='Name'/>
                        <input onChange={e => setEmail(e.target.value)} type="email" className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px]" id="name-1" name="name" placeholder='Email id'/>
                        <textarea onChange={e => setMessage(e.target.value)} className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px]" id="name-1" name="name" placeholder='Message'/>
                    </div>
                </div>
            <p style={successStyle}>Message sent successfully!</p>
            <DialogFooter>
            <Button variant="navPrimary" size="contact" className="mx-auto my-[23px] font-medium" type="submit" onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default ContactUs
