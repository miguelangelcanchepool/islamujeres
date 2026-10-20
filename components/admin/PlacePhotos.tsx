"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makePlaceCover, removePlacePhoto } from "@/app/admin/lugares/photo-actions";
import type { AdminPhoto } from "@/lib/admin/photo-types";

const accept = "image/jpeg,image/png,image/webp";

export function PlacePhotos({
  placeId,
  photos,
}: {
  placeId: string;
  photos: AdminPhoto[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  async function onUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    const alt = String(data.get("alt") ?? "").trim();

    if (!(file instanceof File) || file.size <= 0) {
      setError("Selecciona una imagen.");
      setMessage(null);
      return;
    }
    if (!alt) {
      setError("Escribe el texto alternativo de la fotografía.");
      setMessage(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La fotografía supera 5 MB.");
      setMessage(null);
      return;
    }

    setError(null);
    setMessage(null);
    setProgress(0);

    const result = await sendPhoto(placeId, data, setProgress);
    setProgress(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    form.reset();
    setMessage("La fotografía se guardó. Si el lugar está publicado, la guía la tomará en la próxima consulta.");
    router.refresh();
  }

  return (
    <section className="admin-photos" aria-labelledby="fotos-lugar">
      <div className="admin-photos-head">
        <h2 id="fotos-lugar">Fotografías</h2>
        <p>
          La primera es la portada. En la guía pública aparece antes que el resto. JPG, PNG o WebP,
          hasta 5 MB.
        </p>
      </div>

      {message ? (
        <p className="admin-banner" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="admin-field-error" role="alert">
          {error}
        </p>
      ) : null}

      {photos.length === 0 ? (
        <p className="admin-empty">Este lugar todavía no tiene fotografías.</p>
      ) : (
        <ul className="admin-photo-grid">
          {photos.map((photo) => (
            <li key={photo.id}>
              <img src={photo.src} alt={photo.alt} />
              <div>
                {photo.cover ? <strong>Portada</strong> : null}
                <p>{photo.alt}</p>
                <div className="admin-photo-actions">
                  {photo.cover ? null : (
                    <form action={makePlaceCover}>
                      <input type="hidden" name="placeId" value={placeId} />
                      <input type="hidden" name="photoId" value={photo.id} />
                      <button type="submit">Usar como portada</button>
                    </form>
                  )}
                  {confirming === photo.id ? (
                    <form action={removePlacePhoto}>
                      <input type="hidden" name="placeId" value={placeId} />
                      <input type="hidden" name="photoId" value={photo.id} />
                      <p>¿Eliminar esta fotografía?</p>
                      <button className="admin-danger" type="submit">
                        Eliminar definitivamente
                      </button>
                      <button type="button" onClick={() => setConfirming(null)}>
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <button type="button" onClick={() => setConfirming(photo.id)}>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="admin-photo-upload" onSubmit={onUpload}>
        <label>
          Nueva imagen
          <input name="file" type="file" accept={accept} required />
        </label>
        <label>
          Texto alternativo
          <input name="alt" type="text" maxLength={180} required placeholder="Qué se ve en la imagen" />
        </label>
        <button type="submit" disabled={progress != null}>
          {progress != null ? "Subiendo…" : "Subir fotografía"}
        </button>
        {progress != null ? (
          <div
            className="admin-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Progreso de la subida"
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </form>
    </section>
  );
}

function sendPhoto(
  placeId: string,
  data: FormData,
  onProgress: (value: number) => void,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/admin/lugares/${placeId}/fotos`);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const payload = readPayload(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true });
        return;
      }
      resolve({ ok: false, error: payload.error ?? "No se pudo guardar la fotografía." });
    };
    xhr.onerror = () => resolve({ ok: false, error: "No se pudo enviar la fotografía." });
    xhr.send(data);
  });
}

function readPayload(raw: string): { error?: string } {
  try {
    const parsed = JSON.parse(raw) as { error?: unknown };
    return typeof parsed.error === "string" ? { error: parsed.error } : {};
  } catch {
    return {};
  }
}
