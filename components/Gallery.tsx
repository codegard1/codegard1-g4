"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/gallery";

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const total = photos.length;

  const open = useCallback((index: number) => {
    setCurrent(index);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setCurrent((c) => {
        if (c === null) return c;
        const next = c + delta;
        return next < 0 || next >= total ? c : next;
      });
    },
    [total]
  );

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, step]);

  const photo = current === null ? null : photos[current];

  return (
    <>
      <div className="gallery-grid" role="list">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="gallery-tile"
            role="listitem"
            onClick={() => open(i)}
            aria-label={`Open photo ${i + 1} of ${total}${p.title ? `: ${p.title}` : ""}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 200px"
              quality={60}
            />
            <span className="gallery-tile-label" aria-hidden="true">
              {i + 1}&nbsp;/&nbsp;{total}
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Photo viewer"
        onClose={() => setCurrent(null)}
        onClick={(e) => {
          // Click on the backdrop (outside the body) closes the dialog.
          if (e.target === e.currentTarget) close();
        }}
      >
        {photo && (
          <div className="lightbox-body">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="96vw"
              quality={80}
              priority
              onClick={close}
            />
            <div className="lightbox-caption">
              <button type="button" onClick={() => step(-1)} disabled={current === 0}>
                ← Prev
              </button>
              <span>
                {current! + 1} / {total}
                {photo.dateLabel ? ` · ${photo.dateLabel}` : ""}
                {photo.title ? ` · ${photo.title}` : ""}
              </span>
              <button type="button" onClick={() => step(1)} disabled={current === total - 1}>
                Next →
              </button>
              <button type="button" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
