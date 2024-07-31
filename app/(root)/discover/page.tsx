"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import ProfileCard from "@/components/ProfileCard";
import ProfileCardsData from "@/components/ProfileCardsData";
import SearchBar from "@/components/SearchBar";
import PodcastCard from "@/components/ui/PodcastCard";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Discover = ({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) => {
  const publicationData = useQuery(api.publications.getPublicationBySearch, {
    search: search || "",
  });
  const allUsers = useQuery(api.users.getAllUsers);

  return (
    <div className="flex flex-col">
      <SearchBar />
      <div className="flex flex-col gap-9 mt-3">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Publications" : "Search Result for:"}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {publicationData ? (
          <>
            {publicationData.length > 0 ? (
              <div className="podcast_grid">
                {publicationData?.map(
                  ({
                    _id,
                    publishmentTitle,
                    publishmentDescription,
                    imageUrl,
                  }) => (
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
              <EmptyState title="No Results Found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
      <div className="mt-7 flex flex-col gap-2">
        <h1 className="text-white-1 text-18">
          All <span className="text-orange-1">Creators</span>
        </h1>

        {allUsers ? (
          <div className="podcast_grid">
            {allUsers?.map((user) => (
              <ProfileCardsData
                key={user._id}
                userFirstName={user.name}
                clerkId={user.clerkId}
                imageUrl={user.imageUrl!}
              />
            ))}
          </div>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
