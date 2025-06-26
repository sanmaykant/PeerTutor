import Navbar from "../components/Navbar";
import lastIconAboutPage from "../../public/lastIconAboutPage.svg"
import firstIconAboutPage from "../../public/firstIconAboutPage.svg"
import secondIconAboutPage from "../../public/secondIconAboutPage.svg"
import about_hero_image from "../../public/about_hero_image.svg"
import {useRef, useEffect} from 'react';
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AccordionDemo } from "../components/CustomAccordian";

function About() {

      const icon1 = useRef();
      const icon2 = useRef();
      const icon3 = useRef();
      const icons = [icon1, icon2, icon3];
    
      useEffect(() => {
        icons.forEach(icon => {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                if (!icon.current)
                  return;
    
                icon.current.classList.remove("opacity-0", "translate-y-10");
                icon.current.classList.add("opacity-100", "translate-y-0");
              } else {
                icon.current.classList.remove("opacity-100", "translate-y-0");
                icon.current.classList.add("opacity-0", "translate-y-10");
              }
            },
            {
              threshold: 0.1,
            }
          );
          observer.observe(icon.current);
        })
      });

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

    <div className="flex justify-center items-center gap-[200px] mb-[46px] ">
        <div ref={icon1} className=" flex flex-col items-center justify-center text-center transition-all delay-0 duration-1000 opacity-0 translate-y-10">
            <img src={firstIconAboutPage} alt="handshake icon" />
            <span>Mutual Matching : Based <br></br> on complementary <br></br> strengths and weaknesses</span>
        </div>

        <div ref={icon2} className=" flex flex-col items-center justify-center text-center transition-all delay-200 duration-1000 opacity-0 translate-y-10">
            <img src={secondIconAboutPage} alt="book icon" />
            <span>Built for real connection:<br></br> No one-size-fits-all<br></br> tutoring</span>
        </div>

        <div ref={icon3} className=" flex flex-col items-center justify-center text-center transition-all delay-500 duration-1000 opacity-0 translate-y-10">
            <img src={lastIconAboutPage} alt="chat icon" />
            <span>Real-time connection features:<br></br> Chat and<br></br> conduct meetings</span>
        </div>
    </div>
    </>
  )
}

export default About