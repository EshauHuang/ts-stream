import { StyledTuneIcon } from "@/components/ui/icon.style";

import {
  IVideoQualities,
  TQuality,
  MenuStateName,
} from "@/hooks/useVideoPlayer";

import {
  SettingMenuContainer,
  MenuItemContainer,
  MenuItemIcon,
  MenuItemLabel,
  SecondLabel,
  StyledMenuItemContent,
  RightArrowButton,
  LeftArrowButton,
  MenuItemLeftPart,
  MenuItemRightPart,
  QualityMenuContainer,
  QualityMenuHeader,
  QualityMenuLabel,
  QualityMenuItemsList,
  QualityMenuItem,
  QualityMenuItemLabel,
  CheckButton,
} from "./setting-menu.style";

const MenuItemContent = ({ quality }: { quality: TQuality }) => {
  return (
    <StyledMenuItemContent>
      {quality.quality === "auto" && <span>自動</span>}
      <SecondLabel>{`(${quality.label})`}</SecondLabel>
      <RightArrowButton></RightArrowButton>
    </StyledMenuItemContent>
  );
};

const MenuItem = ({
  findQuality,
  handleChangeSettingMenuState,
}: {
  findQuality: () => TQuality;
  handleChangeSettingMenuState: (name: MenuStateName) => void;
}) => {
  const targetQuality = findQuality();

  return (
    <MenuItemContainer onClick={() => handleChangeSettingMenuState("quality")}>
      <MenuItemLeftPart>
        <MenuItemIcon>
          <StyledTuneIcon />
        </MenuItemIcon>
        <MenuItemLabel>畫質</MenuItemLabel>
      </MenuItemLeftPart>
      <MenuItemRightPart>
        <MenuItemContent quality={targetQuality} />
      </MenuItemRightPart>
    </MenuItemContainer>
  );
};

const QualityMenu = ({
  handleChangeSettingMenuState,
  handleChangeQuality,
  videoQualities,
}: {
  videoQualities: IVideoQualities;
  handleChangeSettingMenuState: (name: MenuStateName) => void;
  handleChangeQuality: (id: number) => void;
}) => {
  const handleChangeSettingMenuToHome = () => {
    handleChangeSettingMenuState("home");
  };

  const { targetId, qualitiesList } = videoQualities;

  return (
    <QualityMenuContainer>
      <QualityMenuHeader>
        <LeftArrowButton onClick={handleChangeSettingMenuToHome} />
        <QualityMenuLabel onClick={handleChangeSettingMenuToHome}>
          畫質
        </QualityMenuLabel>
      </QualityMenuHeader>
      <QualityMenuContainer>
        <QualityMenuItemsList>
          {qualitiesList.map((quality) => (
            <QualityMenuItem
              key={quality.id}
              onClick={() => handleChangeQuality(quality.id)}
            >
              {targetId === quality.id && <CheckButton />}
              <QualityMenuItemLabel>{quality.label}</QualityMenuItemLabel>
            </QualityMenuItem>
          ))}
        </QualityMenuItemsList>
      </QualityMenuContainer>
    </QualityMenuContainer>
  );
};

const SettingMenu = ({
  currentSettingMenuState,
  handleChangeSettingMenuState,
  findQuality,
  videoQualities,
  handleChangeQuality,
}: {
  currentSettingMenuState: {
    name: string;
    panelHeight: string;
  };
  handleChangeSettingMenuState: (name: MenuStateName) => void;
  findQuality: () => TQuality;
  videoQualities: IVideoQualities;
  handleChangeQuality: (id: number) => void;
}) => {
  const { panelHeight, name } = currentSettingMenuState;

  return (
    <SettingMenuContainer panelHeight={panelHeight}>
      {name === "home" && (
        <MenuItem
          findQuality={findQuality}
          handleChangeSettingMenuState={handleChangeSettingMenuState}
        />
      )}
      {name === "quality" && (
        <QualityMenu
          videoQualities={videoQualities}
          handleChangeQuality={handleChangeQuality}
          handleChangeSettingMenuState={handleChangeSettingMenuState}
        />
      )}
    </SettingMenuContainer>
  );
};

export default SettingMenu;
