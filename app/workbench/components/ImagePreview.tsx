"use client"

import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { useWorkbenchStore } from '@/provider/workbench-store-provider';

interface ImagePreviewProps {
  image: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
  // const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | undefined>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showImageSize, setShowImageSize] = useState<{ width: number; height: number } | null>(null);
  const { circleRect, setCircleRect } = useWorkbenchStore((state) => state);

  useEffect(() => {
    if (!image) {
      setImgElement(undefined);
      setShowImageSize(null);
      return;
    }
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      setImgElement(img);
      const showWidth = img.width > 500 ? 500 : img.width;
      const showHeight = showWidth * img.height / img.width;
      setShowImageSize({ width: showWidth, height: showHeight });
    };
  }, [image]);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setCircleRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !circleRect) return;
    const pos = e.target.getStage().getPointerPosition();
    const {x: startX, y: startY} = circleRect!;
    const newRect = {
      x: startX,
      y: startY,
      width: pos.x - startX,
      height: pos.y - startY,
    };
    setCircleRect(newRect);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const imageWidth = showImageSize?.width || 600;
  const imageHeight = showImageSize?.height || 400;
  return (
    <Stage
      width={imageWidth} // 动态设置宽度
      height={imageHeight} // 动态设置高度
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {image && imgElement && (
          <KonvaImage
            image={imgElement}
            width={imageWidth} // 根据原始宽度设置
            height={imageHeight} // 根据原始高度设置
          />
        )}
        {circleRect && (
          <Rect
            x={circleRect.x}
            y={circleRect.y}
            width={circleRect.width}
            height={circleRect.height}
            stroke="rgba(255, 0, 0, 0.5)" // 只给边框上色
            strokeWidth={2} // 设置边框宽度
            fill="transparent"
            draggable
          />
        )}
      </Layer>
    </Stage>
  );
};

export default ImagePreview;
