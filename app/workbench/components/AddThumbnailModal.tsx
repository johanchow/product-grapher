"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkbenchStore } from '@/provider/workbench-store-provider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './AddThumbnailModal.module.scss'; // 导入样式文件

interface AddThumbnailModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (values: {thumbnail: string}) => void;
}

const queryText2Image = async ({queryKey}: {queryKey: string[]}): Promise<string> => {
  const [, prompt, width, height] = queryKey;
  const response = await fetch('/api/gen-ai/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, width, height }),
  });
  if (!response.ok) {
    throw new Error('请求失败');
  }
  const { code, message, data: {image} } = response.json();
  return image;
};

const AddThumbnailModal: React.FC<AddThumbnailModalProps> = ({ showModal, setShowModal, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedOption, setSelectedOption] = useState<'upload' | 'text'>('upload'); // 选项状态
  const queryClient = useQueryClient();
  const circleRect = useWorkbenchStore((state) => state.circleRect);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'upload' | 'text');
  };

  const onSubmitForm = async (data: any) => {
    const { description } = data;
    const {width, height } = circleRect!;
    const image = await queryClient.fetchQuery({
      queryKey: ['text-to-image', description, width, height], // 与 useQuery 的 queryKey 一致
      queryFn: queryText2Image,
    });
    onSubmit({ thumbnail: image });
    setShowModal(false); // 关闭弹窗
  };

  return (
    showModal && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2>变换背景</h2>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="upload"
                  {...register("option", { required: true })}
                  onChange={handleOptionChange}
                />
                上传新背景图
              </label>
              <label>
                <input
                  type="radio"
                  value="text"
                  {...register("option", { required: true })}
                  onChange={handleOptionChange}
                />
                文字描述新背景
              </label>
            </div>
            {errors.option && <p className={styles.error}>请选择背景方式</p>}
            {selectedOption === 'upload' && (
              <input
                type="file"
                accept="image/*"
                {...register("file", { required: selectedOption === 'upload' })}
              />
            )}
            {selectedOption === 'text' && (
              <textarea
                {...register("description", { required: true })}
                placeholder="请输入文字说明"
              />
            )}
            {errors.file && <p className={styles.error}>请上传新背景图</p>}
            {errors.description && <p className={styles.error}>请填写文字说明</p>}
            <div className={styles.footer}>
              <button type="submit" className={styles.primary}>提交</button>
              <button type="button" onClick={() => setShowModal(false)}>取消</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddThumbnailModal;
