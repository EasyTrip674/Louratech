import { ArrowRight } from "lucide-react";
import Link from "next/link";

const GetStarted = () => {
  return (
    <Link href={"/services"} className="flex items-center gap-3 bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
      <span>Commencer</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  );
};

export default GetStarted;