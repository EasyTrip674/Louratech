import { useState } from 'react';
import { Wifi, CreditCard } from 'lucide-react';

const PrepaidCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-96 h-56 relative perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Front of the card */}
      <div className={`absolute w-full h-full transition-transform duration-500 preserve-3d 
        ${isFlipped ? 'rotate-y-180 invisible' : 'rotate-y-0 visible'}
        bg-gradient-to-br from-teal-600 to-blue-800 rounded-2xl p-6 shadow-xl 
        overflow-hidden`}>
        {/* Zelige Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-0.5">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="aspect-square bg-white transform rotate-45" />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between h-full relative z-10">
          {/* Chip and Wireless */}
          <div className="flex justify-between items-start">
            <div className="w-12 h-10 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-md 
              border-2 border-yellow-200/30" />
            <Wifi className="w-8 h-8 text-white/80 rotate-90" />
          </div>

          {/* Card Number */}
          <div className="space-y-4">
            <div className="flex justify-between text-xl text-white tracking-wider 
              font-['Andalus']">
              <span>4589</span>
              <span>••••</span>
              <span>••••</span>
              <span>3456</span>
            </div>

            {/* Card Holder Info */}
            <div className="flex justify-between items-end">
              <div className="text-white/90">
                <p className="text-xs mb-1 font-['Andalus']">Titulaire de la carte</p>
                <p className="text-sm font-medium tracking-wide font-['Andalus']">JEAN DUPONT</p>
              </div>
              <div className="text-white/90">
                <p className="text-xs mb-1 font-['Andalus']">Expire</p>
                <p className="text-sm font-medium">12/25</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div className={`absolute w-full h-full transition-transform duration-500 preserve-3d 
        ${isFlipped ? 'rotate-y-0 visible' : 'rotate-y-180 invisible'}
        bg-gradient-to-br from-teal-700 to-blue-900 rounded-2xl shadow-xl overflow-hidden`}>
        {/* Zelige Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-0.5">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="aspect-square bg-white transform rotate-45" />
            ))}
          </div>
        </div>
        
        <div className="w-full h-12 bg-black/80 my-6" />
        <div className="px-6">
          <div className="bg-white/80 h-10 flex items-center justify-end px-4 mb-4">
            <span className="text-black/80 tracking-wider">123</span>
          </div>
          <p className="text-xs text-white/60 mt-2 font-['Andalus']">
            Cette carte est la propriété de notre banque. En cas de perte ou de vol, 
            veuillez contacter immédiatement le service client.
          </p>
        </div>
      </div>

      {/* Card Features */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-4 bg-teal-900/50 p-4 rounded-xl 
          border border-teal-500/20">
          <CreditCard className="w-6 h-6 text-teal-400" />
          <div>
            <h3 className="text-white font-medium font-['Andalus']">Carte Prépayée Premium</h3>
            <p className="text-teal-200 text-sm">Solde disponible: 1,234.56 €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepaidCard;