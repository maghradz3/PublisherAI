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

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface PublishmentProps {
  _id: Id<"publishments">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  publishmentTitle: string;
  publishmentDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface PublicationDetailPlayerProps {
  audioUrl: string;
  publishmentTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  publicationId: Id<"publishments">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

export interface TopPublishersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  publishment: {
    publishmentTitle: string;
    publishmentId: Id<"publishments">;
  }[];
  totalPublishments: number;
}

export interface CarouselProps {
  fansLikeDetails: TopPublishersProps[];
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  publicationId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}
