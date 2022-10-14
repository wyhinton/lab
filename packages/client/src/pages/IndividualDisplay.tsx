import {
  Content,
  EdgeSidebar,
  EdgeTrigger,
  Header,
  Root,
  SidebarContent,
} from "@mui-treasury/layout";
import { KeyboardArrowLeft, Menu } from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import NavContent from "../components/NavContent";
import PigIcon from "../components/PigIcon";
import Summary from "../components/Summary";
import useCollectionItem from "../hooks/useCollectionItem";
import { pluralToSingular, titleCase } from "../utilities";

type HeaderIconParserMap = {
  [key: string]: JSX.Element;
};
const headerIconDict: HeaderIconParserMap = {
  populations: <PigIcon />,
};

const HeaderIcon = (contentType: string | undefined): JSX.Element => {
  return <Box>{contentType ? headerIconDict[contentType] : <div></div>};</Box>;
};

const IndividualDisplay = (): JSX.Element => {
  const { content, id } = useParams();

  const { data, error } = useCollectionItem(content, id as string);

  if (error) return <div>There was an error</div>;
  if (!data) return <p>Loading...</p>;

  return (
    <Root
      scheme={{
        header: {
          config: {
            xs: {
              position: "sticky",
              height: 56,
            },
            md: {
              position: "relative",
              height: 64,
            },
          },
        },
        leftEdgeSidebar: {
          config: {
            xs: {
              variant: "temporary",
              width: "auto",
            },
            md: {
              variant: "permanent",
              width: 256,
              collapsible: true,
              collapsedWidth: 64,
            },
          },
        },
      }}
    >
      <CssBaseline />
      <Header>
        <Box
          sx={{ flex: 1, display: "flex", alignItems: "center", px: 2, gap: 1 }}
        >
          <Typography variant={"h5"}>{`${titleCase(
            pluralToSingular(content ?? "")
          )} ${id}`}</Typography>
          {headerIconDict[content ?? ""] ?? ""}
        </Box>
      </Header>
      <EdgeSidebar anchor="left">
        <SidebarContent>
          <NavContent />
        </SidebarContent>
        <EdgeTrigger target={{ anchor: "left", field: "open" }}>
          {(open, setOpen) => (
            //@ts-ignore
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowLeft /> : <Menu />}
            </IconButton>
          )}
        </EdgeTrigger>
      </EdgeSidebar>
      <Content>
        <Summary collectionName={data.collectionName} info={data.data} />
      </Content>
    </Root>
  );
};

export default IndividualDisplay;
