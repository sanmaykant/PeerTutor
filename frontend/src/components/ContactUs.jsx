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

function ContactUs() {
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
                        <input className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px] mt-[25px]" id="name-1" name="name" placeholder='Name'/>
                        <input className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px]" id="name-1" name="name" placeholder='Email id'/>
                        <textarea className="border border-black rounded-[5px] pl-[33px] py-[24px] font-hanken-grotesque font-medium text-[18px]" id="name-1" name="name" placeholder='Message'/>
                    </div>
                </div>
            <DialogFooter>
            <Button variant="navPrimary" size="contact" className="mx-auto my-[23px] font-medium" type="submit">Submit</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default ContactUs
