import PopulationClient from "../interfaces/PopulationClient";
import { DataWithId } from "../types";
import PopulationCard from "./PopulationCard";

type SummaryParserMap = {
  [key: string]: (data: DataWithId) => JSX.Element;
};

/**Based on what kind of record we want to investigate, choose a different layout component */
const parseDataToSummary: SummaryParserMap = {
  population: (data: any) => {
    return <PopulationCard data={data as PopulationClient} />;
  },
  movement: (data: any) => {
    return <div>hello</div>;
  },
};

const Summary = ({
  info,
  collectionName,
}: {
  info: any | undefined;
  collectionName: string | undefined;
}) => {
  return (
    <>
      <div>
        {info && collectionName ? (
          parseDataToSummary[collectionName](info)
        ) : (
          <div>loading</div>
        )}
      </div>
    </>
  );
};

export default Summary;
