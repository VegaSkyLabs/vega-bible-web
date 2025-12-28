'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VerseImageProps {
  imagePath: string;
  reference: string;
  revealed?: boolean;
}

export default function VerseImage({ imagePath, reference, revealed = false }: VerseImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div id="verse-image" className="verse-image card bg-base-100 shadow-xl">
      <figure className="verse-image-figure">
        <div className="relative w-full h-96 bg-base-200 rounded-lg overflow-hidden">
          {imageError ? (
            // Fallback placeholder when image fails to load
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="text-center p-8">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-sm opacity-70">
                  Image not found for: {reference}
                </p>
                <p className="text-xs mt-2 opacity-50">
                  Expected at: {imagePath}
                </p>
              </div>
            </div>
          ) : (
            <Image
              src={imagePath}
              alt={revealed ? reference : "Guess the verse"}
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </figure>
      {revealed && (
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">{reference}</h2>
        </div>
      )}
    </div>
  );
}
