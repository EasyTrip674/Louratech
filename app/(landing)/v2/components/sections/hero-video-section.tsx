import { HeroVideoDialog } from "../../components/ui/hero-video-dialog";

export function HeroVideoSection() {
  return (
    <div className="relative px-6 mt-10">
      <div className="relative size-full shadow-xl rounded-2xl overflow-hidden">
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/wZVtzOp92lc"
          thumbnailSrc="/hero.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/wZVtzOp92lc"
          thumbnailSrc="/hero.png"
          thumbnailAlt="Hero Video"
        />
      </div>
    </div>
  );
}
