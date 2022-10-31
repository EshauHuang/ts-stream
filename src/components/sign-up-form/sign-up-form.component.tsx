import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"
import Input from "@/components/input";
import {
  Form,
  Title,
  Content,
  Footer,
  Info,
  Button,
} from "./sign-up-form.style";

import { UserContext } from "@/contexts/userContext";

import { getUsers } from "@/json/users";
interface SignUpUser {
  name: string;
  username: string;
  password: string;
}

interface SignUpUserError {
  name: string;
  username: string;
  password: string;
}

const initialUser = {
  name: "",
  username: "",
  password: "",
};

const initialError = {
  name: "",
  username: "",
  password: "",
};


const SignUp = () => {
  const [user, setUser] = useState<SignUpUser>(initialUser);
  const [error, setError] = useState<SignUpUserError>(initialError);

  const { setCurrentUser } = useContext(UserContext);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const dataCheck = async (user: SignUpUser) => {
      let newError = Object.assign({}, initialError);

      let { data: users } = await getUsers()

      // 後端部分
      users.every(({ name, username }: {name: string, username: string}) => {
        if (name === user.name) {
          newError.name = "暱稱重複，請重新輸入";
        }
        
        if (username === user.username) {
          newError.username = "帳號重複，請重新輸入";
        }
        const noError = Object.values(newError).every((value) => value === "");
        if (noError) {
          users.push(user);
          setCurrentUser(user);
          setUser(initialUser);
        } else {
          setError(newError);
        }
      });
    };

    dataCheck(user);
  };

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, name } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>SING UP</Title>
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

export default SignUp;
