import React from "react";

const Profile = ({
  params: { profileId },
}: {
  params: { profileId: string };
}) => {
  return <div className="text-xl text-white-1">{profileId}</div>;
};

export default Profile;
