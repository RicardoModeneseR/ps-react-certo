import {useStateContext} from "../../context/ContextProvider";
import {Link, Navigate, Outlet} from "react-router-dom";
import BaseApi from "../../services/Api";
import {useEffect, useState} from "react";
import {Dropdown, Collapse} from "react-bootstrap";
import AvatarToggle from "../../components/AvatarToggle";


const DefaultLayout = () => {
  const [asideVisible, setAsideVisible] = useState(false);
  const {user, token, setUser, setToken} = useStateContext();

  useEffect(() => {
    BaseApi.get('/user')
      .then(({data}) => {
        setUser(data);
      })
  }, [])

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    BaseApi.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      })
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container-lg">
          <div className="d-flex">
            <div className="d-flex justify-content-center align-items-center me-2">
              <button className="d-lg-none" type="button" onClick={() => setAsideVisible(!asideVisible)}>
                {asideVisible ? <i className="bi bi-x"/> : <i className="bi bi-list"/>}
              </button>
            </div>

            <Link to="/dashboard" style={{fontWeight: "bold"}}>
              <img src="https://icon-library.com/images/dev-icon/dev-icon-8.jpg" alt="logo" width="34" height="34"/>
            </Link>
          </div>
          <div>
            <div>
              <Dropdown>
                <Dropdown.Toggle as={AvatarToggle} id="dropdown-custom-toggle">
                  <img src="https://avatars.githubusercontent.com/u/49760038?s=40&v=4" alt=""/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <div className="d-flex flex-column">
                      <span>
                      {user.name}
                    </span>
                      <span>
                      {user.email}
                    </span>
                    </div>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#" onClick={onLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
      <div id="defaultLayout">
        <aside className={`collapse d-lg-inline-block ${asideVisible ? 'show' : ''}`}>
          <Link to="/dashboard" style={{fontWeight: "bold"}}>Dashboard</Link>
          <Link to="/users" style={{fontWeight: "bold"}}>Users</Link>
          <Link to="/produto" style={{fontWeight: "bold"}}>Produtos</Link>
          <Link to="/categoria" style={{fontWeight: "bold"}}>Categoria</Link>
        </aside>
        <div className="container-fluid mt-2 overflow overflow-x-auto">
          <header>
            <div>
              <h1>Dashboard</h1>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout;