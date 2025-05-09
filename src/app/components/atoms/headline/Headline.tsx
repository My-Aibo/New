import React from "react";

interface IHeadlineProps {
  title: string;
}

const Headline: React.FC<IHeadlineProps> = ({ title }) => {
  return <h1 className="text-2xl font-bold text-dynamic mb-4">{title}</h1>;
};

export default Headline;
