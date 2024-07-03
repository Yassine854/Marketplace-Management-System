import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Loading from "@/components/elements/Loading";

const OrderCancelingModal = ({
  isOpen,
  onOpenChange,
  message,
  isPending,
  onConfirm,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader className="flex w-full flex-col gap-1"></ModalHeader>
            <ModalBody>
              <div className="flex h-full w-full items-center justify-center pt-4 text-center text-xl font-bold">
                {message}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                <p className="font-semibold">Close</p>
              </Button>
              {!isPending && (
                <Button color="danger" onPress={onConfirm}>
                  <p className="font-semibold">Confirm</p>
                </Button>
              )}
              {isPending && (
                <div className="mx-6 h-8  w-8">
                  <Loading />
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OrderCancelingModal;
