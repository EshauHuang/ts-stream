import { useContext } from "react";

import { UserContext } from "@/contexts/userContext";

import { Container, LinkList, StyledLink } from "./navbar.style";

import { signOut } from "@/api/stream";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const { username } = currentUser || {};

  return (
    <Container>
      <LinkList>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/live/user01">Live</StyledLink>
        {currentUser ? (
          <>
            <StyledLink to={`${username}/setting`}>Setting</StyledLink>
            <StyledLink
              to="/"
              onClick={async () => {
                await signOut();

                setCurrentUser(null);
              }}
            >
              Sign Out
            </StyledLink>
          </>
        ) : (
          <>
            <StyledLink to="/sign-up">Sign Up</StyledLink>
            <StyledLink to="/sign-in">Sign In</StyledLink>
          </>
        )}
      </LinkList>
    </Container>
  );
};

export default Navbar;
