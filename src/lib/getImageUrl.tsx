"use server";
export const getImageUrl = async (imageFile: File, pathName: string) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", pathName);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const image = (await response.json()) as { url: string };
    console.log(image);
    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
  }
};