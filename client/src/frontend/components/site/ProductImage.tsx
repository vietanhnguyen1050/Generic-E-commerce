import { useState, useEffect } from "react";

export const DEFAULT_PRODUCT_IMAGE = "/products/placeholder.svg";

export function ProductImage({
  src,
  alt,
  className,
  width = 800,
  height = 800,
  loading = "lazy",
}: {
  src?: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const targetSrc = !src || hasError ? DEFAULT_PRODUCT_IMAGE : src;

  return (
    <img
      src={targetSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
