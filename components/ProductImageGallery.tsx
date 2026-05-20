"use client";

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { clsx } from "clsx";

const MAX_PRODUCT_IMAGES = 10;

export function ProductImageGallery({
  images,
  title
}: {
  images: string[];
  title: string;
}) {
  const galleryImages = images.slice(0, MAX_PRODUCT_IMAGES);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const selectedImage = galleryImages[selectedIndex];

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isZoomOpen]);

  if (!selectedImage) {
    return (
      <div className="flex aspect-[4/3] w-full max-w-2xl items-center justify-center rounded-lg border border-dashed border-lama-detail/50 bg-lama-card text-sm font-bold text-lama-ink/70 shadow-soft">
        Sin imagen disponible
      </div>
    );
  }

  return (
    <section aria-label={`Imagenes de ${title}`} className="w-full max-w-2xl">
      <button
        type="button"
        onClick={() => setIsZoomOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-lama-line bg-lama-card shadow-soft focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2"
        aria-label={`Ampliar imagen ${selectedIndex + 1} de ${title}`}
      >
        <img src={selectedImage} alt={title} className="h-full w-full object-cover" />
        <span className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-lama-card/90 text-lama-ink shadow-soft transition group-hover:bg-white">
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      {galleryImages.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Miniaturas del producto">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-lama-card focus:outline-none focus:ring-2 focus:ring-lama-detail focus:ring-offset-2 sm:h-20 sm:w-20",
                selectedIndex === index ? "border-lama-detail ring-2 ring-lama-detail" : "border-lama-line"
              )}
              aria-label={`Seleccionar imagen ${index + 1} de ${galleryImages.length}`}
              aria-current={selectedIndex === index ? "true" : undefined}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-lama-ink/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${title}`}
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-h-full w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-lama-card text-lama-ink shadow-soft hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail"
              aria-label="Cerrar imagen ampliada"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <img
              src={selectedImage}
              alt={title}
              className="max-h-[88vh] w-full rounded-lg border border-lama-line bg-lama-card object-contain shadow-soft"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
