"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ArtworkDisplay.module.scss'; // 导入样式文件
import ReplaceBgModal from './components/ReplaceBgModal'; // 导入新组件

interface ArtworkDisplayProps {
  artifactId: string | null;
}

const ArtworkDisplay: React.FC<ArtworkDisplayProps> = ({ artifactId }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showReplaceBgModal, setReplaceBgModal] = useState(false); // 控制弹窗显示

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalSubmit = (option: 'upload' | 'text', description: string) => {
    console.log('提交:', option, description);
    // 处理提交逻辑
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
        {!imagePreview && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
        {imagePreview && (
          <div className={styles.preview}>
            <Image
              src={imagePreview}
              alt="Selected Image"
              layout="responsive" // 根据原始比例展示
              width={500} // 设定一个宽度
              height={300} // 设定一个高度
            />
          </div>
        )}
        <div className={styles.toolbar}>
          <div className={styles.tool} onClick={() => setReplaceBgModal(true)}>
            <Image src="/icons/background.svg" alt="换背景" width={24} height={24} />
            <span>换背景</span>
          </div>
          <div className={styles.tool}>
            <Image src="/icons/illustration.svg" alt="插图" width={24} height={24} />
            <span>插图</span>
          </div>
          <div className={styles.tool}>
            <Image src="/icons/text.svg" alt="插文字" width={24} height={24} />
            <span>插文字</span>
          </div>
        </div>
      </div>

      {/* 使用 ReplaceBgModal 组件 */}
      <ReplaceBgModal
        showModal={showReplaceBgModal}
        setShowModal={setReplaceBgModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ArtworkDisplay;
