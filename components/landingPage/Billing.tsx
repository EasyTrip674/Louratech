import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Lock, ChevronDown, CreditCard, Receipt } from 'lucide-react';
import resources from '@/utils/ressources';
import PrepaidCard from './PrepaidCard';

interface CurrencyInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currency?: string;
  placeholder?: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  expiresIn: number;
}

interface StoreButton {
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency = 'EUR',
  placeholder = '0.00'
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full p-4 bg-white/5 border border-gray-700 rounded-xl text-lg text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
      placeholder={placeholder}
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <span className="text-gray-400">{currency}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

const ExchangeCard: React.FC = () => {
  const [amount, setAmount] = useState<string>('1,000');
  const exchangeRate: ExchangeRate = {
    from: 'EUR',
    to: 'USD',
    rate: 1.0307,
    expiresIn: 43
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex-1 max-w-xl w-full p-8 space-y-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-400" />
          <span className="font-medium text-white text-base">
            Taux garanti ({exchangeRate.expiresIn}h)
          </span>
        </div>
        <span className="bg-brand-500/10 text-brand-400 px-4 py-2 rounded-full text-sm font-medium">
          1 {exchangeRate.from} = {exchangeRate.rate} {exchangeRate.to}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Montant à envoyer</label>
          <CurrencyInput 
            value={amount}
            onChange={handleAmountChange}
            currency={exchangeRate.from}
          />
          <div className='flex justify-center items-center my-6'>
           <PrepaidCard />
          </div>
          <div className="mt-4">
            <a href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
              Envoi supérieur à 20,000 EUR ? Bénéficiez d&apos;une réduction sur nos frais
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoreButtons: React.FC = () => {
  const storeButtons: StoreButton[] = [
    {
      src: resources.apple,
      alt: "Télécharger sur l'App Store",
      width: 129,
      height: 42,
      href: "#"
    },
    {
      src: resources.google,
      alt: "Télécharger sur Google Play",
      width: 144,
      height: 43,
      href: "#"
    }
  ];

  return (
    <div className="flex flex-wrap gap-6 mt-10">
      {storeButtons.map((button, index) => (
        <a 
          key={index}
          href={button.href}
          className="transform hover:scale-105 transition-transform"
        >
          <Image
            src={button.src}
            alt={button.alt}
            width={button.width}
            height={button.height}
            className="object-contain"
          />
        </a>
      ))}
    </div>
  );
};

const Billing: React.FC = () => {
  return (
    <section id="product" className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <ExchangeCard />
              {/* Gradients */}
              <div className="absolute -z-10 -left-20 top-0 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -left-10 bottom-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="order-1 lg:order-2 max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              Gérez vos clients <br className="hidden sm:block" />
              et vos paiements
            </h2>
            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
              Simplifiez la gestion de vos clients et de vos transactions. Notre plateforme vous permet 
              de suivre les paiements, générer des factures et optimiser votre relation client 
              en toute simplicité.
            </p>
            <StoreButtons />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billing;