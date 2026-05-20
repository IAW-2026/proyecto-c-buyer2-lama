"use client";

import { useEffect, useState } from "react";
import type { MouseEvent, WheelEvent } from "react";
import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { clsx } from "clsx";

const MAX_PRODUCT_IMAGES = 10;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

function clampZoom(value: number) {
  return Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);
}

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
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
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

  function openZoom() {
    setZoomLevel(MIN_ZOOM);
    setIsZoomOpen(true);
  }

  function updateZoom(delta: number) {
    setZoomLevel((current) => clampZoom(Number((current + delta).toFixed(2))));
  }

  function handleZoomWheel(event: WheelEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();
    updateZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  }

  function changeZoomFromButton(event: MouseEvent<HTMLButtonElement>, delta: number) {
    event.stopPropagation();
    updateZoom(delta);
  }

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
        onClick={openZoom}
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
          <div
            className="relative flex max-h-full w-full max-w-5xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
              <span className="rounded-md bg-lama-card px-3 py-2 text-sm font-bold text-lama-ink shadow-soft">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={(event) => changeZoomFromButton(event, -ZOOM_STEP)}
                disabled={zoomLevel <= MIN_ZOOM}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-lama-card text-lama-ink shadow-soft hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Reducir zoom"
              >
                <ZoomOut className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => changeZoomFromButton(event, ZOOM_STEP)}
                disabled={zoomLevel >= MAX_ZOOM}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-lama-card text-lama-ink shadow-soft hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Aumentar zoom"
              >
                <ZoomIn className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsZoomOpen(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-lama-card text-lama-ink shadow-soft hover:bg-white focus:outline-none focus:ring-2 focus:ring-lama-detail"
                aria-label="Cerrar imagen ampliada"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div
              onWheelCapture={handleZoomWheel}
              className="h-[88vh] max-h-[88vh] overflow-auto rounded-lg border border-lama-line bg-lama-card shadow-soft"
            >
              <div
                className="flex items-center justify-center p-4"
                style={{
                  minHeight: `${zoomLevel * 100}%`,
                  minWidth: `${zoomLevel * 100}%`
                }}
              >
                <img
                  src={selectedImage}
                  alt={title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
