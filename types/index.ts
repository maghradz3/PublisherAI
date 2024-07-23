import { Dispatch, SetStateAction } from "react";
import { Id } from "@/convex/_generated/dataModel";

export interface GeneratePublicationProps {
  voiceType: string | null;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}
