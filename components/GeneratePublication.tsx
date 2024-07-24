import React from "react";

import { GeneratePublicationProps } from "@/types";

import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { set } from "react-hook-form";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/ui/use-toast";

const useGeneratePublication = ({
  setAudio,

  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePublicationProps) => {
  const [isGenerating, setIsgenerating] = React.useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPublicationAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.publications.getUrl);
  const { toast } = useToast();

  const generatePublication = async () => {
    setIsgenerating(true);
    setAudio("");

    if (!voicePrompt) {
      toast({ title: "Please provide a prompt to generate publication" });
      return setIsgenerating(false);
    }

    try {
      const response = await getPublicationAudio({
        voice: voiceType!,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `publication-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsgenerating(false);
      toast({ title: "Publication generated" });
    } catch (error) {
      console.log("Error in generating publication", error);
      setIsgenerating(false);
      toast({ title: "Error in generating publication" });
    }
  };

  return {
    isGenerating,
    generatePublication,
  };
};

const GeneratePublication = (props: GeneratePublicationProps) => {
  const { isGenerating, generatePublication } = useGeneratePublication(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt To Generate Publication
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate a publication"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          className="text-16  bg-orange-1 py-4 font-bold text-white-1 hover:scale-110 hover:text-black-4 hover:bg-white-1 transition all duration-300 ease-in-out "
          type="submit"
          onClick={generatePublication}
        >
          {isGenerating ? (
            <>
              Submitting
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate & Publish"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePublication;
