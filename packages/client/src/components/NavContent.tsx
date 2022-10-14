import {
  Divider,
  Icon,
  List,
  ListItem,
  ListItemBaseProps,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

type MuiListItem = Partial<ListItemBaseProps>;
interface SideBarListItem extends MuiListItem {
  primaryText?: string;
  icon?: string;
  button?: boolean;
  component?: any;
}
const list: SideBarListItem[] = [
  {
    primaryText: "Home",
    icon: "home",
    button: true,
    // component: (parms: any) => <Link to="/">Home</Link>,
  },
  {
    primaryText: "Summary",
    icon: "list",
    button: true,
  },
];
const NavContent = () => (
  <List>
    {list.map(({ primaryText, icon, component, button }, i) => (
      <ListItem
        component={"a"}
        href={"/"}
        // component={component}
        key={primaryText}
        selected={i === 1}
        // button={button ? true : false}
      >
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText
          // button={button ?? false}

          primary={primaryText}
          primaryTypographyProps={{ noWrap: true }}
        />
      </ListItem>
    ))}
  </List>
);

NavContent.propTypes = {};
NavContent.defaultProps = {};

export default NavContent;
