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
         <p className="dark:text-white"><span className="text-brand-500">M</span>G</p>
         <p>
            {showText && (
                <span className="text-gray-900 dark:text-white font-bold">
               <span className="text-brand-500">Pro</span>Gestion
                </span>
            )}
         </p>
        </Link>
        ) : (
            <div className={`flex items-center ${className}`}>
           <p className="dark:text-white"><span className="text-brand-500">M</span>G</p>
            <p>
                {showText && (
                    <span className="text-gray-900 dark:text-white font-bold">
                <span className="text-brand-500">Pro</span>Gestion
                    </span>
                )}
            </p>
       </div>
    
    ));
    }