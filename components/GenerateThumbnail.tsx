import React, { use } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const imageRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const generateUloadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUloadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);
      const ImageUrl = await getImageUrl({ storageId });
      setImage(ImageUrl!);
      setIsImageLoading(false);
      toast({ title: "Thumbnail generated !" });
    } catch (error) {
      console.log("Error in generating thumbnail", error);
      toast({ title: "Error in generating thumbnail", variant: "destructive" });
    }
  };
  const generateImage = async () => {
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}.png`);
    } catch (error) {
      console.log(error);
      toast({ title: "Error in generating thumbnail", variant: "destructive" });
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: "Error in uploading image", variant: "destructive" });
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="submit"
          variant="plain"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", { "bg-black-6": isAiThumbnail })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="submit"
          variant="plain"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", { "bg-black-6": !isAiThumbnail })}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt To Generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate a thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              className="text-16  bg-orange-1 py-4 font-bold text-white-1 hover:scale-110 hover:text-black-4 hover:bg-white-1 transition all duration-300 ease-in-out "
              type="submit"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  Submitting
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate & Publish"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="image_div"
          onClick={() => {
            imageRef?.current?.click();
          }}
        >
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG OR GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
