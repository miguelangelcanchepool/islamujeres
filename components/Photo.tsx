import Image from "next/image";
import type { Media } from "@/lib/media";

type PhotoProps = {
  image: Media;
  priority?: boolean;
  sizes?: string;
  className?: string;
  credit?: "top" | "bottom";
};

export function Photo({
  image,
  priority = false,
  sizes = "100vw",
  className = "",
  credit = "bottom",
}: PhotoProps) {
  return (
    <figure className={`photo credit-${credit} ${className}`.trim()}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="photo-img"
      />
      <figcaption className="photo-credit">{image.author}</figcaption>
    </figure>
  );
}
