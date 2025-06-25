import Navbar from "../components/Navbar";
import lastIconAboutPage from "../../public/lastIconAboutPage.svg"
import firstIconAboutPage from "../../public/firstIconAboutPage.svg"
import secondIconAboutPage from "../../public/secondIconAboutPage.svg"
import about_hero_image from "../../public/about_hero_image.svg"
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AccordionDemo } from "../components/CustomAccordian";

function About() {
  return (
    <>
    <Navbar />  

    <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center ">
        <div className="flex justify-center items-center gap-[80.12px]">
            <div className="flex flex-col gap-[32px]">
                <div className="font-hanken-grotesque font-bold text-[32px] text-[#003B44]">
                    <span>We're building a better way to </span><br></br>
                    <span> learn — Peer to Peer</span>
                </div>
                <div className="w-[470px]">
                    <AccordionDemo />
                </div>
            </div>
            <img src={about_hero_image} alt="hero image" />
        </div>
    </div>

    <div className="flex justify-center items-center gap-[330px]">
        <div className=" flex flex-col items-center justify-center text-center">
            <img src={firstIconAboutPage} alt="handshake icon" />
            <span>Mutual Matching : Based <br></br> on complementary <br></br> strengths and weaknesses</span>
        </div>

        <div>
            <img src={secondIconAboutPage} alt="book icon" />
            <span></span>
        </div>

        <div>
            <img src={lastIconAboutPage} alt="chat icon" />
            <span></span>
        </div>
    </div>
    </>
  )
}

export default About