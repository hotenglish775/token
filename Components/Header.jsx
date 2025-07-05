import React, { useEffect, useState } from "react";

const Header = ({ address, connectWallet, setAddress }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const menuList = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "ERC20",
      link: "/create",
    },
    {
      name: "Contact Us",
      link: "#",
    },
    {
      name: "Blog",
      link: "#",
    },
  ];

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    console.log("Accounts changed:", accounts[0]);
    setAddress(accounts[0]);
  };
  return (
    <header class="header-one">
      <div class="header-menu-area header-area">
        <div class="container">
          <div class="row">
            <div class="col-xl-2 col-lg-2 col-md-3 d-flex align-items-center">
              <div class="logo">
                <a href="/">
                  <img src="img/logo/logo2.png" alt="" />
                </a>
              </div>
            </div>
            <div class="col-xl-10 col-lg-10 col-md-9">
              {address ? (
                <div class="header-right ">
                  <a href="/create" class="top-btn coin-btn">
                    Create Token
                  </a>
                </div>
              ) : (
                <div class="header-right ">
                  <a onClick={() => connectWallet()} class="top-btn coin-btn">
                    Connect Wallet
                  </a>
                </div>
              )}

              <div class="header_menu f-right">
                <nav id="mobile-menu">
                  <ul className="new-nav-class" class="main-menu">
                    {menuList.map((menu, i) => (
                      <li class="resulta" key={i + 1}>
                        <a href={menu.link}>{menu.name}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
