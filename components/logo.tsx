import Image from "next/image";
import Link from "next/link";

export default function Logo({
    href ,
    className,
    showText = true,
}:{
    showText?: boolean;
    href?: string;
    className?: string;
}) {
    return (
      href ? (
        <Link href={href} className={`flex items-center gap-2 ${className}`}>
         <Image src={"/logo.png"} alt="Logo" width={40} height={40} className="dark:invert" />
         <p>
            {showText && (
                <span className="text-gray-900 dark:text-white font-bold">
               Loura<span className="text-brand-500">Tech</span>
                </span>
            )}
         </p>
        </Link>
        ) : (
            <div className={`flex items-center ${className}`}>
             <Image src={"/logo.png"} alt="Logo" width={40} height={40} className="dark:invert" />
            <p>
                {showText && (
                    <span className="text-gray-900 dark:text-white font-bold">
                Loura<span className="text-brand-500">Tech</span>
                    </span>
                )}
            </p>
       </div>
    
    ));
    }