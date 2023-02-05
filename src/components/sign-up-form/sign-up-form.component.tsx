import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input/input.component";
import {
  Form,
  Title,
  Content,
  Footer,
  Button,
} from "./sign-up-form.style";

import { UserContext } from "@/contexts/userContext";
import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

interface SignUpUser {
  username: string;
  password: string;
  email: string;
}

interface SignUpUserError {
  username: string;
  password: string;
  email: string;
}

const initialUser = {
  username: "",
  password: "",
  email: "",
};

const initialError = {
  username: "",
  password: "",
  email: "",
};

const validateRulesOptions = {
  email: {
    label: "電子信箱",
    rules: ["required", "email"],
  },
  username: {
    label: "帳號",
    rules: ["required"],
  },
  password: {
    label: "密碼",
    rules: ["required"],
  },
};

const SignUp = () => {
  const [user, setUser] = useState<SignUpUser>(initialUser);
  const [error, setError] = useState<SignUpUserError>(initialError);
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const inputUser = { ...user };

    const inputValidateOptions = formatInputAndValidateOptions(
      inputUser,
      validateRulesOptions
    );

    const newErrorMessages = inputValidateOptions.reduce((errorObj, option) => {
      const { name } = option;
      return { ...errorObj, [name]: inputValidate(option) };
    }, initialError);

    const isValid = Object.values(newErrorMessages).some((value) => value);

    if (isValid) {
      setError(newErrorMessages);
      return;
    }

    // 註冊
    const res = await fetch("http://192.168.50.224:3535/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(inputUser),
    });

    if (res.ok) {
      const { message, user } = await res.json();
      setCurrentUser(user);
    } else {
      const { message } = await res.json();
    }
  };

  const handleChangeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, name } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!currentUser) return
    alert("帳號創建成功");
    navigate("/")
  }, [currentUser])

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
          error={error.username}
        />
        <Input
          label="密碼"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChangeValue}
          error={error.password}
        />
        <Input
          label="信箱"
          type="email"
          name="email"
          value={user.email}
          onChange={handleChangeValue}
          error={error.email}
        />
        <Footer>
          <Button type="submit">送出</Button>
        </Footer>
      </Content>
    </Form>
  );
};

export default SignUp;
