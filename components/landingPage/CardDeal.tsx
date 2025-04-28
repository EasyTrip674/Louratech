import styles, { layout } from "@/utils/style";
import Button from "./Button";
import UsageCard from "./UsageCard";

const CardDeal = () => (
  <section className={layout.section}>
  <div className={layout.sectionInfo}>
    <h2 className={styles.heading2}>
      Voyagez sereinement au Maroc <br className="sm:block hidden" /> avec notre carte prépayée !
    </h2>
    <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Profitez dun moyen de paiement sécurisé et pratique pour vos dépenses au Maroc. Rechargez votre carte en quelques clics, suivez vos transactions en temps réel et bénéficiez d'offres exclusives chez nos partenaires.
    </p>

    <Button styles={`mt-10`} />
  </div>

  <div className={layout.sectionImg}>
    <UsageCard />
    {/* <img src={resources.card} alt="Carte prépayée" className="w-[100%] h-[100%]" /> */}
  </div>
</section>
);

export default CardDeal;
