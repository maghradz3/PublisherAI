import { ProfileCardsDataProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProfileCardsData = ({
  userFirstName,
  clerkId,
  imageUrl,
}: ProfileCardsDataProps) => {
  return (
    <div className="mt-6 flex flex-col gap-3 max-md:items-center md:flex-row">
      <Link href={`/profile/${clerkId}`}>
        <figure>
          <Image
            src={imageUrl}
            width={150}
            height={150}
            alt="Podcaster"
            className="aspect-square h-fit w-full rounded-xl 2xl:size-[150px]"
          />

          <h1 className="text-white-1">{userFirstName}</h1>
        </figure>
      </Link>
    </div>
  );
};

export default ProfileCardsData;
