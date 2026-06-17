"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

function Trenggalek() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Memperbarui state setiap 1 detik
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Membersihkan interval saat komponen tidak lagi digunakan
    return () => clearInterval(timer);
  }, []);

  // Memformat waktu ke GMT+7 (WIB)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      // Menggunakan en-US agar format AM/PM standar
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <section
      aria-label="trenggalek"
      className="mt-18 border-t border-[#909090] grid lg:grid-cols-3 lg:gap-x-20 lg:pt-6"
    >
      <div className="mt-6 lg:mt-0">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[28px] leading-12">Trenggalek</h2>
          <p className="font-mono text-[28px] leading-12 text-[#8C8C8C]">
            {formatTime(time)} (GMT+7)
          </p>
        </div>
        <p className="mt-5 text-[#8C8C8C]">
          Trenggalek is a small town at the edge of East Java.
          <br />
          <br />
          It is quieter here. Hills behind, ocean ahead. The pace slows, and the
          thinking sharpens. The calm is not a retreat, it is an advantage: less
          noise, fewer distractions, more room to make decisions with care.
          <br />
          <br />
          This is where we do our best work: building brand and packaging
          systems with clarity, stopping power, and performance across shelf and
          digital.
        </p>
      </div>

      <div className="mt-15 lg:mt-0">
        <h2 className="text-[28px] leading-12">Find Us</h2>
        <p className="mt-5 text-[#8C8C8C]">
          Maharani Pogalan Scandinavian, 2 Storey <br /> Jl. Raya Bendorejo,
          Pojok, Pogalan, Kec. Pogalan Trenggalek Regency, East Java 66371
          Indonesia
        </p>
      </div>

      <div className="mt-15 lg:mt-0">
        <h2 className="text-[28px] leading-12">Business Inquiries</h2>
        <p className="mt-5 text-[#8C8C8C]">
          Eko Widarto
          <br />
          <Link target="_blank" href="mailto:eko@widartoimpact.com">
            eko@widartoimpact.com
          </Link>
          <br />
          <Link target="_blank" href="https://wa.me/+6282264321118">
            +62 822 6432 1118
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Trenggalek;
