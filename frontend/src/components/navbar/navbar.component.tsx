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
        {username && <StyledLink to={`/live/${username}`}>Live</StyledLink>}
        {currentUser ? (
          <>
            <StyledLink to={`${username}/setting`}>Setting</StyledLink>
            <StyledLink
              as="div"
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
