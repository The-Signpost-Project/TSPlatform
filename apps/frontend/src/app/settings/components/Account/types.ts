import type { ModalProps } from "@lib/components";
import type { ChangePasswordInput, DeleteUserInput } from "@shared/common/types";

export type DeleteAccountModalProps = Omit<ModalProps, "children"> & {
	onSubmit: (data: DeleteUserInput) => void;
};

export type ChangePasswordModalProps = Omit<ModalProps, "children"> & {
	onSubmit: (data: ChangePasswordInput) => void;
};
