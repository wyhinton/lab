import { Content, Header, Root } from "@mui-treasury/layout";
import { Box, CssBaseline, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Table from "../Table";
import { titleCase } from "../utilities";

const DataTableDisplay = (): JSX.Element => {
  const { content } = useParams();
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
      }}
    >
      <CssBaseline />
      <Header>
        <Box
          sx={{ flex: 1, display: "flex", alignItems: "center", px: 2, gap: 1 }}
        >
          <Typography variant={"h5"}>{titleCase(content ?? "")}</Typography>
        </Box>
      </Header>
      <Content>
        <Table />
      </Content>
    </Root>
  );
};

export default DataTableDisplay;
