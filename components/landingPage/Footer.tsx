
import styles from "@/utils/style";
// import { footerLinks, socialMedia } from "@/utils/constants";
import Logo from "../logo";
// import Image from "next/image";

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-[1] flex flex-col justify-start mr-10">
    <Logo href="/" className="flex items-center gap-2" showText={true} />
        <p className={`${styles.paragraph} mt-4 max-w-[312px] dark:text-white`}>
          la solution de gestion d&apos;agence pour les professionnels qui automatise vos tâches
        </p>
      </div>

      {/* <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
        {footerLinks.map((footerlink) => (
          <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}>
            <h4 className="font-poppins font-medium text-[18px] leading-[27px] dark:text-white">
              {footerlink.title}
            </h4>
            <ul className="list-none mt-4">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`font-poppins font-normal text-[16px] leading-[24px] dark:text-white hover:text-secondary cursor-pointer ${
                    index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                  }`}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
    </div>

    <div className="w-full flex justify-center items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins gap-2 font-normal text-center text-[8px] leading-[27px] dark:text-white flex justify-center">
        Copyright Ⓒ 2025 <Logo showText={true} />. Tous Droits Reservés.
      </p>

      {/* <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <Image
           width={21}
            height={21}
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer text-gray-900 dark:text-white ${
              index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
            }`}
            // onClick={() => window.open(social.link)}
          />
        ))}
      </div> */}
    </div>
  </section>
);

export default Footer;
