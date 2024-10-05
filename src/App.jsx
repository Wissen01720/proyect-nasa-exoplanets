import { useState } from 'react';
import Navigation from './Navigation';

const App = () => {
    const [isAuthenticated] = useState(false);

    return (
        <Navigation isAuthenticated={isAuthenticated} />
    );
};

export default App;