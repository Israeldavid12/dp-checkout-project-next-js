'use client'
import styles from '../checkout.layout.module.css'
import { useState, useEffect } from 'react'


export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(900); // 3.33 minutos

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedTime = `00 : ${minutes < 10 ? '0' : ''}${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;



    return (
        <div className={styles.timer} >
            <p class="text-lg text-start " id="timer">{formattedTime}</p>
            <i class="bi bi-clock-history text-center text-[35px] font-bold"></i>
            <p className='text-xs sm:text-md text-end' >Preencha os seus dados antes que <br /> o cronômetro termine</p>
        </div>
    )
}