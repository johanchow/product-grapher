"use client"

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Text } from 'react-konva';
import { useWorkbenchStore } from '@/provider/workbench-store-provider';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

export interface ImagePreviewRef {
  updateImage: () => void;
}

interface ImagePreviewProps {
  textFont?: { text: string; font: string };
  thumbnail?: string;
  bg?: string;
}

const ImagePreview = forwardRef<ImagePreviewRef, ImagePreviewProps>(({textFont, thumbnail}, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | undefined>();
  const [thumbnailElement, setThumbnailElement] = useState<HTMLImageElement | undefined>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showImageSize, setShowImageSize] = useState<{ width: number; height: number } | null>(null);
  const { circleRect, imageData: { current: image }, setCircleRect, setImageAction } = useWorkbenchStore((state) => state);

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

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailElement(undefined);
      return;
    }
    const img = new window.Image();
    img.src = thumbnail;
    img.onload = () => {
      setThumbnailElement(img);
    };
  }, [thumbnail]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setCircleRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !circleRect) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const {x: startX, y: startY} = circleRect;
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

  // 暴露 updateImage 方法
  useImperativeHandle(ref, () => ({
    updateImage: () => {
      if (!stageRef.current) return;
      // 临时隐藏选择框
      const hasSelectionRect = circleRect && !textFont && !thumbnail;
      if (hasSelectionRect) {
        const selectionRect = stageRef.current.findOne('.selection-rect');
        if (selectionRect) {
          selectionRect.hide();
        }
      }
      // 导出图片
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
      });
      // 更新到store
      setImageAction(dataURL);
    }
  }));

  const imageWidth = showImageSize?.width || 600;
  const imageHeight = showImageSize?.height || 400;

  return (
    <Stage
      ref={stageRef}
      width={imageWidth}
      height={imageHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {image && imgElement && (
          <KonvaImage
            image={imgElement}
            width={imageWidth}
            height={imageHeight}
          />
        )}
        {thumbnail && thumbnailElement && circleRect && (
          <KonvaImage
            image={thumbnailElement}
            x={circleRect.x}
            y={circleRect.y}
            width={circleRect.width}
            height={circleRect.height}
            draggable
          />
        )}
        {circleRect && !textFont && !thumbnail && (
          <Rect
            name="selection-rect" // 添加名称以便查找
            x={circleRect.x}
            y={circleRect.y}
            width={circleRect.width}
            height={circleRect.height}
            stroke="rgba(255, 0, 0, 0.5)"
            strokeWidth={2}
            fill="transparent"
            draggable
          />
        )}
        {textFont && circleRect && (
          <Text
            x={circleRect.x}
            y={circleRect.y}
            width={circleRect.width}
            height={circleRect.height}
            text={textFont.text}
            fontSize={20}
            fontFamily={textFont.font}
            fill="black"
            align="center"
            verticalAlign="middle"
            wrap="word"
            padding={5}
          />
        )}
      </Layer>
    </Stage>
  );
});

// 添加 displayName
ImagePreview.displayName = 'ImagePreview';

export default ImagePreview;
