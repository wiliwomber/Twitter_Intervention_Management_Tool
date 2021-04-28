import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import api from '../utils/api'

const ExportModal = ({ id, name, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState('false')

  const exportData = async (target) => {
    setIsExporting(target)
    setIsExporting('false')
    const csv = await api.projects.export(id, target)

    const date = format(new Date(), 'yyyy-MM-dd')
    saveAs(csv, `${date}_${name}_${target}.csv`)
    setIsExporting('false')
    onClose()
  }

  const cancel = () => {
    setIsExporting('false')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="1rem">
        <Text fontSize="xl">Export Data</Text>
        <ModalBody>Please choose which data you want to export.</ModalBody>

        <Flex justify="center" mt="1rem">
          <Button
            isLoading={isExporting === 'tweets'}
            isDisabled={isExporting === 'interventions'}
            colorScheme="twitter"
            variant="outline"
            mr={3}
            onClick={() => exportData('tweets')}
          >
            Filtered Tweets
          </Button>
          <Button
            isLoading={isExporting === 'interventions'}
            isDisabled={isExporting === 'tweets'}
            colorScheme="twitter"
            variant="outline"
            mr={3}
            onClick={() => exportData('interventions')}
          >
            Interventions
          </Button>
        </Flex>

        <ModalFooter>
          <Flex w="100%" justify="center">
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              isDisabled={isExporting !== 'false'}
              onClick={cancel}
            >
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default ExportModal
