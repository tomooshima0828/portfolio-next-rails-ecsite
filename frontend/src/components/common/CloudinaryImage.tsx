"use client";
import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * CloudinaryImageコンポーネント
 * 
 * ActiveStorageから提供されるURLをCloudinaryのpublic_idに変換し、
 * Cloudinaryの最適化された画像を表示します。
 * 
 * 開発環境（ローカルストレージ）と本番環境（Cloudinary）の両方に対応しています。
 */
export default function CloudinaryImage({ 
  src, 
  alt, 
  width = 500, 
  height = 500,
  className = ""
}: CloudinaryImageProps) {
  const [isCloudinaryUrl, setIsCloudinaryUrl] = useState<boolean>(false);
  const [publicId, setPublicId] = useState<string>("");
  
  useEffect(() => {
    // URLがCloudinaryのものかどうかを判断
    if (src && src.includes('cloudinary.com')) {
      setIsCloudinaryUrl(true);
      
      try {
        // CloudinaryのURLからpublic_idを抽出
        const urlObj = new URL(src);
        const pathParts = urlObj.pathname.split('/');
        // upload/v1234567890/ の後の部分を取得
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 2 < pathParts.length) {
          // .jpgなどの拡張子を除去
          const filename = pathParts[pathParts.length - 1];
          const filenameWithoutExt = filename.split('.')[0];
          
          // public_idを構築
          const publicIdParts = pathParts.slice(uploadIndex + 2, pathParts.length - 1);
          publicIdParts.push(filenameWithoutExt);
          setPublicId(publicIdParts.join('/'));
        }
      } catch (e) {
        console.error('Failed to parse Cloudinary URL:', e);
        setIsCloudinaryUrl(false);
      }
    } else {
      setIsCloudinaryUrl(false);
    }
  }, [src]);
  
  if (!src) {
    // 画像がない場合はプレースホルダーを表示
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`} 
        style={{ width, height }}
      >
        <span className="text-gray-400">画像なし</span>
      </div>
    );
  }
  
  if (isCloudinaryUrl && publicId) {
    // Cloudinary画像の場合
    return (
      <CldImage
        src={publicId}
        width={width}
        height={height}
        alt={alt}
        crop="fill"
        quality="auto"
        format="auto"
        className={className}
      />
    );
  }
  
  // 通常の画像（開発環境など）
  return (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  );
}
