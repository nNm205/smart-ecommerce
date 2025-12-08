function ProductDescription({ description }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}

export default ProductDescription;
