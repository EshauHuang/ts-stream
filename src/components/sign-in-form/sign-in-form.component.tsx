import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Input from "@/components/input/input.component";
import {
  Form,
  Title,
  Content,
  Footer,
  Info,
  Button,
} from "./sign-in-form.style";

import { getUsers } from "@/json/users";

import { UserContext } from "@/contexts/userContext";

const SignInForm = () => {
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
    <Form onSubmit={handleSubmit}>
      <Title>SING IN</Title>
      <Content>
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
        <Footer>
          <Info>
            還未成為會員嗎？趕快<Link to="/sign-up">註冊</Link>吧！
          </Info>
          <Button type="submit">送出</Button>
        </Footer>
      </Content>
    </Form>
  );
};

export default SignInForm;
