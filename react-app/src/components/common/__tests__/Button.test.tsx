/**
 * Button Component Tests
 * 
 * Tests for the reusable Button component including variants, sizes,
 * loading states, and user interactions.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button Component', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('renders button with children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders with primary variant by default', () => {
      render(<Button>Primary Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--primary')
    })

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--secondary')
    })

    it('renders with outline variant', () => {
      render(<Button variant="outline">Outline Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--outline')
    })

    it('renders with medium size by default', () => {
      render(<Button>Medium Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--md')
    })

    it('renders with small size', () => {
      render(<Button size="sm">Small Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--sm')
    })

    it('renders with large size', () => {
      render(<Button size="lg">Large Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--lg')
    })

    it('renders with full width', () => {
      render(<Button fullWidth>Full Width Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--full-width')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('btn--loading')
    })

    it('disables button when loading', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.className).toContain('btn--loading')
    })

    it('shows loading content structure', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      // Check that the button has the expected structure
      expect(button).toBeInTheDocument()
      expect(button.textContent).toContain('Loading Button')
    })
  })

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('disables button when both disabled and loading', () => {
      render(<Button disabled loading>Disabled Loading Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Clickable Button</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} loading>Loading Button</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('HTML Attributes', () => {
    it('passes through HTML button attributes', () => {
      render(
        <Button 
          type="submit" 
          form="test-form" 
          data-testid="test-button"
          aria-label="Test button"
        >
          Submit
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('data-testid', 'test-button')
      expect(button).toHaveAttribute('aria-label', 'Test button')
    })

    it('overrides disabled attribute when loading', () => {
      render(<Button disabled={false} loading>Override Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('maintains accessibility when loading', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
    })
  })

  describe('Content and Structure', () => {
    it('displays button text correctly', () => {
      render(<Button>Test Button Text</Button>)
      expect(screen.getByText('Test Button Text')).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('maintains structure when loading', () => {
      render(<Button loading>Loading Text</Button>)
      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Loading Text')
    })
  })
})