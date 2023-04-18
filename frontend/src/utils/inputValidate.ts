import { isString, isBlob } from "@/utils/typeCheck"

const MAX_IMAGE_SIZE = 0.5 // MB

type ErrorMessage = {
  [key: string]: string | ((label: string) => string),
  required: (label: string) => string
}

type InputValidate = {
  label: string,
  value: string | Blob,
  rules: string[],
  allError?: boolean,
}

type Input = {
  [key: string]: string | Blob;
}

type ValidateOption = {
  label: string,
  rules: string[],
}

type ValidateOptions = {
  [key: string]: ValidateOption
}

type ValidateRules = {
  required: (value: string) => boolean,
  email: (value: string) => boolean,
  imgSize: (blob: Blob) => boolean
}

type InputValidateOptions = {
  label: string,
  name: string,
  rules: string[],
  value: string | Blob,
}

const errorMessage: ErrorMessage = {
  required: (label) => `${label}為必填項目`,
  email: "請輸入有效的電子信箱",
  imgSize: (label) => `${label}檔案太大`
};

const validateRules: ValidateRules = {
  required: (value) => !!value,
  email: (value) =>
    !!value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  imgSize: (blob) => {
    return blob.size / (1024 * 1024) <= MAX_IMAGE_SIZE
  }
};

export const getErrorMessage = (rule: string, label?: string) => {
  const message = errorMessage[rule];
  label = label || '此欄位'
  return typeof message === "function" ? message(label) : message;
}

export const inputValidate = ({
  label,
  value,
  rules = [],
  allError = false,
}: InputValidate) => {
  if (!rules.length) return "";

  let error = allError ? {} : "";

  if (allError) {
    error = rules.reduce((error, rule) => {
      // 已有錯誤訊息
      let isValid

      if (rule === "imgSize" && isBlob(value)) {
        isValid = validateRules[rule](value);
      } else if ((rule === "required" || rule === "email") && isString(value)) {
        isValid = validateRules[rule](value);
      }

      if (!isValid) {
        return {
          ...error,
          [rule]: getErrorMessage(rule),
        };
      }

      return error;
    }, {});
  } else {
    rules.forEach((rule) => {

      // 已有錯誤訊息
      if (error) return;

      let isValid

      if (rule === "imgSize" && isBlob(value)) {
        isValid = validateRules[rule](value);
      } else if ((rule === "required" || rule === "email") && isString(value)) {
        isValid = validateRules[rule](value);
      }

      if (!isValid) {
        error = getErrorMessage(rule, label);
      }
    });
  }

  return error;
};

export const formatInputAndValidateOptions = (inputObj: Input, validateOptions: ValidateOptions) =>
  Object.keys(inputObj).reduce<InputValidateOptions[]>(
    (inputValidateOptions, name) => [
      ...inputValidateOptions,
      {
        ...validateOptions[name],
        name,
        value: inputObj[name],
      },
    ],
    []
  );

