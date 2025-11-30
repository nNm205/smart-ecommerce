import { useState } from "react";

function ProductImages({ images }) {
  const [mainImage, setMainImage] = useState(images[0] || "");

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="
        w-full 
        flex flex-col md:flex-row 
        gap-4 md:gap-6 
        items-start
      "
    >
      {/* Ảnh chính */}
      <div
        className="
          order-1 
          md:order-1 
          flex-1 
          flex 
          justify-center md:justify-start 
          items-start
        "
      >
        <div
          className="
            w-full 
            max-w-[800px]
            h-72 sm:h-80 md:h-[430px] lg:h-[520px] xl:h-[620px]
            rounded-2xl 
            overflow-hidden 
            bg-white 
            border
          "
        >
          <img
            src={mainImage}
            alt="Main"
            className="
              w-full 
              h-full 
              object-cover 
              transition-transform duration-300 
              hover:scale-[1.02]
            "
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div
        className="
          order-2 
          md:order-2 
          w-full md:w-auto
        "
      >
        <div
          className="
            flex md:flex-col 
            gap-3 
            overflow-x-auto md:overflow-y-auto 
            max-h-[500px]
            pt-2 md:pt-0
            pb-2 md:pb-0
            pr-1 md:pr-2
            scrollbar-thin 
            scrollbar-thumb-gray-400 
            scrollbar-track-gray-200
          "
        >
          {images.map((image, index) => {
            const isActive = image === mainImage;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setMainImage(image)}
                className={`
                  flex-shrink-0
                  rounded-xl 
                  border-2 
                  cursor-pointer 
                  transition-all duration-200 
                  ${
                    isActive
                      ? "border-black scale-105"
                      : "border-gray-300 hover:border-gray-500"
                  }
                `}
              >
                <div
                  className="
                    w-20 h-20 
                    sm:w-22 sm:h-22 
                    md:w-24 md:h-24
                    rounded-lg 
                    overflow-hidden
                  "
                >
                  <img
                    src={image}
                    alt={`thumb-${index}`}
                    className="
                      w-full 
                      h-full 
                      object-cover
                    "
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductImages;
