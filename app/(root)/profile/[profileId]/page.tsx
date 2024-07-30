"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";

import { api } from "@/convex/_generated/api";
import ProfileCard from "@/components/ProfileCard";
import PodcastCard from "@/components/ui/PodcastCard";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const publicationData = useQuery(api.publications.getPublicationsByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !publicationData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          publicationData={publicationData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {publicationData && publicationData.publications.length > 0 ? (
          <div className="podcast_grid">
            {publicationData?.publications
              ?.slice(0, 4)
              .map((publication) => (
                <PodcastCard
                  key={publication._id}
                  imgUrl={publication.imageUrl!}
                  title={publication.publishmentTitle!}
                  description={publication.publishmentDescription!}
                  publicationId={publication._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
