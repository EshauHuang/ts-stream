import styled from "styled-components";

import CheckIcon from "@mui/icons-material/Check";

export const SettingMenuContainer = styled.div<{ panelHeight: string }>`
  position: absolute;
  bottom: 7rem;
  right: 1rem;
  width: 25rem;
  height: ${({ panelHeight }) => panelHeight};
  background: rgba(28, 28, 28, 0.9);
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  border-radius: 1.2rem;
  padding: 0.8rem 0rem;
  transition: height 0.4s ease;
  overflow: hidden;
`;

export const MenuItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 4rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const MenuItemIcon = styled.div`
  padding: 0 1rem;
`;

export const MenuItemLabel = styled.div`
  padding-right: 1.5rem;
  font-size: 1.2rem;
  color: #eee;
`;

export const SecondLabel = styled.div`
  font-size: 1rem;
  margin-left: 0.5rem;
  color: #ccc;
`;

export const StyledMenuItemContent = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`;

export const RightArrowButton = styled.div`
  width: 35px;
  height: 35px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIj48cGF0aCBkPSJtIDEyLjU5LDIwLjM0IDQuNTgsLTQuNTkgLTQuNTgsLTQuNTkgMS40MSwtMS40MSA2LDYgLTYsNiB6IiBmaWxsPSIjZmZmIiAvPjwvc3ZnPg==");
`;

export const LeftArrowButton = styled.div`
  width: 35px;
  height: 35px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIj48cGF0aCBkPSJNIDE5LjQxLDIwLjA5IDE0LjgzLDE1LjUgMTkuNDEsMTAuOTEgMTgsOS41IGwgLTYsNiA2LDYgeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=");
  margin: 0 1rem;
  cursor: pointer;
`;

export const MenuItemLeftPart = styled.div`
  display: flex;
  align-items: center;
`;

export const MenuItemRightPart = styled.div``;

export const QualityMenuContainer = styled.div``;

export const QualityMenuHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const QualityMenuLabel = styled.div`
  padding: 1.5rem 0;
  border-bottom: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
`;

export const QualityMenuItemsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QualityMenuItem = styled.div`
  position: relative;
  height: 4rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
export const QualityMenuItemLabel = styled.div`
  padding-left: 3.5rem;
  font-size: 1rem;
`;

export const CheckButton = styled(CheckIcon)`
  width: 1.8rem;
  height: 1.8rem;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 1.2rem;
  transform: translateY(-50%);
`;
