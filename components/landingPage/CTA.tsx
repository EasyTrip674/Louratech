import styles from "@/utils/style";
import Button from "./Button";

const CTA = () => (
  <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={`${styles.heading2} dark:text-white text-gray-900`}>Essayez notre service dès maintenant !</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Découvrez comment notre solution peut transformer la gestion de votre agence. Inscrivez-vous dès aujourd'hui et profitez d'une période d'essai gratuite pour explorer toutes nos fonctionnalités.
     </p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button 
        styles="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" 
        text="Démarrer l'essai gratuit" 
      />
    </div>
  </section>
);

export default CTA;
