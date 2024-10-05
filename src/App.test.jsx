import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('should render the Home component', () => {
        render(<App />);
        expect(screen.getByText('Bienvenido a la Exploración de Exoplanetas')).toBeInTheDocument();
    });
});