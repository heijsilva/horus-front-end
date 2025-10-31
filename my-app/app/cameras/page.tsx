'use client';

import { useRef } from 'react';
import Sidebar from '../components/Sidebar';

const cameras = [
  { id: 1, location: 'Câmera 15 - Av. Norte', videoRef: 'video1' },
  { id: 2, location: 'Câmera 15 - Av. Norte', videoRef: 'video2' },
  { id: 3, location: 'Câmera 15 - Av. Norte', videoRef: 'video3' },
  { id: 4, location: 'Câmera 15 - Av. Norte', videoRef: 'video4' },
  { id: 5, location: 'Câmera 15 - Av. Norte', videoRef: 'video5' },
  { id: 6, location: 'Câmera 15 - Av. Norte', videoRef: 'video6' },
];

export default function CamerasPage() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const video4Ref = useRef<HTMLVideoElement>(null);
  const video5Ref = useRef<HTMLVideoElement>(null);
  const video6Ref = useRef<HTMLVideoElement>(null);

  const videoRefs = {
    video1: video1Ref,
    video2: video2Ref,
    video3: video3Ref,
    video4: video4Ref,
    video5: video5Ref,
    video6: video6Ref,
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          {/* Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">CÂMERAS</h1>
              <button className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 focus:border-cyan-400 focus:outline-none">
                Hoje ▼
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="border-b border-zinc-800 bg-zinc-900/30 px-8 py-4">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2">
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar câmera..."
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-400 outline-none"
              />
            </div>
          </div>

          {/* Grid de câmeras */}
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-lg transition-all hover:border-cyan-400/50"
                >
                  {/* Container do vídeo */}
                  <div className="relative aspect-video bg-zinc-950">
                    <video
                      ref={videoRefs[camera.videoRef as keyof typeof videoRefs]}
                      className="h-full w-full object-cover"
                      controls
                      muted
                      loop
                    >
                      <source src={`/${camera.videoRef}.mp4`} type="video/mp4" />
                      Seu navegador não suporta vídeo.
                    </video>

                    {/* Overlay com ícone de play (quando pausado) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20 backdrop-blur-sm">
                        <svg
                          className="h-8 w-8 text-cyan-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Badge de status ao vivo */}
                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                      <span className="text-xs font-medium text-white">AO VIVO</span>
                    </div>
                  </div>

                  {/* Legenda com localização */}
                  <div className="flex items-center gap-3 border-t border-zinc-800 bg-zinc-900 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400">
                      <svg
                        className="h-4 w-4 text-zinc-900"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-100">
                        {camera.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}