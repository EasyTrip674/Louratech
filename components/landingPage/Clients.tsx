import { Briefcase, Globe, Users, Shield } from "lucide-react"; 
import styles from "@/utils/style";

const targetClients = [
  {
    id: "client-1",
    icon: <Globe size={40} className="text-secondary text-brand-800" />,
    title: "Agences de Voyage",
    description: "Optimise la gestion de vos réservations, clients et planning avec une solution tout-en-un.",
  },
  {
    id: "client-2",
    icon: <Briefcase size={40} className="text-secondary text-brand-800" />,
    title: "Agences de Tourisme",
    description: "Gère efficacement vos circuits, guides et activités touristiques en un seul endroit.",
  },
  {
    id: "client-3",
    icon: <Users size={40} className="text-secondary text-brand-800" />,
    title: "Agences Événementielles",
    description: "Organise vos événements, gère tes clients et suis tes budgets en temps réel.",
  },
  {
    id: "client-4",
    icon: <Shield size={40} className="text-secondary text-brand-800" />,
    title: "Sécurité et Assistance",
    description: "Offre des services de sécurité et d'assistance pour voyageurs.",
  },
];

const TargetClients = () => (
  <section className={`flex justify-center items-center max-lg:flex-col my-4`}>
    <h2 className="dark:text-white text-2xl font-semibold text-center mb-6">
      Nos Clients Cibles
    </h2>
    <div className={`${styles.flexCenter} flex-wrap w-full`}>
      {targetClients.map((client) => (
        <div
          key={client.id}
          className={`flex-1 ${styles.flexCenter} sm:min-w-[220px] min-w-[150px] m-5 flex-col text-center`}
        >
          <div className="mb-3">{client.icon}</div>
          <h3 className="dark:text-white text-lg font-medium">{client.title}</h3>
          <p className="text-gray-400 text-sm max-w-[200px]">
            {client.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default TargetClients;
