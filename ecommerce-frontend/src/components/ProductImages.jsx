import { useState } from "react";

function ProductImages({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);
  return (
    <div className="flex gap-6 items-start">
      <div
        className="flex flex-col gap-3 
                      overflow-y-auto max-h-[700px] 
                      pr-2 scrollbar-thin 
                      scrollbar-thumb-gray-400 
                      scrollbar-track-gray-200"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`rounded-xl border-2 cursor-pointer 
                        transition-all duration-200 
                        ${
                          image === mainImage
                            ? "border-black scale-105"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
            onClick={() => setMainImage(image)}
          >
            <img
              src={image}
              alt={`thumb-${index}`}
              className="w-23 h-23 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      <div
        className="flex-1 flex justify-center 
                   items-start rounded-2xl"
      >
        <img
          src={mainImage}
          alt="Main"
          className="w-full max-w-[800px] 
                     h-[750px]
                     object-contain 
                     rounded-2xl transition-transform 
                     duration-300 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

export default ProductImages;
