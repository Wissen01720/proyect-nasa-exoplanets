import PropTypes from 'prop-types';

const NavBar = ({ isAuthenticated }) => {
    return (
        <nav className="navbar">
            <ul>
                <li><a href="/">Inicio</a></li>
                {isAuthenticated ? (
                    <>
                        <li><a href="/profile">Perfil</a></li>
                        <li><a href="/logout">Cerrar sesión</a></li>
                    </>
                ) : (
                    <>
                        <li><a href="/login">Iniciar sesión</a></li>
                        <li><a href="/register">Registrarse</a></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

NavBar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

export default NavBar;