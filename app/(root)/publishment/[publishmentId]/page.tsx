import React from "react";

const PublishmentDetails = ({
  params,
}: {
  params: { publishmentId: string };
}) => {
  return (
    <p className="text-white-1">
      Publishment Details for {params.publishmentId}
    </p>
  );
};

export default PublishmentDetails;
