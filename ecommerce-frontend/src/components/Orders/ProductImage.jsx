export default function ProductImage({ image, name }) {
  return (
    <img
      src={image}
      alt={name}
      className="w-[150px] h-[150px] object-cover rounded-md border"
    />
  );
}
