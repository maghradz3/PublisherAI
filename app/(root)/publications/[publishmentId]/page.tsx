"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PublicationDetailPlayer from "@/components/PublicationDetailPlayer";

import PodcastCard from "@/components/ui/PodcastCard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PublishmentDetails = ({
  params: { publishmentId },
}: {
  params: { publishmentId: Id<"publishments"> };
}) => {
  const { user } = useUser();
  const publication = useQuery(api.publications.getPublicationsById, {
    publishmentId,
  });

  const similarPublicationsByAuthor = useQuery(
    api.publications.getPodcastByAuthor,
    { publishmentId }
  );

  const isOwner = user?.id === publication?.authorId;

  if (!similarPublicationsByAuthor || !publication) return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center jistify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">
            {publication?.views}
          </h2>
        </figure>
      </header>
      <PublicationDetailPlayer
        isOwner={isOwner}
        publicationId={publication._id}
        {...publication}
      />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {publication?.publishmentDescription}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {publication?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {publication?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-10 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">
          Simmilar Publications
        </h1>

        {similarPublicationsByAuthor &&
        similarPublicationsByAuthor.length > 0 ? (
          <div className="podcast_grid">
            {similarPublicationsByAuthor?.map(
              ({ _id, publishmentTitle, publishmentDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  title={publishmentTitle}
                  description={publishmentDescription}
                  imgUrl={imageUrl!}
                  publicationId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar publications found"
              buttonLink="/discover"
              buttonText="Discover more Publications"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PublishmentDetails;
