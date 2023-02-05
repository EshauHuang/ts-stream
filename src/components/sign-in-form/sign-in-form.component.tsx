import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  inputValidate,
  formatInputAndValidateOptions,
} from "@/utils/inputValidate";

import { UserContext } from "@/contexts/userContext";

const initialUser = {
  username: "",
  password: "",
};

const initialError = {
  username: "",
  password: "",
};

const validateRulesOptions = {
  username: {
    label: "帳號",
    rules: ["required"],
  },
  password: {
    label: "密碼",
    rules: ["required"],
  },
};

const SignInForm = () => {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState(initialError);

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
    const res = await fetch("http://192.168.50.224:3535/sign-in", {
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
    if (!currentUser) return;
    alert("登入成功")
    navigate("/");
  }, [currentUser]);

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
