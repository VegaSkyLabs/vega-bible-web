'use client';

import Image from 'next/image';

interface VerseImageProps {
  imagePath: string;
  reference: string;
  revealed?: boolean;
}

export default function VerseImage({ imagePath, reference, revealed = false }: VerseImageProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <div className="relative w-full h-96 bg-base-200 rounded-lg overflow-hidden">
          {/* Placeholder for now since we don't have actual images */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center p-8">
              <p className="text-6xl mb-4">📖</p>
              <p className="text-sm opacity-70">
                Image placeholder for: {reference}
              </p>
              <p className="text-xs mt-2 opacity-50">
                Add image at: {imagePath}
              </p>
            </div>
          </div>
          {/* Uncomment when you have actual images:
          <Image
            src={imagePath}
            alt={revealed ? reference : "Guess the verse"}
            fill
            className="object-cover"
            priority
          />
          */}
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
