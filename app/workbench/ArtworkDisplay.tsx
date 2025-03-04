"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { useWorkbenchStore } from '@/provider/workbench-store-provider';
import AddPictureModal from './components/AddPictureModal';
import styles from './ArtworkDisplay.module.scss';

interface ArtworkDisplayProps {
  artifactId: string | null;
}

enum InsertElementStatus {
  Ready = 0,
  CircleRectangle = 1,
  InsertModal = 2,
}

const ImagePreview = dynamic(() => import("./components/ImagePreview"), { ssr: false });


const ArtworkDisplay: React.FC<ArtworkDisplayProps> = ({ artifactId }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAddPictureModal, setShowAddPictureModal] = useState(false);
  const { circleRect, setCircleRect } = useWorkbenchStore((state) => state);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalSubmit = (option: 'upload' | 'text', description: string) => {
    console.log('提交:', option, description);
    // 处理提交逻辑
  };

  const onClickInsert = (contentType: string) => {
    if (!circleRect) {
      alert('请先在原图上圈选区域');
      return;
    }
    if (contentType === 'picture') {
      setShowAddPictureModal(true);
    }
    if (contentType === 'text') {
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {artifactId ? (
          <h1>作品 ID 为 {artifactId} 的实时预览</h1>
        ) : (
          <h1>效果预览</h1>
        )}
      </div>
      <div className={styles.previewToolbar}>
        {!previewImage && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
        {previewImage && (
          <>
            <div className={styles.preview}>
              <ImagePreview image={previewImage} />
            </div>
            <div className={styles.toolbar}>
              <div className={styles.tool} onClick={() => setShowAddPictureModal(true)}>
                <Image src="/icons/background.svg" alt="换背景" width={24} height={24} />
                <span>换背景</span>
              </div>
              <div className={styles.tool} onClick={() => onClickInsert('picture')}>
                <Image src="/icons/illustration.svg" alt="插图" width={24} height={24} />
                <span>插图</span>
              </div>
              <div className={styles.tool} onClick={() => onClickInsert('text')}>
                <Image src="/icons/text.svg" alt="插文字" width={24} height={24} />
                <span>插文字</span>
              </div>
              <div className={styles.tool}>
                <Image src="/icons/text.svg" alt="擦除" width={24} height={24} />
                <span>擦除</span>
              </div>
            </div>
          </>
        )}
      </div>

      <AddPictureModal
        showModal={showAddPictureModal}
        setShowModal={setShowAddPictureModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ArtworkDisplay;
