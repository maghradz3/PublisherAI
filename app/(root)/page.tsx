"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import PodcastCard from "@/components/ui/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function Home() {
  const trandingPublications = useQuery(
    api.publications.getTrandingPublications
  );
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">
          Trending <span className="text-orange-1"> Publications</span>
        </h1>

        <div className="podcast_grid">
          {trandingPublications?.map(
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
      </section>
    </div>
  );
}

export default Home;
