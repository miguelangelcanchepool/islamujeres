import { Photo } from "@/components/Photo";
import type { Media } from "@/lib/media";

type ChapterHeroProps = {
  index: string;
  title: string;
  lede: string;
  image: Media;
};

export function ChapterHero({ index, title, lede, image }: ChapterHeroProps) {
  return (
    <header className="chapter-hero">
      <Photo image={image} priority credit="top" sizes="100vw" />
      <div className="hero-shade" />
      <div className="chapter-hero-copy">
        <p className="eyebrow">{index}</p>
        <h1>{title}</h1>
        <p className="hero-lead">{lede}</p>
      </div>
    </header>
  );
}
