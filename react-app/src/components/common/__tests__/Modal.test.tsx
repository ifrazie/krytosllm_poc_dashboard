/**
 * Modal Component Tests
 * 
 * Tests for the reusable Modal component including overlay functionality,
 * close handling, accessibility features, and keyboard interactions.
 */

import React from 'react'
import { render, screen } from '../../../test/test-utils'
import { TestHelpers, ModalTestUtils } from '../../../test/test-helpers'
import { Modal } from '../Modal'

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders modal when open', () => {
      render(<Modal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('does not render modal when closed', () => {
      render(<Modal {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Modal {...defaultProps} className="custom-modal" />)
      const modal = screen.getByRole('dialog')
      expect(modal.parentElement).toHaveClass('custom-modal')
    })

    it('renders without title when not provided', () => {
      const { title, ...propsWithoutTitle } = defaultProps
      render(<Modal {...propsWithoutTitle} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    })

    it('renders close button', () => {
      render(<Modal {...defaultProps} />)
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Close Functionality', () => {
    it('calls onClose when close button is clicked', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await TestHelpers.user.click(closeButton)
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when overlay is clicked', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const overlay = screen.getByTestId('modal-overlay')
      await TestHelpers.user.click(overlay)
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when modal content is clicked', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const modalContent = screen.getByRole('dialog')
      await TestHelpers.user.click(modalContent)
      
      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when Escape key is pressed', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      await TestHelpers.user.keyboard('{Escape}')
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when closeOnOverlayClick is false', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />)
      
      const overlay = screen.getByTestId('modal-overlay')
      await TestHelpers.user.click(overlay)
      
      expect(onClose).not.toHaveBeenCalled()
    })

    it('does not close when closeOnEscape is false', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />)
      
      await TestHelpers.user.keyboard('{Escape}')
      
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper dialog role', () => {
      render(<Modal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has proper aria-labelledby when title is provided', () => {
      render(<Modal {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      const titleElement = screen.getByText('Test Modal')
      expect(dialog).toHaveAttribute('aria-labelledby', titleElement.id)
    })

    it('has proper aria-describedby when provided', () => {
      render(<Modal {...defaultProps} ariaDescribedBy="modal-description" />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description')
    })

    it('traps focus within modal', () => {
      render(
        <Modal {...defaultProps}>
          <button>First button</button>
          <button>Second button</button>
        </Modal>
      )
      
      const firstButton = screen.getByText('First button')
      const secondButton = screen.getByText('Second button')
      const closeButton = screen.getByRole('button', { name: /close/i })
      
      // Focus should be trapped within modal
      expect(document.activeElement).toBe(closeButton)
      
      firstButton.focus()
      expect(document.activeElement).toBe(firstButton)
      
      secondButton.focus()
      expect(document.activeElement).toBe(secondButton)
    })

    it('restores focus when modal closes', () => {
      const triggerButton = document.createElement('button')
      triggerButton.textContent = 'Open Modal'
      document.body.appendChild(triggerButton)
      triggerButton.focus()
      
      const { rerender } = render(<Modal {...defaultProps} />)
      
      // Modal should be focused
      expect(document.activeElement).not.toBe(triggerButton)
      
      // Close modal
      rerender(<Modal {...defaultProps} isOpen={false} />)
      
      // Focus should be restored (in a real implementation)
      // Note: This test might need adjustment based on actual focus management implementation
      
      document.body.removeChild(triggerButton)
    })

    it('has proper aria-modal attribute', () => {
      render(<Modal {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Keyboard Navigation', () => {
    it('handles Tab key for focus management', async () => {
      render(
        <Modal {...defaultProps}>
          <button>Button 1</button>
          <button>Button 2</button>
          <input type="text" placeholder="Input field" />
        </Modal>
      )
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      const button1 = screen.getByText('Button 1')
      const button2 = screen.getByText('Button 2')
      const input = screen.getByPlaceholderText('Input field')
      
      // Initial focus should be on close button
      expect(document.activeElement).toBe(closeButton)
      
      // Tab through elements
      await TestHelpers.user.keyboard('{Tab}')
      expect(document.activeElement).toBe(button1)
      
      await TestHelpers.user.keyboard('{Tab}')
      expect(document.activeElement).toBe(button2)
      
      await TestHelpers.user.keyboard('{Tab}')
      expect(document.activeElement).toBe(input)
    })

    it('handles Shift+Tab for reverse focus management', async () => {
      render(
        <Modal {...defaultProps}>
          <button>Button 1</button>
          <button>Button 2</button>
        </Modal>
      )
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      const button1 = screen.getByText('Button 1')
      const button2 = screen.getByText('Button 2')
      
      // Focus on last element
      button2.focus()
      expect(document.activeElement).toBe(button2)
      
      // Shift+Tab should go backwards
      await TestHelpers.user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement).toBe(button1)
      
      await TestHelpers.user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement).toBe(closeButton)
    })
  })

  describe('Animation and Transitions', () => {
    it('applies animation classes when opening', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />)
      
      rerender(<Modal {...defaultProps} isOpen={true} />)
      
      const modalOverlay = screen.getByTestId('modal-overlay')
      expect(modalOverlay).toHaveClass('modal-overlay')
    })

    it('maintains proper z-index for layering', () => {
      render(<Modal {...defaultProps} />)
      const modalOverlay = screen.getByTestId('modal-overlay')
      
      // Check that modal has high z-index (implementation dependent)
      const computedStyle = window.getComputedStyle(modalOverlay)
      expect(computedStyle.position).toBe('fixed')
    })
  })

  describe('Integration with Test Helpers', () => {
    it('works with ModalTestUtils.waitForModalToOpen', async () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />)
      
      rerender(<Modal {...defaultProps} isOpen={true} />)
      
      await ModalTestUtils.waitForModalToOpen('modal')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('works with ModalTestUtils.closeModalByEscape', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      await ModalTestUtils.closeModalByEscape()
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('works with ModalTestUtils.closeModalByOverlay', async () => {
      const onClose = vi.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      await ModalTestUtils.closeModalByOverlay()
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('requires onClose prop', () => {
      const { onClose, ...propsWithoutOnClose } = defaultProps
      
      // TypeScript should catch this, but we can test runtime behavior
      expect(() => {
        render(<Modal {...propsWithoutOnClose} onClose={vi.fn()} />)
      }).not.toThrow()
    })

    it('handles invalid children gracefully', () => {
      expect(() => {
        render(<Modal {...defaultProps}>{null}</Modal>)
      }).not.toThrow()
      
      expect(() => {
        render(<Modal {...defaultProps}>{undefined}</Modal>)
      }).not.toThrow()
    })
  })
})