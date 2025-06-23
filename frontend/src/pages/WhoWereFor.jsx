import Navbar from "../components/Navbar";
import firstUserHumman from "../../public/firstUserHumman.svg"
import secondUserHumman from "../../public/secondUserHumman.svg"
import lastUserHumman from "../../public/lastUserHumman.svg"

import React from 'react'

function WhoWereFor() {
  return (
    <>
    <Navbar />
    
    <main>
        <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center gap-[114px] ">

            <div className="font-hanken-grotesque font-semibold text-[32px]">
            <div>Students who <span className="bg-[#FE8261]">need help</span></div>
            <div>in specific subjects</div>
            </div>

            <img src={firstUserHumman} alt="firstUserHumman" className="max-w-[457px] h-auto" />

        </div>

        <div className="w-full h-[calc(100vh-74px)] flex justify-center items-center gap-[180px] ">

            <img src={secondUserHumman} alt="secondUserHumman" className="max-w-[457px] h-auto" />

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

            <img src={lastUserHumman} alt="lastUserHumman" className="max-w-[457px] h-auto" />

        </div>
    </main>
    </>
  )
}

export default WhoWereFor