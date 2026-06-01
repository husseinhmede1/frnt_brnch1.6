import React from "react";
import { home, mail, userIcon, lan_img, down_arrow_icon, locationArrow, logo } from "../../../assets/images";
import { Breadcrumbs, ButtonBase, Card, CardContent, FormControl, IconButton, Link, Menu, MenuItem, Popover, Select } from "@mui/material";

function DesignerHeader() {

  // profile popover
  const [anchorElProfile, setAnchorElProfile] = React.useState<HTMLButtonElement | null>(null);
  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const open = Boolean(anchorElProfile);
  const id = open ? 'simple-popover' : undefined;

  // notification
  const [anchorEl1, setAnchorEl1] = React.useState<HTMLButtonElement | null>(null);
  const handleClickNotification = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover' : undefined;

  // laguage
  const [anchorLanguage, setAnchorLanguage] = React.useState<null | HTMLElement>(null);
  const openLanguage = Boolean(anchorLanguage);
  const handleClickLanguage = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorLanguage(event.currentTarget);
  };
  const handleCloseLanguage = () => {
    setAnchorLanguage(null);
  };
  const handleEnglishLanguage = () => {
    document.body.classList.remove('rtl')
  };

  const handleArabicLanguage = () => {
    document.body.classList.add('rtl')
  };
  function toggleMenu() {
    document.body.classList.toggle('toggle-menu')
  }

  return (
    <header className="header">
      <div className="mobile-bg-shadow" onClick={toggleMenu} />
      <div className="f-align-center">
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        
        {/* <a href="#" title="MAS Prime" className="logo">MAS Prime</a> */}
        <a href="#" title="MAS Prime" className="logo"> <img src={logo} alt="Logo" /></a>
      </div>
      <div className="left-block">
        <Breadcrumbs className="breadcrum">
          <Link href="/">
            <em className="border-icon-btn"><img src={home} alt="home" /></em>
            Home
          </Link>
          <span className="active">Institutions</span>
        </Breadcrumbs>
      </div>
      <ul className="right-block">
        <li>
          <FormControl fullWidth className="select-page" >
            <Select
              displayEmpty
              defaultValue=""
              IconComponent={() => <img src={down_arrow_icon} alt="" />}
              placeholder="Select"
            >
              <MenuItem value="">
                <em>Instituition</em>
              </MenuItem>
              <MenuItem value={"10"}>Instituition</MenuItem>
              <MenuItem value={"20"}>Instituition</MenuItem>
              <MenuItem value={"30"}>Instituition</MenuItem>
            </Select>
          </FormControl>
        </li>
        <li>
          <div className="notification-block">
            <IconButton className="border-icon-btn" onClick={handleClickNotification}>
              <img src={mail} alt="mail" />
            </IconButton>
            <Popover
              open={open1}
              anchorEl={anchorEl1}
              onClose={handleCloseNotification}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              className="notification-popover"
            >
              <Card className="card-notification">
                <CardContent>
                  <div className="card-header">
                    <h2 className="card-title">Notification<span className="notify-count">2</span></h2>
                  </div>
                  <ul>
                    <li><a className="dropdown-item active" href="/#">
                      <span className="list-icon">
                        <img alt="icon" src={locationArrow} />
                      </span>
                      <div>
                        <p>Sed ut perspiciatis unde omnis iste vrnatus error sit voluptatem</p>
                      </div>
                    </a></li>
                    <li><a className="dropdown-item" href="/#">
                      <span className="list-icon">
                        <img alt="icon" src={locationArrow} />
                      </span>
                      <div>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptate</p>
                      </div>
                    </a>
                    </li>
                    <li><a className="dropdown-item" href="/#">
                      <span className="list-icon">
                        <img alt="icon" src={locationArrow} />
                      </span>
                      <div>
                        <p>Sed ut perspiciatis unde omnis iste vrnatus error sit voluptatem</p>

                      </div>
                    </a>
                    </li>
                    <li><a className="dropdown-item" href="/#">
                      <span className="list-icon">
                        <img alt="icon" src={locationArrow} />
                      </span>
                      <div>
                        <p>Sed ut perspiciatis unde omnis iste vrnatus error sit voluptatem</p>

                      </div>
                    </a></li>
                    <li><a className="dropdown-item" href="/#">
                      <span className="list-icon">
                        <img alt="icon" src={locationArrow} />
                      </span>
                      <div>
                        <p>Sed ut perspiciatis unde omnis iste vrnatus error sit voluptatem</p>

                      </div>
                    </a>
                    </li>
                  </ul>
                  <div className="card-footer">
                    <Link type="button" underline="none">Show all</Link>
                  </div>
                </CardContent>
              </Card>
            </Popover>
          </div>
        </li>
        <li>
          <div className="lag-select-block">
            <ButtonBase
              onClick={handleClickLanguage}
              className="btn-lang"
            >
              <em className="border-icon-btn">
                <img src={lan_img} alt="language" />
              </em>
              <span className="name">English</span>
              <img src={down_arrow_icon} alt="down_arrow_icon" />
            </ButtonBase>
            <Menu
              className="menu-lang"
              id="basic-menu"
              anchorEl={anchorLanguage}
              open={openLanguage}
              onClose={handleCloseLanguage}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => { handleEnglishLanguage(); handleCloseLanguage(); }}>
                English</MenuItem>
              <MenuItem onClick={() => { handleArabicLanguage(); handleCloseLanguage(); }}>
                Arabic</MenuItem>
            </Menu>
          </div>
        </li>
        <li>
          <div>
            <ButtonBase onClick={handleProfileClick} className="user-wrapper">
              <em className="border-icon-btn">
                <img src={userIcon} alt="userIcon" />
              </em>
              <div className="user-name">
                <span>Nil Neetin</span>
                <em>
                  <img src={down_arrow_icon} alt="down_arrow_icon" />
                </em>
              </div>
            </ButtonBase>
            <Menu
              className="profile-menu"
              id={id}
              open={open}
              anchorEl={anchorElProfile}
              onClose={handleProfileClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >

              <MenuItem onClick={handleProfileClose}>
                My Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>
                Change Password</MenuItem>
              <MenuItem onClick={handleProfileClose}>
                Logout</MenuItem>
            </Menu>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default DesignerHeader;
