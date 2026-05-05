"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, RefreshCw, Minus, Plus } from 'lucide-react';

interface ImageCropModalProps {
  /** The raw File selected by the user */
  file: File | null;
  /** Called with the cropped Blob when user confirms */
  onCrop: (blob: Blob) => void;
  /** Called when user cancels */
  onClose: () => void;
  /** Aspect ratio of the crop box. Default: 1 (square) */
  aspectRatio?: number;
  /** Shape of the crop overlay. Default: 'round' */
  cropShape?: 'rect' | 'round';
  /** Modal title */
  title?: string;
}

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);
  ctx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/jpeg',
      0.92
    );
  });
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export function ImageCropModal({
  file,
  onCrop,
  onClose,
  aspectRatio = 1,
  cropShape = 'round',
  title = 'Crop Photo',
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  // Create object URL once per file, revoke on cleanup — no leak
  const imageSrc = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  // Reset all state whenever a new file arrives
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  }, [file]);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setApplying(true);
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, rotation);
      onCrop(blob);
    } catch (e) {
      console.error('Crop failed:', e);
    } finally {
      setApplying(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const nudgeZoom = (delta: number) =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2))));

  const zoomLabel = `${zoom.toFixed(1)}×`;

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100%-1rem)] sm:max-w-md p-0 overflow-hidden">

        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Crop canvas */}
        <div className="relative w-full bg-black" style={{ height: '360px' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              cropShape={cropShape}
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ containerStyle: { borderRadius: 0 } }}
            />
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-[11px] text-muted-foreground pt-3 px-5">
          Drag to reposition · Scroll or pinch to zoom
        </p>

        {/* Controls */}
        <div className="px-5 py-3 space-y-3">

          {/* Zoom row */}
          <div className="flex items-center gap-2">
            {/* − button */}
            <button
              onClick={() => nudgeZoom(-ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              className="p-1 rounded-md hover:bg-accent transition-colors disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Slider */}
            <div className="relative flex-1 flex items-center">
              <ZoomOut className="absolute left-0 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-primary h-1.5 rounded-full cursor-pointer px-5"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              />
              <ZoomIn className="absolute right-0 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* + button */}
            <button
              onClick={() => nudgeZoom(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              className="p-1 rounded-md hover:bg-accent transition-colors disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Zoom level label */}
            <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
              {zoomLabel}
            </span>
          </div>

          {/* Rotate + Reset row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>−90°</span>
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>+90°</span>
              </button>
              {rotation !== 0 && (
                <span className="text-xs text-muted-foreground ml-1 tabular-nums">
                  {rotation}°
                </span>
              )}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-5 pt-1">
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleApply}
              disabled={applying}
              className="flex-1 h-10 sm:h-12"
            >
              {applying ? 'Applying…' : 'Crop & Apply'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-10 sm:h-12"
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
