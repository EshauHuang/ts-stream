import { useContext } from "react";

import { UserContext } from "@/contexts/userContext";

import { Container, LinkList, StyledLink } from "./navbar.style";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  return (
    <Container>
      <LinkList>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/live/user01">Live</StyledLink>
        {currentUser ? (
          <StyledLink
            to="/sign-out"
            onClick={() => {
              setCurrentUser(null);
            }}
          >
            Sign Out
          </StyledLink>
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
