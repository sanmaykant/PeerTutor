import { useRef, useEffect } from "react";

import Navbar from "../components/Navbar";
import firstUserHumman from "../../public/firstUserHumman.svg"
import secondUserHumman from "../../public/secondUserHumman.svg"
import lastUserHumman from "../../public/lastUserHumman.svg"

import React from 'react'

function WhoWereFor() {
  const humaan1 = useRef();
  const humaan2 = useRef();
  const humaan3 = useRef();
  const humaans = [humaan1, humaan2, humaan3];

  useEffect(() => {
    humaans.forEach(humaan => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!humaan.current)
              return;

            humaan.current.classList.remove("opacity-0", "translate-y-10");
            humaan.current.classList.add("opacity-100", "translate-y-0");
          } else {
            humaan.current.classList.remove("opacity-100", "translate-y-0");
            humaan.current.classList.add("opacity-0", "translate-y-10");
          }
        },
        {
          threshold: 0.1,
        }
      );
      observer.observe(humaan.current);
    })
  });

  return (
    <>
    <Navbar />
    
    <main>
        <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center gap-[114px] ">

            <div className="font-hanken-grotesque font-semibold text-[32px]">
            <div>Students who <span className="bg-[#FE8261]">need help</span></div>
            <div>in specific subjects</div>
            </div>

            <img ref={humaan1} src={firstUserHumman} alt="firstUserHumman" className="max-w-[457px] h-auto transition-all duration-1000 opacity-0 translate-y-10" />

        </div>

        <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center gap-[180px] ">

            <img ref={humaan2} src={secondUserHumman} alt="secondUserHumman" className="max-w-[457px] h-auto transition-all duration-1000 opacity-0 translate-y-10" />

            <div className="font-hanken-grotesque font-semibold text-[32px]">
            <div>Students that</div>
            <div><span className="bg-[#FE8261]">love helping</span> each</div>
            <div>other</div>
            </div>


        </div>

        <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center gap-[140px] ">
            
            <div className="font-hanken-grotesque font-semibold text-[32px]">
            <div>Students that believe</div>
            <div>in <span className="bg-[#FE8261]">mutual support</span></div>
            </div>

            <img ref={humaan3} src={lastUserHumman} alt="lastUserHumman" className="max-w-[457px] h-auto transition-all duration-1000 opacity-0 translate-y-10" />

        </div>
    </main>
    </>
  )
}

export default WhoWereFor