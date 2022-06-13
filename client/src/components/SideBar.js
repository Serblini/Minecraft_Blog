import React, { useState, useContext, useRef } from "react";
import { Context } from "../index";
import { NavLink } from "react-router-dom";
import { SHOP_ROUTE, ADMIN_ROUTE } from "../utils/consts";
import { Button, Overlay, OverlayTrigger } from "react-bootstrap";
import AuthTooltip from "./AuthTooltip";
import CreatePostPopover from "./CreatePostPopover";
import CreateTypePopover from "./CreateTypePopover";
import DeletePostPopover from "./DeletePostPopover";
import DeviceList from "./DeviceList";

const SideBar = () => {
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  // const [showPopoverPost, setShowPopoverPost] = useState(false);
  // const [showPopoverType, setShowPopoverType] = useState(false);
  const [target, setTarget] = useState(null);
  const { user } = useContext(Context);
  const targetRef = useRef(null);
  const secondTargetRef = useRef(null);

  const [value, setValue] = useState("");

  //      filteredItems.map(device,index) для выввода
  // }

  return (
    <aside className="global-navigation">
      <div className="global-navigation__top">
        <nav className="global-navigation__nav" aria-label="Навигация по блогу">
          <NavLink
            to={SHOP_ROUTE}
            className="global-navigation__logo d-flex flex-column justify-content-center"
            data-tracking-label="logo"
            aria-label="Домашняя страница ФэндомаNavLink"
          >
            <svg className="wds-icon" viewBox="0 0 174 242">
              <path
                fill="#FA005A"
                d="M166.935 118.154L50.108 1.273C49.504.67 48.735.259 47.898.093c-.837-.166-1.705-.08-2.493.247-.788.327-1.461.88-1.935 1.59-.474.71-.727 1.546-.727 2.4v98.276L7.365 67.22c-.604-.604-1.373-1.014-2.21-1.18-.837-.166-1.704-.08-2.492.247-.789.327-1.462.88-1.936 1.59-.474.71-.727 1.545-.727 2.4v101.487c-.003 3.172.62 6.312 1.833 9.242 1.214 2.929 2.993 5.59 5.237 7.83l46.037 46.099c4.528 4.53 10.666 7.078 17.068 7.085h33.68c6.4-.003 12.537-2.547 17.063-7.075l46.027-46.099c2.239-2.242 4.014-4.904 5.225-7.833 1.21-2.93 1.832-6.069 1.83-9.239v-36.533c.002-3.173-.621-6.315-1.834-9.247-1.212-2.932-2.989-5.596-5.231-7.84z"
              ></path>
              <path
                fill="#FFC500"
                d="M131.297 160.901c.001 1.915-.757 3.754-2.108 5.111l-37.11 37.3c-.672.677-1.472 1.215-2.354 1.582-.88.366-1.826.555-2.78.555-.954 0-1.9-.189-2.78-.555-.882-.367-1.682-.905-2.355-1.582l-36.99-37.3c-1.352-1.351-2.114-3.184-2.117-5.096v-14.191c0-.951.19-1.892.554-2.77.366-.878.9-1.675 1.574-2.346l13.317-13.328c.672-.675 1.47-1.209 2.35-1.574.879-.365 1.82-.553 2.772-.553.952 0 1.894.188 2.773.553.879.365 1.677.899 2.35 1.574l18.624 18.645 18.596-18.65c.672-.675 1.47-1.209 2.349-1.574.879-.365 1.821-.553 2.773-.553.951 0 1.893.188 2.772.553.879.365 1.677.899 2.349 1.574l13.318 13.328c.673.671 1.207 1.469 1.571 2.347.364.877.552 1.819.552 2.769v14.181z"
              ></path>
            </svg>
            <span>FANDOM</span>
          </NavLink>

          {/* поиск */}

          {/* <a
            href="##"
            data-tracking-label="search"
            data-wds-tooltip="Поиск"
            data-wds-tooltip-position="right"
            data-tooltip-attached="1"
          >
            <svg className="wds-icon" viewBox="0 0 18 18">
              <path
                d="M11.563 11.504l-.03.029-.03.031A4.984 4.984 0 0 1 8 13c-2.757 0-5-2.243-5-5s2.243-5 5-5c2.756 0 5 2.243 5 5a4.983 4.983 0 0 1-1.437 3.504m5.144 3.789l-3.103-3.103A6.963 6.963 0 0 0 15 8c0-3.859-3.141-7-7-7-3.86 0-7 3.141-7 7s3.14 7 7 7a6.956 6.956 0 0 0 4.189-1.396l3.103 3.103a1.001 1.001 0 0 0 1.415-1.414"
                fill-rule="evenodd"
              ></path>
            </svg>
          </a> */}

          {/* создание поста */}

          {user.isAuth && (
            <OverlayTrigger
              trigger="click"
              placement="right"
              overlay={<CreatePostPopover />}
            >
              <div
                className="global-navigation__links"
                // onClick={handleClick}
                ref={targetRef}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="global-navigation__link d-flex flex-column align-items-center"
                  data-tracking-label="start-a-wiki"
                >
                  <span className="global-navigation__icon has-border">
                    <svg
                      className="wds-icon wds-icon-small"
                      viewBox="0 0 18 18"
                    >
                      <path
                        id="add-small"
                        d="M16 8h-6V2a1 1 0 1 0-2 0v6H2a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2"
                      ></path>{" "}
                    </svg>
                  </span>
                  <span className="global-navigation__label text-center">
                    Создать пост
                  </span>
                </div>
              </div>
            </OverlayTrigger>
          )}

          {user.user.role == "ADMIN" && (
            <OverlayTrigger
              trigger="click"
              placement="right"
              overlay={<CreateTypePopover />}
            >
              <div
                className="global-navigation__links"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="global-navigation__link d-flex flex-column align-items-center"
                  data-tracking-label="start-a-wiki"
                >
                  <span className="global-navigation__icon has-border">
                    <svg
                      className="wds-icon wds-icon-small"
                      viewBox="0 0 18 18"
                    >
                      <path
                        id="add-small"
                        d="M16 8h-6V2a1 1 0 1 0-2 0v6H2a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2"
                      ></path>{" "}
                    </svg>
                  </span>
                  <span className="global-navigation__label text-center">
                    Создать категорию
                  </span>
                </div>
              </div>
            </OverlayTrigger>
          )}

          {user.user.role == "ADMIN" && (
            <OverlayTrigger
              trigger="click"
              placement="right"
              overlay={<DeletePostPopover />}
            >
              <div
                className="global-navigation__links"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="global-navigation__link d-flex flex-column align-items-center"
                  data-tracking-label="start-a-wiki"
                >
                  <span className="global-navigation__icon has-border">
                    <svg
                      className="wds-icon wds-icon-small"
                      viewBox="0 0 18 18"
                      style={{
                        transform: "rotate(45deg)",
                      }}
                    >
                      <path
                        id="add-small"
                        d="M16 8h-6V2a1 1 0 1 0-2 0v6H2a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2"
                      ></path>{" "}
                    </svg>
                  </span>
                  <span className="global-navigation__label text-center">
                    Удалить статью
                  </span>
                </div>
              </div>
            </OverlayTrigger>
          )}
        </nav>
      </div>

      {/* рег/автор или logOut */}
      <div className="global-navigation__bottom">
        <div
          className="wds-dropdown wds-open-to-right is-attached-to-bottom is-anon-dropdown"
          onClick={() =>
            setShowAuthTooltip((showAuthTooltip) => !showAuthTooltip)
          }
        >
          <div className="wds-dropdown__toggle">
            <div className="global-navigation__icon">
              <svg className="wds-icon" viewBox="0 0 24 24">
                <path
                  id="user-avatar-a"
                  d="M12 11c-.965 0-1.75-.785-1.75-1.75S11.035 7.5 12 7.5s1.75.785 1.75 1.75S12.965 11 12 11m0-5.5a3.754 3.754 0 0 0-3.75 3.75A3.754 3.754 0 0 0 12 13a3.754 3.754 0 0 0 3.75-3.75A3.754 3.754 0 0 0 12 5.5m7.679 12.914c-1.987-2.104-4.727-3.289-7.679-3.289-2.953 0-5.692 1.185-7.679 3.289A9.955 9.955 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10a9.956 9.956 0 0 1-2.321 6.414M12 22a9.995 9.995 0 0 1-6.25-2.187c1.613-1.719 3.844-2.688 6.25-2.688s4.637.969 6.249 2.688A9.993 9.993 0 0 1 12 22m0-22C5.383 0 0 5.383 0 12c0 3.268 1.294 6.33 3.651 8.63l.012.013A12 12 0 0 0 12 24h.036a12.008 12.008 0 0 0 8.306-3.363C22.701 18.341 24 15.273 24 12c0-6.617-5.383-12-12-12"
                ></path>
              </svg>
            </div>
          </div>
          {showAuthTooltip && <AuthTooltip />}
        </div>
        {/* {user.isAuth &&
          <div
            onClick={logOut}
            className="ml-2 global-navigation__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="#000000" d="M0.28,19.545l9,4.404C9.35,23.983,9.425,24,9.5,24c0.092,0,0.184-0.025,0.265-0.076	C9.911,23.833,10,23.672,10,23.5V19h4.5c0.276,0,0.5-0.224,0.5-0.5V12c0-0.276-0.224-0.5-0.5-0.5S14,11.724,14,12v6h-4V4.415	c0-0.199-0.118-0.379-0.301-0.458L2.903,1H14v6c0,0.276,0.224,0.5,0.5,0.5S15,7.276,15,7V0.5C15,0.224,14.776,0,14.5,0h-14	C0.491,0,0.484,0.005,0.475,0.005c-0.02,0.001-0.039,0.008-0.059,0.012c-0.057,0.01-0.109,0.027-0.158,0.054	c-0.01,0.006-0.022,0.005-0.032,0.011C0.215,0.089,0.211,0.102,0.2,0.11c-0.044,0.034-0.08,0.074-0.11,0.12	C0.078,0.248,0.065,0.262,0.055,0.281C0.022,0.348,0,0.421,0,0.5v18v0.596C0,19.287,0.109,19.461,0.28,19.545z M9,22.699l-8-3.915	V18.5V1.263l8,3.48V22.699z"></path><path fill="#000000" d="M23.853,9.146l-4.999-4.999c-0.195-0.195-0.512-0.195-0.707,0s-0.195,0.512,0,0.707L22.293,9H11.5	C11.224,9,11,9.224,11,9.5s0.224,0.5,0.5,0.5h10.793l-4.146,4.146c-0.195,0.195-0.195,0.512,0,0.707	C18.244,14.951,18.372,15,18.5,15s0.256-0.049,0.354-0.146l4.999-4.999c0.046-0.046,0.083-0.102,0.109-0.163	c0.051-0.122,0.051-0.26,0-0.382C23.936,9.248,23.899,9.192,23.853,9.146z"></path>
            </svg>
          </div>
        } */}
      </div>
    </aside>
  );
};

export default SideBar;
