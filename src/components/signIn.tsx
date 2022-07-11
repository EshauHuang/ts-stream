import { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import Input from "@/components/input";

import { getUsers } from "@/json/users";

import { UserContext } from "@/contexts/userContext";

const fakeUsers = [
  {
    name: "user01",
    username: "user01",
    password: "user01",
  },
];

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignIn = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
  });
  const { name, username, password } = user;

  const { setCurrentUser } = useContext(UserContext);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const { data: users } = await getUsers();

    const userCheck = users.every(
      ({
        username,
        password,
      }: {
        name: string;
        username: string;
        password: string;
      }) => {
        return username === user.username && password === user.password;
      }
    );

    if (userCheck) {
      setCurrentUser({ name, username });
    }
  };

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, name } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container as="form" onSubmit={handleSubmit}>
      <Input
        label="帳號"
        type="text"
        name="username"
        value={user.username}
        onChange={handleChangeValue}
      />
      <Input
        label="密碼"
        type="password"
        name="password"
        value={user.password}
        onChange={handleChangeValue}
      />
      <button type="submit">送出</button>
    </Container>
  );
};

export default SignIn;
