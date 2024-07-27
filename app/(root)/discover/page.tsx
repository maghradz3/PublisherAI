"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import SearchBar from "@/components/SearchBar";
import PodcastCard from "@/components/ui/PodcastCard";
// import { publicationData } from "@/constants";
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

  return (
    <div className="flex flex-col">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bol text-white-1">Discover</h1>
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
    </div>
  );
};

export default Discover;
