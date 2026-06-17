"use client";

import Image from "next/image";
import Link from "next/link";
import { socialMedia } from "../config/navigation";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const isContactShown = pathname === "/contact";
  const isFormShown = pathname === "/form";
  return (
    <>
      <footer className="px-4.5 pb-4.5 mt-5">
        {/* {!isFormShown ? (
          <>
            <div className="lg:grid lg:grid-cols-[450px_1fr] xl:grid-cols-[700px_1fr] lg:items-start justify-start">
              <div>
                <h4 className="text-base">
                  New Business Inquiries <br /> Media & PR
                </h4>
              </div>

              <div>
                <div className="mt-3.5 lg:mt-0">
                  <Link href="mailto:eko@widartoimpact.com">
                    eko@widartoimpact.com
                  </Link>
                </div>
                <div>
                  <Link href="mailto:press@widartoimpact.com">
                    press@widartoimpact.com
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-b border-[#909090] mt-16.75 lg:mt-12" />
          </>
        ) : null} */}

        {isFormShown && (
          <div className="border-b border-[#909090] mt-16.75 lg:mt-25.5" />
        )}

        <div className="mt-5">
          <div className="lg:grid lg:grid-cols-[450px_1fr] xl:grid-cols-[700px_1fr] lg:items-start justify-start">
            <h4 className="text-base">About</h4>

            <p className="text-base mt-3.5 lg:mt-0 lg:max-w-2xl">
              We are Widarto Impact. An independent, strategy led brand design
              agency. <br /> We build FMCG brands and packaging systems that
              move people and markets. We help brands refresh and scale up to
              drive growth.
            </p>
          </div>
        </div>

        <div className="mt-23 lg:mt-42">
          <Image
            src="/logo/widarto-impact-logo.svg"
            alt="widarto impact logo"
            width={1200}
            height={371}
            loading="lazy"
            className="w-full h-auto"
            draggable={false}
          />
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-13">
            <div className="flex items-center gap-x-3.5">
              {socialMedia.map((item, index) => (
                <Link
                  className="text-base"
                  aria-label={item.title}
                  href={item.href}
                  key={index}
                  target="_blank"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <p className="text-base mt-3.5 lg:mt-0 ">©2026 Widarto Impact</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
