import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'

const MessageModal = ({
  isOpen,
  onClose,
  title,
  text,
  isConfirm,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{text}</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="twitter"
            variant="outline"
            mr={3}
            onClick={onClose}
          >
            {isConfirm ? 'Cancel' : 'Close'}
          </Button>
          {isConfirm && (
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default MessageModal
