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
    // URLがCloudinaryのものかどうかを判断し、public_idを抽出する
    if (src && src.includes('cloudinary.com')) {
      setIsCloudinaryUrl(true); // Cloudinary URLであるとマークします。
      
      try {
        // CloudinaryのURLからpublic_idを抽出する処理を開始します。
        // 例: src = "https://res.cloudinary.com/my-cloud/image/upload/c_fill,w_500/v1678901234/products/category_images/my_product_image.jpg"
        const urlObj = new URL(src); // URL文字列を解析し、URLオブジェクトを生成します。
        const pathParts = urlObj.pathname.split('/'); // URLのパス部分を'/'で分割し、セグメントの配列を作成します。
                                                     // 例: ["", "my-cloud", "image", "upload", "c_fill,w_500", "v1678901234", "products", "category_images", "my_product_image.jpg"]
        
        // 'upload'セグメントのインデックスを特定し、public_idの開始位置を決定します。
        const uploadIndex = pathParts.indexOf('upload'); // 例: 'upload'はインデックス3にあるため、uploadIndex = 3
        
        // 'upload'が見つかり、かつその後にpublic_idとファイル名のための十分なセグメントがあるか確認します。
        // (uploadIndex + 3 は public_id の最初のセグメントを指します)
        if (uploadIndex !== -1 && uploadIndex + 3 < pathParts.length) {
          // ファイル名（拡張子付き）を取得します。
          const filename = pathParts[pathParts.length - 1]; // 例: "my_product_image.jpg"
          // ファイル名から拡張子を除去します。
          const filenameWithoutExt = filename.split('.')[0]; // 例: "my_product_image"
          
          // public_idを構成するパスセグメントを抽出します。
          // 'upload'セグメントの3つ後（v<version>の次）から、ファイル名の直前までをスライスします。
          const publicIdParts = pathParts.slice(uploadIndex + 3, pathParts.length - 1); // 例: ["products", "category_images"]
          // 抽出したpublic_idのパスセグメントに拡張子なしのファイル名を追加します。
          publicIdParts.push(filenameWithoutExt); // 例: ["products", "category_images", "my_product_image"]
          
          // public_idの全セグメントを'/'で結合し、状態に設定します。
          setPublicId(publicIdParts.join('/')); // 例: "products/category_images/my_product_image"
        } else {
          // 有効なCloudinary URL構造でない場合、Cloudinary URLではないと判断します。
          setIsCloudinaryUrl(false);
        }
      } catch (e) {
        // URLパース中にエラーが発生した場合
        console.error('Failed to parse Cloudinary URL:', e);
        setIsCloudinaryUrl(false); // Cloudinary URLではないとマークします。
      }
    } else {
      // srcが空、またはCloudinary URLではない場合
      setIsCloudinaryUrl(false); // Cloudinary URLではないとマークします。
    }
  }, [src]);
  
  if (!src) {
    // 画像がない場合はプレースホルダーを表示
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`} 
        style={{ width, height }}
      >
        <span className="text-gray-400">No Image</span>
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
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  );
}
