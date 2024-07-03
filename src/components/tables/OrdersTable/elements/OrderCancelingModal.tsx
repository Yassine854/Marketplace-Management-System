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
  cancelOrder,
  orderId,
  isPending,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader className="flex w-full flex-col gap-1"></ModalHeader>
            <ModalBody>
              <div className="flex h-full w-full items-center justify-center pt-4 text-center text-xl font-bold">
                Are you sure you want to cancel this order : {`${orderId}`} ?
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                <p className="font-semibold">Close</p>
              </Button>
              {!isPending && (
                <Button color="danger" onPress={() => cancelOrder(orderId)}>
                  <p className="font-semibold">Yes</p>
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
