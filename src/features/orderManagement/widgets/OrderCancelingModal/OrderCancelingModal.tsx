import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";
import Loading from "@/features/shared/elements/Loading";

const OrderCancelingModal = ({
  isOpen,
  isPending,
  onConfirm,
  onClose,
  message,
}: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <>
          <ModalHeader
            className="flex w-full flex-col gap-1"
            onClick={onClose}
          ></ModalHeader>
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
      </ModalContent>
    </Modal>
  );
};

export default OrderCancelingModal;
