'use client';

export const ImageUploader = ({ images, setImages, maxImages, setPreviewImage }: any) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, maxImages - images.length);
      setImages((prevImages: File[]) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages: any) => prevImages.filter((_: any, i: any) => i !== index));
  };

  const handlePreviewImage = (image: File) => {
    const imageUrl = URL.createObjectURL(image);
    setPreviewImage(imageUrl);
  };

  return (
    <div className="mt-4">
      <label className="text-white mb-2 block">Додати зображення (до {maxImages})</label>
      <div className="relative w-full h-32 border-2 border-dashed border-gray-500 rounded-lg flex justify-center items-center cursor-pointer hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center text-gray-400">
          <p className="text-sm">Перетягніть або натисніть, щоб завантажити зображення</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {images.map((image: File, index: number) => (
          <div key={index} className="relative group w-20 h-20">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-full object-cover rounded-lg border border-gray-500 cursor-pointer"
              onClick={() => handlePreviewImage(image)}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
