import { Star } from "lucide-react";


interface TestimonialProps {
  content: string;
  name: string;
  position: string;
  company: string;
  image: string;
}

const testimonials = [
  {
    id: "testimonial-1",
    content: "Ce SaaS a révolutionné la gestion de notre agence marketing. En quelques mois, notre productivité a augmenté de 35% et nos clients sont plus satisfaits que jamais.",
    name: "Mamadou Bah",
    position: "Directrice",
    company: "AgenceWeb Plus",
    image: "/api/placeholder/100/100"
  },
  {
    id: "testimonial-2",
    content: "L'interface intuitive et les fonctionnalités complètes nous ont permis de centraliser toutes nos opérations. Un gain de temps considérable !",
    name: "Fanta Conte",
    position: "CEO",
    company: "DigitalCreative",
    image: "/api/placeholder/100/100"
  },
  {
    id: "testimonial-3",
    content: "Le support client est exceptionnel et les mises à jour régulières apportent constamment de nouvelles fonctionnalités qui répondent parfaitement à nos besoins.",
    name: "Moussa Diallo",
    position: "Responsable projet",
    company: "InnovAgency",
    image: "/api/placeholder/100/100"
  }
];

const Testimonials: React.FC = () => (
  <section className="py-20 sm:py-32 " id="clients">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ce que disent nos clients
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Des centaines d&apos;agences font confiance à notre solution pour optimiser leur gestion quotidienne
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
      
      {/* <div className="mt-16 text-center">
        <Button 
          styles="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          text="Voir plus de témoignages"
        />
      </div> */}
    </div>
  </section>
);

export default Testimonials;


const TestimonialCard: React.FC<TestimonialProps> = ({ content, name, position, company }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mx-2 mb-4 flex flex-col h-full">
    <div className="mb-4">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-base italic mb-6 flex-grow">{content}</p>
    <div className="flex items-center mt-4">
      <div className="ml-3">
        <h4 className="text-gray-900 dark:text-white font-semibold">{name}</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{position}, {company}</p>
      </div>
    </div>
  </div>
);
